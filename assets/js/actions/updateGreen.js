'use strict';

const rgbToHsv = require('../rgbToHsv.js');

module.exports = function(green, socket) {
    return function(dispatch, getState) {
        let color = getState().get('color');
        let rgb = color.get('rgb').toObject();
        let hsv = rgbToHsv(rgb.red, green, rgb.blue).hsv;
        const sync = color.get('sync');

        dispatch({
            type: 'UPDATE_GREEN',
            data: green
        });

        if(Number.isNaN(rgb.red)) {
            dispatch({
                type: 'UPDATE_RED',
                data: 0
            });
        }

        if(Number.isNaN(rgb.blue)) {
            dispatch({
                type: 'UPDATE_BLUE',
                data: 0
            });
        }

        color = getState().get('color');
        rgb = color.get('rgb').toObject();
        hsv = rgbToHsv(rgb.red, rgb.green, rgb.blue).hsv;

        if(socket) {
            socket.send(JSON.stringify(['mode', 'rgb']));
            socket.send(JSON.stringify(['rgb', rgb]));
        }

        if(sync) {
            dispatch({
                type: 'UPDATE_HUE',
                data: hsv.hue
            });

            dispatch({
                type: 'UPDATE_SATURATION',
                data: hsv.saturation
            });

            dispatch({
                type: 'UPDATE_VALUE',
                data: hsv.value
            });

            if(socket) {
                socket.send(JSON.stringify(['hsv', hsv]));
            }
        }
    };
};
