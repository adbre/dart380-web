'use strict';

var _ = require('lodash');

function Communication(eventBus)
{
    this._eventBus = eventBus;

    this._providers = [];
    this.isBusy = false;
}

module.exports = Communication;

Communication.$inject = ['eventBus'];

Communication.prototype.registerProvider = function (provider) {
    if (!provider || !_.isFunction(provider.send)) {
        throw new Error('Communication provider must implement function .send(message)');
    }

    this._providers.push(provider);
};

Communication.prototype.send = function (message) {
    var self = this;

    if (self.isBusy) {
        return Promise.reject('busy');
    }

    self._fire('sending', { message: message });
    self.isBusy = true;

    return Promise.all(_.map(this._providers, function (provider) {
        return provider.send(message);
    }))
    .then(function () {
        self.isBusy = false;
        self._fire('sent', { message: message, success: true });
    })
    .catch(function (reason) {
        self.isBusy = false;
        self._fire('sent', { message: message, success: false, error: reason });
    });
};

Communication.prototype._fire = function (type, event) {
    this._eventBus.fire('communication.' + type, event);
};