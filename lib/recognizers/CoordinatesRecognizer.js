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
var Recognizer_1 = __importDefault(require("./Recognizer"));
var math_1 = require("../utils/math");
/**
 * @private
 * Abstract class for coordinates-based gesture recongizers
 * @abstract
 * @class CoordinatesRecognizer
 * @extends {Recognizer<T>}
 * @template T
 */
var CoordinatesRecognizer = /** @class */ (function (_super) {
    __extends(CoordinatesRecognizer, _super);
    function CoordinatesRecognizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Returns the real movement (without taking intentionality into acount)
     */
    CoordinatesRecognizer.prototype.getInternalMovement = function (values, state) {
        return math_1.subV(values, state.initial);
    };
    /**
     * In coordinates-based gesture, this function will detect the first intentional axis,
     * lock the gesture axis if lockDirection is specified in the config, block the gesture
     * if the first intentional axis doesn't match the specified axis in config.
     *
     * @param {[FalseOrNumber, FalseOrNumber]} _intentional
     * @param {Vector2} _movement
     * @param {PartialGestureState<T>} state
     */
    CoordinatesRecognizer.prototype.checkIntentionality = function (_intentional, _movement, state) {
        var _ix = _intentional[0], _iy = _intentional[1];
        var intentionalMovement = _ix !== false || _iy !== false;
        var axis = state.axis;
        var _blocked = false;
        // If the movement is intentional, we can compute axis.
        if (intentionalMovement) {
            var _a = _movement.map(Math.abs), absX = _a[0], absY = _a[1];
            var _b = this.config, configAxis = _b.axis, lockDirection = _b.lockDirection;
            // We make sure we only set axis value if it hadn't been detected before.
            if (!axis) {
                if (absX > absY)
                    axis = 'x';
                else
                    axis = absX < absY ? 'y' : undefined;
            }
            if (!!configAxis || lockDirection) {
                if (axis) {
                    // If the detected axis doesn't match the config axis we block the gesture
                    if (!!configAxis && axis !== configAxis)
                        _blocked = true;
                    else {
                        // Otherwise we prevent the gesture from updating the unwanted axis.
                        var lockedIndex = axis === 'x' ? 1 : 0;
                        _intentional[lockedIndex] = false;
                    }
                }
                else {
                    // Until we've detected the axis, we prevent the hnadler from updating.
                    _intentional = [false, false];
                }
            }
        }
        return { _intentional: _intentional, _blocked: _blocked, axis: axis };
    };
    CoordinatesRecognizer.prototype.getKinematics = function (values, event) {
        var timeStamp = this.state.timeStamp;
        var movementDetection = this.getMovement(values, this.state);
        var _blocked = movementDetection._blocked, delta = movementDetection.delta, movement = movementDetection.movement;
        if (_blocked)
            return movementDetection;
        var delta_t = event.nativeEvent.timestamp - timeStamp;
        var kinematics = math_1.calculateAllKinematics(movement, delta, delta_t);
        return __assign(__assign({ values: values,
            delta: delta }, movementDetection), kinematics);
    };
    CoordinatesRecognizer.prototype.mapStateValues = function (state) {
        return { xy: state.values, vxvy: state.velocities };
    };
    return CoordinatesRecognizer;
}(Recognizer_1.default));
exports.default = CoordinatesRecognizer;
