'use strict';

var _ = require('lodash'),
    ko = require('knockout');

var Promise = require('dart380-js/lib/util/Deferred');

function PrinterViewModel(printer) {
    printer.registerProvider(this);

    this.messages = ko.observableArray([]);
}

module.exports = PrinterViewModel;

PrinterViewModel.$inject = ['printer'];

PrinterViewModel.prototype.print = function (message) {
    var text = ko.observable('                \n');
    var messageText = message.toString();
    var index = 0;
    var interval = setInterval(function () {
        if (index >= messageText.length) {
            clearInterval(interval);
            return;
        }

        var start = index;

        while (index <= messageText.length && messageText[++index] === ' ');
        var end = index;

        if (end - start > 0) {
            text(text() + messageText.substring(start, end));
        }
    }, 50);
    this.messages.push(text);
    return Promise.resolve();
};
