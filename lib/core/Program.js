'use strict';

function Program(eventBus, keyboard, selfTest, smallDisplay, largeDisplay) {

    var self = this;

    this._eventBus = eventBus;
    this._keyboard = keyboard;
    this._selfTest = selfTest;
    this._smallDisplay = smallDisplay;
    this._largeDisplay = largeDisplay;

    function off() {
        selfTest.abort();
        self.isRunning = false;
        self.isOn = false;
        eventBus.fire('off', {});
    }

    function on() {
        eventBus.once('selfTest.done', function (e) {
            self.isRunning = e.success;
            eventBus.fire('ready', {});
        });

        self.isOn = true;
        eventBus.fire('on', {});

        selfTest.start();
    }

    eventBus.on('keyboard.keyPress', function (e) {
        if (e.key === 'RESET' && self.isOn) {
            off();
            on();
        }
    });

    eventBus.on('mod.changed', function (e) {
        if (e.value > 1) {

            // De-activation of unsupported mods (have not been implemented)
            if (e.value !== 3 && e.value !== 4) { // != KLAR && != SKYDD
                return;
            }

            if (!self.isRunning) {
                on();
            }
        }
        else if (e.value <= 1) {
            off();
        }
    });
}

Program.$inject = ['eventBus', 'keyboard', 'selfTest', 'smallDisplay', 'largeDisplay'];

module.exports = Program;