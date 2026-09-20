import { Pane } from "tweakpane";
import { PhysicsDebugRenderer } from "./physics/physics-debug-renderer.ts";
import { AppState } from "./app-state.ts";
import { PhysicsFPSController } from "./controllers/physics-fps-controller.ts";


export class DebugMenu {
  appState: AppState;
  pane: Pane;

  constructor(appState: AppState) {
    this.appState = appState;

    this.pane = new Pane({
      title: document.title.split('-')[0],
    });

    this.pane.addButton({
      title: 'Save',
    }).on('click', () => {
      const json = this.appState.serializeDecalLayout();
      const blob = new Blob([json], { type: "text/json" });
      const link = document.createElement("a");
      link.download = 'decalLayout.json';
      link.href = window.URL.createObjectURL(blob);
      link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
      link.click();
      link.remove();
    });

    this.pane.addButton({
      title: 'Load',
    }).on('click', () => {
      let input = document.createElement('input');
      input.type = 'file';
      input.onchange = async () => {
        let file = input.files?.item(0);
        if (file) {
          this.appState.deserializeDecalLayoutFromString(await file.text());
        }
      };
      input.click();
    });

    this.pane.addBinding(this.appState.config, 'physicsDebugRendering').on('change', (ev) => {
      this.#updatePhysicsDebugRendering();
    });

    this.pane.addBinding(this.appState.config, 'flying').on('change', (ev) => {
      this.#updateFlying();
    });

    this.#updatePhysicsDebugRendering();
    this.#updateFlying();
  }

  #updatePhysicsDebugRendering() {
    if (this.appState.config.physicsDebugRendering) {
      this.appState.stage.add(new PhysicsDebugRenderer(this.appState.gpu));
    } else {
      this.appState.stage.remove(PhysicsDebugRenderer);
    }
  }

  #updateFlying() {
    this.appState.stage.query(PhysicsFPSController).forEach((actor, controller) => {
      controller.flying = this.appState.config.flying;
    });
  }
}