'use strict';

function RemoteControl(eventBus, opmtn) {
    var self = this;
    eventBus.on('ready', function () {
        self._isConnected = true;
        eventBus.fire('remote-control.connected', {});
        opmtn.play();
    });
}

module.exports = RemoteControl;

RemoteControl.$inject = ['eventBus', 'opmtn'];

RemoteControl.prototype.isConnected = function () {
    return !!this._isConnected;
};
