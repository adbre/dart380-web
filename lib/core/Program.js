'use strict';

function Program(eventBus, keyboard, selfTest, memory) {

    var self = this;

    this._eventBus = eventBus;
    this._keyboard = keyboard;
    this._selfTest = selfTest;

    function off() {
        if (self._testRoutine) {
            self._testRoutine.stop();
        }
        else {
            selfTest.abort();
        }
        self.isRunning = false;
        self.isOn = false;
        eventBus.fire('off', {});
    }

    function on() {
        self.isOn = true;
        eventBus.fire('on', {});

        if (keyboard.isDown('T')) {
            self._testRoutine = selfTest.startRoutine(3);
        }
        else {
            eventBus.once('selfTest.done', function (e) {
                self.isRunning = e.success;
                eventBus.fire('ready', {});
            });

            selfTest.start();
        }
    }

    eventBus.on('keyboard.keyPress', function (e) {
        if (e.key === 'RESET' && self.isOn) {
            off();
            memory.clear();
            on();
        }
    });

    eventBus.on('mod.changed', function (e) {
        if (e.value > 1) {
            if (!self.isRunning) {
                on();
            }
        }
        else if (e.value <= 1) {
            off();
        }
    });
}

Program.$inject = ['eventBus', 'keyboard', 'selfTest', 'memory'];

module.exports = Program;