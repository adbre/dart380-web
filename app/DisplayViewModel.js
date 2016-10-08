'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    ko = require('knockout');

function DisplayViewModel(display, eventBus) {
    this._display = display;

    this.blink = ko.observable(false);

    this.characters = _.map(display.characters, function (c) {
        return new Character(c);
    });

    this.css = ko.pureComputed(function () {
        return {
            blink: this.blink()
        };
    }, this);

    eventBus.on(display.name+'.changed', this._onDisplayChanged.bind(this));

    setInterval(function () {
        this.blink(!this.blink());
    }.bind(this), 250);
}

module.exports = DisplayViewModel;

DisplayViewModel.prototype._onDisplayChanged = function () {
    _.forEach(this.characters, function (c, index) {
        c.update();
    });
};


function Character(char) {
    this.text = ko.observable('');
    this.cursor = ko.observable(false);
    this.blinking = ko.observable(false);

    this.css = ko.pureComputed(function () {
        return {
            blinking: this.blinking(),
            cursor: this.cursor()
        };
    }, this);

    this.update = function () {
        this.text(char.text || ' ');
        this.cursor(!!char.cursor);
        this.blinking(!!char.blinking);
    };

    this.update();
}
