'use strict';

var _ = require('lodash');

function Kda(eventBus, memory, channel) {
    this._eventBus = eventBus;
    this._memory = memory;
    this._channel = channel;

    this._default = [
        new Channel(30025),
        new Channel(40025),
        new Channel(50025),
        new Channel(60025),
        new Channel(70025),
        new Channel(80025),
        new Channel(87975),
        new Channel(42025),
    ];
}

module.exports = Kda;

Kda.$inject = ['eventBus', 'memory', 'channel'];

Kda.prototype.getCurrentChannel = function () {
    return this._get()[this._channel.get() - 1];
};

Kda.prototype.setCurrentChannel = function (channel) {
    var data = this._get();
    data[this._channel.get() - 1] = channel;
    this._set(data);
};

Kda.prototype.getFrequency = function () {
    return this.getCurrentChannel().fr;
};

Kda.prototype.getBd1 = function () {
    return this.getCurrentChannel().bd1;
};

Kda.prototype.getBd2 = function () {
    return this.getCurrentChannel().bd2;
};

Kda.prototype.getDisableKlar = function () {
    return this.getCurrentChannel().disableKlar;
};

Kda.prototype.getSynk = function () {
    return this.getCurrentChannel().synk;
};

Kda.prototype.getPassiveKey = function () {
    return this.getCurrentChannel().passiveKey;
};

Kda.prototype.getActiveKey = function () {
    return this.getCurrentChannel().activeKey;
};

Kda.prototype.setFrequency = function (value) {
    var MHz = parseInt(value) / 1000;
    if (MHz < 30 || MHz > 87.975 ) {
        return false;
    }

    this.setCurrentChannel(_.assign(this.getCurrentChannel(), { fr: value }));
    return true;
};

Kda.prototype.setBd1 = function (value) {
    this.setCurrentChannel(_.assign(this.getCurrentChannel(), { bd1: value }));
};

Kda.prototype.setBd2 = function (value) {
    this.setCurrentChannel(_.assign(this.getCurrentChannel(), { bd2: value }));
};

Kda.prototype.setDisableKlar = function (value) {
    this.setCurrentChannel(_.assign(this.getCurrentChannel(), { disableKlar: value }));
};

Kda.prototype.setSynk = function (value) {
    this.setCurrentChannel(_.assign(this.getCurrentChannel(), { synk: value }));
};

Kda.prototype.setPassiveKey = function (value) {
    this.setCurrentChannel(_.assign(this.getCurrentChannel(), { passiveKey: value }));
};

Kda.prototype.setActiveKey = function (value) {
    this.setCurrentChannel(_.assign(this.getCurrentChannel(), { activeKey: value }));
};

Kda.prototype.setPny = Kda.prototype.setPassiveKey;

Kda.prototype._get = function () {
    return this._memory.get('kda') || _.assign({}, this._default);
};

Kda.prototype._set = function (value) {
    this._memory.set('kda', _.assign({}, this._default, value));
    this._eventBus.fire('kda.changed', { kda: this });
};

function Channel(frequency) {
    this.fr = frequency;
    this.bd1 = '9000';
    this.bd2 = '0000';
    this.disableKlar = false;
    this.synk = false;
    this.passiveKey = null;
    this.activeKey = null;
}
