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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitialState = void 0;
var utils_1 = require("./utils");
function getInitialState() {
    // common initial state for all gestures
    var initialCommon = {
        _active: false,
        _blocked: false,
        _intentional: [false, false],
        _movement: [0, 0],
        _initial: [0, 0],
        _lastEventType: undefined,
        event: undefined,
        // currentTarget: undefined,
        // pointerId: undefined,
        values: [0, 0],
        velocities: [0, 0],
        delta: [0, 0],
        movement: [0, 0],
        offset: [0, 0],
        lastOffset: [0, 0],
        direction: [0, 0],
        initial: [0, 0],
        previous: [0, 0],
        first: false,
        last: false,
        active: false,
        timeStamp: 0,
        startTime: 0,
        elapsedTime: 0,
        cancel: utils_1.noop,
        canceled: false,
        memo: undefined,
        args: undefined,
    };
    // initial state for coordinates-based gestures
    var initialCoordinates = {
        axis: undefined,
        xy: [0, 0],
        vxvy: [0, 0],
        velocity: 0,
        distance: 0,
    };
    // initial state for distance and angle-based gestures (pinch)
    var initialDistanceAngle = {
        da: [0, 0],
        vdva: [0, 0],
        origin: undefined,
        turns: 0,
    };
    // initial state object (used by the gesture controller)
    return {
        shared: {
            dragging: false,
            pinching: false,
            touches: 0,
            down: false,
        },
        drag: __assign(__assign(__assign({}, initialCommon), initialCoordinates), { _isTap: true, _delayedEvent: false, tap: false, swipe: [0, 0] }),
        pinch: __assign(__assign({}, initialCommon), initialDistanceAngle),
    };
}
exports.getInitialState = getInitialState;
