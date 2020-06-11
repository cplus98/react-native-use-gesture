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
 * Abstract class for distance/angle-based gesture recongizers
 * @abstract
 * @class DistanceAngleRecognizer
 * @extends {Recognizer<T>}
 * @template T
 */
var DistanceAngleRecognizer = /** @class */ (function (_super) {
    __extends(DistanceAngleRecognizer, _super);
    function DistanceAngleRecognizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Returns the real movement (without taking intentionality into acount)
     */
    DistanceAngleRecognizer.prototype.getInternalMovement = function (_a, state) {
        var d = _a[0], a = _a[1];
        var da = state.values, turns = state.turns, initial = state.initial;
        // angle might not be defined when ctrl wheel is used for zoom only
        // in that case we set it to the previous angle value
        a = a !== undefined ? a : da[1];
        var delta_a = a - da[1];
        /**
         * The angle value might jump from 179deg to -179deg when we actually want to
         * read 181deg to ensure continuity. To make that happen, we detect when the jump
         * is supsiciously high (ie > 270deg) and increase the `turns` value
         */
        var newTurns = Math.abs(delta_a) > 270 ? turns + Math.sign(delta_a) : turns;
        // we update the angle difference to its corrected value
        var movement_d = d - initial[0];
        var movement_a = a - 360 * newTurns - initial[1];
        return [movement_d, movement_a];
    };
    DistanceAngleRecognizer.prototype.getKinematics = function (values, event) {
        var _a = this.state, timeStamp = _a.timeStamp, initial = _a.initial;
        var movementDetection = this.getMovement(values, this.state);
        var delta = movementDetection.delta, movement = movementDetection.movement;
        var turns = (values[1] - movement[1] - initial[1]) / 360;
        var delta_t = event.nativeEvent.timestamp - timeStamp;
        var kinematics = math_1.calculateAllKinematics(movement, delta, delta_t);
        return __assign(__assign({ values: values,
            delta: delta,
            turns: turns }, movementDetection), kinematics);
    };
    DistanceAngleRecognizer.prototype.mapStateValues = function (state) {
        return { da: state.values, vdva: state.velocities };
    };
    return DistanceAngleRecognizer;
}(Recognizer_1.default));
exports.default = DistanceAngleRecognizer;
