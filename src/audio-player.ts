export class AudioPlayer {
  context: AudioContext = new AudioContext();

  bufferSources: Map<string, Promise<AudioBuffer>> = new Map();

  constructor() {
  }

  async play(url: string, offset?: number, duration?: number) {
    let buffer = this.bufferSources.get(url);
    if (!buffer) {
      const buffer = fetch(url)
        .then(res => res.arrayBuffer())
        .then(ArrayBuffer => this.context.decodeAudioData(ArrayBuffer));

      this.bufferSources.set(url, buffer);
    }
    const source = this.context.createBufferSource();
    source.buffer = await buffer!;
    source.connect(this.context.destination);
    source.start(0, offset, duration);
  }
}