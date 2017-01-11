'use strict';

var note = require('note-log');
var util = require('util');
var vm = require('vm');

var hsv2rgb = require('../../utils/hsv2rgb.js');

var each = function each(pixel, leds, pre, init) {
    var scope = pre;

    scope.index = scope.i = pixel.index;
    scope.x = pixel.x;
    scope.y = pixel.y;
    scope.pixelRandom = scope.pr = Math.random();
    scope.previous = scope.p = pixel.values;

    if (leds.mode === 'hsv') {
        var hue = void 0,
            saturation = void 0,
            value = void 0;

        try {
            hue = init.hsv.hue.eval.evaluate(scope);
            saturation = init.hsv.saturation.eval.evaluate(scope);
            value = init.hsv.value.eval.evaluate(scope);
        } catch (error) {
            note('color', 2, error.message);
        }

        pixel.values = hsv2rgb(hue, saturation, value);
    }

    if (leds.mode === 'rgb') {
        var red = void 0,
            green = void 0,
            blue = void 0;

        try {
            red = init.rgb.red.eval.evaluate(scope);
            green = init.rgb.green.eval.evaluate(scope);
            blue = init.rgb.blue.eval.evaluate(scope);
        } catch (error) {
            note(error);
        }

        pixel.values[0] = red;
        pixel.values[1] = green;
        pixel.values[2] = blue;
    }
};

module.exports = each;