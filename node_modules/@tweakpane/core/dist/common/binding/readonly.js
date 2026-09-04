/**
 * A binding that can read the target.
 * @hidden
 * @template In The type of the internal value.
 */
export class ReadonlyBinding {
    constructor(config) {
        this.target = config.target;
        this.reader_ = config.reader;
    }
    read() {
        return this.reader_(this.target.read());
    }
}
