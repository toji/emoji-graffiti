import { JSDOM } from 'jsdom';
import { forceCast } from './type-util.js';
export function createTestWindow() {
    return forceCast(new JSDOM('').window);
}
