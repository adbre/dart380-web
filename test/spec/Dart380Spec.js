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

        it('should start with channel 1', inject(function (channel) {
            expect(channel.get()).toBe(1);
        }));

        it('should start with mod FR', inject(function (mod) {
            expect(mod.get()).toBe(1);
            expect(mod.get()).toBe(mod.FR);
        }));

        it('should start with volume 4', inject(function (volume) {
            expect(volume.get()).toBe(4);
        }));

        it('should fire event when changing volume', inject(function (volume, eventBus) {
            // given
            var eventCallback = jasmine.createSpy('eventCallback');
            eventBus.on('volume.changed', eventCallback);

            // when
            volume.set(volume.get()+1);

            // then
            expect(eventCallback).toHaveBeenCalled();
        }));

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

    });
});
