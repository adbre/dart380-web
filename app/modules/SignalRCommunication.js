'use strict';

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

    eventBus.on('communication.context.changed', function (e) {
        this._changeContext(e.context);
    }.bind(this));

    $.connection.hub.start().done(function () {
        this._isHubReady = true;
        this._changeContext(this._currentContext);
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

SignalRCommunication.prototype._changeContext = function (context) {
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