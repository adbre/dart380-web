'use strict';

var _ = require('lodash');

var MESSAGE_KEY = 'localStorageCommunication.message';

function LocalStorageCommunication(communication, eventBus) {
    this._communication = communication;

    this._senderId = Date.now();

    window.addEventListener('storage', function (e) {
        if (e.key !== MESSAGE_KEY) {
            return;
        }

        var envelope = JSON.parse(e.newValue);
        if (!envelope || !envelope.message || envelope.context !== this._currentContext) {
            return;
        }

        communication.receive(envelope.message);
        window.localStorage.removeItem(MESSAGE_KEY);
    }.bind(this));

    // Events does not work when running from file:/// ... fallback
    // to polling.
    window.setInterval(function () {

        var envelope = window.localStorage.getItem(MESSAGE_KEY);
        if (!envelope) {
            return;
        }

        envelope = JSON.parse(envelope);

        if (!envelope || envelope.senderId === this._senderId) {
            return;
        }

        communication.receive(envelope.message);
        window.localStorage.removeItem(MESSAGE_KEY);
    }.bind(this), 250);

    communication.registerProvider(this);
}

module.exports = LocalStorageCommunication;

LocalStorageCommunication.$inject = ['communication', 'eventBus'];

LocalStorageCommunication.prototype.beginReceive = function (context) {
    this._currentContext = context;
};

LocalStorageCommunication.prototype.send = function (message, context) {

    if (window.localStorage.getItem(MESSAGE_KEY)) {
        return Promise.reject(this._communication.Error.busy);
    }

    return new Promise(function (resolve, reject) {
        window.localStorage.setItem(MESSAGE_KEY, JSON.stringify({
            senderId: this._senderId,
            context: context,
            message: message.toArray()
        }));

        window.setTimeout(function () {
            window.localStorage.removeItem(MESSAGE_KEY);
            resolve();
        }, 500);
    }.bind(this));
};