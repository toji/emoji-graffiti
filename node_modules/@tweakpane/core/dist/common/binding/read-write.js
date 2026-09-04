/**
 * A binding that can read and write the target.
 * @hidden
 * @template In The type of the internal value.
 */
export class ReadWriteBinding {
    constructor(config) {
        this.target = config.target;
        this.reader_ = config.reader;
        this.writer_ = config.writer;
    }
    read() {
        return this.reader_(this.target.read());
    }
    write(value) {
        this.writer_(this.target, value);
    }
    inject(value) {
        this.write(this.reader_(value));
    }
}
