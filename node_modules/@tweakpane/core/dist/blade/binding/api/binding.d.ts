import { BladeApi } from '../../common/api/blade.js';
import { EventListenable } from '../../common/api/event-listenable.js';
import { Refreshable } from '../../common/api/refreshable.js';
import { TpChangeEvent } from '../../common/api/tp-event.js';
import { BindingController } from '../controller/binding.js';
export interface BindingApiEvents<Ex> {
    change: TpChangeEvent<Ex, BindingApi<unknown, Ex>>;
}
/**
 * The API for binding between the parameter and the pane.
 * @template In The internal type.
 * @template Ex The external type.
 */
export declare class BindingApi<In = unknown, Ex = unknown, C extends BindingController<In> = BindingController<In>> extends BladeApi<C> implements EventListenable<BindingApiEvents<Ex>>, Refreshable {
    private readonly emitter_;
    /**
     * @hidden
     */
    constructor(controller: C);
    get label(): string | null | undefined;
    set label(label: string | null | undefined);
    /**
     * The key of the bound value.
     */
    get key(): string;
    /**
     * The generic tag with many uses.
     */
    get tag(): string | undefined;
    set tag(tag: string | undefined);
    on<EventName extends keyof BindingApiEvents<Ex>>(eventName: EventName, handler: (ev: BindingApiEvents<Ex>[EventName]) => void): this;
    off<EventName extends keyof BindingApiEvents<Ex>>(eventName: EventName, handler: (ev: BindingApiEvents<Ex>[EventName]) => void): this;
    refresh(): void;
    private onValueChange_;
}
