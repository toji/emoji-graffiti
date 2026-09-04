import { BladeController } from '../controller/blade.js';
import { BladeState } from '../controller/blade-state.js';
export declare class BladeApi<C extends BladeController = BladeController> {
    /**
     * @hidden
     */
    readonly controller: C;
    /**
     * @hidden
     */
    constructor(controller: C);
    get element(): HTMLElement;
    get disabled(): boolean;
    set disabled(disabled: boolean);
    get hidden(): boolean;
    set hidden(hidden: boolean);
    dispose(): void;
    importState(state: BladeState): boolean;
    exportState(): BladeState;
}
