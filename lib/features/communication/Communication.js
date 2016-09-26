'use strict';

var _ = require('lodash');
var Promise = require('../../util/Deferred');
var sprintf = require('sprintf-js').sprintf;

function Communication(eventBus, largeDisplay, mod, kda, time)
{
    this._eventBus = eventBus;
    this._largeDisplay = largeDisplay;
    this._mod = mod;
    this._kda = kda;
    this._time = time;

    this._providers = [];
    this.isBusy = false;

    this.Error = {
        Mod: 'mod',
        Busy: 'busy',
        Header: 'header',
        Memory: 'memory'
    };
}

module.exports = Communication;

Communication.$inject = ['eventBus', 'largeDisplay', 'mod', 'kda', 'time'];

Communication.prototype.registerProvider = function (provider) {
    if (!provider || !_.isFunction(provider.send)) {
        throw new Error('Communication provider must implement function .send(message)');
    }

    this._providers.push(provider);
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
        self.isBusy = false;
        self._fire('sent', { message: message, success: true });
    })
    .catch(function (reason) {
        self.isBusy = false;
        self._fire('sent', { message: message, success: false, error: reason });
    });

    return promise;
};

Communication.prototype.getContext = function () {
    var key = this._kda.getActiveKey();
    if (!key) {
        key = '###';
    } else {
        key = key.groups.join('') + key.checksum;
    }
    return [
        this._time.getContextTime(),
        this._kda.getFrequency(),
        this._kda.getBd1(),
        _.padEnd(this._kda.getBd2(), 4),
        key
    ].join('');
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