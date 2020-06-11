import { Vector2, UseGestureEvent } from '../types';

function getTouchEvents(event: UseGestureEvent) {
	const { touches, changedTouches } = event.nativeEvent;
	return touches.length > 0 ? touches : changedTouches;
}

export function getGenericEventData(event: UseGestureEvent) {
	const touchEvents = getTouchEvents(event);
	const touches = (touchEvents && touchEvents.length) || 0;
	const down = touches > 0;
	return { touches, down };
}

type Values = { values: Vector2 };

/**
 * Gets pointer event values.
 * @param event
 * @returns pointer event values
 */
export function getPointerEventValues(event: UseGestureEvent): Values {
	const touchEvents = getTouchEvents(event);
	return { values: [touchEvents[0].pageX, touchEvents[0].pageY] };
}

/**
 * Gets two touches event data
 * @param event
 * @returns two touches event data
 */
export function getTwoTouchesEventData(event: UseGestureEvent) {
	const { touches } = event.nativeEvent;
	const dx = touches[1].pageX - touches[0].pageX;
	const dy = touches[1].pageY - touches[0].pageY;

	const values: Vector2 = [Math.hypot(dx, dy), -(Math.atan2(dx, dy) * 180) / Math.PI];
	const origin: Vector2 = [(touches[1].pageX + touches[0].pageX) * 0.5, (touches[1].pageY + touches[0].pageY) * 0.5];

	return { values, origin };
}
