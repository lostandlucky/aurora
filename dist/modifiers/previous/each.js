'use strict';

var each = function each(pixel, leds, pre, init) {
    pixel.previous.values[0] = pixel.values[0] || 0;
    pixel.previous.values[1] = pixel.values[1] || 0;
    pixel.previous.values[2] = pixel.values[2] || 0;
};

module.exports = each;