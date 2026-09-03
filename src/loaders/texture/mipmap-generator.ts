// Copyright (c) 2021 Brandon Jones
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Mipmap generator
// Generates mipmaps for 2D textures by doing a sequence of render passes that blit each level to
// the next level down with simple linear sampling. If the texture was not originally allocated
// with RENDER_ATTACHMENT usage, renders the mip chain to a temporary texture and copies it over.

// This is from https://github.com/toji/web-texture-tool, copied here for convenience.

const mipmapShader = /* wgsl */`
  var<private> pos : array<vec2f, 3> = array<vec2f, 3>(
    vec2f(-1, -1), vec2f(-1, 3), vec2f(3, -1));

  struct VertexOutput {
    @builtin(position) position : vec4f,
    @location(0) texCoord : vec2f,
  };

  @vertex
  fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
    return VertexOutput(
      vec4(pos[vertexIndex], 0.0, 1.0), // position
      pos[vertexIndex] * vec2f(0.5, -0.5) + vec2f(0.5) // texCoord
    );
  }

  @group(0) @binding(0) var imgSampler : sampler;
  @group(0) @binding(1) var img : texture_2d<f32>;

  @fragment
  fn fragmentMain(@location(0) texCoord : vec2f) -> @location(0) vec4f {
    return textureSample(img, imgSampler, texCoord);
  }
`;

interface WebGPUMipmapResources {
  module: GPUShaderModule;
  sampler: GPUSampler;
  bindGroupLayout: GPUBindGroupLayout;
  pipelineLayout: GPUPipelineLayout;
}

export class WebGPUMipmapGenerator {
  #resources?: WebGPUMipmapResources;

  // We'll need a new pipeline for every texture format used.
  #pipelines: Map<GPUTextureFormat, GPURenderPipeline> = new Map();

  constructor(public device: GPUDevice) {
  }

  /**
   * Determines the number of mip levels needed for a full mip chain given the width and height of texture level 0.
   *
   * @param width of texture level 0.
   * @param height of texture level 0.
   * @returns Ideal number of mip levels.
   */
  static calculateMipLevels(width: number, height: number): number {
    return Math.floor(Math.log2(Math.max(width, height))) + 1;
  }

  #ensureSharedResources(): WebGPUMipmapResources {
    if (!this.#resources) {
      // Some resources are shared between all pipelines, so only create once.
      const bindGroupLayout = this.device.createBindGroupLayout({
        label: 'Mipmap Generator Bind Group Layout',
        entries: [{
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {}
        }, {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {}
        }]
      });

      this.#resources = {
        module: this.device.createShaderModule({
          label: 'Mipmap Generator Shader',
          code: mipmapShader,
        }),
        sampler: this.device.createSampler({
          label: 'Mipmap Generator Sampler',
          minFilter: 'linear'
        }),
        bindGroupLayout,
        pipelineLayout: this.device.createPipelineLayout({
          label: 'Mipmap Generator Pipeline Layout',
          bindGroupLayouts: [ bindGroupLayout ]
        }),
      };
    }

    return this.#resources;
  }

  #getMipmapPipeline(format: GPUTextureFormat): GPURenderPipeline {
    let pipeline = this.#pipelines.get(format);
    if (!pipeline) {
      const { pipelineLayout, module } = this.#ensureSharedResources();

      pipeline = this.device.createRenderPipeline({
        label: `Mipmap Generator ${format} Render Pipeline`,
        layout: pipelineLayout,
        vertex: { module },
        fragment: {
          module,
          targets: [{format}],
        }
      });
      this.#pipelines.set(format, pipeline);
    }
    return pipeline;
  }

  /**
   * Generates mipmaps for the given GPUTexture from the data in level 0.
   *
   * @param texture - Texture to generate mipmaps for.
   */
  generateMipmap(texture: GPUTexture, layer?: number) {
    if (texture.dimension == '3d' || texture.dimension == '1d') {
      throw new Error('Generating mipmaps for non-2d textures is currently unsupported!');
    }

    const pipeline = this.#getMipmapPipeline(texture.format);
    const { bindGroupLayout, sampler } = this.#ensureSharedResources();

    let mipTexture = texture;
    const baseArrayLayer = layer ?? 0;
    const arrayLayerCount = layer !== undefined ? 1 : texture.depthOrArrayLayers; // Only valid for 2D textures.

    // If the texture was created with RENDER_ATTACHMENT usage we can render directly between mip levels.
    const renderToSource = texture.usage & GPUTextureUsage.RENDER_ATTACHMENT;
    if (!renderToSource) {
      // Otherwise we have to use a separate texture to render into. It can be one mip level smaller than the source
      // texture, since we already have the top level.
      const mipTextureDescriptor = {
        size: {
          width: Math.max(texture.width >> 1, 1),
          height: Math.max(texture.height >> 1, 1),
          depthOrArrayLayers: arrayLayerCount,
        },
        format: texture.format,
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
        mipLevelCount: texture.mipLevelCount - 1,
      };
      mipTexture = this.device.createTexture(mipTextureDescriptor);
    }

    const commandEncoder = this.device.createCommandEncoder({});

    // Loop through each layer and generate a mipchain for it separately.
    // TODO: This won't handle things like blending over cubemap edges.
    for (let arrayLayer = baseArrayLayer; arrayLayer < baseArrayLayer+arrayLayerCount; ++arrayLayer) {
      let srcView = texture.createView({
        baseMipLevel: 0,
        mipLevelCount: 1,
        dimension: '2d',
        baseArrayLayer: arrayLayer,
        arrayLayerCount: 1,
      });

      let dstMipLevel = renderToSource ? 1 : 0;
      for (let i = 1; i < texture.mipLevelCount; ++i) {
        const dstView = mipTexture.createView({
          baseMipLevel: dstMipLevel++,
          mipLevelCount: 1,
          dimension: '2d',
          baseArrayLayer: arrayLayer,
          arrayLayerCount: 1,
        });

        const bindGroup = this.device.createBindGroup({
          layout: bindGroupLayout,
          entries: [{
            binding: 0,
            resource: sampler,
          }, {
            binding: 1,
            resource: srcView,
          }],
        });

        const passEncoder = commandEncoder.beginRenderPass({
          colorAttachments: [{
            view: dstView,
            loadOp: 'clear',
            storeOp: 'store'
          }],
        });
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(3);
        passEncoder.end();

        srcView = dstView;
      }
    }

    // If we didn't render to the source texture, finish by copying the mip results from the temporary mipmap texture
    // to the source.
    if (!renderToSource) {
      const mipLevelSize = {
        width: Math.max(texture.width >> 1, 1),
        height: Math.max(texture.height >> 1, 1),
        depthOrArrayLayers: arrayLayerCount,
      };

      for (let i = 1; i < texture.mipLevelCount; ++i) {
        commandEncoder.copyTextureToTexture({
          texture: mipTexture,
          mipLevel: i-1,
        }, {
          texture: texture,
          mipLevel: i,
        }, mipLevelSize);

        mipLevelSize.width = Math.max(mipLevelSize.width >> 1, 1);
        mipLevelSize.height = Math.max(mipLevelSize.height >> 1, 1);
      }
    }

    this.device.queue.submit([commandEncoder.finish()]);

    if (!renderToSource) {
      mipTexture.destroy();
    }

    return texture;
  }
}
