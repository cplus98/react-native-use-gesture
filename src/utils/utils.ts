import _ from 'lodash';
import { Fn, Vector2 } from '../types';

// blank function
export function noop() {}
// returns a function that chains all functions given as parameters
export const chainFns = (...fns: Fn[]): Fn => {
	const a = 0;
	return (...args: any[]) => {
		const b = 0;
		return fns.forEach(fn => fn(...args));
	};
};

export const def = {
	array: <T>(value: T | T[]): T[] => (Array.isArray(value) ? value : [value, value]),
	withDefault: <T>(value: T | undefined, defaultIfUndefined: T): T => (!_.isUndefined(value) ? value : defaultIfUndefined),
};

export function matchKeysFromObject<T extends object, K extends object>(obj: T, matchingObject: K): Partial<T> {
	const o: Partial<T> = {};

	_.forEach(_.entries(obj), ([key, value]) => {
		(value !== undefined || key in matchingObject) && (o[key as keyof T] = value);
	});
	return o;
}

export function valueFn(v: Vector2 | (() => Vector2)) {
	return _.isFunction(v) ? v() : v;
}
