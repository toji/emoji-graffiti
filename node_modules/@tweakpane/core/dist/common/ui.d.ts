interface StepKeys {
    altKey: boolean;
    downKey: boolean;
    shiftKey: boolean;
    upKey: boolean;
}
export declare function getStepForKey(keyScale: number, keys: StepKeys): number;
export declare function getVerticalStepKeys(ev: KeyboardEvent): StepKeys;
export declare function getHorizontalStepKeys(ev: KeyboardEvent): StepKeys;
export declare function isVerticalArrowKey(key: string): boolean;
export declare function isArrowKey(key: string): boolean;
export {};
