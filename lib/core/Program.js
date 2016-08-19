'use strict';

function Program(eventBus, keyboard, selfTest, smallDisplay, largeDisplay, time) {

    var self = this;

    this._eventBus = eventBus;
    this._keyboard = keyboard;
    this._selfTest = selfTest;
    this._smallDisplay = smallDisplay;
    this._largeDisplay = largeDisplay;
    this._time = time;

    eventBus.on('switchMod.changed', function (e) {
        if (e.value > 1) {

            // De-activation of unsupported mods (have not been implemented)
            if (e.value !== 3 && e.value !== 4) { // != KLAR && != SKYDD
                selfTest.abort();
                smallDisplay.clear();
                largeDisplay.setText('FEL MOD');
                return;
            }

            if (!self.isRunning) {
                eventBus.once('selfTest.done', function (e) {
                    self.isRunning = e.success;
                    eventBus.fire('ready', {});
                });
                selfTest.start();
            }
        }
        else if (e.value <= 1) {
            selfTest.abort();
            smallDisplay.clear();
            largeDisplay.clear();
            self.isRunning = false;
            eventBus.fire('shutdown', {});
        }
    });
}

Program.$inject = ['eventBus', 'keyboard', 'selfTest', 'smallDisplay', 'largeDisplay', 'time'];

module.exports = Program;