'use strict';

require('../../TestHelper');

var enterNewPny = require('../../util/SetupData').enterNewPny;

describe('Self test', function () {

    beforeEach(bootstrapDart380());

    it("should perform self-test on KLAR", inject(function (switchMod, smallDisplay, selfTest) {
        switchMod.set(switchMod.KLAR);
        expect(smallDisplay.toString()).toBe("TEST    ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("TEST OK ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("NOLLST  ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should not delay change of mod observable to KLAR", inject(function (switchMod) {
        switchMod.set(switchMod.KLAR);
        expect(switchMod.get()).toBe(switchMod.KLAR);
    }));

    it("should not delay change of mod observable to SKYDD", inject(function (switchMod) {
        switchMod.set(switchMod.SKYDD);
        expect(switchMod.get()).toBe(switchMod.SKYDD);
    }));

    it("should not delay change of mod observable to DRELÄ", inject(function (switchMod) {
        switchMod.set(switchMod.DRELA);
        expect(switchMod.get()).toBe(switchMod.DRELA);
    }));

    it("should not open menu until self-test is complete", inject(function (switchMod, keyboard, smallDisplay) {
        switchMod.set(switchMod.KLAR);
        keyboard.trigger('1');
        expect(smallDisplay.toString()).not.toMatch(/^T:/);
    }));

    xit("should not display NOLLST if entered KDA", inject(function (switchMod, smallDisplay, selfTest, keyboard) {
        switchMod.set(switchMod.SKYDD);
        jasmine.clock().tick(selfTest.DELAY * 3);
        enterNewPny(keyboard);
        switchMod.set(switchMod.FR);
        switchMod.set(switchMod.KLAR);
        expect(smallDisplay.toString()).toBe("TEST    ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("TEST OK ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should perform self-test after RESET", inject(function (switchMod, keyboard, smallDisplay, selfTest) {
        switchMod.set(switchMod.SKYDD);
        jasmine.clock().tick(selfTest.DELAY * 3);
        enterNewPny(keyboard);
        keyboard.trigger('RESET');
        expect(smallDisplay.toString()).toBe("TEST    ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("TEST OK ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("NOLLST  ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should cancel self-test from TEST when OFF", inject(function (switchMod, selfTest, smallDisplay) {
        switchMod.set(switchMod.KLAR);
        jasmine.clock().tick(selfTest.DELAY);
        switchMod.set(switchMod.FR);
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should cancel self-test from TEST OK when OFF", inject(function (switchMod, selfTest, smallDisplay) {
        switchMod.set(switchMod.KLAR);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);
        switchMod.set(switchMod.FR);
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should cancel self-test from NOLLST when OFF", inject(function (switchMod, selfTest, smallDisplay) {
        switchMod.set(switchMod.KLAR);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);
        switchMod.set(switchMod.FR);
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should clear display when OFF", inject(function(switchMod, selfTest, smallDisplay, keyboard) {
        switchMod.set(switchMod.KLAR);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);
        keyboard.trigger('4');
        switchMod.set(switchMod.FR);
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it ("should not restart self-test when switching between KLAR, SKYDD or DRELAY", inject(function (switchMod, selfTest, smallDisplay) {
        switchMod.set(switchMod.KLAR);
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("TEST OK ");
        switchMod.set(switchMod.SKYDD);
        expect(smallDisplay.toString()).toBe("TEST OK ");
        switchMod.set(switchMod.DRELA);
        expect(smallDisplay.toString()).toBe("TEST OK ");
    }));

    it("should not start new self-test when already ON", inject(function (switchMod, selfTest, smallDisplay) {
        switchMod.set(switchMod.KLAR);
        jasmine.clock().tick(selfTest.DELAY); // TEST
        jasmine.clock().tick(selfTest.DELAY); // TEST OK
        jasmine.clock().tick(selfTest.DELAY); // NOLLST
        jasmine.clock().tick(selfTest.DELAY); //

        expect(smallDisplay.toString()).toBe("        ");
        switchMod.set(switchMod.SKYDD);
        expect(smallDisplay.toString()).toBe("        ");
        switchMod.set(switchMod.KLAR);
        expect(smallDisplay.toString()).toBe("        ");
        switchMod.set(switchMod.DRELA);
        expect(smallDisplay.toString()).toBe("        ");
        switchMod.set(switchMod.KLAR);
        expect(smallDisplay.toString()).toBe("        ");
        switchMod.set(switchMod.SKYDD);
        expect(smallDisplay.toString()).toBe("        ");
        switchMod.set(switchMod.DRELA);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should not be possible to modify brightness while OFF", inject(function (brightness, keyboard) {
        var initialValue = brightness.get();
        keyboard.trigger('BEL');
        expect(brightness.get()).toBe(initialValue);
    }));

    it("should be possible to modify brightness during self-test", inject(function (switchMod, brightness, keyboard) {
        var initialValue = brightness.get();
        switchMod.set(switchMod.KLAR);
        keyboard.trigger('BEL');
        expect(brightness.get()).not.toBe(initialValue);
    }));

    it("should not reset brightness", inject(function (switchMod, brightness, keyboard) {
        switchMod.set(switchMod.KLAR);
        keyboard.trigger('BEL');
        var expected = brightness.get();
        keyboard.trigger('RESET');
        expect(brightness.get()).toBe(expected);
    }));

    it("should be possible to cycle brightness thru 6 values", inject(function (eventBus, switchMod, brightness, keyboard) {
        switchMod.set(switchMod.KLAR);

        var values = [];
        eventBus.on('brightness.changed', function () {
            var value = brightness.get();
            if (values.indexOf(value) === -1) {
                values.push(value);
            }
        });

        for (var i = 0; i < 7; i++) {
            keyboard.trigger('BEL');
        }

        expect(values.length).toBe(6);
    }));

    it("should quit submenu when reset", inject(function (switchMod, selfTest, keyboard, smallDisplay) {
        switchMod.set(switchMod.KLAR);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);
        keyboard.trigger('1');
        expect(smallDisplay.toString()).toMatch(/^T\:[0-9]{6}$/);
        keyboard.trigger('RESET');
        expect(smallDisplay.toString()).toBe("TEST    ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("TEST OK ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("NOLLST  ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));
});
