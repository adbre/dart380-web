'use strict';

var _ = require('lodash');

function Memory(eventBus) {
    this._eventBus = eventBus;

    this._keys = [];

    this._storage = (function () {
        var data = {};
        return {
            setItem: function (key, value) {
                data[key] = value;
            },

            getItem: function (key) {
                return data[key];
            },

            removeItem: function (key) {
                delete data[key];
            }
        };
    })();
}

module.exports = Memory;

Memory.$inject = ['eventBus'];

Memory.prototype.clear = function () {
    _.forEach(this._keys, function (key) {
        this._storage.removeItem(key);
    }.bind(this));
    this._keys = [];

    this._eventBus.fire('memory.cleared', {});
};

Memory.prototype.isEmpty = function () {
    return this._keys.length < 1;
};

Memory.prototype.get = function (key) {
    var data = this._storage.getItem(key);
    if (!data) {
        return undefined;
    }

    return JSON.parse(data);
};

Memory.prototype.set = function (key, value) {
    if (this._keys.indexOf(key) < 0) {
        this._keys.push(key);
    }
    this._storage.setItem(key, JSON.stringify(value));
    this._eventBus.fire('memory.changed', { key: key, value: value });
};