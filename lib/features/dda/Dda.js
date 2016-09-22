'use strict';

function Dda(eventBus, memory) {
    this._eventBus = eventBus;
    this._memory = memory;

    this._default = {
        ad: '*',
        skr: 'MAN',
        opmtn: true,
        sum: true,
        tkl: true
    };

    this.SKR = [
        'MAN',
        'MOT',
        'ALLA',
        'AVS'
    ];
}

module.exports = Dda;

Dda.$inject = ['eventBus', 'memory'];

Dda.prototype.get = function () {
    return this._memory.get('dda') || _.assign({}, this._default);
};

Dda.prototype.getAd = function () {
    return this.get().ad;
};

Dda.prototype.getSkr = function () {
    return this.get().skr;
};

Dda.prototype.getOpmtn = function () {
    return this.get().opmtn;
};

Dda.prototype.getSum = function () {
    return this.get().sum;
};

Dda.prototype.getTkl = function () {
    return this.get().tkl;
};

Dda.prototype.setAd = function (value) {
    if (!_.isString(value)) {
        throw new Error('value must be a string');
    }
    if (value.length < 1) {
        throw new Error('value must not be empty');
    }
    this.set(_.assign(this.get(), { ad: value }));
};

Dda.prototype.setSkr = function (value) {
    if (_.indexOf(this.SKR, value) < 0) {
        throw new Error(value + ' is not an enumeration of Dda.SKR');
    }

    this.set(_.assign(this.get(), { skr: value }));
};

Dda.prototype.setOpmtn = function (value) {
    this.set(_.assign(this.get(), { opmtn: !!value }));
};

Dda.prototype.setSum = function (value) {
    this.set(_.assign(this.get(), { sum: !!value }));
};

Dda.prototype.setTkl = function (value) {
    this.set(_.assign(this.get(), { tkl: !!value }));
};

Dda.prototype.set = function (value) {
    this._memory.set('dda', _.assign({}, this._default, value));
    this._eventBus.fire('dda.changed', { dda: this });
};
