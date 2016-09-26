'use strict';

require('../../../TestHelper');

var MockCommunication = require('../../../util/MockCommunication');

describe("communication", function() {

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

    beforeEach(inject(function (dda, time, kda) {
        dda.setAddress('CR');
        time.setTime('154012');
        time.setDate('0922');
        kda.setActiveKey({ groups: [1111, 1111, 1111, 1111, 1111, 1111, 1111, 1111], checksum: '000' });
    }));

    describe('message sent', function () {
        beforeEach(inject(function (mockCommunication, keyboard) {
            createFmt100('RG', 'LOREM IPSUM');
            keyboard.trigger('ISK');
            keyboard.trigger('SND');
        }));

        it('should define .toArray() function', inject(function (mockCommunication) {
            // then
            expect(mockCommunication.mostRecent().message.toArray()).toEqual([
                'FRI*TEXT*       ',
                'TILL:RG         ',
                '                ',
                '154012*FR:CR    ',
                '                ',
                'FRÅN:     *U:   ',
                'TEXT:LOREM IPSUM',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '------SLUT------',
            ]);
        }));

        it('should define .getHeaderArray() function', inject(function (mockCommunication) {
            // then
            expect(mockCommunication.mostRecent().message.getHeaderArray()).toEqual([
                'TILL:RG         ',
                '                ',
                '154012*FR:CR    ',
                '                ',
                'FRÅN:     *U:   '
            ]);
        }));

        it('should define .getBodyArray() function', inject(function (mockCommunication) {
            // then
            expect(mockCommunication.mostRecent().message.getBodyArray()).toEqual([
                'TEXT:LOREM IPSUM',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                '
            ]);
        }));

        it('should define .toString() function', inject(function (mockCommunication) {
            // then
            expect(mockCommunication.mostRecent().message.toString().split('\n')).toEqual([
                'FRI*TEXT*       ',
                'TILL:RG         ',
                '                ',
                '154012*FR:CR    ',
                '                ',
                'FRÅN:     *U:   ',
                'TEXT:LOREM IPSUM',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '                ',
                '------SLUT------',
            ]);
        }));

        it('should define .getRecipent()', inject(function (mockCommunication) {
            // then
            expect(mockCommunication.mostRecent().message.getRecipent()).toBe('RG');
        }));

        it('should define .getTimestamp()', inject(function (mockCommunication) {
            // then
            expect(mockCommunication.mostRecent().message.getTimestamp()).toBe('154012');
        }));

        it('should define .getSender()', inject(function (mockCommunication) {
            // then
            expect(mockCommunication.mostRecent().message.getSender()).toBe('CR');
        }));

        it('should define .format.value', inject(function (mockCommunication) {
            // then
            expect(mockCommunication.mostRecent().message.format.value).toEqual('100');
        }));

        it('should define .format.nameLong', inject(function (mockCommunication) {
            // then
            expect(mockCommunication.mostRecent().message.format.nameLong).toEqual('FRI*TEXT*');
        }));

        it('should define .format.nameShort', inject(function (mockCommunication) {
            // then
            expect(mockCommunication.mostRecent().message.format.nameShort).toEqual('FRI*TEXT');
        }));
    });

    describe('message context', function () {
        beforeEach(inject(function (mockCommunication, keyboard) {
            createFmt100('RG', 'LOREM IPSUM');
            keyboard.trigger('ISK');
            keyboard.trigger('SND');
        }));

        it('should pass context to communication provider', inject(function (mockCommunication) {
            // then
            expect(mockCommunication.mostRecent().context).toMatch(/^.+$/);
        }));

        describe('channel data based', function () {

            it('should change when frequency changes', inject(function (kda, communication) {
                // given
                var notExpected = communication.getContext();

                // when
                kda.setFrequency('41234');

                // then
                expect(communication.getContext()).not.toEqual(notExpected);
            }));

            it('should change when bd1 changes', inject(function (kda, communication) {
                // given
                var notExpected = communication.getContext();

                // when
                kda.setBd1('4050');

                // then
                expect(communication.getContext()).not.toEqual(notExpected);
            }));

            it('should change when bd2 changes', inject(function (kda, communication) {
                // given
                var notExpected = communication.getContext();

                // when
                kda.setBd2('7075');

                // then
                expect(communication.getContext()).not.toEqual(notExpected);
            }));

            it('should change when active key changes', inject(function (kda, keyChecksum, communication) {
                // given
                var notExpected = communication.getContext();

                // when
                kda.setActiveKey(keyChecksum.generate());

                // then
                expect(communication.getContext()).not.toEqual(notExpected);
            }));

        });

        describe('timestamp based', function () {

            it('should change at XX15', inject(function (time, communication) {
                // given
                time.setTime('121459');
                var notExpected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).not.toEqual(notExpected);
            }));

            it('should change at XX45', inject(function (time, communication) {
                // given
                time.setTime('124459');
                var notExpected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).not.toEqual(notExpected);
            }));

            it('should NOT change at XX00', inject(function (time, communication) {
                // given
                time.setTime('125959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change at XX30', inject(function (time, communication) {
                // given
                time.setTime('122959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change context at 00:00 middle of month', inject(function (time, communication) {
                // given
                time.setDate('0115');
                time.setTime('235959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change context at 00:00 on january 1st', inject(function (time, communication) {
                // given
                time.setDate('1231');
                time.setTime('235959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change context at 00:00 on february 1st', inject(function (time, communication) {
                // given
                time.setDate('0131');
                time.setTime('235959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change context at 00:00 on march 1st', inject(function (time, communication) {
                // given
                time.setDate('0228');
                time.setTime('235959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change context at 00:00 on april 1st', inject(function (time, communication) {
                // given
                time.setDate('0331');
                time.setTime('235959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change context at 00:00 on may 1st', inject(function (time, communication) {
                // given
                time.setDate('0430');
                time.setTime('235959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change context at 00:00 on june 1st', inject(function (time, communication) {
                // given
                time.setDate('0531');
                time.setTime('235959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change context at 00:00 on july 1st', inject(function (time, communication) {
                // given
                time.setDate('0630');
                time.setTime('235959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change context at 00:00 on august 1st', inject(function (time, communication) {
                // given
                time.setDate('0731');
                time.setTime('235959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change context at 00:00 on september 1st', inject(function (time, communication) {
                // given
                time.setDate('0831');
                time.setTime('235959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change context at 00:00 on october 1st', inject(function (time, communication) {
                // given
                time.setDate('0930');
                time.setTime('235959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change context at 00:00 on november 1st', inject(function (time, communication) {
                // given
                time.setDate('1031');
                time.setTime('235959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));

            it('should NOT change context at 00:00 on december 1st', inject(function (time, communication) {
                // given
                time.setDate('1130');
                time.setTime('235959');
                var expected = communication.getContext();

                // when
                jasmine.clock().tick(1000);

                // then
                expect(communication.getContext()).toEqual(expected);
            }));
        });
    });
});