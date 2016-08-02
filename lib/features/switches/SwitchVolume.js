'use strict';

var SwitchBase = require('./SwitchBase');
var inherits = require('inherits');

function SwitchVolume(eventBus) {
    SwitchBase.call(this, eventBus);

    this.name = 'switchVolume';
    this.value = 4;
}

inherits(SwitchVolume, SwitchBase);

SwitchVolume.$inject = ['eventBus'];

module.exports = SwitchVolume;
