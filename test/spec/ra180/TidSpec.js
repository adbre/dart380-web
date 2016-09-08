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

            it('should cancel edit on SLT', inject(function(smallDisplay, keyboard) {
                // when
                keyboard.triggerMany('235959');
                keyboard.trigger('SLT');

                // then
                expect(smallDisplay.get()).toBe('T:000000');
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

        it('should blink the colon to indicate it can be edited', inject(function(smallDisplay) {
            // then
            expect(smallDisplay.characters[3].blinking).toBe(true);
        }));
    });

    describe('time and date boundaries', function () {

        it('should be 1000 milliseconds per second', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            jasmine.clock().tick(999);
            expect(smallDisplay.get()).toBe('T:000000');
            jasmine.clock().tick(1);
            expect(smallDisplay.get()).toBe('T:000001');
        }));

        it('should be 59 seconds per minute', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('000059');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('T:000100');
        }));

        it('should be 59 minutes per hour', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('005959');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('T:010000');
        }));

        it('should have 24 hours per day', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0102');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in January', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0131');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0201');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 28 days in February', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0228');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0301');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in March', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0331');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0401');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 30 days in April', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0430');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0501');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in May', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0531');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0601');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 30 days in June', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0630');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0701');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in July', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0731');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0801');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in August', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0831');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0901');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 30 days in September', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('0930');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:1001');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in October', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('1031');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:1101');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 30 days in November', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('1130');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:1201');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));

        it('should have 31 days in December', inject(function(keyboard, smallDisplay) {
            keyboard.trigger('1');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('235959');
            keyboard.trigger('⏎');
            keyboard.trigger('⏎');
            keyboard.trigger('ÄND');
            keyboard.triggerMany('1231');
            keyboard.trigger('⏎');
            jasmine.clock().tick(1000);
            expect(smallDisplay.get()).toBe('DAT:0101');
            keyboard.trigger('SLT');
            keyboard.trigger('1');
            expect(smallDisplay.get()).toBe('T:000000');
        }));
    });
});
