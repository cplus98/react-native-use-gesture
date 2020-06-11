import { Vector2, UseGestureEvent } from '../types';
export declare function getGenericEventData(event: UseGestureEvent): {
    touches: number;
    down: boolean;
};
declare type Values = {
    values: Vector2;
};
/**
 * Gets pointer event values.
 * @param event
 * @returns pointer event values
 */
export declare function getPointerEventValues(event: UseGestureEvent): Values;
/**
 * Gets two touches event data
 * @param event
 * @returns two touches event data
 */
export declare function getTwoTouchesEventData(event: UseGestureEvent): {
    values: import("../types").Tuple<number>;
    origin: import("../types").Tuple<number>;
};
export {};
