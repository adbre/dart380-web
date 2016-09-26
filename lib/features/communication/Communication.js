'use strict';

var _ = require('lodash');
var Promise = require('../../util/Deferred');
var sprintf = require('sprintf-js').sprintf;

function Communication(eventBus, largeDisplay, mod, kda, dda, time, messages)
{
    this._eventBus = eventBus;
    this._largeDisplay = largeDisplay;
    this._mod = mod;
    this._kda = kda;
    this._time = time;
    this._messages = messages;

    this._providers = [];
    this.isBusy = false;

    this.Error = {
        Mod: 'mod',
        Busy: 'busy',
        Header: 'header',
        Memory: 'memory'
    };

    this._synchronizationContext = null;

    eventBus.on(['kda.changed', 'time.changed'], function () {
        this._synchronizationContext = this.getContext(true);
    }.bind(this));
}

module.exports = Communication;

Communication.$inject = ['eventBus', 'largeDisplay', 'mod', 'kda', 'dda', 'time', 'messages'];

Communication.prototype.registerProvider = function (provider) {
    if (!provider || !_.isFunction(provider.send)) {
        throw new Error('Communication provider must implement function .send(message)');
    }

    this._providers.push(provider);
};

Communication.prototype.receive = function (message) {
    message = this._messages.createMessage(message);

    this._messages.saveReceived(message);
    this._fire('received', { message: message, success: true })
};

Communication.prototype.send = function (message) {
    var self = this;

    if (self.isBusy) {
        return Promise.reject(self.Error.Busy);
    }
    else if (!self._isAllowedMod()) {
        return Promise.reject(self.Error.Mod);
    }
    else if (!self._hasValidHeader(message)) {
        return Promise.reject(self.Error.Header);
    }

    var context = this.getContext();
    self._fire('sending', { message: message, context: context });
    self.isBusy = true;

    var promise = Promise.all(_.map(this._providers, function (provider) {
        return provider.send(message, context);
    }))
    .then(function () {
        self._messages.setAsSent(message);
        self.isBusy = false;
        self._fire('sent', { message: message, success: true });
    })
    .catch(function (reason) {
        self.isBusy = false;
        self._fire('sent', { message: message, success: false, error: reason });
    });

    return promise;
};

Communication.prototype.getContext = function (force) {
    if (!force && this._synchronizationContext) {
        return this._synchronizationContext;
    }

    var key = this._kda.getActiveKey();
    if (!key) {
        key = '###';
    } else {
        key = key.groups.join('') + key.checksum;
    }

    var context = [
        this._time.getContextTime(),
        this._kda.getFrequency(),
        this._kda.getBd1(),
        _.padEnd(this._kda.getBd2(), 4),
        key
    ].join('');

    if (context !== this._synchronizationContext) {
        this._synchronizationContext = context;
        this._fire('context.changed', { context: this._synchronizationContext });
    }

    return this._synchronizationContext;
};

Communication.prototype._fire = function (type, event) {
    this._eventBus.fire('communication.' + type, event);
};

Communication.prototype._isAllowedMod = function () {
    switch (this._mod.get()) {
        case this._mod.SKYDD:
        case this._mod.DRELA:
            return true;
        default:
            return false;
    }
};

Communication.prototype._hasValidHeader = function (message) {
    return !!(message.getRecipent() && message.getTimestamp() && message.getSender());
};