'use strict';

var DisplayBase = require('./DisplayBase');
var inherits = require('inherits');

function LargeDisplay(eventBus) {
    DisplayBase.call(this, eventBus);

    this.name = 'largeDisplay';
    this.size = 16;
}

inherits(LargeDisplay, DisplayBase);

LargeDisplay.$inject = ['eventBus'];

module.exports = LargeDisplay;
