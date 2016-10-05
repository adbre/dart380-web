'use strict';

function RemoteControl(eventBus, opm) {
    var self = this;
    eventBus.on('ready', function () {
        self._isConnected = true;
        eventBus.fire('remote-control.connected', {});
        opm.addMessage('ANSL FTR');
        opm.addMessage('FJR FTR');
        opm.addMessage('ST=FTR');
    });
}

module.exports = RemoteControl;

RemoteControl.$inject = ['eventBus', 'opm'];

RemoteControl.prototype.isConnected = function () {
    return !!this._isConnected;
};
