'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var Ra180MenuBase = require('./../Ra180MenuBase');

function OpmMenu(injector, eventBus, opm) {
    injector.invoke(Ra180MenuBase, this);

    this.init('OPM', 'OPM', function () {
        var messages =opm.getMessages();
        return _.map(messages, function (message) {
            return { text: message };
        });
    });
}

inherits(OpmMenu, Ra180MenuBase);

module.exports = OpmMenu;

OpmMenu.$inject = ['injector', 'eventBus', 'opm'];

OpmMenu.prototype.onKeyPress = function (e) {
    if (Ra180MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    if (e.key === 'OPM') {
        this.nextMenuItem();
        return true;
    }

    return false;
};
