'use strict';

var config = require('config');
var note = require('note-log');
var util = require('util');

var init = function init(leds, ws) {
  var init = {
    canvas: Array.apply(null, new Array(leds.pixels.length)).map(function (value) {
      return {
        values: [0, 0, 0],
        opacity: 0
      };
    })
  };

  ws.on('connection', function (wss) {
    wss.on('message', function (msg) {
      var data = JSON.parse(msg);

      if (data[0] === 'draw') {
        var index = data[1].y * config.size[1] + (data[1].y % 2 ? config.size[0] - 1 - data[1].x : data[1].x);

        init.canvas[index] = data[1];
      }

      if (data[0] === 'fill') {
        init.canvas = init.canvas.map(function (value) {
          return data[1];
        });
      }
    });
  });

  return init;
};

var each = function each(pixel, leds, pre, init) {
  var pencil = init.canvas[pixel.index];

  return pencil.values.map(function (value, index) {
    return (1 - pencil.opacity) * pixel.values[index] + pencil.opacity * value;
  });
};

module.exports = { init: init, each: each };