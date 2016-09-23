'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var Ra180MenuBase = require('./../Ra180MenuBase');

function TidMenu(injector, eventBus, time) {
    injector.invoke(Ra180MenuBase, this);

    this.init('1', 'TID', [
        {
            prefix: 'T',
            canEdit: true,
            text: time.getTime.bind(time),
            save: time.setTime.bind(time)
        },
        {
            prefix: 'DAT',
            canEdit: true,
            text: time.getDate.bind(time),
            save: time.setDate.bind(time)
        }
    ]);

    eventBus.on('time.changed', this.update.bind(this));
}

inherits(TidMenu, Ra180MenuBase);

module.exports = TidMenu;

TidMenu.$inject = ['injector', 'eventBus', 'time'];
