'use strict';

function Channel(eventBus) {
    this._eventBus = eventBus;
    this._value = 1;
}

Channel.$inject = ['eventBus'];

module.exports = Channel;

Channel.prototype.get = function () {
    return this._value;
};

Channel.prototype.set = function (value) {
    if (value < 1 || value > 8) {
        throw new Error('Argument value is out of range: Must be in range 1-8.');
    }

    this._value = value;
    this._eventBus.fire('channel.changed', { switch: this, value: value });
};
