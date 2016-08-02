'use strict';

var DisplayBase = require('./DisplayBase');
var inherits = require('inherits');

function SmallDisplay(eventBus) {
    DisplayBase.call(this, eventBus);

    this.name = 'smallDisplay';
    this.size = 8;
}

inherits(SmallDisplay, DisplayBase);

SmallDisplay.$inject = ['eventBus'];

module.exports = SmallDisplay;
