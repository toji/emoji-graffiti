import { forceCast } from '../misc/type-util.js';
export const SVG_NS = 'http://www.w3.org/2000/svg';
export function forceReflow(element) {
    element.offsetHeight;
}
export function disableTransitionTemporarily(element, callback) {
    const t = element.style.transition;
    element.style.transition = 'none';
    callback();
    element.style.transition = t;
}
export function supportsTouch(doc) {
    return doc.ontouchstart !== undefined;
}
function getGlobalObject() {
    return globalThis;
}
export function getWindowDocument() {
    const globalObj = forceCast(getGlobalObject());
    return globalObj.document;
}
export function getCanvasContext(canvasElement) {
    const win = canvasElement.ownerDocument.defaultView;
    if (!win) {
        return null;
    }
    // HTMLCanvasElement.prototype.getContext is not defined on testing environment
    const isBrowser = 'document' in win;
    return isBrowser
        ? canvasElement.getContext('2d', {
            willReadFrequently: true,
        })
        : null;
}
const ICON_ID_TO_INNER_HTML_MAP = {
    check: '<path d="M2 8l4 4l8 -8"/>',
    dropdown: '<path d="M5 7h6l-3 3 z"/>',
    p2dpad: '<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>',
};
export function createSvgIconElement(document, iconId) {
    const elem = document.createElementNS(SVG_NS, 'svg');
    elem.innerHTML = ICON_ID_TO_INNER_HTML_MAP[iconId];
    return elem;
}
export function insertElementAt(parentElement, element, index) {
    parentElement.insertBefore(element, parentElement.children[index]);
}
export function removeElement(element) {
    if (element.parentElement) {
        element.parentElement.removeChild(element);
    }
}
export function removeChildElements(element) {
    while (element.children.length > 0) {
        element.removeChild(element.children[0]);
    }
}
export function removeChildNodes(element) {
    while (element.childNodes.length > 0) {
        element.removeChild(element.childNodes[0]);
    }
}
export function indexOfChildElement(element) {
    const parentElem = element.parentElement;
    if (!parentElem) {
        return -1;
    }
    const children = Array.prototype.slice.call(parentElem.children);
    return children.indexOf(element);
}
export function findNextTarget(ev) {
    if (ev.relatedTarget) {
        return forceCast(ev.relatedTarget);
    }
    // Workaround for Firefox
    if ('explicitOriginalTarget' in ev) {
        return ev.explicitOriginalTarget;
    }
    // TODO: Workaround for Safari
    // Safari doesn't set next target for some elements
    // (e.g. button, input[type=checkbox], etc.)
    return null;
}
