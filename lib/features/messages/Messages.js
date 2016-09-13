'use strict';

var _ = require('lodash');

var formats = require('./MessageFormats');

function Messages() {
    this._messageFormats = [];
    this._initFormats(formats);
}

module.exports = Messages;

Messages.prototype.getFormat = function (value) {
    var match = ((value || '').toString()).match(/^([0-9])([0-9])?([0-9])?$/);
    if (!match) {
        return formats;
    }

    return getFormat(formats, [match[1], match[2], match[3]]);
};

Messages.prototype._initFormats = function (menu, parent, num) {
    menu.parent = parent;
    menu.value = ((parent && parent.value) || '') + (num || '');

    var self = this;

    if (menu.value.length === 3) {
        this._messageFormats.push(menu);
        this._initMessageFormat(menu);
    }

    _.forEach(menu, function (value, propertyName) {
        if (/^[0-9]$/.test(propertyName) && _.isObject(value)) {
            self._initFormats(value, menu, propertyName);
        }
    });
};

Messages.prototype._initMessageFormat = function (format) {
    format.getLines = function () {
        return [
            'TILL:           ',
            '                ',
            '      *FR:      ',
            '                ',
            'FRÅN:     *U:   ',
            'TEXT:           ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                ',
            '                '
        ];
    };
};

function getFormat(menu, values) {
    var value = values.shift();
    if (_.isUndefined(value)) {
        return menu;
    }
    else {
        var child = menu[value];
        if (!child) {
            return false;
        }
        else {
            return getFormat(child, values);
        }
    }
}

function initFormats(menu, parent, num) {

}