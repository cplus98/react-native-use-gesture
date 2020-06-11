"use strict";
/* eslint-disable react-hooks/exhaustive-deps */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var react_1 = __importDefault(require("react"));
var Controller_1 = __importDefault(require("../Controller"));
/**
 * @private
 *
 * Utility hook called by all gesture hooks and that will be responsible for the internals.
 *
 * @param {Partial<InternalHandlers>} handlers
 * @param {RecognizerClasses} classes
 * @param {InternalConfig} config
 * @param {NativeHandlersPartial} nativeHandlers - native handlers such as onClick, onMouseDown, etc.
 * @returns {(...args: any[]) => HookReturnType<Config>}
 */
function useRecognizers(handlers, classes, config, nativeHandlers) {
    // The gesture controller keeping track of all gesture states
    var controller = react_1.default.useMemo(function () {
        var current = new Controller_1.default();
        /**
         * The bind function will create gesture recognizers and return the right
         */
        var bind = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            current.resetBindings();
            lodash_1.default.forEach(classes, function (RecognizerClass) {
                new RecognizerClass(current, args).addBindings();
            });
            // we also add event bindings for native handlers
            if (controller.nativeRefs) {
                lodash_1.default.forIn(controller.nativeRefs, function (eventName) {
                    current.addBindings(eventName, 
                    // @ts-ignore we're cheating when it comes to event type :(
                    controller.nativeRefs[eventName]);
                });
            }
            return current.getBind();
        };
        return { nativeRefs: nativeHandlers, current: current, bind: bind };
    }, []);
    // We reassign the config and handlers to the controller on every render.
    controller.current.config = config;
    controller.current.handlers = handlers;
    // We assign nativeHandlers, otherwise they won't be refreshed on the next render.
    controller.nativeRefs = nativeHandlers;
    // Run controller clean functions on unmount.
    react_1.default.useEffect(function () { return controller.current.clean; }, []);
    return controller.bind;
}
exports.default = useRecognizers;
