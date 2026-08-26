export class ControllerInput {
  #element?: HTMLElement;
  #registerElement: (value?: HTMLElement) => void;

  #keyPressed: { [key: string]: boolean } = {};
  #mousePressed: boolean[] = [];

  constructor(element?: HTMLElement) {
    let lastX: number;
    let lastY: number;

    // Keyboard handling
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      // Do nothing if event already handled
      if (event.defaultPrevented) { return; }
      this.#keyPressed[event.code] = true;
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      this.#keyPressed[event.code] = false;
    });
    window.addEventListener('blur', (event: Event) => {
      // Clear the pressed keys on blur so that we don't have inadvertent inputs
      // after we've shifted focus to another window.
      this.#keyPressed = {};
    });

    // Mouse/Pointer handling
    const downCallback = (event: PointerEvent) => {
      lastX = event.pageX;
      lastY = event.pageY;
    };
    const moveCallback = (event: PointerEvent) => {
      this.#mousePressed[0] = (event.buttons & 0x01) != 0 || event.pointerType == 'touch';
      this.#mousePressed[1] = (event.buttons & 0x02) != 0;
      this.#mousePressed[3] = (event.buttons & 0x04) != 0;
      this.#mousePressed[4] = (event.buttons & 0x08) != 0;
      this.#mousePressed[5] = (event.buttons & 0x10) != 0;

      if(document.pointerLockElement !== null) {
        this.onMouseMove(event.movementX, event.movementY);
      } else {
        this.onMouseMove(event.pageX - lastX, event.pageY - lastY);
      }
      lastX = event.pageX;
      lastY = event.pageY;
    };
    const wheelCallback = (event: WheelEvent) => {
      this.onScroll(event.deltaY);
      event.preventDefault();
    };

    this.#registerElement = (value?: HTMLElement) => {
      if (this.#element && this.#element != value) {
        this.#element.removeEventListener('pointerdown', downCallback);
        this.#element.removeEventListener('pointermove', moveCallback);
        this.#element.removeEventListener('wheel', wheelCallback);
      }

      this.#element = value;
      if (this.#element) {
        this.#element.addEventListener('pointerdown', downCallback);
        this.#element.addEventListener('pointermove', moveCallback);
        this.#element.addEventListener('wheel', wheelCallback);
      }
    }

    this.#registerElement(element);
  }

  set element(value: HTMLElement | undefined) {
    this.#registerElement(value);
  }

  get element(): HTMLElement | undefined {
    return this.#element;
  }

  protected onMouseMove(xDelta: number, yDelta: number) {}
  protected onScroll(delta: number) {}

  keyPressed(keycode: string): boolean {
    return !!this.#keyPressed[keycode];
  }

  mousePressed(button: number): boolean {
    return !!this.#mousePressed[button];
  }
}