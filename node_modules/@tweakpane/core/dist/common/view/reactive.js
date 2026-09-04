import { bindValue } from '../model/reactive.js';
function applyClass(elem, className, active) {
    if (active) {
        elem.classList.add(className);
    }
    else {
        elem.classList.remove(className);
    }
}
export function valueToClassName(elem, className) {
    return (value) => {
        applyClass(elem, className, value);
    };
}
export function bindValueToTextContent(value, elem) {
    bindValue(value, (text) => {
        elem.textContent = text !== null && text !== void 0 ? text : '';
    });
}
