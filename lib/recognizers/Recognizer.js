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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("../utils/state");
var math_1 = require("../utils/math");
var utils_1 = require("../utils/utils");
/**
 * @private
 * Recognizer abstract class.
 *
 * @protected
 * @abstract
 * @type {StateKey<T>} whether the Recognizer should deal with coordinates or distance / angle
 */
var Recognizer = /** @class */ (function () {
    /**
     * Creates an instance of a gesture recognizer.
     * @param stateKey drag, move, pinch, etc.
     * @param controller the controller attached to the gesture
     * @param [args] the args that should be passed to the gesture handler
     */
    function Recognizer(stateKey, controller, args) {
        var _this = this;
        if (args === void 0) { args = []; }
        this.stateKey = stateKey;
        this.controller = controller;
        this.args = args;
        this.debounced = true;
        // Convenience method to set a timeout for a given gesture
        this.setTimeout = function (callback, ms) {
            if (ms === void 0) { ms = 140; }
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            _this.controller.timeouts[_this.stateKey] = setTimeout.apply(void 0, __spreadArrays([callback, ms], args));
        };
        // Convenience method to clear a timeout for a given gesture
        this.clearTimeout = function () {
            var v = _this.controller.timeouts[_this.stateKey];
            v && clearTimeout(v);
        };
        /**
         * Returns the reinitialized start state for the gesture.
         * Should be common to all gestures.
         *
         * @param {Vector2} values
         * @param {UseGestureEvent} event
         * @returns - the start state for the gesture
         */
        this.getStartGestureState = function (values, event) { return (__assign(__assign({}, state_1.getInitialState()[_this.stateKey]), { _active: true, values: values, initial: values, offset: _this.state.offset, lastOffset: _this.state.offset, startTime: event.nativeEvent.timestamp })); };
        // Runs rubberband on a vector
        this.rubberband = function (vector, rubberband) {
            var bounds = _this.config.bounds;
            /**
             * [x, y]: [rubberband(x, min, max), rubberband(y, min, max)]
             */
            return vector.map(function (v, i) { return math_1.rubberbandIfOutOfBounds(v, bounds[i][0], bounds[i][1], rubberband[i]); });
        };
        /**
         * Fires the gesture handler
         *
         * @param {boolean} [forceFlag] - if true, then the handler will fire even if the gesture is not intentional
         */
        this.fireGestureHandler = function (forceFlag) {
            /**
             * If the gesture has been blocked (this can happen when the gesture has started in an unwanted direction),
             * clean everything and don't do anything.
             */
            if (_this.state._blocked) {
                // we need debounced gestures to end by themselves
                if (!_this.debounced) {
                    _this.state._active = false;
                    _this.clean();
                }
                return null;
            }
            // If the gesture has no intentional dimension, don't do fire the handler.
            var _a = _this.state._intentional, intentionalX = _a[0], intentionalY = _a[1];
            if (!forceFlag && intentionalX === false && intentionalY === false)
                return null;
            var _b = _this.state, _active = _b._active, active = _b.active;
            _this.state.active = _active;
            _this.state.first = _active && !active; // `first` is true when the gesture becomes active
            _this.state.last = active && !_active; // `last` is true when the gesture becomes inactive
            _this.controller.state.shared[_this.ingKey] = _active; // Sets dragging, pinching, etc. to the gesture active state
            var state = __assign(__assign(__assign({}, _this.controller.state.shared), _this.state), _this.mapStateValues(_this.state));
            // @ts-ignore
            var newMemo = _this.handler(state);
            // Sets memo to the returned value of the handler (unless it's not undefined)
            _this.state.memo = newMemo !== undefined ? newMemo : _this.state.memo;
            // Cleans the gesture when the gesture is no longer active.
            if (!_active)
                _this.clean();
            return state;
        };
    } // eslint-disable-line
    Object.defineProperty(Recognizer.prototype, "config", {
        // Returns the gesture config
        get: function () {
            return this.controller.config[this.stateKey];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Recognizer.prototype, "enabled", {
        // Is the gesture enabled
        get: function () {
            return this.controller.config.enabled && this.config.enabled;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Recognizer.prototype, "state", {
        // Returns the controller state for a given gesture
        get: function () {
            return this.controller.state[this.stateKey];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Recognizer.prototype, "handler", {
        // Returns the gesture handler
        get: function () {
            return this.controller.handlers[this.stateKey];
        },
        enumerable: false,
        configurable: true
    });
    // Conveninence method to update the shared state
    Recognizer.prototype.updateSharedState = function (sharedState) {
        Object.assign(this.controller.state.shared, sharedState);
    };
    // Conveninence method to update the gesture state
    Recognizer.prototype.updateGestureState = function (gestureState) {
        Object.assign(this.state, gestureState);
    };
    /**
     * Returns a generic, common payload for all gestures from an event.
     *
     * @param {UseGestureEvent} event
     * @param {boolean} [isStartEvent]
     * @returns - the generic gesture payload
     */
    Recognizer.prototype.getGenericPayload = function (event, isStartEvent) {
        var type = event.type;
        var timeStamp = event.nativeEvent.timestamp;
        var _a = this.state, values = _a.values, startTime = _a.startTime;
        return {
            _lastEventType: type,
            event: event,
            timeStamp: timeStamp,
            elapsedTime: isStartEvent ? 0 : timeStamp - startTime,
            args: this.args,
            previous: values,
        };
    };
    /**
     * Returns state properties depending on the movement and state.
     *
     * Should be overriden for custom behavior, doesn't do anything in the implementation
     * below.
     */
    Recognizer.prototype.checkIntentionality = function (_intentional, _movement, _state) {
        return { _intentional: _intentional, _blocked: false };
    };
    /**
     * Returns basic movement properties for the gesture based on the next values and current state.
     */
    Recognizer.prototype.getMovement = function (values, state) {
        if (state === void 0) { state = this.state; }
        var _a = this.config, initial = _a.initial, threshold = _a.threshold, rubberband = _a.rubberband;
        var t0 = threshold[0], t1 = threshold[1];
        var _initial = state._initial, _active = state._active, intentional = state._intentional, lastOffset = state.lastOffset, prevMovement = state.movement;
        var i0 = intentional[0], i1 = intentional[1];
        var _b = this.getInternalMovement(values, state), _m0 = _b[0], _m1 = _b[1];
        /**
         * For both dimensions of the gesture, check its intentionality on each frame.
         */
        if (i0 === false) {
            i0 = math_1.getIntentionalDisplacement(_m0, t0);
        }
        if (i1 === false) {
            i1 = math_1.getIntentionalDisplacement(_m1, t1);
        }
        // Get gesture specific state properties based on intentionality and movement.
        var intentionalityCheck = this.checkIntentionality([i0, i1], [_m0, _m1], state);
        var _intentional = intentionalityCheck._intentional, _blocked = intentionalityCheck._blocked;
        var _c = _intentional, _i0 = _c[0], _i1 = _c[1];
        var _movement = [_m0, _m1];
        if (_i0 !== false && intentional[0] === false)
            _initial[0] = utils_1.valueFn(initial)[0];
        if (_i1 !== false && intentional[1] === false)
            _initial[1] = utils_1.valueFn(initial)[1];
        /**
         * If the gesture has been blocked (from gesture specific checkIntentionality),
         * stop right there.
         */
        if (_blocked)
            return __assign(__assign({}, intentionalityCheck), { _movement: _movement, delta: [0, 0] });
        /**
         * The movement sent to the handler has 0 in its dimensions when intentionality is false.
         * It is calculated from the actual movement minus the threshold.
         */
        var movement = [_i0 !== false ? _m0 - _i0 : utils_1.valueFn(initial)[0], _i1 !== false ? _m1 - _i1 : utils_1.valueFn(initial)[1]];
        var offset = math_1.addV(movement, lastOffset);
        /**
         * Rubberband should be 0 when the gesture is no longer active, so that movement
         * and offset can return within their bounds.
         */
        var _rubberband = _active ? rubberband : [0, 0];
        movement = this.rubberband(math_1.addV(movement, _initial), _rubberband); // rubberbanded movement
        return __assign(__assign({}, intentionalityCheck), { _initial: _initial,
            _movement: _movement,
            movement: movement, offset: this.rubberband(offset, _rubberband), delta: math_1.subV(movement, prevMovement) });
    };
    // Cleans the gesture. Can be overriden by gestures.
    Recognizer.prototype.clean = function () {
        this.clearTimeout();
    };
    return Recognizer;
}());
exports.default = Recognizer;
