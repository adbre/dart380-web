'use strict';

require('../../TestHelper');

describe('Tid', function () {

    beforeEach(bootstrapDart380());

    beforeEach(inject(function (switchMod, selfTest, eventBus) {
        switchMod.set(switchMod.KLAR);
        jasmine.clock().tick(selfTest.DELAY); // TEST OK
        jasmine.clock().tick(selfTest.DELAY); // NOLLST
        jasmine.clock().tick(selfTest.DELAY); // (empty)
    }));

    it('should show menu name as last item', inject(function(keyboard, smallDisplay) {

        // when
        keyboard.trigger('1');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');

        // then
        expect(smallDisplay.get()).toBe('  (TID) ');
    }));

    it('should close menu after last item', inject(function(keyboard, smallDisplay, tidMenu) {

        // when
        keyboard.trigger('1');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');

        // then
        expect(smallDisplay.get()).toBe('');
        expect(tidMenu.isOpen()).toBe(false);
    }));

    it('should close menu on SLT', inject(function(keyboard, smallDisplay, tidMenu) {

        // when
        keyboard.trigger('1');
        keyboard.trigger('SLT');

        // then
        expect(smallDisplay.get()).toBe('');
        expect(tidMenu.isOpen()).toBe(false);
    }));

    describe('T', function () {
        beforeEach(inject(function(keyboard) {
            keyboard.trigger('1');
        }));

        it('should open T: menu', inject(function(keyboard, smallDisplay) {
            // then
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should elapse grovtid as time passes', inject(function(smallDisplay) {
            // when
            jasmine.clock().tick(1000);

            // then
            expect(smallDisplay.get()).toBe('T:000001');
        }));

        it('should elapse grovtid into minutes as time passes', inject(function(smallDisplay) {
            // when
            jasmine.clock().tick(60 * 1000);

            // then
            expect(smallDisplay.get()).toBe('T:000100');
        }));

        it('should elapse grovtid into hours as time passes', inject(function(smallDisplay) {
            // when
            jasmine.clock().tick(60 * 60 * 1000);

            // then
            expect(smallDisplay.get()).toBe('T:010000');
        }));

        it('should blink the colon to indicate grovtid can be edited', inject(function(smallDisplay) {
            // then
            expect(smallDisplay.characters[1].blinking).toBe(true);
        }));
    });

    describe('DAT', function () {
        beforeEach(inject(function(keyboard) {
            keyboard.trigger('1');
            keyboard.trigger('⏎');
        }));

        it('should open DAT: menu', inject(function(keyboard, smallDisplay) {
            // then
            expect(smallDisplay.get()).toBe('DAT:0101');
        }));

        // Slow test
        xit('should elapse day', inject(function(smallDisplay) {
            // when
            jasmine.clock().tick(24 * 60 * 60 * 1000);

            // then
            expect(smallDisplay.get()).toBe('DAT:0102');
        }));

        // Slow test
        xit('should elapse month', inject(function(smallDisplay) {
            // when
            jasmine.clock().tick(31 * 24 * 60 * 60 * 1000);

            // then
            expect(smallDisplay.get()).toBe('DAT:0201');
        }));

        it('should blink the colon to indicate it can be edited', inject(function(smallDisplay) {
            // then
            expect(smallDisplay.characters[1].blinking).toBe(true);
        }));

    });
});
