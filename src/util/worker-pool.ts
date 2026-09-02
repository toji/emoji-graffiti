// This utility eases some of the pain points around worker communication and makes setting up pools
// of workers that all do the same thing trivial.

//========
// Client
//========

const WORKER_DIR = import.meta.url.replace(/[^\/]*$/, '../../workers/');

interface WorkResolver {
  resolve: (value: unknown) => void,
  reject: (reason?: any) => void,
}

export class WorkerPool {
  #workerPath: string;
  #maxWorkerPoolSize: number;
  #onMessage: (message: MessageEvent<any>) => void;
  #pendingWorkItems: Map<number, WorkResolver> = new Map();
  #nextWorkItemId = 1;
  #workerPool: Worker[] = [];
  #nextWorker = 0;

  constructor(workerPath: string, maxWorkerPoolSize = undefined) {
    this.#workerPath = WORKER_DIR + workerPath;
    this.#maxWorkerPoolSize = maxWorkerPoolSize ?? Math.min(4, navigator.hardwareConcurrency);

    this.#onMessage = (msg) => {
      const id = msg.data.id;
      const workItem = this.#pendingWorkItems.get(id);
      if (!workItem) {
        console.error(`Got a result for unknown work item ${id}`);
        return;
      }
      this.#pendingWorkItems.delete(id);

      if (msg.data.error) {
        workItem.reject(msg.data.error);
        return;
      }

      workItem.resolve(msg.data.result);
    };
  }

  #selectWorker(id: number, resolver: WorkResolver): Worker {
    this.#pendingWorkItems.set(id, resolver);
    if (this.#pendingWorkItems.size >= this.#workerPool.length &&
        this.#workerPool.length < this.#maxWorkerPoolSize) {
      // Add a new worker
      const worker = new Worker(this.#workerPath);
      worker.addEventListener('message', this.#onMessage);
      this.#workerPool.push(worker);
      return worker;
    }
    return this.#workerPool[this.#nextWorker++ % this.#workerPool.length];
  }

  dispatch(args: any, transfer?: Transferable[]) {
    return new Promise((resolve, reject) => {
      const id = this.#nextWorkItemId++;
      this.#selectWorker(id, {resolve, reject}).postMessage({
        id,
        args
      }, transfer ?? []);
    });
  }
}
