import { Emitter } from '../../model/emitter.js';
/**
 * @hidden
 */
export class IntervalTicker {
    constructor(doc, interval) {
        this.disabled_ = false;
        this.timerId_ = null;
        this.onTick_ = this.onTick_.bind(this);
        // this.onWindowBlur_ = this.onWindowBlur_.bind(this);
        // this.onWindowFocus_ = this.onWindowFocus_.bind(this);
        this.doc_ = doc;
        this.emitter = new Emitter();
        this.interval_ = interval;
        this.setTimer_();
        // TODO: Stop on blur?
        // const win = document.defaultView;
        // if (win) {
        //   win.addEventListener('blur', this.onWindowBlur_);
        //   win.addEventListener('focus', this.onWindowFocus_);
        // }
    }
    get disabled() {
        return this.disabled_;
    }
    set disabled(inactive) {
        this.disabled_ = inactive;
        if (this.disabled_) {
            this.clearTimer_();
        }
        else {
            this.setTimer_();
        }
    }
    dispose() {
        this.clearTimer_();
    }
    clearTimer_() {
        if (this.timerId_ === null) {
            return;
        }
        const win = this.doc_.defaultView;
        if (win) {
            win.clearInterval(this.timerId_);
        }
        this.timerId_ = null;
    }
    setTimer_() {
        this.clearTimer_();
        if (this.interval_ <= 0) {
            return;
        }
        const win = this.doc_.defaultView;
        if (win) {
            this.timerId_ = win.setInterval(this.onTick_, this.interval_);
        }
    }
    onTick_() {
        if (this.disabled_) {
            return;
        }
        this.emitter.emit('tick', {
            sender: this,
        });
    }
}
