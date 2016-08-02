'use strict';

require('../../../TestHelper');

describe('features/displays - SelfTest', function () {

    beforeEach(bootstrapDart380());

    it('should start device by changing MOD switch to KLAR', inject(function (switchMod, smallDisplay, eventBus, selfTest) {
        switchMod.setValue(switchMod.KLAR);
        expect(smallDisplay.getText()).toBe('TEST');
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.getText()).toBe('TEST OK');
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.getText()).toBe('NOLLST');
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.getText()).toBe('');
    }));

    it('should NOT start self-test when changing from KLAR to SKYDD', inject(function (switchMod, smallDisplay, eventBus, selfTest) {
        // given
        switchMod.setValue(switchMod.KLAR); // TEST
        jasmine.clock().tick(selfTest.DELAY); // TEST OK
        jasmine.clock().tick(selfTest.DELAY); // NOLLST
        jasmine.clock().tick(selfTest.DELAY); // (empty)

        // when
        switchMod.setValue(switchMod.SKYDD);

        // then
        expect(smallDisplay.getText()).toBe('');
    }));

    it('should abort self test by changing back to FR', inject(function (switchMod, smallDisplay, eventBus, selfTest) {

        switchMod.setValue(switchMod.KLAR);
        expect(smallDisplay.getText()).toBe('TEST');
        switchMod.setValue(switchMod.FR);
        expect(smallDisplay.getText()).toBe('');
    }));

    it('should fire selfTest.done upon completion', inject(function (switchMod, smallDisplay, eventBus, selfTest) {

        var o = {
            callback: function eventCallback(e) {
                expect(e.success).toBe(true);
            }
        };

        spyOn(o, 'callback').and.callThrough();

        eventBus.once('selfTest.done', o.callback);

        // when
        switchMod.setValue(switchMod.KLAR); // TEST
        jasmine.clock().tick(selfTest.DELAY * 3); // TEST OK, NOLLST, (empty)

        // then
        expect(o.callback).toHaveBeenCalled();
    }));

    it('should fire selfTest.done when aborted', inject(function (switchMod, smallDisplay, eventBus, selfTest) {

        var o = {
            callback: function eventCallback(e) {
                expect(e.success).toBe(false);
            }
        };

        spyOn(o, 'callback').and.callThrough();

        eventBus.once('selfTest.done', o.callback);

        // when
        switchMod.setValue(switchMod.KLAR);
        jasmine.clock().tick(selfTest.DELAY / 2);
        switchMod.setValue(switchMod.FR);

        // then
        expect(o.callback).toHaveBeenCalled();
    }));
});
