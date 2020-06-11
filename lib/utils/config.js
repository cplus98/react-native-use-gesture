"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternalDragOptions = exports.getInternalDistanceAngleOptions = exports.getInternalCoordinatesOptions = exports.getInternalGestureOptions = exports.getInternalGenericOptions = void 0;
var lodash_1 = __importDefault(require("lodash"));
var utils_1 = require("./utils");
var DEFAULT_DRAG_DELAY = 180;
var DEFAULT_RUBBERBAND = 0.15;
var DEFAULT_SWIPE_VELOCITY = 0.5;
var DEFAULT_SWIPE_DISTANCE = 60;
var defaultCoordinatesOptions = {
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
function getInternalGenericOptions(config) {
    if (config === void 0) { config = {}; }
    var _a = config.enabled, enabled = _a === void 0 ? true : _a, restConfig = __rest(config, ["enabled"]);
    return __assign(__assign({}, restConfig), { enabled: enabled });
}
exports.getInternalGenericOptions = getInternalGenericOptions;
function getInternalGestureOptions(gestureConfig) {
    var _a = gestureConfig.threshold, threshold = _a === void 0 ? undefined : _a, _b = gestureConfig.rubberband, rubberband = _b === void 0 ? 0 : _b;
    var _c = gestureConfig.enabled, enabled = _c === void 0 ? true : _c, _d = gestureConfig.initial, initial = _d === void 0 ? [0, 0] : _d;
    if (lodash_1.default.isBoolean(rubberband))
        rubberband = rubberband ? DEFAULT_RUBBERBAND : 0;
    if (lodash_1.default.isUndefined(threshold))
        threshold = 0;
    return {
        enabled: enabled,
        initial: initial,
        threshold: utils_1.def.array(threshold),
        rubberband: utils_1.def.array(rubberband),
    };
}
exports.getInternalGestureOptions = getInternalGestureOptions;
function getInternalCoordinatesOptions(coordinatesConfig) {
    if (coordinatesConfig === void 0) { coordinatesConfig = {}; }
    var axis = coordinatesConfig.axis, lockDirection = coordinatesConfig.lockDirection, _a = coordinatesConfig.bounds, bounds = _a === void 0 ? {} : _a, internalOptions = __rest(coordinatesConfig, ["axis", "lockDirection", "bounds"]);
    var boundsArray = [
        [utils_1.def.withDefault(bounds.left, -Infinity), utils_1.def.withDefault(bounds.right, Infinity)],
        [utils_1.def.withDefault(bounds.top, -Infinity), utils_1.def.withDefault(bounds.bottom, Infinity)],
    ];
    return __assign(__assign(__assign(__assign({}, getInternalGestureOptions(internalOptions)), defaultCoordinatesOptions), utils_1.matchKeysFromObject({ axis: axis, lockDirection: lockDirection }, coordinatesConfig)), { bounds: boundsArray });
}
exports.getInternalCoordinatesOptions = getInternalCoordinatesOptions;
function getInternalDistanceAngleOptions(distanceAngleConfig) {
    if (distanceAngleConfig === void 0) { distanceAngleConfig = {}; }
    var _a = distanceAngleConfig.distanceBounds, distanceBounds = _a === void 0 ? {} : _a, _b = distanceAngleConfig.angleBounds, angleBounds = _b === void 0 ? {} : _b, internalOptions = __rest(distanceAngleConfig, ["distanceBounds", "angleBounds"]);
    var boundsArray = [
        [utils_1.def.withDefault(distanceBounds.min, -Infinity), utils_1.def.withDefault(distanceBounds.max, Infinity)],
        [utils_1.def.withDefault(angleBounds.min, -Infinity), utils_1.def.withDefault(angleBounds.max, Infinity)],
    ];
    return __assign(__assign({}, getInternalGestureOptions(internalOptions)), { bounds: boundsArray });
}
exports.getInternalDistanceAngleOptions = getInternalDistanceAngleOptions;
function getInternalDragOptions(dragConfig) {
    if (dragConfig === void 0) { dragConfig = {}; }
    var enabled = dragConfig.enabled, bounds = dragConfig.bounds, rubberband = dragConfig.rubberband, initial = dragConfig.initial, dragOptions = __rest(dragConfig, ["enabled", "bounds", "rubberband", "initial"]);
    var threshold = dragConfig.threshold;
    var _a = dragOptions.swipeVelocity, swipeVelocity = _a === void 0 ? DEFAULT_SWIPE_VELOCITY : _a, _b = dragOptions.swipeDistance, swipeDistance = _b === void 0 ? DEFAULT_SWIPE_DISTANCE : _b, _c = dragOptions.delay, delay = _c === void 0 ? false : _c, axis = dragOptions.axis, lockDirection = dragOptions.lockDirection;
    var _d = dragOptions.filterTaps, filterTaps = _d === void 0 ? false : _d;
    if (lodash_1.default.isUndefined(threshold)) {
        threshold = Math.max(0, filterTaps ? 3 : 0, lockDirection || axis ? 1 : 0);
    }
    else {
        filterTaps = true;
    }
    var internalCoordinatesOptions = getInternalCoordinatesOptions(utils_1.matchKeysFromObject({ enabled: enabled, threshold: threshold, bounds: bounds, rubberband: rubberband, axis: axis, lockDirection: lockDirection, initial: initial }, dragConfig));
    var finalDelay;
    if (lodash_1.default.isNumber(delay))
        finalDelay = delay;
    else
        finalDelay = delay ? DEFAULT_DRAG_DELAY : 0;
    return __assign(__assign({}, internalCoordinatesOptions), { filterTaps: filterTaps || internalCoordinatesOptions.threshold[0] + internalCoordinatesOptions.threshold[1] > 0, swipeVelocity: utils_1.def.array(swipeVelocity), swipeDistance: utils_1.def.array(swipeDistance), delay: finalDelay });
}
exports.getInternalDragOptions = getInternalDragOptions;
