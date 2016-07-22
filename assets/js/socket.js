'use strict';

const config = require('config');
const store = require('./store.js');

const socket = new WebSocket(config.socket.host);

const updateSize = require('./actions/updateSize.js');
const updatePixels = require('./actions/updatePixels.js');
const updateRegulator = require('./actions/updateRegulator.js');

const updateRed = require('./actions/updateRed.js');
const updateGreen = require('./actions/updateGreen.js');
const updateBlue = require('./actions/updateBlue.js');

const updateHue = require('./actions/updateHue.js');
const updateSaturation = require('./actions/updateSaturation.js');
const updateValue = require('./actions/updateValue.js');

socket.addEventListener('message', msg => {
  const data = JSON.parse(msg.data);

  if(data[0] === 'meta') {
    let size = data[1].size;

    if(!Array.isArray(size)) {
      size = [size, 1];
    }

    store.dispatch(updateSize(size[0], size[1]));
    store.dispatch(updatePixels(data[1].pixels));
    store.dispatch(updateRegulator(data[1].regulator));
  }

  if(data[0] === 'rgb') {
    store.dispatch(updateRed(data[1].red));
    store.dispatch(updateGreen(data[1].green));
    store.dispatch(updateBlue(data[1].blue));
  }

  if(data[0] === 'hsv') {
    store.dispatch(updateHue(data[1].hue));
    store.dispatch(updateSaturation(data[1].saturation));
    store.dispatch(updateValue(data[1].value));
  }

  if(data[0] === 'error') {
    console.log(new Error(data[1]));
  }
});

module.exports = socket;
