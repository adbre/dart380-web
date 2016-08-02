'use strict';

function Program(eventBus, keyboard, selfTest, smallDisplay, largeDisplay) {

    var self = this;

    eventBus.on('selfTest.done', function (e) {
        self.isRunning = e.success;
    });

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
                selfTest.start();
            }
        }
        else if (e.value <= 1) {
            selfTest.abort();
            smallDisplay.clear();
            largeDisplay.clear();
            self.isRunning = false;
        }
    });
}

Program.$inject = ['eventBus', 'keyboard', 'selfTest', 'smallDisplay', 'largeDisplay'];

module.exports = Program;
