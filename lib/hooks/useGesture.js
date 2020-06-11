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
exports.useGesture = void 0;
var react_1 = __importDefault(require("react"));
var useRecognizers_1 = __importDefault(require("./useRecognizers"));
var DragRecognizer_1 = __importDefault(require("../recognizers/DragRecognizer"));
var PinchRecognizer_1 = __importDefault(require("../recognizers/PinchRecognizer"));
var config_1 = require("../utils/config");
/**
 * @public
 *
 * The most complete gesture hook, allowing support for multiple gestures.
 *
 * @param {UserHandlersPartial} handlers - an object with on[Gesture] keys containg gesture handlers
 * @param {UseGestureConfig} [config={}] - the full config object
 * @returns {(...args: any[]) => HookReturnType<Config>}
 */
function useGesture(handlers, config) {
    if (config === void 0) { config = {}; }
    /**
     * If handlers contains {onDragStart, onDrag, onDragEnd, onMoveStart, onMove}
     * actions will include 'onDrag' and 'onMove.
     */
    var actions = react_1.default.useState(function () { return new Set(Object.keys(handlers).map(function (k) { return k.replace(/End|Start/, ''); })); })[0];
    /**
     * Here we compute the derived internal config based on the provided config object.
     * We decompose the config into its generic and gesture options and compute each.
     * TODO: this is currently done on every render!
     */
    var drag = config.drag, pinch = config.pinch, restConfig = __rest(config, ["drag", "pinch"]);
    var mergedConfig = config_1.getInternalGenericOptions(restConfig);
    var classes = [];
    var internalHandlers = {};
    // will hold reference to native handlers such as onClick, onMouseDown, etc.
    var _nativeHandlers = __assign({}, handlers);
    if (actions.has('onDrag')) {
        classes.push(DragRecognizer_1.default);
        internalHandlers.drag = includeStartEndHandlers(handlers, 'onDrag', _nativeHandlers);
        mergedConfig.drag = config_1.getInternalDragOptions(drag);
    }
    if (actions.has('onPinch')) {
        classes.push(PinchRecognizer_1.default);
        internalHandlers.pinch = includeStartEndHandlers(handlers, 'onPinch', _nativeHandlers);
        mergedConfig.pinch = config_1.getInternalDistanceAngleOptions(pinch);
    }
    return useRecognizers_1.default(internalHandlers, classes, mergedConfig, _nativeHandlers);
}
exports.useGesture = useGesture;
/**
 * @private
 *
 * This utility function will integrate start and end handlers into the regular
 * handler function by using first and last conditions.
 *
 * @param {UserHandlersPartial} handlers - the handlers function object
 * @param {HandlerKey} handlerKey - the key for which to integrate start and end handlers
 * @returns
 */
function includeStartEndHandlers(handlers, handlerKey, _nativeHandlers) {
    var startKey = handlerKey + "Start";
    var endKey = handlerKey + "End";
    delete _nativeHandlers[handlerKey];
    delete _nativeHandlers[startKey];
    delete _nativeHandlers[endKey];
    var fn = function (state) {
        var memo;
        if (state.first && startKey in handlers)
            handlers[startKey](state);
        if (handlerKey in handlers)
            memo = handlers[handlerKey](state);
        if (state.last && endKey in handlers)
            handlers[endKey](state);
        return memo;
    };
    return fn;
}
