'use strict';

function Notifications(eventBus) {

    var self = this;

    if (!Notification) {
        console.warn('window.Notification is not set, notifications will be disabled.');
        return;
    }

    this._requestPermission();

    eventBus.on('communication.received', function (e) {
        if (Notification.permission === 'granted') {
            var title = e.message.toArray()[0];
            var n = new Notification(title);
        }
    });
}

module.exports = Notifications;

Notifications.$inject = ['eventBus'];

Notifications.prototype._requestPermission = function () {
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
        return;
    }

    Notification.requestPermission();
};