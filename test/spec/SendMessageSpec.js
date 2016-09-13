'use strict';

require('../TestHelper');

describe("KDA", function() {

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

    it("should open message format selection", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');

        expect(largeDisplay.toString()).toBe('FORMAT:         ');
        expect(smallDisplay.toString()).toBe('ROT*NIVÅ');
        expect(largeDisplay.getCursor()).toBe(7);
        expect(smallDisplay.getCursor()).toBe(-1);
    }));

    // DART 380 Instruktionsbok Utdrag, sida 25
    it("Formatnummer saknas", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');
        keyboard.triggerMany('998');

        expect(largeDisplay.toString()).toBe('FORMAT:998      ');
        expect(smallDisplay.toString()).toBe('SAKNAS  ');
    }));

    // DART 380 Instruktionsbok Utdrag, sida 25
    it("Nummerval av format", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');

        expect(largeDisplay.toString()).toBe('FORMAT:         ');
        expect(smallDisplay.toString()).toBe('ROT*NIVÅ');

        keyboard.trigger('1');

        expect(largeDisplay.toString()).toBe('FORMAT:1        ');
        expect(smallDisplay.toString()).toBe('LEDNING ');

        keyboard.trigger('0');

        expect(largeDisplay.toString()).toBe('FORMAT:10       ');
        expect(smallDisplay.toString()).toBe('LEDNSBTJ');

        keyboard.trigger('3');

        expect(largeDisplay.toString()).toBe('FORMAT:103      ');
        expect(smallDisplay.toString()).toBe('FÖRBPROV');
    }));

    // DART 380 Instruktionsbok Utdrag, sida 25
    it("Söka format i formatträd", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');

        keyboard.trigger('→');

        expect(largeDisplay.toString()).toBe('FORMAT:0        ');
        expect(smallDisplay.toString()).toBe('RADIOFMT');

        keyboard.trigger('↓');

        expect(largeDisplay.toString()).toBe('FORMAT:1        ');
        expect(smallDisplay.toString()).toBe('LEDNING ');

        keyboard.trigger('→');

        expect(largeDisplay.toString()).toBe('FORMAT:10       ');
        expect(smallDisplay.toString()).toBe('LEDNSBTJ');

        keyboard.trigger('→');

        expect(largeDisplay.toString()).toBe('FORMAT:100      ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');

        keyboard.trigger('↓');

        expect(largeDisplay.toString()).toBe('FORMAT:101      ');
        expect(smallDisplay.toString()).toBe('PASS*ALT');

        keyboard.trigger('↓');

        expect(largeDisplay.toString()).toBe('FORMAT:102      ');
        expect(smallDisplay.toString()).toBe('RANY*KRY');

        keyboard.trigger('↓');

        expect(largeDisplay.toString()).toBe('FORMAT:103      ');
        expect(smallDisplay.toString()).toBe('FÖRBPROV');
    }));

    it("Söka format i formatträd (bakåt)", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');
        keyboard.triggerMany('103');

        expect(largeDisplay.toString()).toBe('FORMAT:103      ');
        expect(smallDisplay.toString()).toBe('FÖRBPROV');

        keyboard.trigger('↑');

        expect(largeDisplay.toString()).toBe('FORMAT:102      ');
        expect(smallDisplay.toString()).toBe('RANY*KRY');

        keyboard.trigger('↑');

        expect(largeDisplay.toString()).toBe('FORMAT:101      ');
        expect(smallDisplay.toString()).toBe('PASS*ALT');

        keyboard.trigger('↑');

        expect(largeDisplay.toString()).toBe('FORMAT:100      ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');

        keyboard.trigger('←');

        expect(largeDisplay.toString()).toBe('FORMAT:10       ');
        expect(smallDisplay.toString()).toBe('LEDNSBTJ');

        keyboard.trigger('←');

        expect(largeDisplay.toString()).toBe('FORMAT:1        ');
        expect(smallDisplay.toString()).toBe('LEDNING ');

        keyboard.trigger('↑');

        expect(largeDisplay.toString()).toBe('FORMAT:0        ');
        expect(smallDisplay.toString()).toBe('RADIOFMT');

        keyboard.trigger('←');

        expect(largeDisplay.toString()).toBe('FORMAT:         ');
        expect(smallDisplay.toString()).toBe('ROT*NIVÅ');
    }));

    it("should not navigate UP outside format group", inject(function (keyboard, largeDisplay, smallDisplay) {
        // given
        keyboard.trigger('FMT');
        keyboard.triggerMany('100');

        // when
        keyboard.trigger('↑');

        // then
        expect(largeDisplay.toString()).toBe('FORMAT:100      ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it("should not navigate DOWN outside format group", inject(function (keyboard, largeDisplay, smallDisplay) {
        // given
        keyboard.trigger('FMT');
        keyboard.triggerMany('209');

        // when
        keyboard.trigger('↓');

        // then
        expect(largeDisplay.toString()).toBe('FORMAT:209      ');
        expect(smallDisplay.toString()).toBe('FLBASSV2');
    }));

    it("should not navigate LEFT outside format group", inject(function (keyboard, largeDisplay, smallDisplay) {
        // given
        keyboard.trigger('FMT');
        keyboard.triggerMany('100');

        // when
        keyboard.trigger('→');

        // then
        expect(largeDisplay.toString()).toBe('FORMAT:100      ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it("should be no-op to press UP when in root format", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');
        keyboard.trigger('↑');

        expect(largeDisplay.toString()).toBe('FORMAT:         ');
        expect(smallDisplay.toString()).toBe('ROT*NIVÅ');
    }));

    it("should be no-op to press RIGHT when in root format", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');
        keyboard.trigger('←');

        expect(largeDisplay.toString()).toBe('FORMAT:         ');
        expect(smallDisplay.toString()).toBe('ROT*NIVÅ');
    }));

    it("should be no-op to press DOWN when in root format", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');
        keyboard.trigger('↓');

        expect(largeDisplay.toString()).toBe('FORMAT:         ');
        expect(smallDisplay.toString()).toBe('ROT*NIVÅ');
    }));

    it("should enter message", inject(function (keyboard, largeDisplay, smallDisplay) {
        keyboard.trigger('FMT');
        keyboard.triggerMany('100');

        expect(largeDisplay.toString()).toBe('FORMAT:100      ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('FRI*TEXT*       ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('TILL:           ');

        keyboard.trigger('ÄND');

        expect(largeDisplay.toString()).toBe('TILL:           ');
        expect(largeDisplay.getCursor()).toBe(5);

        keyboard.triggerMany('VN,VK,ZF');

        expect(largeDisplay.toString()).toBe('TILL:VN,VK,ZF   ');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('                ');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('000000*FR:      ');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('                ');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('FRÅN:     *U:   ');

        keyboard.trigger('⏎');

        expect(largeDisplay.toString()).toBe('TEXT:           ');

        keyboard.triggerMany('LOREM IPSUM');

        expect(largeDisplay.toString()).toBe('TEXT:LOREM IPSUM');

        keyboard.trigger('SLT');

        expect(largeDisplay.toString()).toBe('TEXT:LOREM IPSUM');
        expect(largeDisplay.getCursor()).toBe(-1);

        keyboard.trigger('SLT');

        expect(largeDisplay.toString()).toBe('                ');
        expect(smallDisplay.toString()).toBe('        ');
    }));
});