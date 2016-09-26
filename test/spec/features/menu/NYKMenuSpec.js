'use strict';

require('../../../TestHelper');

describe("NYK", function() {

    beforeEach(bootstrapDart380());

    beforeEach(inject(function(mod, selfTest, eventBus) {
        var isReady = false;
        eventBus.on('ready', function () {
            isReady = true;
        });
        mod.set(mod.SKYDD);
        while (!isReady) {
            jasmine.clock().tick(1000);
        }
    }));

    it("should open NYK menu", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('7');

        expect(largeDisplay.toString()).toBe('                ');
        expect(smallDisplay.toString()).toBe('NYK=### ');
    }));

    it("should indicate PNY is available", inject(function (kda, keyChecksum, keyboard, largeDisplay, smallDisplay) {
        // given
        kda.setPny({ groups: [4422, 2211, 3300, 5511, 4325, 5621, 3201, 5104], checksum: 762 });

        // when
        keyboard.trigger('7');

        expect(largeDisplay.toString()).toBe('                ');
        expect(smallDisplay.toString()).toBe('NYK:### ');
    }));

    it("should be possible to activate PNY", inject(function (kda, keyChecksum, keyboard, largeDisplay, smallDisplay) {
        // given
        kda.setPny({ groups: [4422, 2211, 3300, 5511, 4325, 5621, 3201, 5104], checksum: 762 });

        // when
        keyboard.trigger('7');
        keyboard.trigger('ÄND');

        // then
        expect(largeDisplay.toString()).toBe('                ');
        expect(smallDisplay.toString()).toBe('NYK:762 ');
    }));

    it("should be possible to de-activate key", inject(function (kda, keyChecksum, keyboard, largeDisplay, smallDisplay) {
        // given
        kda.setPny({ groups: [4422, 2211, 3300, 5511, 4325, 5621, 3201, 5104], checksum: 762 });

        // when
        keyboard.trigger('7');
        keyboard.trigger('ÄND');
        keyboard.trigger('ÄND');

        // then
        expect(largeDisplay.toString()).toBe('                ');
        expect(smallDisplay.toString()).toBe('NYK:### ');
    }));
});