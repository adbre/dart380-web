'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    ko = require('knockout');

var Dart380 = require('../lib/Dart380');
var SwitchViewModel = require('./SwitchViewModel');
var DisplayViewModel = require('./DisplayViewModel');

function Dart380ViewModel(dart380) {
    this._dart380 = dart380 = dart380 || new Dart380({ modules: [
        require('./modules')
    ]});

    this._eventBus = dart380.get('eventBus');
    this._smallDisplay = dart380.get('smallDisplay');
    this._largeDisplay = dart380.get('largeDisplay');
    this._keyboard = dart380.get('keyboard');

    this.largeDisplay = new DisplayViewModel(this._largeDisplay, this._eventBus);
    this.smallDisplay = new DisplayViewModel(this._smallDisplay, this._eventBus);

    this.textLargeDisplay = ko.observable();
    this.textSmallDisplay = ko.observable();

    this.channel = new SwitchViewModel(dart380.get('channel'), this._eventBus);
    this.mod = new SwitchViewModel(dart380.get('mod'), this._eventBus);
    this.volume = new SwitchViewModel(dart380.get('volume'), this._eventBus);

    this._eventBus.on(['channel.changed', 'mod.changed', 'volume.changed'], function () {
        this.channel.update();
        this.mod.update();
        this.volume.update();
    }.bind(this));
}

module.exports = Dart380ViewModel;

Dart380ViewModel.prototype.sendKey = function (key) {
    this._keyboard.trigger(key);
};

Dart380ViewModel.prototype.activate = function (view) {
    var me = this;
    var $shiftKey = $(view).find('button.shift-key');

    $(view).on('mousedown', function (e) {
        e.preventDefault();
    });

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

        value = value.trim();

        if (value === me._keyboard.keys.shift.text) {
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
        me.sendKey([me._keyboard.keys.asterix, me._keyboard.keys.hashtag]);
    });
};
