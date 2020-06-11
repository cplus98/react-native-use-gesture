/// <reference types="node" />
import { StateKey, State, Fn, ReactEventHandlerKey, ReactEventHandlers, InternalConfig, InternalHandlers } from './types';
declare type GestureTimeouts = Partial<{
    [stateKey in StateKey]: NodeJS.Timeout;
}>;
/**
 * The controller will keep track of the state for all gestures and also keep
 * track of timeouts, and window listeners.
 *
 * @template BinderType the type the bind function should return
 */
export default class Controller {
    config: InternalConfig;
    handlers: Partial<InternalHandlers>;
    state: State;
    timeouts: GestureTimeouts;
    private bindings;
    /**
     * Function ran on component unmount: cleans timeouts.
     */
    clean: () => void;
    /**
     * Function run every time the bind function is run (ie on every render).
     * Resets the binding object
     */
    resetBindings: () => void;
    /**
     * this.bindings is an object which keys match ReactEventHandlerKeys.
     * Since a recognizer might want to bind a handler function to an event key already used by a previously
     * added recognizer, we need to make sure that each event key is an array of all the functions mapped for
     * that key.
     */
    addBindings: (eventNames: ReactEventHandlerKey | ReactEventHandlerKey[], fn: Fn) => void;
    /**
     * getBindings will return an object that will be bound by users
     * to the react component they want to interact with.
     */
    getBindings: () => ReactEventHandlers;
    getBind: () => ReactEventHandlers;
}
export {};
