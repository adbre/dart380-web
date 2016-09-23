'use strict';

require('../TestHelper');

var MockCommunication = require('../util/MockCommunication');

describe("FMT", function() {

    beforeEach(bootstrapDart380({ modules: [
        {
            __init__: ['mockCommunication'],
            mockCommunication: ['type', MockCommunication]
        }
    ]}));

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

    function createFmt100(to, text, tnr) {
        inject(function (keyboard) {
            keyboard.trigger('FMT');
            keyboard.triggerMany('100');
            keyboard.trigger('⏎'); // FRI*TEXT
            keyboard.trigger('⏎'); // TILL:
            keyboard.trigger('ÄND');
            keyboard.triggerMany(to);
            keyboard.trigger('⏎'); // (empty)
            keyboard.trigger('⏎'); // 000000*FR:
            if (tnr) {
                keyboard.triggerMany(tnr);
            }
            keyboard.trigger('⏎'); // (empty)
            keyboard.trigger('⏎'); // FRÅN:     *U:
            keyboard.trigger('⏎'); // TEXT:
            keyboard.triggerMany(text);
            keyboard.trigger('SLT');
            keyboard.trigger('SLT');
        })();
    }

    beforeEach(inject(function (dda, time) {
        dda.setAddress('CR');
        time.setTime('154012');
        time.setDate('0922');
    }));

    it('should save written message in ISK', inject(function(keyboard, largeDisplay, smallDisplay) {
        // given
        createFmt100('RG', 'LOREM IPSUM');

        // when
        keyboard.trigger('ISK');

        // then
        expect(largeDisplay.toString()).toBe('154012*FR:CR    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should send message', inject(function(keyboard, largeDisplay, smallDisplay) {
        // given
        createFmt100('RG', 'LOREM IPSUM');

        // when
        keyboard.trigger('ISK');
        keyboard.trigger('SND');

        // then
        expect(largeDisplay.toString()).toBe('     SÄNDER     ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should show when message has been sent', inject(function(keyboard, largeDisplay, smallDisplay, mockCommunication) {
        // given
        createFmt100('RG', 'LOREM IPSUM');
        keyboard.trigger('ISK');
        keyboard.trigger('SND');

        // when
        mockCommunication.mostRecent().complete();

        // then
        expect(largeDisplay.toString()).toBe('      SÄNT      ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should exit all menus on SLT after sending', inject(function(keyboard, largeDisplay, smallDisplay, mockCommunication) {
        // given
        createFmt100('RG', 'LOREM IPSUM');
        keyboard.trigger('ISK');
        keyboard.trigger('SND');

        // when
        mockCommunication.mostRecent().complete();
        keyboard.trigger('SLT');


        // when
        expect(largeDisplay.toString()).toBe('                ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    it('should display error if in TE', inject(function(mod, keyboard, largeDisplay, smallDisplay) {
        // given
        createFmt100('RG', 'LOREM IPSUM');
        keyboard.trigger('ISK');

        // when
        mod.set(mod.TE);
        keyboard.trigger('SND');

        // then
        expect(largeDisplay.toString()).toBe('    FEL MOD     ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should display error if in KLAR', inject(function(mod, keyboard, largeDisplay, smallDisplay) {
        // given
        createFmt100('RG', 'LOREM IPSUM');
        keyboard.trigger('ISK');

        // when
        mod.set(mod.KLAR);
        keyboard.trigger('SND');

        // then
        expect(largeDisplay.toString()).toBe('    FEL MOD     ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should display error if in TD', inject(function(mod, keyboard, largeDisplay, smallDisplay) {
        // given
        createFmt100('RG', 'LOREM IPSUM');
        keyboard.trigger('ISK');

        // when
        mod.set(mod.TD);
        keyboard.trigger('SND');

        // then
        expect(largeDisplay.toString()).toBe('    FEL MOD     ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should display error if in NG', inject(function(mod, keyboard, largeDisplay, smallDisplay) {
        // given
        createFmt100('RG', 'LOREM IPSUM');
        keyboard.trigger('ISK');

        // when
        mod.set(mod.NG);
        keyboard.trigger('SND');

        // then
        expect(largeDisplay.toString()).toBe('    FEL MOD     ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should display error if in FmP', inject(function(mod, keyboard, largeDisplay, smallDisplay) {
        // given
        createFmt100('RG', 'LOREM IPSUM');
        keyboard.trigger('ISK');

        // when
        mod.set(mod.FmP);
        keyboard.trigger('SND');

        // then
        expect(largeDisplay.toString()).toBe('    FEL MOD     ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should display error if message does not contain recipent', inject(function(mod, keyboard, largeDisplay, smallDisplay) {
        // given
        createFmt100('', 'LOREM IPSUM');
        keyboard.trigger('ISK');

        // when
        keyboard.trigger('SND');

        // then
        expect(largeDisplay.toString()).toBe('   FEL HUVUD    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should display error if message does not contain timestamp', inject(function(mod, keyboard, largeDisplay, smallDisplay) {
        // given
        createFmt100('RG', 'LOREM IPSUM', '      ');
        keyboard.trigger('ISK');

        // when
        keyboard.trigger('SND');

        // then
        expect(largeDisplay.toString()).toBe('   FEL HUVUD    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should display error if message does not contain sender', inject(function(dda, keyboard, largeDisplay, smallDisplay) {
        // given
        dda.setAd('*');
        createFmt100('RG', 'LOREM IPSUM');
        keyboard.trigger('ISK');

        // when
        keyboard.trigger('SND');

        // then
        expect(largeDisplay.toString()).toBe('   FEL HUVUD    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should be possible to continue working while message is sending', inject(function(keyboard, largeDisplay, smallDisplay, mockCommunication) {
        // given
        createFmt100('RG', 'LOREM IPSUM');

        // when
        keyboard.trigger('ISK');
        keyboard.trigger('SND');
        keyboard.trigger('SLT');

        keyboard.trigger('ISK');

        // then
        expect(largeDisplay.toString()).toBe('154012*FR:CR    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should not overwrite display if user pressed SLT before message was finished sending', inject(function(keyboard, largeDisplay, smallDisplay, mockCommunication) {
        // given
        createFmt100('RG', 'LOREM IPSUM');

        // when
        keyboard.trigger('ISK');
        keyboard.trigger('SND');
        keyboard.trigger('SLT');

        keyboard.trigger('ISK');
        mockCommunication.mostRecent().complete();

        // then
        expect(largeDisplay.toString()).toBe('154012*FR:CR    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should not overwrite display if user pressed SLT before message was finished sending', inject(function(keyboard, largeDisplay, smallDisplay, mockCommunication) {
        // given
        createFmt100('RG', 'LOREM IPSUM');

        // when
        keyboard.trigger('ISK');
        keyboard.trigger('SND');
        keyboard.trigger('SLT');

        keyboard.trigger('ISK');
        mockCommunication.mostRecent().error();

        // then
        expect(largeDisplay.toString()).toBe('154012*FR:CR    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should display error if provider rejects with Mod error', inject(function(keyboard, largeDisplay, smallDisplay, communication, mockCommunication) {
        // given
        createFmt100('RG', 'LOREM IPSUM');

        // when
        keyboard.trigger('ISK');
        keyboard.trigger('SND');
        mockCommunication.mostRecent().error(communication.Error.Mod);

        // then
        expect(largeDisplay.toString()).toBe('    FEL MOD     ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should display error if provider rejects with Header error', inject(function(keyboard, largeDisplay, smallDisplay, communication, mockCommunication) {
        // given
        createFmt100('RG', 'LOREM IPSUM');

        // when
        keyboard.trigger('ISK');
        keyboard.trigger('SND');
        mockCommunication.mostRecent().error(communication.Error.Header);

        // then
        expect(largeDisplay.toString()).toBe('   FEL HUVUD    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should display error if provider rejects with Busy error', inject(function(keyboard, largeDisplay, smallDisplay, communication, mockCommunication) {
        // given
        createFmt100('RG', 'LOREM IPSUM');

        // when
        keyboard.trigger('ISK');
        keyboard.trigger('SND');
        mockCommunication.mostRecent().error(communication.Error.Busy);

        // then
        expect(largeDisplay.toString()).toBe('    UPPTAGET    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should display error if provider rejects with Memory error', inject(function(keyboard, largeDisplay, smallDisplay, communication, mockCommunication) {
        // given
        createFmt100('RG', 'LOREM IPSUM');

        // when
        keyboard.trigger('ISK');
        keyboard.trigger('SND');
        mockCommunication.mostRecent().error(communication.Error.Memory);

        // then
        expect(largeDisplay.toString()).toBe('MFULLT EJ LAGRAT');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should display error even if provider rejects with unkown error', inject(function(keyboard, largeDisplay, smallDisplay, communication, mockCommunication) {
        // given
        createFmt100('RG', 'LOREM IPSUM');

        // when
        keyboard.trigger('ISK');
        keyboard.trigger('SND');
        mockCommunication.mostRecent().error();

        // then
        expect(largeDisplay.toString()).toBe('   OKÄNT FEL    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should display error if communication is busy', inject(function(keyboard, largeDisplay, smallDisplay, mockCommunication) {
        // given
        createFmt100('RG', 'LOREM IPSUM');

        // when
        keyboard.trigger('ISK');
        keyboard.trigger('SND');
        keyboard.trigger('SLT');

        keyboard.trigger('ISK');
        keyboard.trigger('SND');

        // then
        expect(largeDisplay.toString()).toBe('    UPPTAGET    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));

    it('should remove message from ISK when sent', inject(function(keyboard, largeDisplay, smallDisplay, mockCommunication) {
        // given
        createFmt100('RG', 'LOREM IPSUM');

        // when
        keyboard.trigger('ISK');
        keyboard.trigger('SND');
        mockCommunication.mostRecent().complete();
        keyboard.trigger('SLT');

        keyboard.trigger('ISK');

        // then
        expect(largeDisplay.toString()).toBe('  (INSKRIVNA)   ');
        expect(smallDisplay.toString()).toBe('        ');
    }));

    it('should move message to AVS when sent', inject(function(keyboard, largeDisplay, smallDisplay, mockCommunication) {
        // given
        createFmt100('RG', 'LOREM IPSUM');

        // when
        keyboard.trigger('ISK');
        keyboard.trigger('SND');
        mockCommunication.mostRecent().complete();
        keyboard.trigger('SLT');

        keyboard.trigger('AVS');

        // then
        expect(largeDisplay.toString()).toBe('154012*FR:CR    ');
        expect(smallDisplay.toString()).toBe('FRI*TEXT');
    }));
});