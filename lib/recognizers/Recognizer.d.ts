import Controller from '../Controller';
import { StateKey, SharedGestureState, UseGestureEvent, IngKey, InternalConfig, GestureState, PartialGestureState, Vector2, FalseOrNumber, FullGestureState } from '../types';
/**
 * @private
 * Recognizer abstract class.
 *
 * @protected
 * @abstract
 * @type {StateKey<T>} whether the Recognizer should deal with coordinates or distance / angle
 */
export default abstract class Recognizer<T extends StateKey> {
    protected readonly stateKey: T;
    protected readonly controller: Controller;
    protected readonly args: any[];
    protected abstract ingKey: IngKey;
    protected debounced: Boolean;
    /**
     * Creates an instance of a gesture recognizer.
     * @param stateKey drag, move, pinch, etc.
     * @param controller the controller attached to the gesture
     * @param [args] the args that should be passed to the gesture handler
     */
    constructor(stateKey: T, controller: Controller, args?: any[]);
    protected get config(): NonNullable<InternalConfig[T]>;
    protected get enabled(): boolean;
    protected get state(): GestureState<T>;
    protected get handler(): NonNullable<Partial<import("../types").InternalHandlers>[T]>;
    protected updateSharedState(sharedState: Partial<SharedGestureState> | null): void;
    protected updateGestureState(gestureState: PartialGestureState<T> | null): void;
    protected setTimeout: (callback: (...args: any[]) => void, ms?: number, ...args: any[]) => void;
    protected clearTimeout: () => void;
    /**
     * Utility function to get kinematics of the gesture.
     *
     * @abstract
     * @values - values we want to calculate the kinematics from
     * @event - the pointer event
     * @returns - set of values including movement, velocity, velocities, distance and direction
     */
    protected abstract getKinematics(values: Vector2, event: UseGestureEvent): PartialGestureState<T>;
    protected abstract mapStateValues(state: GestureState<T>): PartialGestureState<T>;
    abstract addBindings(): void;
    /**
     * Returns a generic, common payload for all gestures from an event.
     *
     * @param {UseGestureEvent} event
     * @param {boolean} [isStartEvent]
     * @returns - the generic gesture payload
     */
    protected getGenericPayload(event: UseGestureEvent, isStartEvent?: boolean): {
        _lastEventType: string;
        event: import("react-native").GestureResponderEvent;
        timeStamp: number;
        elapsedTime: number;
        args: any[];
        previous: import("../types").Tuple<number>;
    };
    /**
     * Returns the reinitialized start state for the gesture.
     * Should be common to all gestures.
     *
     * @param {Vector2} values
     * @param {UseGestureEvent} event
     * @returns - the start state for the gesture
     */
    protected getStartGestureState: (values: import("../types").Tuple<number>, event: UseGestureEvent) => import("../types").State[T] & {
        _active: boolean;
        values: import("../types").Tuple<number>;
        initial: import("../types").Tuple<number>;
        offset: import("../types").Tuple<number>;
        lastOffset: import("../types").Tuple<number>;
        startTime: number;
    };
    /**
     * Returns state properties depending on the movement and state.
     *
     * Should be overriden for custom behavior, doesn't do anything in the implementation
     * below.
     */
    protected checkIntentionality(_intentional: [FalseOrNumber, FalseOrNumber], _movement: Vector2, _state: PartialGestureState<T>): PartialGestureState<T>;
    protected abstract getInternalMovement(values: Vector2, state: GestureState<T>): Vector2;
    /**
     * Returns basic movement properties for the gesture based on the next values and current state.
     */
    protected getMovement(values: Vector2, state?: GestureState<T>): PartialGestureState<T>;
    protected rubberband: (vector: import("../types").Tuple<number>, rubberband: import("../types").Tuple<number>) => import("../types").Tuple<number>;
    protected clean(): void;
    /**
     * Fires the gesture handler
     *
     * @param {boolean} [forceFlag] - if true, then the handler will fire even if the gesture is not intentional
     */
    protected fireGestureHandler: (forceFlag?: boolean | undefined) => FullGestureState<T> | null;
}
