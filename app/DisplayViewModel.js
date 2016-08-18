'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    ko = require('knockout');

function DisplayViewModel(display, eventBus) {
    this._display = display;

    this.hidden = ko.observable(display.hidden);

    this.characters = _.map(display.characters, function (c) {
        return new Character(c);
    });

    this.css = ko.pureComputed(function () {
        return {
            hidden: this.hidden()
        };
    }, this);

    eventBus.on(display.name+'.changed', this._onDisplayChanged.bind(this));
}

module.exports = DisplayViewModel;

DisplayViewModel.prototype._onDisplayChanged = function () {
    this.hidden(this._display.hidden);

    _.forEach(this.characters, function (c, index) {
        c.update();
    });
};


function Character(char) {
    var cursor = false,
        blinking = false,
        underline = ko.observable(false),
        hidden = ko.observable(false),
        updateInterval;

    function startUpdates() {
        if (updateInterval) {
            return;
        }
        underline(false);
        hidden(blinking && true);
        updateInterval = setInterval(function () {
            if (cursor) {
                underline(!underline());
            }
            if (blinking) {
                hidden(!hidden());
            }
        }, 750);
    }

    function endUpdates() {
        if (!updateInterval) {
            return;
        }
        clearInterval(updateInterval);
        updateInterval = null;
        underline(false);
        hidden(false);
    }

    function startOrStopUpdates() {
        if (cursor || blinking) {
            startUpdates();
        }
        else {
            endUpdates();
        }
    }

    this.text = ko.observable('');
    this.css = ko.pureComputed(function () {
        return {
            hidden: hidden(),
            underline: underline()
        };
    });

    this.cursor = function (enable) {
        cursor = enable;
        startOrStopUpdates();
    };

    this.blinking = function (enable) {
        blinking = enable;
        startOrStopUpdates();
    };

    this.update = function () {
        this.text(char.text);
        this.cursor(char.cursor);
        this.blinking(char.blinking);
    };

    this.update();
}
