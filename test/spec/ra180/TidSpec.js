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

        it('should reset blinking when closing T: menu', inject(function(smallDisplay, keyboard) {
            // when
            keyboard.trigger('⏎');

            // then
            expect(smallDisplay.characters[1].blinking).toBe(false);
        }));

        describe('editing', function () {

            beforeEach(inject(function(keyboard) {
                keyboard.trigger('ÄND');
            }));

            it('should clear value', inject(function(smallDisplay) {
                // then
                expect(smallDisplay.get()).toBe('T:');
            }));

            it('should flash colon-character', inject(function(smallDisplay) {
                // then
                expect(smallDisplay.getBlinking()).toBe(1);
            }));

            it('should show cursor', inject(function(smallDisplay) {
                // then
                expect(smallDisplay.getCursor()).toBe(2);
            }));

            it('should write input', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.trigger('2');

                // then
                expect(smallDisplay.get()).toBe('T:2');
            }));

            it('should move cursor with input', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.trigger('2');

                // then
                expect(smallDisplay.getCursor()).toBe(3);
            }));

            it('should write input', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.trigger('2');

                // then
                expect(smallDisplay.get()).toBe('T:2');
            }));

            it('should stop cursor at last character', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.trigger('2');
                keyboard.trigger('1');
                keyboard.trigger('2');
                keyboard.trigger('5');
                keyboard.trigger('4');
                keyboard.trigger('7');

                // then
                expect(smallDisplay.getCursor()).toBe(7);
            }));
        });
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
            expect(smallDisplay.characters[3].blinking).toBe(true);
        }));

    });
});
