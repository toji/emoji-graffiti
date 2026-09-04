import { ValueController } from '../../../common/controller/value.js';
import { Value } from '../../../common/model/value.js';
import { ViewProps } from '../../../common/model/view-props.js';
import { IntColor } from '../model/int-color.js';
import { APaletteView } from '../view/a-palette.js';
interface Config {
    value: Value<IntColor>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class APaletteController implements ValueController<IntColor, APaletteView> {
    readonly value: Value<IntColor>;
    readonly view: APaletteView;
    readonly viewProps: ViewProps;
    private readonly ptHandler_;
    constructor(doc: Document, config: Config);
    private handlePointerEvent_;
    private onPointerDown_;
    private onPointerMove_;
    private onPointerUp_;
    private onKeyDown_;
    private onKeyUp_;
}
export {};
