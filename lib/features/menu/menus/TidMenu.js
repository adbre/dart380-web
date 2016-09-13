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
            text: function () {
                var value = time.get();
                return sprintf('%02d%02d%02d', value.hour, value.minute, value.second);
            },
            save: function (value) {
                var match = value.match(/^([0-9]{2})([0-9]{2})([0-9]{2})$/);
                return !!match && time.set({
                    hour: parseInt(match[1]),
                    minute: parseInt(match[2]),
                    second: parseInt(match[3])
                });
            }
        },
        {
            prefix: 'DAT',
            canEdit: true,
            text: function () {
                var value = time.get();
                return sprintf('%02d%02d', value.month, value.day);
            },
            save: function (value) {
                var match = value.match(/^([0-9]{2})([0-9]{2})$/);
                return !!match && time.set({
                    month: parseInt(match[1]),
                    day: parseInt(match[2])
                });
            }
        }
    ]);

    eventBus.on('time.changed', this.update.bind(this));
}

inherits(TidMenu, Ra180MenuBase);

module.exports = TidMenu;

TidMenu.$inject = ['injector', 'eventBus', 'time'];
