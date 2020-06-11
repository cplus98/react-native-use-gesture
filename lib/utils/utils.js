"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueFn = exports.matchKeysFromObject = exports.def = exports.chainFns = exports.noop = void 0;
var lodash_1 = __importDefault(require("lodash"));
// blank function
function noop() { }
exports.noop = noop;
// returns a function that chains all functions given as parameters
exports.chainFns = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    var a = 0;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var b = 0;
        return fns.forEach(function (fn) { return fn.apply(void 0, args); });
    };
};
exports.def = {
    array: function (value) { return (Array.isArray(value) ? value : [value, value]); },
    withDefault: function (value, defaultIfUndefined) { return (!lodash_1.default.isUndefined(value) ? value : defaultIfUndefined); },
};
function matchKeysFromObject(obj, matchingObject) {
    var o = {};
    lodash_1.default.forEach(lodash_1.default.entries(obj), function (_a) {
        var key = _a[0], value = _a[1];
        (value !== undefined || key in matchingObject) && (o[key] = value);
    });
    return o;
}
exports.matchKeysFromObject = matchKeysFromObject;
function valueFn(v) {
    return lodash_1.default.isFunction(v) ? v() : v;
}
exports.valueFn = valueFn;
