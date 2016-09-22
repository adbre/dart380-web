'use strict';

require('../TestHelper');

var Message = require('../../lib/features/messages/Message');

describe("Message", function() {

    describe("rowCount", function () {

        it("should return correct count", function () {
            // given
            var message = new Message([
                'TILL:           ',
                '                ',
                '      *FR:      '
            ]);

            // then
            expect(message.rowCount()).toBe(3);
        });

    });

    describe("firstWriteableCell", function () {

        it("should return index of first writeable character", function () {
            // given
            var message = new Message([
                'TILL:           ',
                '                ',
                '      *FR:      '
            ]);

            // then
            expect(message.firstWriteableCell()).toEqual({ row: 0, col: 5 });
        });

        it("should return index of first writeable character given row", function () {
            // given
            var message = new Message([
                'TILL:           ',
                '                ',
                '      *FR:      '
            ]);

            // then
            expect(message.firstWriteableCell(1)).toEqual({ row: 1, col: 0 });
        });

    });

});