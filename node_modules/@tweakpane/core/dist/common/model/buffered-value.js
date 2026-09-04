import { forceCast } from '../../misc/type-util.js';
function fillBuffer(buffer, bufferSize) {
    while (buffer.length < bufferSize) {
        buffer.push(undefined);
    }
}
export function initializeBuffer(bufferSize) {
    const buffer = [];
    fillBuffer(buffer, bufferSize);
    return buffer;
}
function createTrimmedBuffer(buffer) {
    const index = buffer.indexOf(undefined);
    return forceCast(index < 0 ? buffer : buffer.slice(0, index));
}
export function createPushedBuffer(buffer, newValue) {
    const newBuffer = [...createTrimmedBuffer(buffer), newValue];
    if (newBuffer.length > buffer.length) {
        newBuffer.splice(0, newBuffer.length - buffer.length);
    }
    else {
        fillBuffer(newBuffer, buffer.length);
    }
    return newBuffer;
}
