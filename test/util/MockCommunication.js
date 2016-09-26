'use strict';

var _ = require('lodash');
var Promise = require('../../lib/util/Deferred');

function MockCommunication(communication) {
    communication.registerProvider(this);

    this.requests = [];
    this.callbacks = [];
}

module.exports = MockCommunication;

MockCommunication.module = {
    __init__: ['mockCommunication'],
    mockCommunication: ['type', MockCommunication]
};

MockCommunication.$inject = ['communication'];

MockCommunication.prototype.send = function (message, context) {
    var self = this;
    return new Promise(function (resolve, reject) {
        var request = {
            message: message,
            context: context,
            complete: resolve,
            error: reject,
            errorMod: function () {
                reject(self._communication.Error.Mod);
            },
            errorHeader: function () {
                reject(self._communication.Error.Header);
            },
            errorBusy: function () {
                reject(self._communication.Error.Busy);
            },
            errorMemory: function () {
                reject(self._communication.Error.Memory);
            },
            toString: function () {
                message.apply(message, arguments);
            }
        };
        self.requests.push(request);

        _.forEach(self.callbacks, function (callback) {
            callback(request);
        });
    });
};

MockCommunication.prototype.mostRecent = function () {
    return this.requests[this.requests.length - 1];
};

MockCommunication.prototype.onSending = function (callback) {
    this.callbacks.push(callback);
};