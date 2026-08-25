import { Mat4 } from 'gl-matrix';
import { Transform } from './transform.js';

// Ah yes! The part of any engine I hate the most: The node tree.

const IDENTITY_MATRIX = new Mat4();

/**
 * A node in a tree of transform nodes.
 * Each node has a `transform` describing it's local transformation and a `worldTransform`
 * describing it's final transformation taking into account all parent transforms (if any).
 */
export class Node<T extends Node<T>> {
  #parent?: T;
  #children?: Set<T>;
  #isDirty = true;

  #transform?: Transform;
  #worldTransform?: Transform;

  constructor() {}

  attachChild(child: T) {
    const childNode = child as Node<T>;
    if (childNode.parent && childNode.parent != this as unknown as T) {
      (childNode.parent as Node<T>).removeChild(child);
    }

    if (!this.#children) { this.#children = new Set(); }
    this.#children.add(child);
    childNode.#parent = this as unknown as T;
    this.onChildAttached(child);
    childNode.#markDirty();
  }

  removeChild(child: T) {
    const childNode = child as Node<T>;
    const removed = this.#children?.delete(child);
    if (removed) {
      childNode.#parent = undefined;
      this.onChildRemoved(child);
      childNode.#markDirty();
    }
  }

  clearChildren() {
    if (!this.#children) { return; }
    for (const child of this.#children) {
      child.#parent = undefined;
      this.onChildRemoved(child);
      child.#markDirty();
    }
    this.#children.clear();
  }

  get children(): Iterable<T> {
    return this.#children?.values() ?? [];
  }

  get parent(): T | undefined {
    return this.#parent;
  }

  get transform(): Transform {
    if (!this.#transform) {
      this.#transform = new Transform({
        matrix: IDENTITY_MATRIX,
        onChange: () => this.#markDirty()
      });
    }
    return this.#transform;
  }

  get worldTransform(): Readonly<Transform> {
    if (this.#isDirty) {
      // Create a world transform if we don't have one yet.
      if (!this.#worldTransform) {
        this.#worldTransform = new Transform();
      }

      const localMatrix = this.#transform?.matrix ?? IDENTITY_MATRIX;
      if (!this.parent) {
        this.#worldTransform.matrix = localMatrix;
      } else {
        Mat4.mul(this.#worldTransform.matrixRef, (this.parent as Node<T>).worldTransform.matrix, localMatrix);
      }
      this.#isDirty = false;
    }
    return this.#worldTransform!;
  }

  #markDirty() {
    if (this.#isDirty) { return; }
    this.#isDirty = true;
    this.onUpdated();

    if (this.#children) {
      for (const child of this.#children) {
        (child as Node<T>).#markDirty();
      }
    }
  }

  onUpdated() { /* Override to respond to world transform changes or other node updates */ }
  onChildAttached(child: T) { /* Override to respond to children being attached */ }
  onChildRemoved(child: T) { /* Override to respond to children being removed */ }
}