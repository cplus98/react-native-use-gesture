"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var state_1 = require("./utils/state");
var utils_1 = require("./utils/utils");
/**
 * The controller will keep track of the state for all gestures and also keep
 * track of timeouts, and window listeners.
 *
 * @template BinderType the type the bind function should return
 */
var Controller = /** @class */ (function () {
    function Controller() {
        var _this = this;
        this.state = state_1.getInitialState(); // state for all gestures
        this.timeouts = {}; // keeping track of timeouts for debounced gestures (such as move, scroll, wheel)
        this.bindings = {}; // an object holding the handlers associated to the gestures
        /**
         * Function ran on component unmount: cleans timeouts.
         */
        this.clean = function () {
            _this.resetBindings();
            lodash_1.default.forEach(lodash_1.default.values(_this.timeouts), function (v) {
                v && clearTimeout(v);
            });
        };
        /**
         * Function run every time the bind function is run (ie on every render).
         * Resets the binding object
         */
        this.resetBindings = function () {
            _this.bindings = {};
        };
        /**
         * this.bindings is an object which keys match ReactEventHandlerKeys.
         * Since a recognizer might want to bind a handler function to an event key already used by a previously
         * added recognizer, we need to make sure that each event key is an array of all the functions mapped for
         * that key.
         */
        this.addBindings = function (eventNames, fn) {
            var eventNamesArray = !lodash_1.default.isArray(eventNames) ? [eventNames] : eventNames;
            lodash_1.default.forEach(eventNamesArray, function (eventName) {
                if (_this.bindings[eventName])
                    _this.bindings[eventName].push(fn);
                else
                    _this.bindings[eventName] = [fn];
            });
        };
        /**
         * getBindings will return an object that will be bound by users
         * to the react component they want to interact with.
         */
        this.getBindings = function () {
            var bindings = {};
            lodash_1.default.forEach(lodash_1.default.entries(_this.bindings), function (_a) {
                var event = _a[0], fns = _a[1];
                var fnsArray = Array.isArray(fns) ? fns : [fns];
                var key = event;
                bindings[key] = utils_1.chainFns.apply(void 0, fnsArray);
            });
            return bindings;
        };
        this.getBind = function () {
            // If not, we return an object that contains gesture handlers mapped to react handler event keys.
            return _this.getBindings();
        };
    }
    return Controller;
}());
exports.default = Controller;
