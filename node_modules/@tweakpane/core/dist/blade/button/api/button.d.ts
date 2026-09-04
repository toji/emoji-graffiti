import { BladeApi } from '../../common/api/blade.js';
import { EventListenable } from '../../common/api/event-listenable.js';
import { TpMouseEvent } from '../../common/api/tp-event.js';
import { ButtonBladeController } from '../controller/button-blade.js';
export interface ButtonApiEvents {
    click: TpMouseEvent<ButtonApi>;
}
export declare class ButtonApi extends BladeApi<ButtonBladeController> implements EventListenable<ButtonApiEvents> {
    get label(): string | null | undefined;
    set label(label: string | null | undefined);
    get title(): string;
    set title(title: string);
    on<EventName extends keyof ButtonApiEvents>(eventName: EventName, handler: (ev: ButtonApiEvents[EventName]) => void): this;
    off<EventName extends keyof ButtonApiEvents>(eventName: EventName, handler: (ev: ButtonApiEvents[EventName]) => void): this;
}
