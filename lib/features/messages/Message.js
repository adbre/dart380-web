'use strict';

var _ = require('lodash');
var sprintf = require('sprintf-js').sprintf;

function Message(lines)
{
    this._template = Array.prototype.slice.call(lines);
    this._message = Array.prototype.slice.call(lines);
}

module.exports = Message;

Message.prototype.rowCount = function () {
    return this._message.length;
};

Message.prototype.toString = function (row) {
    if (!_.isUndefined(row) && this._message[row]) {
        return this._message[row];
    }
    else {
        return this._message.join('\n');
    }
};

Message.prototype.writeAt = function (row, col, text) {
    while (text.length > 0 && row < this._message.length) {
        var c = text.substr(0, 1);
        text = text.substr(1);

        if (this._template[row][col] !== ' ') {
            throw new Error('given row and column is write protected');
        }

        var line = this._message[row];
        var before = line.substr(0, col);
        var after = line.substr(col + 1);
        this._message[row] = before + c + after;

        var pos = this.nextWriteableCell(row, col, 1);
        col = pos.col;
        row = pos.row;
    }

    return { row: row, col: col };
};

Message.prototype.nextWriteableCell = function (row, col, step) {
    do {
        if (col < 15) {
            col += step;
        }
        else if (row < this._template.length - 1) {
            col = 0;
            row++;
        }
        else {
            break;
        }
    } while (this._template[row][col] !== ' ');

    return { row: row, col: col };
};

Message.prototype.firstWriteableCell = function (row) {
    row = row || 0;
    return { row: row, col: this._template[row].indexOf(' ')};
};

Message.prototype.setTimestamp = function (time) {
    this.writeAt(2,0, sprintf('%02d%02d%02d', time.hour, time.minute, time.second));
};

Message.prototype.setSender = function (address) {
    this.writeAt(2,10, address === '*' ? '' : address);
};

Message.prototype.withTimestamp = function (time) {
    this.setTimestamp(time);
    return this;
};

Message.prototype.withSender = function (address) {
    this.setSender(address);
    return this;
};