'use strict';

require('../TestHelper');

describe("FMT", function() {

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

    it("should not have any messages in ISK", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('ISK');

        // then
        expect(largeDisplay.toString()).toBe('  (INSKRIVNA)   ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    it("should not have any messages in AVS", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('AVS');

        // then
        expect(largeDisplay.toString()).toBe('    (SÄNDA)     ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    it("should not have any messages in EKV", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('EKV');

        // then
        expect(largeDisplay.toString()).toBe('(MOTT EJ KVITT) ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    it("should not have any messages in MOT", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('MOT');

        // then
        expect(largeDisplay.toString()).toBe('   (MOTTAGNA)   ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    it("should not have any message in F1", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('F1');

        // then
        expect(largeDisplay.toString()).toBe('   EJ LAGRAT    ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    it("should not have any message in F2", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('F2');

        // then
        expect(largeDisplay.toString()).toBe('   EJ LAGRAT    ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    it("should not have any message in F3", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('F3');

        // then
        expect(largeDisplay.toString()).toBe('   EJ LAGRAT    ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    it("should not have any message in F4", inject(function (keyboard, largeDisplay, smallDisplay) {
        // when
        keyboard.trigger('F4');

        // then
        expect(largeDisplay.toString()).toBe('   EJ LAGRAT    ');
        expect(smallDisplay.toString()).toBe('        ');
    }));
});