'use strict';

var _ = require('lodash');

function Deferred(executor) {
    executor(this.resolve.bind(this), this.reject.bind(this));

    this._then = [];
    this._fail = [];
}

Deferred.resolve = function (reason) {
    return new Deferred(function (resolve) {
        resolve(reason);
    });
};

Deferred.reject = function (reason) {
    return new Deferred(function (resolve, reject) {
        reject(reason);
    });
};

Deferred.all = function (iterable) {
    return new Deferred(function (resolve, reject) {
        var promises = _.map(iterable, function (promise) {
            if (!_.isFunction(promise.then)) {
                return Deferred.resolve(promise);
            }
            else {
                return promise;
            }
        });

        var isRejected = false;
        var remaining = promises.length;
        var values = new Array(promises.length);

        _.forEach(promises, function (promise, index) {
            promise.then(function (value) {
                values[index] = value;
                remaining--;
                if (remaining <= 0) {
                    resolve(values);
                }
            }, function (reason) {
                reject(reason);
            });
        });
    });
};

Deferred.prototype.then = function (callback, errorCallback) {
    if (this._isResolved) {
        if (_.isFunction(callback)) {
            callback(this._reason);
        }
    }
    else if (this._isRejected) {
        if (_.isFunction(errorCallback)) {
            errorCallback(this._reason);
        }
    }
    else {
        if (_.isFunction(callback)) {
            this._then.push(callback);
        }
        if (_.isFunction(errorCallback)) {
            this._fail.push(errorCallback);
        }
    }

    return this;
};

Deferred.prototype.catch = function (errorCallback) {
    return this.then(undefined, errorCallback);
};

Deferred.prototype.resolve = function (reason) {
    this._complete(reason, true);
};

Deferred.prototype.reject = function (reason) {
    this._complete(reason, false);
};

Deferred.prototype._complete = function (reason, success) {
    if (this._isCompleted) {
        return;
    }

    this._isCompleted = true;
    this._isResolved = success;
    this._isRejected = !success;
    this._reason = reason;

    _.forEach(success ? this._then : this._fail, function (callback) {
        callback(reason);
    });
};

module.exports = Deferred;
