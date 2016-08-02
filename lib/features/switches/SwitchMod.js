'use strict';

var SwitchBase = require('./SwitchBase');
var inherits = require('inherits');

function SwitchMod(eventBus) {
    SwitchBase.call(this, eventBus);

    this.name = 'switchMod';
    this.value = 1;
}

inherits(SwitchMod, SwitchBase);

SwitchMod.$inject = ['eventBus'];

module.exports = SwitchMod;

SwitchMod.prototype.FR = 1;
SwitchMod.prototype.TE = 2;
SwitchMod.prototype.KLAR = 3;
SwitchMod.prototype.SKYDD = 4;
SwitchMod.prototype.DRELA = 5;
SwitchMod.prototype.TD = 6;
SwitchMod.prototype.NG = 7;
SwitchMod.prototype.FmP = 8;
