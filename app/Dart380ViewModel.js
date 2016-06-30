'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    ko = require('knockout');

var Dart380 = require('../lib/Dart380');
var KnobViewModel = require('./KnobViewModel');

function Dart380ViewModel(dart380) {
    this._dart380 = dart380;
    this._eventBus = dart380.get('eventBus');

    this._eventBus.on('display.updated', _.bind(this._updateDisplays, this));

    this.textLargeDisplay = ko.observable();
    this.textSmallDisplay = ko.observable();

    this.knobChannel = new KnobViewModel(1);
    this.knobMod = new KnobViewModel(3);
    this.knobVolume = new KnobViewModel(5);

    this._updateDisplays();
}

module.exports = Dart380ViewModel;

Dart380ViewModel.prototype.sendKey = function (key) {
    this._dart380.sendKey(key);
};

Dart380ViewModel.prototype.activate = function (view) {
    var me = this;
    var $shiftKey = $(view).find('button.shift-key');

    $(view).find("button").click(function (event) {
        var button = this, value, shiftValue;
        if (button.children.length == 2) {
            shiftValue = button.children[0].innerText;
            value = button.children[1].innerText;
        } else if ($(button).find(".dart380-btn-star").length > 0) {
            value = '*';
        } else if ($(button).find(".dart380-btn-sun").length > 0) {
            value = Dart380.SPECIAL_KEYS.brightness.text;
        } else {
            value = button.innerText;
        }

        if (value === Dart380.SPECIAL_KEYS.shift.text) {
            $shiftKey.toggleClass('active');
        }
        else if (shiftValue && $shiftKey.hasClass('active')) {
            $shiftKey.removeClass('active');
            me.sendKey(shiftValue);
        } else {
            me.sendKey(value);
        }
    });

    $(view).find("a.reset").click(function () {
        me.sendKey(Dart380.SPECIAL_KEYS.reset.text);
    });
};

Dart380ViewModel.prototype._updateDisplays = function () {
    this.textLargeDisplay(this._dart380.largeDisplay.text);
    this.textSmallDisplay(this._dart380.smallDisplay.text);
};
