'use strict';

require('../TestHelper');

describe('Dart380', function () {

    beforeEach(bootstrapDart380());

    describe('eventbus module', function () {
        it('should invoke registered event callbacks', inject(function (eventBus) {
            // given
            var eventCallback = jasmine.createSpy('eventCallback');
            var eventObject = {name: 'event object'};

            // when
            eventBus.on('foo', eventCallback);
            eventBus.fire('foo', eventObject);

            // then
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.calls.mostRecent().args[1]).toBe(eventObject);
        }));
    });

    describe('basic controls', function () {

        it('should start with channel 1', inject(function (switchChannel) {
            expect(switchChannel.getValue()).toBe(1);
        }));

        it('should start with mod FR', inject(function (switchMod) {
            expect(switchMod.getValue()).toBe(1);
            expect(switchMod.getValue()).toBe(switchMod.FR);
        }));

        it('should start with volume 4', inject(function (switchVolume) {
            expect(switchVolume.getValue()).toBe(4);
        }));

        it('should fire event when changing volume', inject(function (switchVolume, eventBus) {
            // given
            var eventCallback = jasmine.createSpy('eventCallback');
            eventBus.on('switchVolume.changed', eventCallback);

            // when
            switchVolume.setValue(switchVolume.getValue()+1);

            // then
            expect(eventCallback).toHaveBeenCalled();
        }));

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

    });
});
