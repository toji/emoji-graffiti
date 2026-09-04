import { createNumberFormatter } from './number.js';
const innerFormatter = createNumberFormatter(0);
export function formatPercentage(value) {
    return innerFormatter(value) + '%';
}
