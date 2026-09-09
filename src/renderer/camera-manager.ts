import { Mat4, Vec2, Vec3, Vec4 } from "gl-matrix";
import { WebGPURenderer } from "./webgpu-renderer.ts";
import { Actor } from "../core/actor.ts";
import { OrthographicCamera, PerspectiveCamera } from "../core/camera.ts";

export class CameraManager {
  gpu: WebGPURenderer;

  #cameraArray = new Float32Array(16*3 + 8);
  #projMat = new Mat4(this.#cameraArray.buffer, 0);
  #inverseProjMat = new Mat4(this.#cameraArray.buffer, Mat4.BYTE_LENGTH);
  #viewMat = new Mat4(this.#cameraArray.buffer, Mat4.BYTE_LENGTH * 2);
  #viewPos = new Vec3(this.#cameraArray.buffer, Mat4.BYTE_LENGTH * 3);
  #zRange = new Vec2(this.#cameraArray.buffer, Mat4.BYTE_LENGTH * 3 + Vec4.BYTE_LENGTH);
  #outputSize = new Vec2(this.#cameraArray.buffer, Mat4.BYTE_LENGTH * 3 + Vec4.BYTE_LENGTH + Vec2.BYTE_LENGTH);
  cameraBuffer: GPUBuffer;

  constructor(gpu: WebGPURenderer) {
    this.gpu = gpu;
    const device = gpu.device;

    this.cameraBuffer = device.createBuffer({
      label: 'Camera',
      size: this.#cameraArray.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
  }

  updateCamera(cameraActor: Actor, timestamp: number) {
      const camera = cameraActor.get(PerspectiveCamera) ?? cameraActor.get(OrthographicCamera);
      if (!camera) {
        throw new Error('cameraActor passed to WebGPURenderer.render() must have a camera component');
      }
  
      // Update the various camera matrices.
      camera.getProjection(this.#projMat);
      Mat4.invert(this.#inverseProjMat, this.#projMat);
      Mat4.invert(this.#viewMat, cameraActor.worldTransform.matrix);
      this.#viewPos.set(cameraActor.worldTransform.translation);
      this.#cameraArray[51] = timestamp / 1000;
      this.#zRange[1] = camera.zNear;
      this.#zRange[0] = camera.zFar;
      this.#outputSize[0] = this.gpu.canvas.width;
      this.#outputSize[1] = this.gpu.canvas.height;
  
      // Update camera uniforms
      this.gpu.device.queue.writeBuffer(this.cameraBuffer, 0, this.#cameraArray);
    }
}