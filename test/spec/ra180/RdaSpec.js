'use strict';

require('../../TestHelper');

describe("RDA", function() {

    beforeEach(bootstrapDart380());

    beforeEach(inject(function(mod, selfTest, eventBus) {
        var isReady = false;
        eventBus.on('ready', function () {
            isReady = true;
        });
        mod.set(mod.KLAR);
        while (!isReady) {
            jasmine.clock().tick(1000);
        }
    }));

    it("should navigate RDA", inject(function(keyboard, smallDisplay) {
        keyboard.trigger('2');
        expect(smallDisplay.toString()).toBe("SDX=NEJ ");
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("OPMTN=JA");
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("BAT=12.5");
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("  (RDA) ");
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should return to main menu from RDA on SLT", inject(function(smallDisplay, keyboard) {
        keyboard.trigger('2');
        expect(smallDisplay.toString()).toBe("SDX=NEJ ");
        keyboard.trigger('SLT');
        expect(smallDisplay.toString()).toBe("        ");

        keyboard.trigger('2');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("OPMTN=JA");
        keyboard.trigger('SLT');
        expect(smallDisplay.toString()).toBe("        ");

        keyboard.trigger('2');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("BAT=12.5");
        keyboard.trigger('SLT');
        expect(smallDisplay.toString()).toBe("        ");

        keyboard.trigger('2');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("  (RDA) ");
        keyboard.trigger('SLT');
        expect(smallDisplay.toString()).toBe("        ");
    }));
});