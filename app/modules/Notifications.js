'use strict';

var notification = window.Notification;

function Notifications(eventBus) {

    var self = this;

    if (!notification) {
        console.warn('window.Notification is not set, notifications will be disabled.');
        return;
    }

    this._requestPermission();

    eventBus.on('communication.received', function (e) {
        if (notification.permission === 'granted') {
            var title = e.message.toArray()[0];
            var n = new notification(title);
        }
    });
}

module.exports = Notifications;

Notifications.$inject = ['eventBus'];

Notifications.prototype._requestPermission = function () {
    if (notification.permission === 'granted' || notification.permission === 'denied') {
        return;
    }

    notification.requestPermission();
};