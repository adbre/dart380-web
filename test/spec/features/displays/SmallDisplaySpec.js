'use strict';

require('../../../TestHelper');

describe('features/displays - SmallDisplay', function () {

    beforeEach(bootstrapDart380());

    it('should fire smallDisplay.changed when cleared', inject(function (smallDisplay, eventBus) {
        // given
        var eventCallback = jasmine.createSpy('eventCallback');
        eventBus.on('smallDisplay.changed', eventCallback);
        smallDisplay.setText('NONEMPTY');

        // when
        smallDisplay.clear();

        // then
        expect(eventCallback).toHaveBeenCalled();
    }));

    it('should fire smallDisplay.changed when text changed', inject(function (smallDisplay, eventBus) {
        // given
        var eventCallback = jasmine.createSpy('eventCallback');
        eventBus.on('smallDisplay.changed', eventCallback);

        // when
        smallDisplay.setText('FOO');

        // then
        expect(eventCallback).toHaveBeenCalled();
    }));

    it('should fire NOT smallDisplay.changed when setText was a noop', inject(function (smallDisplay, eventBus) {
        // given
        var eventCallback = jasmine.createSpy('eventCallback');
        eventBus.on('smallDisplay.changed', eventCallback);
        smallDisplay.setText('FOO');
        eventCallback.calls.reset();

        // when
        smallDisplay.setText('FOO');

        // then
        expect(eventCallback).not.toHaveBeenCalled();
    }));
});
