import { Vec2 } from "gl-matrix";
import { Actor } from "../core/actor.ts";
import { TickData } from "../core/stage.ts";
import { Collection} from "nipplejs/Collection";

export class ActionBoolean extends EventTarget {
  #pressed = false;
  #lastPressed = false;

  set pressed(value: boolean) {
    this.#lastPressed = this.#pressed;
    this.#pressed = value;
    if (this.#pressed != this.#lastPressed) {
      this.dispatchEvent(new Event(this.#pressed ? 'start' : 'end'));
    }
  }

  get pressed(): boolean {
    return this.#pressed;
  }

  get changed(): boolean {
    return this.#pressed == this.#lastPressed;
  }
}

export class PlayerActions {
  walk = new Vec2();
  look = new Vec2();
  primary = new ActionBoolean;
  jump = new ActionBoolean;
  crouch = new ActionBoolean;
  nextSlot = new ActionBoolean;
  prevSlot = new ActionBoolean;
}

const GAMEPAD_DEADZONE = 0.1;

export class ActionManager {
  #mouseElement: HTMLElement;
  #playerActions: PlayerActions = new PlayerActions();

  #keyPressed: { [key: string]: boolean } = {};
  #mouseDelta = new Vec2();
  #mouseButtons = 0;
  #mouseWheel = 0;

  #virtualWalkJoystick?: Collection;
  #virtualLookJoystick?: Collection;
  #stickWalk = new Vec2();
  #stickLook = new Vec2();

  constructor(mouseElement?: HTMLElement) {
    this.#mouseElement = mouseElement ?? document.body;

    // Keyboard handling
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      // Do nothing if event already handled
      if (event.defaultPrevented || !this.isPointerLocked) { return; }
      this.#keyPressed[event.code] = true;
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (!this.isPointerLocked) { return; }
      this.#keyPressed[event.code] = false;
    });
    window.addEventListener('blur', (event: Event) => {
      // Clear the pressed keys on blur so that we don't have inadvertent inputs
      // after we've shifted focus to another window.
      this.#keyPressed = {};
    });

    // Mouse handling
    let lastX: number;
    let lastY: number;
    this.#mouseElement.addEventListener('click', (event: PointerEvent) => {
      if (!this.isPointerLocked) {
        this.#mouseElement.requestPointerLock({
          unadjustedMovement: true,
        });
      }
    });
    document.addEventListener("pointerlockchange", () => {
      this.#keyPressed = {};
    });
    this.#mouseElement.addEventListener('pointerenter', (event: PointerEvent) => {
      lastX = event.pageX;
      lastY = event.pageY;
    });
    this.#mouseElement.addEventListener('pointermove', (event: PointerEvent) => {
      if(document.pointerLockElement !== null) {
        this.#mouseDelta[0] += event.movementX;
        this.#mouseDelta[1] += event.movementY;
      } else {
        this.#mouseDelta[0] += event.pageX - lastX;
        this.#mouseDelta[1] += event.pageY - lastY;
      }
      lastX = event.pageX;
      lastY = event.pageY;
    });
    this.#mouseElement.addEventListener('wheel', (event: WheelEvent) => {
      this.#mouseWheel = event.deltaY;
      event.preventDefault();
    });
    const buttonCallback = (event: PointerEvent) => {
      this.#mouseButtons = event.buttons;
    };
    this.#mouseElement.addEventListener('pointerdown', buttonCallback);
    this.#mouseElement.addEventListener('pointerup', buttonCallback);
  }

  get isPointerLocked() {
    return this.#mouseElement === document.pointerLockElement;
  }

  get playerActions(): PlayerActions {
    return this.#playerActions;
  }

  setVirtualWalkJoystick(vjs?: Collection) {
    if (this.#virtualWalkJoystick) {
      this.#virtualWalkJoystick.off('move');
      this.#virtualWalkJoystick.off('end');
    }

    this.#virtualWalkJoystick = vjs;

    if (this.#virtualWalkJoystick) {
      this.#virtualWalkJoystick.on('move', (evt: any) => {
        this.#stickWalk[0] = evt.data.vector.x;
        this.#stickWalk[1] = -evt.data.vector.y;
      });
      this.#virtualWalkJoystick.on('end', () => {
        this.#stickWalk[0] = 0;
        this.#stickWalk[1] = 0;
      });
    }
  }

  setVirtualLookJoystick(vjs?: Collection) {
    if (this.#virtualLookJoystick) {
      this.#virtualLookJoystick.off('move');
      this.#virtualLookJoystick.off('end');
    }

    this.#virtualLookJoystick = vjs;

    if (this.#virtualLookJoystick) {
      this.#virtualLookJoystick.on('move', (evt: any) => {
        this.#stickLook[0] = evt.data.vector.x;
        this.#stickLook[1] = -evt.data.vector.y;
      });
      this.#virtualLookJoystick.on('end', () => {
        this.#stickLook[0] = 0;
        this.#stickLook[1] = 0;
      });
    }
  }

  addToActor(actor: Actor) {
    actor.add(this.#playerActions);
  }

  removeFromActor(actor: Actor) {
    actor.remove(PlayerActions);
  }

  onTick(tickData: TickData, actor: Actor) {
    this.#playerActions.walk[0] = 0;
    this.#playerActions.walk[1] = 0;

    this.#playerActions.look[0] = 0;
    this.#playerActions.look[1] = 0;

    let primaryPressed = false;
    let jumpPressed = false;
    let crouchPressed = false;
    let nextSlotPressed = false;
    let prevSlotPressed = false;

    // Gamepad input
    for (const gamepad of navigator.getGamepads()) {
      if (gamepad) {
        if (Math.abs(gamepad.axes[0]) >= GAMEPAD_DEADZONE ||
            Math.abs(gamepad.axes[1]) >= GAMEPAD_DEADZONE) {
          this.#playerActions.walk[0] += gamepad.axes[0];
          this.#playerActions.walk[1] += gamepad.axes[1];
        }

        if (Math.abs(gamepad.axes[2]) >= GAMEPAD_DEADZONE ||
            Math.abs(gamepad.axes[3]) >= GAMEPAD_DEADZONE) {
          this.#playerActions.look[0] += gamepad.axes[2];
          this.#playerActions.look[1] += gamepad.axes[3];
        }

        // Either trigger or left face button
        primaryPressed ||= gamepad.buttons[2].pressed || gamepad.buttons[6].pressed || gamepad.buttons[7].pressed;
        // Bottom face Button
        jumpPressed ||= gamepad.buttons[0].pressed;
        // Right face Button (TODO: Feels weird?)
        crouchPressed ||= gamepad.buttons[1].pressed;
        // Right shoulder or right d-pad
        nextSlotPressed ||= gamepad.buttons[5].pressed || gamepad.buttons[15].pressed;
        // Left shoulder or left d-pad
        prevSlotPressed ||= gamepad.buttons[4].pressed || gamepad.buttons[14].pressed;
      }
    }

    // Keyboard Input
    if (this.#keyPressed['KeyW']) {
      this.#playerActions.walk[1] -= 1.0;
    }
    if (this.#keyPressed['KeyS']) {
      this.#playerActions.walk[1] += 1.0;
    }
    if (this.#keyPressed['KeyA']) {
      this.#playerActions.walk[0] -= 1.0;
    }
    if (this.#keyPressed['KeyD']) {
      this.#playerActions.walk[0] += 1.0;
    }

    if (this.#keyPressed['ArrowLeft']) {
      this.#playerActions.look[0] -= 1.0;
    }
    if (this.#keyPressed['ArrowRight']) {
      this.#playerActions.look[0] += 1.0;
    }
    if (this.#keyPressed['ArrowUp']) {
      this.#playerActions.look[1] -= 1.0;
    }
    if (this.#keyPressed['ArrowDown']) {
      this.#playerActions.look[1] += 1.0;
    }

    primaryPressed ||= !!this.#keyPressed['Enter'];
    jumpPressed ||= !!this.#keyPressed['Space'];
    crouchPressed ||= !!this.#keyPressed['ShiftLeft'];
    nextSlotPressed ||= !!this.#keyPressed['KeyE'];
    prevSlotPressed ||= !!this.#keyPressed['KeyQ'];

    // Mouse Input
    if (this.isPointerLocked || !!(this.#mouseButtons & 0x01)) {
      this.#playerActions.look.scaleAndAdd(this.#mouseDelta, 0.25);
    }
    primaryPressed ||= !!(this.#mouseButtons & (this.isPointerLocked ? 0x01 : 0x02));
    nextSlotPressed ||= this.#mouseWheel > 0;
    prevSlotPressed ||= this.#mouseWheel < 0;

    this.#mouseDelta[0] = 0;
    this.#mouseDelta[1] = 0;
    this.#mouseWheel = 0;

    // Touch Inputs
    this.#playerActions.walk.add(this.#stickWalk);
    this.#playerActions.look.add(this.#stickLook);

    // Normalize inputs.
    const sqrMag = this.#playerActions.walk.sqrMag;
    if (sqrMag > 1) {
      this.#playerActions.walk.normalize();
    }

    // TODO: Normalize look as well?

    this.#playerActions.primary.pressed = primaryPressed;
    this.#playerActions.jump.pressed = jumpPressed;
    this.#playerActions.crouch.pressed = crouchPressed;
    this.#playerActions.nextSlot.pressed = nextSlotPressed;
    this.#playerActions.prevSlot.pressed = prevSlotPressed;
  }
}