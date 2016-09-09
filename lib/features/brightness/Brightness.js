'use strict';

function Brightness(eventBus) {

    this._eventBus = eventBus;

    var self = this;
    self._value = 0;

    eventBus.on('on', function () {
        self._isOn = true;
    });

    eventBus.off('off', function () {
        self._isOn = false;
    });

    eventBus.on('keyboard.keyPress', function (e) {
        if (self._isOn && e.key === 'BEL') {
            self._value++;
            if (self._value > 5) {
                self._value = 0;
            }

            eventBus.fire('brightness.changed', { value: self._value });
        }
    });
}

module.exports = Brightness;

Brightness.$inject = ['eventBus'];

Brightness.prototype.get = function () {
    return this._value;
};

