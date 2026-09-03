export class AudioClip {
  bufferPromise: Promise<AudioBuffer>;
  offset: number = 0;
  duration?: number;

  constructor(bufferPromise: Promise<AudioBuffer>, offset?: number, duration?: number) {
    this.bufferPromise = bufferPromise;
    this.offset = offset ?? 0;
    this.duration = duration;
  }

  subClips(clips: {offset: number, duration?: number}[]): AudioClip[] {
    const audioClips: AudioClip[] = [];
    for (const clip of clips) {
      audioClips.push(new AudioClip(this.bufferPromise, this.offset + clip.offset, clip.duration));
    }
    return audioClips;
  }
}

export class AudioPlayer {
  #context: AudioContext = new AudioContext();

  constructor() {
  }

  loadClip(url: string): AudioClip {
    const buffer = fetch(url)
        .then(res => res.arrayBuffer())
        .then(ArrayBuffer => this.#context.decodeAudioData(ArrayBuffer));

    return new AudioClip(buffer);
  }

  async play(clip: AudioClip) {
    const source = this.#context.createBufferSource();
    source.buffer = await clip.bufferPromise;
    source.connect(this.#context.destination);
    source.start(0, clip.offset, clip.duration);
  }
}