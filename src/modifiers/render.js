'use strict';

const config = require('config');

const init = function(leds, ws) {
  ws.on('connection', wss => {
    const update = function() {
      wss.transfer('meta', {
        size: config.size,
        pixels: leds.pixels,
        regulator: config.regulator
      });

      setTimeout(() => {
        update();
      }, config.socket.previewUpdateInterval || 1000);
    };

    update();
  });
};

module.exports = {init};
