import RAPIER from '@dimforge/rapier3d-compat';
import { Actor } from "../core/actor.ts";
import { TickData } from "../core/stage.ts";

export class StagePhysics {
  world: RAPIER.World;

  constructor(world: RAPIER.World) {
    this.world = world;
  }

  static TickOrder = -1;
  onTick(tickData: TickData, actor: Actor) {
    this.world.step();
  }
}