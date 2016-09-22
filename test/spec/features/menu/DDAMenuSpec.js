'use strict';

require('../../../TestHelper');

describe("DDA", function() {

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

    it("should open DDA menu", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('DDA');

        expect(largeDisplay.toString()).toBe('                ');
        expect(smallDisplay.toString()).toBe('AD:*    ');
    }));

    it("should allow AD to be edited", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('DDA');
        keyboard.trigger('ÄND');
        keyboard.triggerMany('VJ');
        keyboard.trigger('⏎');
        keyboard.trigger('SLT');
        keyboard.trigger('DDA');

        expect(largeDisplay.toString()).toBe('                ');
        expect(smallDisplay.toString()).toBe('AD:VJ   ');
    }));

    it("should allow SKR to be cycled", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('DDA');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe('SKR:MAN ');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('SKR:MOT ');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('SKR:ALLA');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('SKR:AVS ');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('SKR:MAN ');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('SKR:MOT ');
        keyboard.trigger('SLT');
        keyboard.trigger('DDA');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe('SKR:MOT ');
    }));

    it("should allow OPMTN to be toggled", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('DDA');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe('OPMTN:PÅ');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('OPMTN:AV');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('OPMTN:PÅ');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('OPMTN:AV');
        keyboard.trigger('SLT');
        keyboard.trigger('DDA');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe('OPMTN:AV');
    }));

    it("should allow SUM to be toggled", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('DDA');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe('SUM:TILL');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('SUM:FRÅN');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('SUM:TILL');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('SUM:FRÅN');
        keyboard.trigger('SLT');
        keyboard.trigger('DDA');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe('SUM:FRÅN');
    }));

    it("should allow TKL to be toggled", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('DDA');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe('TKL:TILL');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('TKL:FRÅN');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('TKL:TILL');
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe('TKL:FRÅN');
        keyboard.trigger('SLT');
        keyboard.trigger('DDA');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe('TKL:FRÅN');
    }));

    it("should show battery level", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('DDA');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe('BAT=12.1');
    }));
});