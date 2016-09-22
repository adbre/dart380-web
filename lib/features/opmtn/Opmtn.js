'use strict';

function Opmtn(eventBus, dda) {
    this._eventBus = eventBus;
    this._dda = dda;
}

module.exports = Opmtn;

Opmtn.$inject = ['eventBus', 'dda'];

Opmtn.prototype.get = function () {
    return this._dda.getOpmtn();
};

Opmtn.prototype.play = function () {
    if (this.get()) {
        this._eventBus.fire('opmtn.play', { });
    }
};
