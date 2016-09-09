'use strict';

var _ = require('lodash'),
    ko = require('knockout');

function SwitchViewModel(switchModel, eventBus) {
    var self = this;
    self._switch = switchModel;
    self.value = ko.observable(this._switch.get());

    self.css = ko.pureComputed(function () {
        var value = self.value();
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
    });
}

module.exports = SwitchViewModel;

SwitchViewModel.prototype.onClick = function () {
    var value = this.value() + 1;
    if (value > 8) {
        value = 1;
    }
    this._switch.set(value);
};

SwitchViewModel.prototype.update = function () {
    this.value(this._switch.get());
};
