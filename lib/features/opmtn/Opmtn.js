'use strict';

function Opmtn(eventBus) {
    this._eventBus = eventBus;
    this._enabled = true;
}

module.exports = Opmtn;

Opmtn.$inject = ['eventBus'];

Opmtn.prototype.get = function () {
    return !!this._enabled;
};

Opmtn.prototype.set = function (value) {
    value = !!value;
    if (value == this.get()) {
        this._enabled = value;
        this._eventBus.fire('opmtn.changed', { value: value });
    }
};

Opmtn.prototype.play = function () {
    if (this.get()) {
        this._eventBus.fire('opmtn.play', { });
    }
};
