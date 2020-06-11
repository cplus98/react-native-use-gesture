import _ from 'lodash';
import { def, matchKeysFromObject } from './utils';
import {
	Vector2,
	GenericOptions,
	InternalGenericOptions,
	DragConfig,
	Tuple,
	GestureOptions,
	InternalDragOptions,
	InternalGestureOptions,
	CoordinatesConfig,
	CoordinatesOptions,
	InternalCoordinatesOptions,
	DistanceAngleConfig,
	InternalDistanceAngleOptions,
} from '../types';

const DEFAULT_DRAG_DELAY = 180;
const DEFAULT_RUBBERBAND = 0.15;
const DEFAULT_SWIPE_VELOCITY = 0.5;
const DEFAULT_SWIPE_DISTANCE = 60;

const defaultCoordinatesOptions: CoordinatesOptions = {
	lockDirection: false,
	axis: undefined,
	bounds: undefined,
};

/**
 * @private
 *
 * Returns the internal generic option object.
 *
 * @param {Partial<GenericOptions>} [config={}]
 * @returns {InternalGenericOptions}
 */
export function getInternalGenericOptions(config: Partial<GenericOptions> = {}): InternalGenericOptions {
	const { enabled = true, ...restConfig } = config;

	return {
		...restConfig,
		enabled,
	};
}

export function getInternalGestureOptions(gestureConfig: Partial<GestureOptions>): InternalGestureOptions {
	let { threshold = undefined, rubberband = 0 } = gestureConfig;
	const { enabled = true, initial = [0, 0] } = gestureConfig;

	if (_.isBoolean(rubberband)) rubberband = rubberband ? DEFAULT_RUBBERBAND : 0;
	if (_.isUndefined(threshold)) threshold = 0;

	return {
		enabled,
		initial,
		threshold: def.array(threshold) as Vector2,
		rubberband: def.array(rubberband) as Vector2,
	};
}

export function getInternalCoordinatesOptions(coordinatesConfig: CoordinatesConfig = {}): InternalCoordinatesOptions {
	const { axis, lockDirection, bounds = {}, ...internalOptions } = coordinatesConfig;

	const boundsArray = [
		[def.withDefault(bounds.left, -Infinity), def.withDefault(bounds.right, Infinity)],
		[def.withDefault(bounds.top, -Infinity), def.withDefault(bounds.bottom, Infinity)],
	];

	return {
		...getInternalGestureOptions(internalOptions),
		...defaultCoordinatesOptions,
		...matchKeysFromObject({ axis, lockDirection }, coordinatesConfig),
		bounds: boundsArray as Tuple<Vector2>,
	};
}

export function getInternalDistanceAngleOptions(distanceAngleConfig: DistanceAngleConfig = {}): InternalDistanceAngleOptions {
	const { distanceBounds = {}, angleBounds = {}, ...internalOptions } = distanceAngleConfig;

	const boundsArray = [
		[def.withDefault(distanceBounds.min, -Infinity), def.withDefault(distanceBounds.max, Infinity)],
		[def.withDefault(angleBounds.min, -Infinity), def.withDefault(angleBounds.max, Infinity)],
	];

	return {
		...getInternalGestureOptions(internalOptions),
		bounds: boundsArray as Tuple<Vector2>,
	};
}

export function getInternalDragOptions(dragConfig: DragConfig = {}): InternalDragOptions {
	const { enabled, bounds, rubberband, initial, ...dragOptions } = dragConfig;
	let { threshold } = dragConfig;
	const { swipeVelocity = DEFAULT_SWIPE_VELOCITY, swipeDistance = DEFAULT_SWIPE_DISTANCE, delay = false, axis, lockDirection } = dragOptions;
	let { filterTaps = false } = dragOptions;

	if (_.isUndefined(threshold)) {
		threshold = Math.max(0, filterTaps ? 3 : 0, lockDirection || axis ? 1 : 0);
	} else {
		filterTaps = true;
	}

	const internalCoordinatesOptions = getInternalCoordinatesOptions(matchKeysFromObject({ enabled, threshold, bounds, rubberband, axis, lockDirection, initial }, dragConfig));

	let finalDelay;
	if (_.isNumber(delay)) finalDelay = delay;
	else finalDelay = delay ? DEFAULT_DRAG_DELAY : 0;

	return {
		...internalCoordinatesOptions,
		filterTaps: filterTaps || internalCoordinatesOptions.threshold[0] + internalCoordinatesOptions.threshold[1] > 0,
		swipeVelocity: def.array(swipeVelocity) as Vector2,
		swipeDistance: def.array(swipeDistance) as Vector2,
		delay: finalDelay,
	};
}
