import _ from 'lodash';
import { StateKey, State, Fn, ReactEventHandlerKey, ReactEventHandlers, InternalConfig, InternalHandlers } from './types';
import { getInitialState } from './utils/state';
import { chainFns } from './utils/utils';

type GestureTimeouts = Partial<{ [stateKey in StateKey]: NodeJS.Timeout }>;
type Bindings = Partial<{ [eventName in ReactEventHandlerKey]: Fn[] }>;

/**
 * The controller will keep track of the state for all gestures and also keep
 * track of timeouts, and window listeners.
 *
 * @template BinderType the type the bind function should return
 */
export default class Controller {
	public config!: InternalConfig;

	public handlers!: Partial<InternalHandlers>;

	public state: State = getInitialState(); // state for all gestures

	public timeouts: GestureTimeouts = {}; // keeping track of timeouts for debounced gestures (such as move, scroll, wheel)

	private bindings: Bindings = {}; // an object holding the handlers associated to the gestures

	/**
	 * Function ran on component unmount: cleans timeouts.
	 */
	public clean = (): void => {
		this.resetBindings();
		_.forEach(_.values(this.timeouts), v => {
			v && clearTimeout(v);
		});
	};

	/**
	 * Function run every time the bind function is run (ie on every render).
	 * Resets the binding object
	 */
	public resetBindings = (): void => {
		this.bindings = {};
	};

	/**
	 * this.bindings is an object which keys match ReactEventHandlerKeys.
	 * Since a recognizer might want to bind a handler function to an event key already used by a previously
	 * added recognizer, we need to make sure that each event key is an array of all the functions mapped for
	 * that key.
	 */
	public addBindings = (eventNames: ReactEventHandlerKey | ReactEventHandlerKey[], fn: Fn): void => {
		const eventNamesArray = !_.isArray(eventNames) ? [eventNames] : eventNames;
		_.forEach(eventNamesArray, eventName => {
			if (this.bindings[eventName]) this.bindings[eventName]!.push(fn);
			else this.bindings[eventName] = [fn];
		});
	};

	/**
	 * getBindings will return an object that will be bound by users
	 * to the react component they want to interact with.
	 */
	public getBindings = (): ReactEventHandlers => {
		const bindings: ReactEventHandlers = {};

		_.forEach(_.entries(this.bindings), ([event, fns]) => {
			const fnsArray = Array.isArray(fns) ? fns : [fns];
			const key = event as ReactEventHandlerKey;
			bindings[key] = chainFns(...(fnsArray as Fn[]));
		});

		return bindings;
	};

	public getBind = () =>
		// If not, we return an object that contains gesture handlers mapped to react handler event keys.
		this.getBindings();
}
