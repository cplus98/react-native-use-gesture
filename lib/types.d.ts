import React from 'react';
import { GestureResponderEvent } from 'react-native';
import Controller from './Controller';
import Recognizer from './recognizers/Recognizer';
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare type AtLeastOneOf<T, U = {
    [K in keyof T]: Pick<T, K>;
}> = Partial<T> & U[keyof U];
export declare type Tuple<T> = [T, T];
export declare type Vector2 = Tuple<number>;
export declare type Fn = (...args: any[]) => any;
export declare type FalseOrNumber = false | number;
export interface AxisBounds {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}
export interface Bounds {
    min?: number;
    max?: number;
}
export interface GenericOptions {
    enabled: boolean;
}
export interface GestureOptions {
    enabled: boolean;
    initial: Vector2 | (() => Vector2);
    threshold?: number | Vector2;
    rubberband: boolean | number | Vector2;
}
export interface CoordinatesOptions {
    axis?: 'x' | 'y';
    lockDirection: boolean;
    bounds?: AxisBounds;
}
export interface DistanceAngleOptions {
    distanceBounds?: Bounds;
    angleBounds?: Bounds;
}
export interface DragOptions {
    filterTaps: boolean;
    swipeVelocity: number | Vector2;
    swipeDistance: number | Vector2;
    delay: boolean | number;
}
export declare type CoordinatesConfig = Partial<GestureOptions & CoordinatesOptions>;
export declare type DistanceAngleConfig = Partial<GestureOptions & DistanceAngleOptions>;
export declare type DragConfig = CoordinatesConfig & Partial<DragOptions>;
export declare type UseDragConfig = Partial<GenericOptions> & DragConfig;
export declare type UsePinchConfig = Partial<GenericOptions> & DragConfig;
export declare type UseGestureConfig = Partial<GenericOptions> & {
    drag?: DragConfig;
    pinch?: DistanceAngleConfig;
};
export interface InternalGenericOptions {
    enabled: boolean;
}
export interface InternalGestureOptions {
    enabled: boolean;
    initial: Vector2 | (() => Vector2);
    threshold: Vector2;
    rubberband: Vector2;
}
export interface InternalCoordinatesOptions extends InternalGestureOptions {
    axis?: 'x' | 'y';
    bounds: Tuple<Vector2>;
    lockDirection: boolean;
}
export interface InternalDistanceAngleOptions extends InternalGestureOptions {
    bounds: Tuple<Vector2>;
}
export interface InternalDragOptions extends InternalCoordinatesOptions {
    filterTaps: boolean;
    swipeVelocity: Vector2;
    swipeDistance: Vector2;
    delay: number;
}
export declare type InternalConfig = InternalGenericOptions & {
    drag?: InternalDragOptions;
    pinch?: InternalDistanceAngleOptions;
};
export declare type UseGestureEvent = GestureResponderEvent;
export interface ReactEventHandlers {
    onTouchCancel?: Fn;
    onTouchCancelCapture?: Fn;
    onTouchEnd?: Fn;
    onTouchEndCapture?: Fn;
    onTouchMove?: Fn;
    onTouchMoveCapture?: Fn;
    onTouchStart?: Fn;
    onTouchStartCapture?: Fn;
    onGestureStart?: Fn;
    onGestureChange?: Fn;
    onGestureEnd?: Fn;
}
export declare type ReactEventHandlerKey = keyof ReactEventHandlers;
export declare type IngKey = 'dragging' | 'pinching';
export declare type CoordinatesKey = 'drag';
export declare type DistanceAngleKey = 'pinch';
export declare type GestureKey = CoordinatesKey | DistanceAngleKey;
export declare type StateKey<T extends GestureKey = GestureKey> = T;
export declare type SharedGestureState = {
    [ingKey in IngKey]: boolean;
} & {
    touches: number;
    down: boolean;
};
export interface CommonGestureState {
    _active: boolean;
    _blocked: boolean;
    _intentional: [FalseOrNumber, FalseOrNumber];
    _movement: Vector2;
    _initial: Vector2;
    _lastEventType?: string;
    event?: UseGestureEvent;
    currentTarget?: (EventTarget & Element) | null;
    pointerId?: number | null;
    values: Vector2;
    velocities: Vector2;
    delta: Vector2;
    movement: Vector2;
    offset: Vector2;
    lastOffset: Vector2;
    initial: Vector2;
    previous: Vector2;
    direction: Vector2;
    first: boolean;
    last: boolean;
    active: boolean;
    startTime: number;
    timeStamp: number;
    elapsedTime: number;
    cancel?(): void;
    canceled: boolean;
    memo?: any;
    args?: any;
}
export interface Coordinates {
    axis?: 'x' | 'y';
    xy: Vector2;
    velocity: number;
    vxvy: Vector2;
    distance: number;
}
export interface DragState {
    _isTap: boolean;
    _delayedEvent: boolean;
    tap: boolean;
    swipe: Vector2;
}
export interface DistanceAngle {
    da: Vector2;
    vdva: Vector2;
    origin?: Vector2;
    turns: number;
}
export declare type State = {
    shared: SharedGestureState;
} & {
    drag: CommonGestureState & Coordinates & DragState;
    pinch: CommonGestureState & DistanceAngle;
};
export declare type GestureState<T extends StateKey> = State[T];
export declare type PartialGestureState<T extends StateKey> = Partial<GestureState<T>>;
export declare type FullGestureState<T extends StateKey> = SharedGestureState & State[T];
export declare type Handler<T extends GestureKey> = (state: FullGestureState<StateKey<T>>) => any | void;
export declare type HandlerKey = 'onDrag' | 'onPinch';
export declare type UserHandlers = {
    onDrag: Handler<'drag'>;
    onDragStart: Handler<'drag'>;
    onDragEnd: Handler<'drag'>;
    onPinch: Handler<'pinch'>;
    onPinchStart: Handler<'pinch'>;
    onPinchEnd: Handler<'pinch'>;
};
export declare type InternalHandlers = {
    [Key in GestureKey]: Handler<Key>;
};
export declare type RecognizerClass<T extends StateKey> = {
    new (controller: Controller, args: any[]): Recognizer<T>;
};
export declare type RecognizerClasses = (RecognizerClass<'drag'> | RecognizerClass<'pinch'>)[];
declare type ReactDomAttributes = React.DOMAttributes<Element>;
export declare type NativeHandlersPartial = Partial<Omit<ReactDomAttributes, keyof UserHandlers & keyof ReactDomAttributes>>;
export declare type UserHandlersPartial = AtLeastOneOf<UserHandlers> & NativeHandlersPartial;
export declare type HookReturnType<T> = T extends object ? Fn : ReactEventHandlers;
export {};
