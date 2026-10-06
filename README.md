# Emoji Graffiti

Emoji Graffiti is a WebGPU sample built to demonstrate one use case for
[GPUResourceTables](https://github.com/gpuweb/gpuweb/blob/main/proposals/bindless.md), also known as
"Bindless resources". Bindless is an upcoming WebGPU feature that makes resource management more
flexible and will eventually allow for things like better indirect drawing, ray tracing, and more!

There's also an accompanying blog post talking about [using bindless texture
sampling](https://toji.dev/2026/10/06/webgpu-bindless.html).

## Work in Progress

Emoji Graffiti is definitely a work in progress! There's a lot of little quirks, missing features,
and lacking polish that I'd like to fix over time. In the meantime it functions for its intended
purpose, which is providing a live use case for bindless texturing.

## Implementation notes

This demo has been pulled together from bits and pieces of multiple other projects I've done in the
past, so it's a bit messy. It's certainly not an exemplary display of WebGPU optimization! There's
a lot of room for improvement, so I wouldn't recommend using it as a basis for any of your own code.

If you want to look at just the bindless portion of the code, it's primarily contained in
[renderer/decal-manager.ts](https://github.com/toji/emoji-graffiti/blob/main/src/renderer/decal-manager.ts)
with the shader portions in [renderer/pipeline/unlit.ts](https://github.com/toji/emoji-graffiti/blob/main/src/renderer/pipelines/unlit.ts).
Look for anything conditioned on `useBindless`.