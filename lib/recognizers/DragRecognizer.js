"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var CoordinatesRecognizer_1 = __importDefault(require("./CoordinatesRecognizer"));
var utils_1 = require("../utils/utils");
var event_1 = require("../utils/event");
var math_1 = require("../utils/math");
var TAP_DISTANCE_THRESHOLD = 3;
var SWIPE_MAX_ELAPSED_TIME = 220;
var FILTER_REPEATED_EVENTS_DELAY = 200;
var DragRecognizer = /** @class */ (function (_super) {
    __extends(DragRecognizer, _super);
    function DragRecognizer(controller, args) {
        var _this = _super.call(this, 'drag', controller, args) || this;
        _this.ingKey = 'dragging';
        _this.wasTouch = false;
        _this.isEventTypeTouch = function (type) { return !!type && type.indexOf('touch') === 0; };
        _this.dragShouldStart = function (event) {
            var touches = event_1.getGenericEventData(event).touches;
            var _lastEventType = _this.state._lastEventType;
            /**
             * This tries to filter out mouse events triggered by touch screens
             * */
            // If the previous gesture was touch-based, and the current one is mouse based,
            // this means that we might be dealing with mouse simulated events if they're close to
            // each other. We're only doing this check when we're not using pointer events.
            if (_this.isEventTypeTouch(_lastEventType) && !_this.isEventTypeTouch(event.type)) {
                var delay = Math.abs(event.nativeEvent.timestamp - _this.state.startTime);
                if (delay < FILTER_REPEATED_EVENTS_DELAY)
                    return false;
            }
            return _this.enabled && touches < 2;
        };
        _this.onDragStart = function (event) {
            if (!_this.dragShouldStart(event))
                return;
            if (_this.config.delay > 0) {
                _this.state._delayedEvent = true;
                if (lodash_1.default.isFunction(event.persist))
                    event.persist();
                _this.setTimeout(function () { return _this.startDrag(event); }, _this.config.delay);
            }
            else {
                _this.startDrag(event);
            }
        };
        _this.onDragChange = function (event) {
            var canceled = _this.state.canceled;
            if (canceled)
                return;
            if (!_this.state._active) {
                if (_this.state._delayedEvent) {
                    _this.clearTimeout();
                    _this.startDrag(event);
                }
                return;
            }
            var genericEventData = event_1.getGenericEventData(event);
            if (!genericEventData.down) {
                _this.onDragEnd(event);
                return;
            }
            _this.updateSharedState(genericEventData);
            var values = event_1.getPointerEventValues(event).values;
            var kinematics = _this.getKinematics(values, event);
            var _isTap = _this.state._isTap;
            if (_isTap && math_1.calculateDistance(kinematics._movement) >= TAP_DISTANCE_THRESHOLD)
                _isTap = false;
            _this.updateGestureState(__assign(__assign(__assign({}, _this.getGenericPayload(event)), kinematics), { _isTap: _isTap, cancel: function () { return _this.onCancel(); } }));
            _this.fireGestureHandler();
        };
        _this.onDragEnd = function (event) {
            _this.state._active = false;
            _this.updateSharedState({ down: false, touches: 0 });
            var _a = _this.state, _isTap = _a._isTap, values = _a.values, _b = _a.velocities, vx = _b[0], vy = _b[1], _c = _a.movement, mx = _c[0], my = _c[1], _d = _a._intentional, ix = _d[0], iy = _d[1];
            var endState = __assign(__assign({}, _this.getGenericPayload(event)), _this.getMovement(values));
            var elapsedTime = endState.elapsedTime;
            var _e = _this.config, _f = _e.swipeVelocity, svx = _f[0], svy = _f[1], _g = _e.swipeDistance, sx = _g[0], sy = _g[1];
            var swipe = [0, 0];
            if (elapsedTime < SWIPE_MAX_ELAPSED_TIME) {
                if (ix !== false && Math.abs(vx) > svx && Math.abs(mx) > sx)
                    swipe[0] = Math.sign(vx);
                if (iy !== false && Math.abs(vy) > svy && Math.abs(my) > sy)
                    swipe[1] = Math.sign(vy);
            }
            _this.updateGestureState(__assign(__assign({}, endState), { tap: _isTap, swipe: swipe }));
            _this.fireGestureHandler(_this.config.filterTaps && _this.state._isTap);
        };
        _this.clean = function () {
            _super.prototype.clean.call(_this);
            _this.state._delayedEvent = false;
        };
        _this.onCancel = function () {
            _this.updateGestureState({ canceled: true, cancel: utils_1.noop });
            _this.state._active = false;
            _this.updateSharedState({ down: false, touches: 0 });
            requestAnimationFrame(function () { return _this.fireGestureHandler(); });
        };
        return _this;
    }
    DragRecognizer.prototype.startDrag = function (event) {
        var _this = this;
        var values = event_1.getPointerEventValues(event).values;
        this.updateSharedState(event_1.getGenericEventData(event));
        var startState = __assign(__assign({}, this.getStartGestureState(values, event)), this.getGenericPayload(event, true));
        this.updateGestureState(__assign(__assign(__assign({}, startState), this.getMovement(values, startState)), { cancel: function () { return _this.onCancel(); } }));
        this.fireGestureHandler();
    };
    DragRecognizer.prototype.addBindings = function () {
        this.controller.addBindings(['onTouchStart'], this.onDragStart);
        this.controller.addBindings(['onTouchMove'], this.onDragChange);
        this.controller.addBindings(['onTouchEnd', 'onTouchCancel'], this.onDragEnd);
    };
    return DragRecognizer;
}(CoordinatesRecognizer_1.default));
exports.default = DragRecognizer;
