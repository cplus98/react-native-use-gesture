"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rubberbandIfOutOfBounds = exports.getIntentionalDisplacement = exports.calculateAllKinematics = exports.calculateDirection = exports.calculateDistance = exports.calculateVelocities = exports.calculateVelocity = exports.subV = exports.addV = void 0;
// vector add
function addV(v1, v2) {
    return v1.map(function (v, i) { return v + v2[i]; });
}
exports.addV = addV;
// vector substract
function subV(v1, v2) {
    return v1.map(function (v, i) { return v - v2[i]; });
}
exports.subV = subV;
/**
 * Calculates velocity
 * @param delta the difference between current and previous vectors
 * @param delta_t the time offset
 * @param len the length of the delta vector
 * @returns velocity
 */
function calculateVelocity(delta, delta_t, len) {
    len = len || Math.hypot.apply(Math, delta);
    return delta_t ? len / delta_t : 0;
}
exports.calculateVelocity = calculateVelocity;
/**
 * Calculates velocities vector
 * @template T the expected vector type
 * @param delta the difference between current and previous vectors
 * @param delta_t the time offset
 * @returns velocities vector
 */
function calculateVelocities(delta, delta_t) {
    return (delta_t ? delta.map(function (v) { return v / delta_t; }) : Array(delta.length).fill(0));
}
exports.calculateVelocities = calculateVelocities;
/**
 * Calculates distance
 * @param movement the difference between current and initial vectors
 * @returns distance
 */
function calculateDistance(movement) {
    return Math.hypot.apply(Math, movement);
}
exports.calculateDistance = calculateDistance;
/**
 * Calculates direction
 * @template T the expected vector type
 * @param delta
 * @param len
 * @returns direction
 */
function calculateDirection(delta, len) {
    len = len || Math.hypot.apply(Math, delta) || 1;
    return delta.map(function (v) { return v / len; });
}
exports.calculateDirection = calculateDirection;
/**
 * Calculates all kinematics
 * @template T the expected vector type
 * @param movement the difference between current and initial vectors
 * @param delta the difference between current and previous vectors
 * @param delta_t the time difference between current and previous timestamps
 * @returns all kinematics
 */
function calculateAllKinematics(movement, delta, delta_t) {
    var len = Math.hypot.apply(Math, delta);
    return {
        velocities: calculateVelocities(delta, delta_t),
        velocity: calculateVelocity(delta, delta_t, len),
        distance: calculateDistance(movement),
        direction: calculateDirection(delta, len),
    };
}
exports.calculateAllKinematics = calculateAllKinematics;
function getIntentionalDisplacement(movement, threshold) {
    var abs = Math.abs(movement);
    return abs >= threshold ? Math.sign(movement) * threshold : false;
}
exports.getIntentionalDisplacement = getIntentionalDisplacement;
function minMax(value, min, max) {
    return Math.max(min, Math.min(value, max));
}
// Based on @aholachek ;)
// https://twitter.com/chpwn/status/285540192096497664
// iOS constant = 0.55
// https://medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5
function rubberband2(distance, constant) {
    // default constant from the article is 0.7
    return Math.pow(distance, (constant * 5));
}
function rubberband(distance, dimension, constant) {
    if (dimension === 0 || Math.abs(dimension) === Infinity)
        return rubberband2(distance, constant);
    return (distance * dimension * constant) / (dimension + constant * distance);
}
function rubberbandIfOutOfBounds(position, min, max, constant) {
    if (constant === void 0) { constant = 0.15; }
    if (constant === 0)
        return minMax(position, min, max);
    if (position < min) {
        return -rubberband(min - position, max - min, constant) + min;
    }
    if (position > max) {
        return rubberband(position - max, max - min, constant) + max;
    }
    return position;
}
exports.rubberbandIfOutOfBounds = rubberbandIfOutOfBounds;
