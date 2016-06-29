'use strict';

var _ = require('lodash');

var SPECIAL_KEYS = require('./util/specialKeys');

function Dart380() {
    this.largeDisplay = { text: '1234567890123456' };
    this.smallDisplay = { text: '12345678' };
}

Dart380.prototype.sendKey = function (key) {
    this.largeDisplay.text = _.isString(key.text) ? key.text : key;
    if (_.isFunction(this._callback)) {
        this._callback();
    }
};

Dart380.prototype.get = function (module) {
    return {
        on: _.bind(function (type, callback) {
            this._callback = callback;
        }, this)
    }
};

Dart380.SPECIAL_KEYS = SPECIAL_KEYS;

module.exports = Dart380;
