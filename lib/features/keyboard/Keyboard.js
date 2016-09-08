'use strict';

var assign = require('lodash').assign,
    forEach = require('lodash').forEach,
    isString = require('lodash').isString;

function Keyboard(eventBus) {
    this._eventBus = eventBus;

    var self = this;

    function createKey(text) {
        return {
            text: text,
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
        hashtag: createKey('#')
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

Keyboard.prototype.trigger = function (key) {
    this._eventBus.fire('keyboard.keyPress', { key: key });
};

Keyboard.prototype.triggerMany = function (manyKeys) {
    var self = this;
    forEach(manyKeys, function (key) {
        self.trigger(key);
    });
};