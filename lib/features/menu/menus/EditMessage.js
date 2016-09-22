'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var MenuBase = require('./../MenuBase');

function EditMessage(injector, eventBus, menu, largeDisplay, smallDisplay, messages, time, dda, communication) {
    injector.invoke(MenuBase, this);

    this._menu = menu;
    this._eventBus = eventBus;
    this._largeDisplay = largeDisplay;
    this._smallDisplay = smallDisplay;
    this._messages = messages;
    this._time = time;
    this._dda = dda;
    this._communication = communication;
}

inherits(EditMessage, MenuBase);

module.exports = EditMessage;

EditMessage.$inject = [
    'injector',
    'eventBus',
    'menu',
    'largeDisplay',
    'smallDisplay',
    'messages',
    'time',
    'dda',
    'communication'
];

EditMessage.prototype.openMessage = function (messageFormat) {
    this._messageFormat = messageFormat;
    this._menu.openChild(this);
};

EditMessage.prototype.open = function () {
    MenuBase.prototype.open.apply(this, arguments);

    this._largeDisplay.clear();
    this._smallDisplay.clear();

    this._template = this._messageFormat.getLines();
    this._message = [].concat(this._template);
    this._row = -1;

    var time = this._time.get();
    var address = this._dda.getAd();
    this.writeAt(2,0, sprintf('%02d%02d%02d', time.hour, time.minute, time.second));
    this.writeAt(2,10, address === '*' ? '' : address);
    this.update();
};

EditMessage.prototype.write = function (text) {
    var col = this._largeDisplay.getCursor();
    var pos = this.writeAt(this._row, col, text);
    this._largeDisplay.setCursor(pos.col);
    this._row = pos.row;
};

EditMessage.prototype.writeAt = function (row, col, text) {
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

        var pos = this._nextWriteableCell(row, col, 1);
        col = pos.col;
        row = pos.row;
    }

    return { row: row, col: col };
};

EditMessage.prototype._nextWriteableCell = function (row, col, step) {
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

EditMessage.prototype.startEdit = function () {
    this._isEditing = true;
    var cursor = this._message[this._row].indexOf(' ');
    this._largeDisplay.setCursor(cursor);
    this.update();
};

EditMessage.prototype.endEdit = function () {
    this._isEditing = false;
    this._largeDisplay.noCursor();
    this.update();
};

EditMessage.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    if (e.key === 'SLT') {
        if (this._isEditing) {
            this.endEdit();
        }
        else {
            this._largeDisplay.clear();
            this._smallDisplay.clear();

            this.close();
        }
        return true;
    }
    else if (e.key === 'SND') {
        this._largeDisplay.clear();
        this._smallDisplay.clear();

        this._largeDisplay.set('SÄNDER');
        var self = this;
        this._communication.send(this._message)
            .then(function () {
                self._largeDisplay.set('SÄNT');
            })
            .catch(function () {
                self._largeDisplay.set('UPPTAGET');
            });

    }
    else if (e.key == '⏎') {
        this._row = Math.min(this._message.length, this._row+1);
        if (this._row === this._message.length) {
            this.endEdit();
        }
        else if (this._isEditing) {
            var cursor = this._template[this._row].indexOf(' ');
            this._largeDisplay.setCursor(cursor);
        }
        this.update();
        return true;
    }
    else if (e.key === 'ÄND' && this._row >= 0) {
        this.startEdit();
        return true;
    }
    else if (e.key === '△') {

    }
    else if (e.key === '▽') {

    }
    else if (e.key === '→') {
        var pos = this._nextWriteableCell(this._row, this._largeDisplay.getCursor(), 1);
        this._row = pos.row;
        this._largeDisplay.setCursor(pos.col);
        this.update();
        return true;
    }
    else if (e.key === '←') {
        var pos = this._nextWriteableCell(this._row, this._largeDisplay.getCursor(), -1);
        this._row = pos.row;
        this._largeDisplay.setCursor(pos.col);
        this.update();
        return true;
    }
    else if (e.key === '↑') {
        this._row = Math.max(0, this._row - 1);
        this.update();
        return true;
    }
    else if (e.key === '↓') {
        this._row = Math.min(this._message.length, this._row + 1);
        this.update();
        return true;
    }
    else if (/^.$/.test(e.key) && this._isEditing) {
        this.write(e.key);
        this.update();
        return true;
    }

    return false;
};

EditMessage.prototype.update = function () {
    if (this.isOpenChild()) {
        this._child.update();
        return;
    }
    else if (!this.isOpen()) {
        return;
    }

    if (this._row < 0)
    {
        this._largeDisplay.set(this._messageFormat.nameLong);
        this._smallDisplay.set(this._messageFormat.nameShort);
    }
    else if (this._row === this._message.length) {
        this._largeDisplay.set('------SLUT------');
    }
    else {
        var line = this._message[this._row];
        this._largeDisplay.set(line);
    }
};
