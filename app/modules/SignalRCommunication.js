'use strict';

var Promise = require('native-promise-only');

function SignalRCommunication(communication, eventBus) {
    this._communication = communication;

    this._hub = $.connection.messageHub;

    if (!this._hub) {
        console.warn('SignalR messageHub not defined; SignalRCommunication will be disabled');
        return;
    }

    this._hub.client.broadcastMessage = function (message) {
        communication.receive(JSON.parse(message));
    }.bind(this);

    // IE11 sucks
    $.ajaxSetup({ cache: false });

    $.connection.hub.start().done(function () {
        this._isHubReady = true;
        this.beginReceive(this._currentContext);
    }.bind(this));

    communication.registerProvider(this);
}

module.exports = SignalRCommunication;

SignalRCommunication.$inject = ['communication', 'eventBus'];

SignalRCommunication.prototype.send = function (message, context) {
    if (!this._isHubReady) {
        return Promise.reject(this._communication.Error.busy);
    }

    return new Promise(function (resolve, reject) {
        this._hub.server.sendMessage(context, JSON.stringify(message.toArray()))
            .done(function () {
                resolve();
            }).fail(function (reason) {
                reject(reason);
            });
    }.bind(this));
};

SignalRCommunication.prototype.beginReceive = function (context) {
    if (!this._isHubReady) {
        return;
    }

    if (this._currentContext) {
        this._hub.server.leaveRoom(this._currentContext);
    }

    if (context) {
        this._hub.server.joinRoom(context);
    }

    this._currentContext = context;
};
