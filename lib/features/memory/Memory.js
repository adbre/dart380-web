'use strict';

var cloneDeep = require('lodash').cloneDeep;

function Memory(eventBus) {
    this._eventBus = eventBus;

    this._default = {
        kda: [
            new Kda(30025),
            new Kda(40025),
            new Kda(50025),
            new Kda(60025),
            new Kda(70025),
            new Kda(80025),
            new Kda(87975),
            new Kda(42025),
        ]
    };
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
    return (this._data && cloneDeep(this._data[key])) || cloneDeep(this._default[key]);
};

Memory.prototype.set = function (key, value) {
    if (!this._data) {
        this._data = {};
    }

    this._data[key] = cloneDeep(value);
    this._eventBus.fire('memory.changed', { key: key, value: value });
};

function Kda(frequency) {
    this.fr = frequency;
    this.bd1 = '9000';
    this.bd2 = '0000';
    this.disableKlar = false;
    this.synk = false;
    this.passiveKey = null;
    this.activeKey = null;
}