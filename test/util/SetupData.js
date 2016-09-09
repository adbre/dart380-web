'use strict';

module.exports.enterNewPny = enterNewPny;

function enterNewPny(keyboard) {
    keyboard.trigger('4');
    keyboard.trigger('ÄND');
    keyboard.triggerMany("42000");
    keyboard.trigger('⏎');
    keyboard.trigger('⏎');
    keyboard.trigger('ÄND');
    keyboard.triggerMany("3040");
    keyboard.trigger('⏎');
    keyboard.triggerMany("5060");
    keyboard.trigger('⏎');
    keyboard.trigger('⏎'); // spara BD2
    keyboard.trigger('⏎'); // SYNK
    keyboard.trigger('⏎'); // PNY=###
    keyboard.trigger('ÄND');
    keyboard.triggerMany("4422");
    keyboard.trigger('⏎');
    keyboard.triggerMany("2211");
    keyboard.trigger('⏎');
    keyboard.triggerMany("3300");
    keyboard.trigger('⏎');
    keyboard.triggerMany("5511");
    keyboard.trigger('⏎');
    keyboard.triggerMany("4325");
    keyboard.trigger('⏎');
    keyboard.triggerMany("5621");
    keyboard.trigger('⏎');
    keyboard.triggerMany("3201");
    keyboard.trigger('⏎');
    keyboard.triggerMany("5104");
    keyboard.trigger('⏎');
    keyboard.trigger('SLT');
}