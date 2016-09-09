'use strict';

function Volume(eventBus) {
    this._eventBus = eventBus;
    this._value = 4;
}

Volume.$inject = ['eventBus'];

module.exports = Volume;

Volume.prototype.get = function () {
    return this._value;
};

Volume.prototype.set = function (value) {
    if (value < 1 || value > 8) {
        throw new Error('Argument value is out of range: Must be in range 1-8.');
    }

    this._value = value;
    this._eventBus.fire('volume.changed', { switch: this, value: value });
};
