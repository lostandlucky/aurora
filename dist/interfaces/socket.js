'use strict';

var config = require('config');
var util = require('util');
var note = require('note-log');
var WebSocket = require('ws').Server;
var uuid = require('uuid');
var math = require('mathjs');
var knex = require('../knex.js');

var port = config.has('socket.port') ? config.socket.port : 3001;

module.exports = function (leds) {
  var ws = new WebSocket({ port: port });

  note('wss', 'Socket server listening on port ' + port);

  ws.on('connection', function (wss) {
    note('socket', 0, 'Established websocket with \'' + (wss.upgradeReq.headers['x-forwarded-for'] || ws.upgradeReq.connection.remoteAddress) + '\'');

    wss.id = uuid();

    wss.transfer = function (namespace) {
      if (wss.readyState === 1) {
        for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          data[_key - 1] = arguments[_key];
        }

        wss.send(JSON.stringify([namespace].concat(data)));
      }
    };

    wss.broadcast = function (namespace) {
      for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        data[_key2 - 1] = arguments[_key2];
      }

      ws.clients.forEach(function (client) {
        if (wss.readyState === 1 && client.id !== wss.id) {
          client.send(JSON.stringify([namespace].concat(data)));
        }
      });
    };

    wss.transfer('meta', {
      width: leds.width,
      height: leds.height,
      pixels: leds.pixels,
      regulator: config.regulator,
      interval: leds.interval
    });

    wss.transfer('interval', leds.interval);
    wss.transfer('mode', leds.mode);

    knex('presets').select().then(function (presets) {
      wss.transfer('presets', presets.map(function (preset) {
        preset.targets = JSON.parse(preset.targets);
        preset.values = JSON.parse(preset.values);
        preset.labels = JSON.parse(preset.labels);

        return preset;
      }));
    }).catch(function (error) {
      note(error);
    });

    var update = function update() {
      wss.transfer('pixels', leds.pixels);

      if (wss.readyState === 1) {
        setTimeout(function () {
          update();
        }, config.has('socket.previewInterval') ? config.socket.previewInterval : 1000);
      }
    };

    update();

    wss.on('message', function (msg) {
      var data = JSON.parse(msg);

      if (data[0] === 'mode') {
        leds.mode = data[1];
      }

      if (data[0] === 'interval') {
        leds.interval = data[1];
      }
    });

    wss.on('close', function () {
      note('socket', 0, 'Closed websocket with \'' + (wss.upgradeReq.headers['x-forwarded-for'] || ws.upgradeReq.connection.remoteAddress) + '\'');
    });
  });

  return ws;
};