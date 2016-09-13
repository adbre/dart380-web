'use strict';

require('../../TestHelper');

var enterNewPny = require('../../util/SetupData').enterNewPny;

describe('Self test', function () {

    beforeEach(bootstrapDart380());

    it("should perform self-test on KLAR", inject(function (mod, smallDisplay, selfTest) {
        mod.set(mod.KLAR);
        expect(smallDisplay.toString()).toBe("TEST    ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("TEST OK ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("NOLLST  ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should not delay change of mod observable to KLAR", inject(function (mod) {
        mod.set(mod.KLAR);
        expect(mod.get()).toBe(mod.KLAR);
    }));

    it("should not delay change of mod observable to SKYDD", inject(function (mod) {
        mod.set(mod.SKYDD);
        expect(mod.get()).toBe(mod.SKYDD);
    }));

    it("should not delay change of mod observable to DRELÄ", inject(function (mod) {
        mod.set(mod.DRELA);
        expect(mod.get()).toBe(mod.DRELA);
    }));

    it("should not open menu until self-test is complete", inject(function (mod, keyboard, smallDisplay) {
        mod.set(mod.KLAR);
        keyboard.trigger('1');
        expect(smallDisplay.toString()).not.toMatch(/^T:/);
    }));

    it("should not display NOLLST if entered KDA", inject(function (mod, smallDisplay, selfTest, keyboard) {
        mod.set(mod.SKYDD);
        jasmine.clock().tick(selfTest.DELAY * 3);
        enterNewPny(keyboard);
        mod.set(mod.FR);
        mod.set(mod.KLAR);
        expect(smallDisplay.toString()).toBe("TEST    ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("TEST OK ");
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should perform self-test after RESET", inject(function (mod, keyboard, smallDisplay, selfTest) {
        mod.set(mod.SKYDD);
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

    it("should cancel self-test from TEST when OFF", inject(function (mod, selfTest, smallDisplay) {
        mod.set(mod.KLAR);
        jasmine.clock().tick(selfTest.DELAY);
        mod.set(mod.FR);
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should cancel self-test from TEST OK when OFF", inject(function (mod, selfTest, smallDisplay) {
        mod.set(mod.KLAR);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);
        mod.set(mod.FR);
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should cancel self-test from NOLLST when OFF", inject(function (mod, selfTest, smallDisplay) {
        mod.set(mod.KLAR);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);
        mod.set(mod.FR);
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should clear display when OFF", inject(function(mod, selfTest, smallDisplay, keyboard) {
        mod.set(mod.KLAR);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);
        keyboard.trigger('4');
        mod.set(mod.FR);
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it ("should not restart self-test when switching between KLAR, SKYDD or DRELAY", inject(function (mod, selfTest, smallDisplay) {
        mod.set(mod.KLAR);
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.toString()).toBe("TEST OK ");
        mod.set(mod.SKYDD);
        expect(smallDisplay.toString()).toBe("TEST OK ");
        mod.set(mod.DRELA);
        expect(smallDisplay.toString()).toBe("TEST OK ");
    }));

    it("should not start new self-test when already ON", inject(function (mod, selfTest, smallDisplay) {
        mod.set(mod.KLAR);
        jasmine.clock().tick(selfTest.DELAY); // TEST
        jasmine.clock().tick(selfTest.DELAY); // TEST OK
        jasmine.clock().tick(selfTest.DELAY); // NOLLST
        jasmine.clock().tick(selfTest.DELAY); //

        expect(smallDisplay.toString()).toBe("        ");
        mod.set(mod.SKYDD);
        expect(smallDisplay.toString()).toBe("        ");
        mod.set(mod.KLAR);
        expect(smallDisplay.toString()).toBe("        ");
        mod.set(mod.DRELA);
        expect(smallDisplay.toString()).toBe("        ");
        mod.set(mod.KLAR);
        expect(smallDisplay.toString()).toBe("        ");
        mod.set(mod.SKYDD);
        expect(smallDisplay.toString()).toBe("        ");
        mod.set(mod.DRELA);
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should not be possible to modify brightness while OFF", inject(function (brightness, keyboard) {
        var initialValue = brightness.get();
        keyboard.trigger('BEL');
        expect(brightness.get()).toBe(initialValue);
    }));

    it("should be possible to modify brightness during self-test", inject(function (mod, brightness, keyboard) {
        var initialValue = brightness.get();
        mod.set(mod.KLAR);
        keyboard.trigger('BEL');
        expect(brightness.get()).not.toBe(initialValue);
    }));

    it("should not reset brightness", inject(function (mod, brightness, keyboard) {
        mod.set(mod.KLAR);
        keyboard.trigger('BEL');
        var expected = brightness.get();
        keyboard.trigger('RESET');
        expect(brightness.get()).toBe(expected);
    }));

    it("should be possible to cycle brightness thru 6 values", inject(function (eventBus, mod, brightness, keyboard) {
        mod.set(mod.KLAR);

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

    it("should quit submenu when reset", inject(function (mod, selfTest, keyboard, smallDisplay) {
        mod.set(mod.KLAR);
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
