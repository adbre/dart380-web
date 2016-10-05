'use strict';

require('../../../TestHelper');

var MockCommunication = require('../../../util/MockCommunication');

describe("opm", function() {

    beforeEach(bootstrapDart380({ modules: [ MockCommunication.module ]}));

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

    it('should indicate connection to Ra180 on ready', inject(function (keyboard, smallDisplay) {
        keyboard.trigger('OPM');
        expect(smallDisplay.toString()).toBe('ST=FTR  ');
        keyboard.trigger('OPM');
        expect(smallDisplay.toString()).toBe('FJR FTR ');
        keyboard.trigger('OPM');
        expect(smallDisplay.toString()).toBe('ANSL FTR');
        keyboard.trigger('OPM');
        expect(smallDisplay.toString()).toBe('  (OPM) ');
        keyboard.trigger('OPM');
        expect(smallDisplay.toString()).toBe('        ');
    }));
});