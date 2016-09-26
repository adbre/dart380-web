'use strict';

require('../../../TestHelper');

describe("EKV", function() {

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

    beforeEach(inject(function (dda, time, kda) {
        dda.setAddress('CR');
        time.setTime('120000');
        time.setDate('0101');
        kda.setActiveKey({ groups: [1111, 1111, 1111, 1111, 1111, 1111, 1111, 1111], checksum: '000' });
    }));

    it("should open EKV menu", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('EKV');

        expect(largeDisplay.toString()).toBe('(MOTT EJ KVITT) ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    describe('when receiving a message', function () {

        beforeEach(inject(function (communication) {
            communication.receive([
                'FRI*TEXT*       ',
                'TILL:CR         ',
                '                ',
                '154012*FR:RG    ',
                '                ',
                'FRÅN:     *U:   ',
                'TEXT:LOREM IPSUM',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '------SLUT------',
            ]);
        }));

        it("should show message in EKV menu", inject(function (keyboard, largeDisplay, smallDisplay) {
            // when
            keyboard.trigger('EKV');

            // then
            expect(largeDisplay.toString()).toBe('154012*FR:RG    ');
            expect(smallDisplay.toString()).toBe('FRI*TEXT');
        }));

        it("should NOT show message in MOT menu", inject(function (keyboard, largeDisplay, smallDisplay) {
            // when
            keyboard.trigger('MOT');

            // then
            expect(largeDisplay.toString()).toBe('   (MOTTAGNA)   ');
            expect(smallDisplay.toString()).toBe('        ');
        }));

    });
});