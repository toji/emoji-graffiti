import { FolderApi, Pane } from "tweakpane";
import { PhysicsDebugRenderer } from "./physics/physics-debug-renderer.ts";
import { AppState } from "./app-state.ts";
import { PhysicsFPSController } from "./controllers/physics-fps-controller.ts";


export class DebugMenu {
  appState: AppState;
  pane: Pane;
  stats: FolderApi;

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

    this.stats = this.pane.addFolder({title: 'Decal Stats', expanded: true});

    this.stats.addBinding(this.appState.gpu, 'useBindless', {
      readonly: true,
      label: 'Bindless',
    });

    this.stats.addBinding(this.appState.gpu.decalManager, 'decalCount', {
      readonly: true,
      label: 'Decals',
      format: (v) => v.toFixed(0),
    });

    this.stats.addBinding(this.appState.gpu.decalManager, 'decalTextureCount', {
      readonly: true,
      label: 'Textures',
      format: (v) => v.toFixed(0),
    });

    this.stats.addBinding(this.appState.gpu.decalManager, 'decalMemory', {
      readonly: true,
      label: 'Memory',
      format: (v) => {
        if (v < 1024) { return `${v}b`; }
        v /= 1024;
        if (v < 1024) { return `${parseFloat(v.toFixed(2))}kb`; }
        v /= 1024;
        if (v < 1024) { return `${parseFloat(v.toFixed(2))}mb`; }
        v /= 1024;
        if (v < 1024) { return `${parseFloat(v.toFixed(2))}gb`; }
      },
    });

    this.pane.addBinding(this.appState.config, 'physicsDebugRendering', {
      label: 'Physics Debug',
    }).on('change', (ev) => {
      this.#updatePhysicsDebugRendering();
    });

    this.pane.addBinding(this.appState.config, 'flying');
    this.pane.addBinding(this.appState.config, 'noclip');

    this.#updatePhysicsDebugRendering();
  }

  #updatePhysicsDebugRendering() {
    if (this.appState.config.physicsDebugRendering) {
      this.appState.stage.add(new PhysicsDebugRenderer(this.appState.gpu));
    } else {
      this.appState.stage.remove(PhysicsDebugRenderer);
    }
  }
}