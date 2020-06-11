"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTwoTouchesEventData = exports.getPointerEventValues = exports.getGenericEventData = void 0;
function getTouchEvents(event) {
    var _a = event.nativeEvent, touches = _a.touches, changedTouches = _a.changedTouches;
    return touches.length > 0 ? touches : changedTouches;
}
function getGenericEventData(event) {
    var touchEvents = getTouchEvents(event);
    var touches = (touchEvents && touchEvents.length) || 0;
    var down = touches > 0;
    return { touches: touches, down: down };
}
exports.getGenericEventData = getGenericEventData;
/**
 * Gets pointer event values.
 * @param event
 * @returns pointer event values
 */
function getPointerEventValues(event) {
    var touchEvents = getTouchEvents(event);
    return { values: [touchEvents[0].pageX, touchEvents[0].pageY] };
}
exports.getPointerEventValues = getPointerEventValues;
/**
 * Gets two touches event data
 * @param event
 * @returns two touches event data
 */
function getTwoTouchesEventData(event) {
    var touches = event.nativeEvent.touches;
    var dx = touches[1].pageX - touches[0].pageX;
    var dy = touches[1].pageY - touches[0].pageY;
    var values = [Math.hypot(dx, dy), -(Math.atan2(dx, dy) * 180) / Math.PI];
    var origin = [(touches[1].pageX + touches[0].pageX) * 0.5, (touches[1].pageY + touches[0].pageY) * 0.5];
    return { values: values, origin: origin };
}
exports.getTwoTouchesEventData = getTwoTouchesEventData;
