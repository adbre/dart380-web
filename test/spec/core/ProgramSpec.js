'use strict';

require('../../TestHelper');

describe('core - Program', function () {

    beforeEach(bootstrapDart380());

    it('should clear displays when switching to FR', inject(function (switchMod, smallDisplay, largeDisplay, selfTest, program) {
        // given
        switchMod.setValue(switchMod.KLAR);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);
        jasmine.clock().tick(selfTest.DELAY);

        largeDisplay.setText('FOO');
        smallDisplay.setText('BAR');

        // when
        switchMod.setValue(switchMod.FR);

        // then
        expect(smallDisplay.getText()).toBe('');
        expect(largeDisplay.getText()).toBe('');
        expect(program.isRunning).toBe(false);
    }));
});
