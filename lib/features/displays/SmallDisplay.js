'use strict';

var DisplayBase = require('./DisplayBase');
var inherits = require('inherits');

function SmallDisplay(eventBus) {
    DisplayBase.call(this, eventBus);

    this.init('smallDisplay', 8);
}

inherits(SmallDisplay, DisplayBase);

SmallDisplay.$inject = ['eventBus'];

module.exports = SmallDisplay;
