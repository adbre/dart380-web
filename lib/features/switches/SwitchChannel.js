'use strict';

var SwitchBase = require('./SwitchBase');
var inherits = require('inherits');

function SwitchChannel(eventBus) {
    SwitchBase.call(this, eventBus);

    this.name = 'switchChannel';
    this.value = 1;
}

inherits(SwitchChannel, SwitchBase);

SwitchChannel.$inject = ['eventBus'];

module.exports = SwitchChannel;
