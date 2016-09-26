'use strict';

var cloneDeep = require('lodash').cloneDeep;

function Memory(eventBus) {
    this._eventBus = eventBus;
}

module.exports = Memory;

Memory.$inject = ['eventBus'];

Memory.prototype.clear = function () {
    this._data = null;
    this._eventBus.fire('memory.cleared', {});
};

Memory.prototype.isEmpty = function () {
    return !this._data;
};

Memory.prototype.get = function (key) {
    return (this._data && cloneDeep(this._data[key])) || undefined;
};

Memory.prototype.set = function (key, value) {
    if (!this._data) {
        this._data = {};
    }

    this._data[key] = cloneDeep(value);
    this._eventBus.fire('memory.changed', { key: key, value: value });
};