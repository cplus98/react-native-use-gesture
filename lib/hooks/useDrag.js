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
exports.useDrag = void 0;
var useRecognizers_1 = __importDefault(require("./useRecognizers"));
var DragRecognizer_1 = __importDefault(require("../recognizers/DragRecognizer"));
var config_1 = require("../utils/config");
/**
 * @public
 *
 * Drag hook.
 *
 * @param {Handler<'drag'>} handler - the function fired every time the drag gesture updates
 * @param {(Config | {})} [config={}] - the config object including generic options and drag options
 * @returns {(...args: any[]) => HookReturnType<Config>}
 */
function useDrag(handler, config) {
    if (config === void 0) { config = {}; }
    var drag = __rest(config, []);
    /**
     * TODO: at the moment we recompute the config object at every render
     * this could probably be optimized
     */
    var mergedConfig = __assign(__assign({}, config_1.getInternalGenericOptions()), { drag: config_1.getInternalDragOptions(drag) });
    return useRecognizers_1.default({ drag: handler }, [DragRecognizer_1.default], mergedConfig);
}
exports.useDrag = useDrag;
