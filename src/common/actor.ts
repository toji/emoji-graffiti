import { Node } from './node.js';
import { Stage, StageData } from './stage.js';

export type ComponentType<T extends {} = {}> = new (...args: any[]) => T;

/**
 * Actors function as nodes in the scene graph and containers of components.
 */
export class Actor extends Node<Actor> {
  #components?: Map<ComponentType, any>;
  #stageData?: StageData;

  label?: string; // Just for debugging

  constructor(...components: any[]) {
    super();

    if (components) {
      this.add(...components);
    }
  }

  /**
   * Note: While a Actor may only have one of any given type of component, the components may
   * be shared between Actors without issue. ie: A single Mesh can be add to multiple actors,
   * which will result in multiple instances of the mesh being rendered.
   */
  add(...components: any[]) {
    // The components map isn't added until the actor is actually given a component. This is to
    // make actors that simply serve as a transform node in a tree more lightweight.
    if (!this.#components) {
      this.#components = new Map<ComponentType, any>();
    }

    for (const component of components) {
      if (component instanceof Actor) {
        console.warn('Added an Actor as a component with add(). This is unusual. If you are attempting to attach a child to the Actor, use attachChild().')
      }
      const prev = this.#components.get(component.constructor);
      this.#components.set(component.constructor, component);
      prev?.removedFromActor?.(this);
      this.#stageData?.addActorComponent(this, component);
      component.addToActor?.(this);
      if (this.#stageData) {
        component.addToStage?.(this.#stageData?.stage, this);
      }
    }

    return this;
  }

  remove(componentType: ComponentType): any {
    const component = this.#components?.get(componentType);
    if (!component) { return undefined; }
    this.#components!.delete(componentType);
    if (this.#stageData) {
      component.removeFromStage?.(this.#stageData?.stage, this);
    }
    component?.removeFromActor?.(this);
    this.#stageData?.removeActorComponent(this, component.constructor);
    return component;
  }

  setStage(stageData?: StageData) {
    if (this.#stageData && this.#components) {
      for (const component of this.#components.values()) {
          component.removeFromStage?.(this.#stageData.stage, this);
      }
    }
    this.#stageData = stageData;
    if (this.#stageData && this.#components) {
      for (const component of this.#components?.values()) {
          component.addToStage?.(this.#stageData.stage, this);
      }
    }
  }

  get stage(): Stage | undefined {
    return this.#stageData?.stage;
  }

  has(componentType: ComponentType): boolean {
    return this.#components?.has(componentType) ?? false;
  }

  get<T extends {}>(componentType: ComponentType<T>): T | undefined {
    return this.#components?.get(componentType);
  }

  get componentTypes() {
    return this.#components?.keys();
  }

  get components() {
    return this.#components?.values();
  }

  clone(): Actor {
    // Create a new actor, copying the current one's transform.
    const newActor = new Actor();
    newActor.transform.matrix = this.transform.matrix;

    // Clone all the components of this actor
    for (const component of this.#components?.values() ?? []) {
      // If the component has a clone method call it, otherwise use the same component.
      newActor.add(component.clone?.() ?? component);
    }

    // Clone children
    for (const child of this.children) {
      newActor.attachChild(child.clone());
    }

    return newActor;
  }

  // Node overrides
  onChildAttached(child: Actor) {
    this.#stageData?.addActor(child, true);
  }
  onChildRemoved(child: Actor) {
    this.#stageData?.removeActor(child, true);
  }
}