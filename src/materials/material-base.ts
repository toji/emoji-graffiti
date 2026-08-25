import { Actor, ComponentType } from "../core/actor.ts";
import { Stage } from "../core/stage.ts";

export class ActorMaterial {
  material: MaterialBase;
  materialType: ComponentType;

  constructor(material: MaterialBase) {
    this.materialType = Stage.getComponentType(material);
    this.material = material;
  }
}

export class MaterialBase {
  addToActor(actor: Actor) {
    // Only one "primary" material allowed at a time.
    let actorMaterial = actor.get(ActorMaterial);
    if (actorMaterial) {
      actor.remove(actorMaterial.materialType);
    }
    actorMaterial = new ActorMaterial(this);
  }

  removedFromActor(actor: Actor) {
    actor.remove(ActorMaterial);
  }
}