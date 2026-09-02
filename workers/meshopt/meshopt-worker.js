importScripts('../worker-pool-service.js');
importScripts('./meshopt_decoder.js');

class MeshoptDecoderService extends WorkerPoolService {
    async init() {
      await MeshoptDecoder.ready;
    }

    async onDispatch(args) {
      const source = new Uint8Array(args.source);
      const count = args.count;
      const size = args.size;
      const mode = args.mode;
      const filter = args.filter;

      const target = new Uint8Array(count * size);

      MeshoptDecoder.decodeGltfBuffer(target, count, size, source, mode, filter);

      return this.transfer({ buffer: target.buffer }, [target.buffer]);
    }
  }

  // Initialize the service
  new MeshoptDecoderService();