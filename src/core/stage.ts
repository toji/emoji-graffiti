import { Transform } from './transform.js';
import { Actor, ComponentType } from './actor.js';

export interface TickData {
  tickId: number,
  timestamp: number,
  delta: number,
  stage: Stage,
}

const IDENTITY_TRANSFORM = new Transform();

// The Stage is the top-level of the scene graph. Actors must be attached to a
// Stage in order to be rendered. It also provides mechanisms for qurying actors
// based on their components for ECS-lite style interactions.
export class Stage extends Actor {
  #stageData = new StageData(this);
  #tickData: TickData = { tickId: 0, timestamp: 0, delta: 0, stage: this };
  #lastTimestamp: number = 0;

  static getComponentName(component: any) {
    return component.name ?? component.ComponentName ?? component.constructor.name;
  }

  static getComponentType(component: any) {
    return component.constructor;
  }

  constructor() {
    super();
    this.#stageData.addActor(this, false);
  }

  // TODO: Prevent Stage from being attached to another stage/actor

  // Node overrides
  get transform(): Transform {
    console.warn('Updating a Stage transform has no effect.');
    return super.transform;
  }
  get worldTransform(): Readonly<Transform> {
    // The stage will always have an effective world transform of the identity matrix.
    return IDENTITY_TRANSFORM;
  }

  // Walks the entire scene graph, calling the given callback for every actor.
  // If the callback returns false the walk is canceled.
  walkActors(callback: (actor: Actor, ...args: any[]) => boolean, ...args: any[]) {
    this.#walkActorList(this.children, callback, args);
  }

  #walkActorList(actors: Iterable<Actor>, callback: (actor: Actor, ...args: any[]) => boolean, args: any[]) {
    for (const actor of actors) {
      callback(actor, args);
      this.#walkActorList(actor.children, callback, args);
    }
  }

  query(...componentTypes: ComponentType[]) {
    return this.#stageData.getQuery(componentTypes);
  }

  get tickData(): Readonly<TickData> {
    return this.#tickData;
  }

  tick(timestamp?: number) {
    if (!timestamp) { timestamp = performance.now(); }
    this.#tickData = {
      tickId: this.#stageData.nextTick++,
      timestamp,
      delta: this.#lastTimestamp > 0 ? timestamp - this.#lastTimestamp : 1,
      stage: this,
    };
    this.#lastTimestamp = timestamp;

    for (const tickType of this.#stageData.tickTypes) {
      const componentSet = this.#stageData.components.get(tickType.componentType);
      if (componentSet) {
        for (const actor of componentSet.actors) {
          const component = actor.get(tickType.componentType) as any;
          component.onTick(this.#tickData, actor);
        }
      }
    }
  }
}

interface StageComponentSet {
  actors: Set<Actor>,
  queries: StageQuery[], // Queries which include this component type
}

interface TickType {
  order: number,
  componentType: ComponentType
}

export class StageData {
  actors = new Set<Actor>();
  components = new Map<ComponentType, StageComponentSet>();
  unsharedComponentActors = new Map<any, Actor>();
  tickTypes: TickType[] = [];
  queries = new Map<string, StageQuery>();
  nextTick = 1;
  groupTick = new Map<number, number>();

  constructor(public stage: Stage) { }

  #onNewCompontentType(componentType: ComponentType) {
    if ('onTick' in componentType.prototype) {
      this.tickTypes.push({
        order: (componentType as any).TickOrder ?? 0,
        componentType,
      });
      this.tickTypes = this.tickTypes.sort((a, b) => a.order - b.order);
    }
  }

  #getComponentSet(componentType: ComponentType) {
    let componentSet = this.components.get(componentType);
    if (!componentSet) {
      componentSet = { actors: new Set(), queries: [] };
      this.components.set(componentType, componentSet);
      this.#onNewCompontentType(componentType);
    }
    return componentSet;
  }

  addActorComponent(actor: Actor, component: any) {
    const componentType = component.constructor;
    const componentSet = this.#getComponentSet(componentType);
    // Ensure that non-shared components are only attached to one actor at a time.
    if ((componentType as any).SharedComponent !== true) {
      const oldActor = this.unsharedComponentActors.get(component);
      if (oldActor && oldActor != actor) {
        oldActor.remove(componentType);
      }
      this.unsharedComponentActors.set(component, actor);
    }
    componentSet.actors.add(actor);
    for (const query of componentSet.queries) {
      query.clearCache();
    }
  }

  removeActorComponent(actor: Actor, componentType: ComponentType) {
    let componentSet = this.components.get(componentType);
    if (componentSet?.actors?.delete(actor)) {
      for (const query of componentSet.queries) {
        query.clearCache();
      }
    }
  }

  addActor(actor: Actor, recursive: boolean = true) {
    this.actors.add(actor);

    actor.setStage(this);

    for (const component of actor.components ?? []) {
      this.addActorComponent(actor, component);
    }

    if (recursive) {
      for (const child of actor.children) {
        this.addActor(child, true);
      }
    }
  }

  removeActor(actor: Actor, recursive: boolean = true) {
    this.actors.delete(actor);
    actor.setStage(undefined);

    for (const component of actor.componentTypes ?? []) {
      this.removeActorComponent(actor, component);
    }

    if (recursive) {
      for (const child of actor.children) {
        this.removeActor(child, true);
      }
    }
  }

  getQuery(componentTypes: ComponentType[]) {
    let componentNames = [];
    for (const type of componentTypes) {
      componentNames.push(Stage.getComponentName(type));
    }
    const queryName = componentNames.join(':');
    const cachedQuery = this.queries.get(queryName);
    if (cachedQuery !== undefined) { return cachedQuery; }
    return new StageQuery(this, queryName, componentTypes);
  }

  watchComponents(query: StageQuery, componentTypes: any[]) {
    for (const componentType of componentTypes) {
      this.#getComponentSet(componentType).queries.push(query);
    }
  }

  // Clear the stage of all actors
  clear() {
    this.actors.clear();
    this.components.clear();
    for (const query of this.queries.values()) {
      query.clearCache();
    }
  }
}

