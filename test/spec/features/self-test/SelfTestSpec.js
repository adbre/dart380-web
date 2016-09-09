'use strict';

require('../../../TestHelper');

describe('features/self-test', function () {

    beforeEach(bootstrapDart380());

    it('should start device by changing MOD switch to KLAR', inject(function (mod, smallDisplay, eventBus, selfTest) {
        mod.set(mod.KLAR);
        expect(smallDisplay.getText()).toBe('TEST');
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.getText()).toBe('TEST OK');
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.getText()).toBe('NOLLST');
        jasmine.clock().tick(selfTest.DELAY);
        expect(smallDisplay.getText()).toBe('');
    }));

    it('should NOT start self-test when changing from KLAR to SKYDD', inject(function (mod, smallDisplay, eventBus, selfTest) {
        // given
        mod.set(mod.KLAR); // TEST
        jasmine.clock().tick(selfTest.DELAY); // TEST OK
        jasmine.clock().tick(selfTest.DELAY); // NOLLST
        jasmine.clock().tick(selfTest.DELAY); // (empty)

        // when
        mod.set(mod.SKYDD);

        // then
        expect(smallDisplay.getText()).toBe('');
    }));

    it('should abort self test by changing back to FR', inject(function (mod, smallDisplay, eventBus, selfTest) {

        mod.set(mod.KLAR);
        expect(smallDisplay.getText()).toBe('TEST');
        mod.set(mod.FR);
        expect(smallDisplay.getText()).toBe('');
    }));

    it('should fire selfTest.done upon completion', inject(function (mod, smallDisplay, eventBus, selfTest) {

        var o = {
            callback: function eventCallback(e) {
                expect(e.success).toBe(true);
            }
        };

        spyOn(o, 'callback').and.callThrough();

        eventBus.once('selfTest.done', o.callback);

        // when
        mod.set(mod.KLAR); // TEST
        jasmine.clock().tick(selfTest.DELAY * 3); // TEST OK, NOLLST, (empty)

        // then
        expect(o.callback).toHaveBeenCalled();
    }));

    it('should fire selfTest.done when aborted', inject(function (mod, smallDisplay, eventBus, selfTest) {

        var o = {
            callback: function eventCallback(e) {
                expect(e.success).toBe(false);
            }
        };

        spyOn(o, 'callback').and.callThrough();

        eventBus.once('selfTest.done', o.callback);

        // when
        mod.set(mod.KLAR);
        jasmine.clock().tick(selfTest.DELAY / 2);
        mod.set(mod.FR);

        // then
        expect(o.callback).toHaveBeenCalled();
    }));
});
