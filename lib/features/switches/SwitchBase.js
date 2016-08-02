'use strict';

function Switch(eventBus) {
    this._eventBus = eventBus;
}

Switch.$inject = ['eventBus'];

module.exports = Switch;

Switch.prototype.init = function (name) {
    this.name = name;
};

Switch.prototype.getValue = function () {
    return this.value;
};

Switch.prototype.setValue = function (value) {
    if (value < 1 || value > 8) {
        throw new Error('Argument value is out of range: Must be in range 1-8.');
    }

    this.value = value;
    this._eventBus.fire(this.name+'.changed', { switch: this, value: value });
};
