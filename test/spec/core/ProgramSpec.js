'use strict';

require('../../TestHelper');

describe('core - Program', function () {

    beforeEach(bootstrapDart380());

    it('should clear displays when switching to FR', inject(function (mod, smallDisplay, largeDisplay, selfTest, program) {
        // given
        mod.set(mod.KLAR);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);

        largeDisplay.setText('FOO');
        smallDisplay.setText('BAR');

        // when
        mod.set(mod.FR);

        // then
        expect(smallDisplay.getText()).toBe('');
        expect(largeDisplay.getText()).toBe('');
        expect(program.isRunning).toBe(false);
    }));
});