export class StageQuery {
  name: string;

  include: any[];
  exclude: any[];

  #stageData: StageData;
  #queryWatching = false;

  #includedCache?: Set<Actor>;

  constructor(stageData: StageData, queryName: string, includedTypes: ComponentType[], excludedTypes: ComponentType[] = []) {
    this.#stageData = stageData;
    this.name = queryName;
    this.#stageData.queries.set(queryName, this);

    this.include = includedTypes;
    this.exclude = excludedTypes;

    // Sanity check to ensure you don't end up with invalid queries
    for (const type of excludedTypes) {
      if (includedTypes.includes(type)) {
        throw new Error(`Component type "${Stage.getComponentName(type)}" cannot be both included and excluded in the same query.`);
      }
    }
  }

  not(...componentTypes: ComponentType[]) {
    let componentNames = [];
    for(const type of componentTypes) {
      componentNames.push(Stage.getComponentName(type));
    }
    const queryName = this.name + '!' + componentNames.join(':!');
    const cachedQuery = this.#stageData.queries.get(queryName);
    if (cachedQuery !== undefined) { return cachedQuery; }
    return new StageQuery(this.#stageData, queryName, this.include, this.exclude.concat(componentTypes));
  }

  clearCache() {
    this.#includedCache = undefined;
  }

  #getIncludedActors(): Set<Actor> {
    if (!this.#includedCache) {
      // The first time we actually run the query, set it to watch the components it includes so
      // that the query cache can be cleared as components are added and removed from actors.
      if (!this.#queryWatching) {
        this.#stageData.watchComponents(this, this.include);
        this.#queryWatching = true;
      }

      // TODO: Sorting the components by least common could make filtering faster?
      let queryActors: Set<Actor> = new Set();
      for (let i = 0; i < this.include.length; ++i) {
        const componentType = this.include[i];
        const componentSet = this.#stageData.components.get(componentType);
        const componentActors = componentSet?.actors;

        // No actors that include this component, so the query is empty.
        if (!componentActors) {
          queryActors.clear();
          break;
        }

        if (i == 0) {
          // For the first query term, include all actors with the component.
          queryActors = componentActors;
        } else {
          // For each term afterwards, filter the list to only include actors
          // that also have the next component.
          queryActors = queryActors!.intersection(componentActors);
        }

        // Early out if we've reduced the actor set to zero.
        if (queryActors.size === 0) { break; }
      }

      this.#includedCache = queryActors;
    }
    return this.#includedCache;
  }

  forEach(callback: (actor: Actor, ...components: any[]) => (boolean | void)) {
    const args = new Array(this.include.length);

    const queryActors = this.#getIncludedActors();
    if (queryActors.size === 0) {
      return;
    }

    for (const actor of queryActors) {
      let excluded = false;
      for (const componentId of this.exclude) {
        if (actor.has(componentId)) {
          excluded = true;
          break;
        }
      }
      if (excluded) { continue; }

      for (let i = 0; i < this.include.length; ++i) {
        args[i] = actor.get(this.include[i]);
      }

      const keepIterating = callback(actor, ...args);
      if (keepIterating === false) { return; }
    }
  }

  // Just gets the count of how many objects this query would return. Generally don't call this
  // unless the ONLY thing you care about is how many of something there are in the world. If you
  // actually want to do anything with the objects queried just call forEach and increment a
  // counter for each object.
  getCount() {
    const queryActors = this.#getIncludedActors();

    let count = 0;
    for (const actor of queryActors) {
      let excluded = false;
      for (const componentId of this.exclude) {
        if (actor.has(componentId)) {
          excluded = true;
          break;
        }
      }
      if (excluded) { continue; }

      count++;
    }
    return count;
  }
}
