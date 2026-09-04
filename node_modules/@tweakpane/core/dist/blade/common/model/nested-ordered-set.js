import { Emitter } from '../../../common/model/emitter.js';
import { TpError } from '../../../common/tp-error.js';
/**
 * @hidden
 */
export class NestedOrderedSet {
    constructor(extract) {
        this.emitter = new Emitter();
        this.items_ = [];
        this.cache_ = new Set();
        this.onSubListAdd_ = this.onSubListAdd_.bind(this);
        this.onSubListRemove_ = this.onSubListRemove_.bind(this);
        this.extract_ = extract;
    }
    get items() {
        return this.items_;
    }
    allItems() {
        return Array.from(this.cache_);
    }
    find(callback) {
        for (const item of this.allItems()) {
            if (callback(item)) {
                return item;
            }
        }
        return null;
    }
    includes(item) {
        return this.cache_.has(item);
    }
    add(item, opt_index) {
        if (this.includes(item)) {
            throw TpError.shouldNeverHappen();
        }
        const index = opt_index !== undefined ? opt_index : this.items_.length;
        this.items_.splice(index, 0, item);
        this.cache_.add(item);
        const subList = this.extract_(item);
        if (subList) {
            subList.emitter.on('add', this.onSubListAdd_);
            subList.emitter.on('remove', this.onSubListRemove_);
            subList.allItems().forEach((i) => {
                this.cache_.add(i);
            });
        }
        this.emitter.emit('add', {
            index: index,
            item: item,
            root: this,
            target: this,
        });
    }
    remove(item) {
        const index = this.items_.indexOf(item);
        if (index < 0) {
            return;
        }
        this.items_.splice(index, 1);
        this.cache_.delete(item);
        const subList = this.extract_(item);
        if (subList) {
            subList.allItems().forEach((i) => {
                this.cache_.delete(i);
            });
            subList.emitter.off('add', this.onSubListAdd_);
            subList.emitter.off('remove', this.onSubListRemove_);
        }
        this.emitter.emit('remove', {
            index: index,
            item: item,
            root: this,
            target: this,
        });
    }
    onSubListAdd_(ev) {
        this.cache_.add(ev.item);
        this.emitter.emit('add', {
            index: ev.index,
            item: ev.item,
            root: this,
            target: ev.target,
        });
    }
    onSubListRemove_(ev) {
        this.cache_.delete(ev.item);
        this.emitter.emit('remove', {
            index: ev.index,
            item: ev.item,
            root: this,
            target: ev.target,
        });
    }
}
