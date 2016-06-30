'use strict';

var _ = require('lodash'),
    ko = require('knockout');

function Knob(value) {
    this.value = ko.observable(value || 1);

    this.css = ko.pureComputed(_.bind(function () {
        var value = this.value();
        return {
            'value-1': value === 1,
            'value-2': value === 2,
            'value-3': value === 3,
            'value-4': value === 4,
            'value-5': value === 5,
            'value-6': value === 6,
            'value-7': value === 7,
            'value-8': value === 8,
        };
    }, this));
}

module.exports = Knob;

Knob.prototype.onClick = function () {
    var value = this.value() + 1;
    if (value > 8) {
        value = 1;
    }
    this.value(value);
};
