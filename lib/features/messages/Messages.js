'use strict';

var _ = require('lodash');

var formats = require('./MessageFormats');

function Messages() {
    formats.value = '';
    initFormats(formats);
}

module.exports = Messages;

Messages.prototype.getFormat = function (value) {
    var match = ((value || '').toString()).match(/^([0-9])([0-9])?([0-9])?$/);
    if (!match) {
        return formats;
    }

    return getFormat(formats, [match[1], match[2], match[3]]);
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
    menu.parent = parent;
    menu.value = ((parent && parent.value) || '') + (num || '');

    _.forEach(menu, function (value, propertyName) {
        if (/^[0-9]$/.test(propertyName) && _.isObject(value)) {
            initFormats(value, menu, propertyName);
        }
    });
}