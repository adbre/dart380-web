'use strict';

var _ = require('lodash'),
    assign = require('lodash').assign,
    forEach = require('lodash').forEach,
    isString = require('lodash').isString;

function Keyboard(eventBus) {
    this._eventBus = eventBus;

    var self = this;

    function createKey(text) {
        return {
            text: text,
            isDown: false,
            trigger: function () {
                self.trigger(text);
            }
        };
    }

    this.keys = {
        f1: createKey('F1'),
        f2: createKey('F2'),
        f3: createKey('F3'),
        fmt: createKey('FMT'),
        rep: createKey('REP'),
        rad: createKey('RAD'),
        kvi: createKey('KVI'),
        skr: createKey('SKR'),
        dda: createKey('DDA'),
        opm: createKey('OPM'),
        eff: createKey('EFF'),
        and: createKey('ÄND'),
        brightness: createKey('¤'),
        slt: createKey('SLT'),
        enter: createKey('⏎'),
        shift: createKey('⇪'),
        backspace: createKey('DEL'),
        left: createKey('←'),
        right: createKey('→'),
        up: createKey('↑'),
        down: createKey('↓'),
        pageUp: createKey('△'),
        pageDown: createKey('▽'),

        one: createKey('1', 'TID'),
        two: createKey('2', 'RDA'),
        three: createKey('3'),
        four: createKey('4', 'KDA'),
        five: createKey('5', 'RAP'),
        six: createKey('6'),
        seven: createKey('7', 'NYK'),
        eight: createKey('8'),
        nine: createKey('9', 'TJK'),
        zero: createKey('0'),
        asterix: createKey('*'),
        hashtag: createKey('#'),

        A: createKey('A'),
        B: createKey('B'),
        C: createKey('C'),
        D: createKey('D'),
        E: createKey('E', '#'),
        F: createKey('F'),
        G: createKey('G', '´'),
        H: createKey('H', '^'),
        I: createKey('I', '('),
        J: createKey('J', '$'),
        K: createKey('K', '<'),
        L: createKey('L', '>'),
        M: createKey('M'),
        N: createKey('N'),
        O: createKey('O', ')'),
        P: createKey('P', '='),
        Q: createKey('Q', '!'),
        R: createKey('R', '@'),
        S: createKey('S'),
        T: createKey('T', '%'),
        U: createKey('U', '/'),
        V: createKey('V'),
        W: createKey('W', '"'),
        X: createKey('X'),
        Y: createKey('Y', '&'),
        Z: createKey('Z'),
        'Å': createKey('Å', '+'),
        'Ä': createKey('Ä', '?'),
        'Ö': createKey('Ö', '*'),

        comma: createKey(',', ';'),
        period: createKey('.', ':'),
        dash: createKey('-', '_')
    };

    assign(this.keys, {
        tid: this.keys.one,
        rda: this.keys.two,
        kda: this.keys.four,
        rap: this.keys.five,
        nyk: this.keys.seven,
        tjk: this.keys.nine
    });
}

Keyboard.$inject = ['eventBus'];

module.exports = Keyboard;

Keyboard.prototype.down = function (key) {
    key = _.find(this.keys, function (k) {
        return k.text === key;
    });
    if (key) {
        key.isDown = true;
        this._eventBus.fire('keyboard.keyDown', { key: key });
    }
};

Keyboard.prototype.up = function (key, up) {
    key = _.find(this.keys, function (k) {
        return k.text === key;
    });
    if (key) {
        key.isDown = !!up;
        this._eventBus.fire('keyboard.keyUp', { key: key });
    }
};

Keyboard.prototype.trigger = function (key) {
    this._eventBus.fire('keyboard.keyPress', { key: key });
};

Keyboard.prototype.triggerMany = function (manyKeys) {
    var self = this;
    forEach(manyKeys, function (key) {
        self.trigger(key);
    });
};

Keyboard.prototype.isDown = function (key) {
    key = _.find(this.keys, function (k) {
        return k.text === key;
    });

    return key && !!key.isDown;
};