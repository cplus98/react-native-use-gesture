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
var DistanceAngleRecognizer_1 = __importDefault(require("./DistanceAngleRecognizer"));
var utils_1 = require("../utils/utils");
var event_1 = require("../utils/event");
var PinchRecognizer = /** @class */ (function (_super) {
    __extends(PinchRecognizer, _super);
    function PinchRecognizer(controller, args) {
        var _this = _super.call(this, 'pinch', controller, args) || this;
        _this.ingKey = 'pinching';
        _this.pinchShouldStart = function (event) {
            var touches = event_1.getGenericEventData(event).touches;
            return _this.enabled && touches === 2 && _this.state._active === false;
        };
        _this.onPinchStart = function (event) {
            if (!_this.pinchShouldStart(event))
                return;
            var _a = event_1.getTwoTouchesEventData(event), values = _a.values, origin = _a.origin;
            _this.updateSharedState(event_1.getGenericEventData(event));
            var startState = __assign(__assign({}, _this.getStartGestureState(values, event)), _this.getGenericPayload(event, true));
            _this.updateGestureState(__assign(__assign(__assign({}, startState), _this.getMovement(values, startState)), { origin: origin, cancel: function () { return _this.onCancel(); } }));
            _this.fireGestureHandler();
        };
        _this.onPinchChange = function (event) {
            var _a = _this.state, canceled = _a.canceled, timeStamp = _a.timeStamp, _active = _a._active;
            if (canceled || !_active)
                return;
            var genericEventData = event_1.getGenericEventData(event);
            if (genericEventData.touches !== 2 || event.nativeEvent.timestamp === timeStamp)
                return;
            _this.updateSharedState(genericEventData);
            var _b = event_1.getTwoTouchesEventData(event), values = _b.values, origin = _b.origin;
            var kinematics = _this.getKinematics(values, event);
            _this.updateGestureState(__assign(__assign(__assign({}, _this.getGenericPayload(event)), kinematics), { origin: origin, cancel: function () { return _this.onCancel(); } }));
            _this.fireGestureHandler();
        };
        _this.onPinchEnd = function (event) {
            if (!_this.state.active)
                return;
            _this.state._active = false;
            _this.updateSharedState({ down: false, touches: 0 });
            _this.updateGestureState(__assign(__assign({}, _this.getGenericPayload(event)), _this.getMovement(_this.state.values)));
            _this.fireGestureHandler();
        };
        _this.onCancel = function () {
            _this.state._active = false;
            _this.updateGestureState({ canceled: true, cancel: utils_1.noop });
            _this.updateSharedState({ down: false, touches: 0 });
            requestAnimationFrame(function () { return _this.fireGestureHandler(); });
        };
        _this.updateTouchData = function (event) {
            if (!_this.enabled || event.nativeEvent.touches.length !== 2 || !_this.state._active)
                return;
            var origin = event_1.getTwoTouchesEventData(event).origin;
            _this.state.origin = origin;
        };
        return _this;
    }
    PinchRecognizer.prototype.addBindings = function () {
        this.controller.addBindings('onTouchStart', this.onPinchStart);
        this.controller.addBindings('onTouchMove', this.onPinchChange);
        this.controller.addBindings(['onTouchEnd', 'onTouchCancel'], this.onPinchEnd);
    };
    return PinchRecognizer;
}(DistanceAngleRecognizer_1.default));
exports.default = PinchRecognizer;
