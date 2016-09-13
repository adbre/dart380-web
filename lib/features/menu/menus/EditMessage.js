'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var MenuBase = require('./../MenuBase');

function EditMessage(injector, eventBus, menu, largeDisplay, smallDisplay, messages, time, communication) {
    injector.invoke(MenuBase, this);

    this._menu = menu;
    this._eventBus = eventBus;
    this._largeDisplay = largeDisplay;
    this._smallDisplay = smallDisplay;
    this._messages = messages;
    this._time = time;
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

    var time = this._time.get();
    time = sprintf('%02d%02d%02d', time.hour, time.minute, time.second)

    this._message = [
        'TILL:           ',
        '                ',
        time+ '*FR:      ',
        '                ',
        'FRÅN:     *U:   ',
        'TEXT:           ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                '
    ];
    this._row = -1;

    this.update();
};

EditMessage.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    if (e.key === 'SLT') {
        if (this._isEditing) {
            this._isEditing = false;
            this._largeDisplay.noCursor();
            this.update();
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
        this._row = Math.min(this._message.length - 1, this._row+1);
        if (this._isEditing) {
            var cursor = this._message[this._row].indexOf(' ');
            this._largeDisplay.setCursor(cursor);
        }
        this.update();
        return true;
    }
    else if (e.key === 'ÄND' && this._row >= 0) {
        this._isEditing = true;
        var cursor = this._message[this._row].indexOf(' ');
        this._largeDisplay.setCursor(cursor);
    }
    else if (e.key === '→') {

    }
    else if (e.key === '←') {

    }
    else if (e.key === '↓') {

    }
    else if (e.key === '↑') {

    }
    else if (/^.$/.test(e.key) && this._isEditing) {
        var cursor = this._largeDisplay.getCursor();
        var line = this._message[this._row];
        var before = line.substr(0, cursor);
        var after = line.substr(cursor + 1);
        line = before + e.key + after;
        this._largeDisplay.setCursor(Math.min(15, cursor+1));
        this._message[this._row] = line;
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
    else {
        var line = this._message[this._row];
        this._largeDisplay.set(line);
    }
};
