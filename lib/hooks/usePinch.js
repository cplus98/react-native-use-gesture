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
exports.usePinch = void 0;
var useRecognizers_1 = __importDefault(require("./useRecognizers"));
var PinchRecognizer_1 = __importDefault(require("../recognizers/PinchRecognizer"));
var config_1 = require("../utils/config");
/**
 * @public
 *
 * Pinch hook.
 *
 * @param {Handler<'pinch'>} handler - the function fired every time the pinch gesture updates
 * @param {(Config | {})} [config={}] - the config object including generic options and pinch options
 * @returns {(...args: any[]) => HookReturnType<Config>}
 */
function usePinch(handler, config) {
    if (config === void 0) { config = {}; }
    var pinch = __rest(config, []);
    /**
     * TODO: at the moment we recompute the config object at every render
     * this could probably be optimized
     */
    var mergedConfig = __assign(__assign({}, config_1.getInternalGenericOptions()), { pinch: config_1.getInternalDistanceAngleOptions(pinch) });
    return useRecognizers_1.default({ pinch: handler }, [PinchRecognizer_1.default], mergedConfig);
}
exports.usePinch = usePinch;
