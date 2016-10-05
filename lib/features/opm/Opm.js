'use strict';

function Opm(eventBus, dda, memory) {
    this._eventBus = eventBus;
    this._dda = dda;
    this._memory = memory;
}

module.exports = Opm;

Opm.$inject = ['eventBus', 'dda', 'memory'];

Opm.prototype.getMessages = function () {
    return this._memory.get('opm.messages') || [];
};

Opm.prototype.addMessage = function (message) {
    var messages = this.getMessages();
    messages.unshift(message);
    this._memory.set('opm.messages', messages);
    this._eventBus.fire('opm.message', { message: message });

    if (this._dda.getOpmtn()) {
        this._eventBus.fire('opm.opmtn.play', { });
    }
};
