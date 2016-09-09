'use strict';

function Mod(eventBus) {
    this._eventBus = eventBus;
    this._value = 1;
}

Mod.$inject = ['eventBus'];

module.exports = Mod;

Mod.prototype.get = function () {
    return this._value;
};

Mod.prototype.set = function (value) {
    if (value < 1 || value > 8) {
        throw new Error('Argument value is out of range: Must be in range 1-8.');
    }

    this._value = value;
    this._eventBus.fire('mod.changed', { switch: this, value: value });
};

Mod.prototype.FR = 1;
Mod.prototype.TE = 2;
Mod.prototype.KLAR = 3;
Mod.prototype.SKYDD = 4;
Mod.prototype.DRELA = 5;
Mod.prototype.TD = 6;
Mod.prototype.NG = 7;
Mod.prototype.FmP = 8;
