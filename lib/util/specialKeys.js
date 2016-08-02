'use strict';

function specialKey(text) {
    return {
        text: text,
        is: function (key) {
            return key === text;
        }
    };
}

module.exports = {
    f1: specialKey('F1'),
    f2: specialKey('F2'),
    f3: specialKey('F3'),
    f4: specialKey('F4'),
    fmt: specialKey('FMT'),
    rep: specialKey('REP'),
    rad: specialKey('RAD'),

    kvi: specialKey('KVI'),
    skr: specialKey('SKR'),
    dda: specialKey('DDA'),

    opm: specialKey('OPM'),
    eff: specialKey('EFF'),
    and: specialKey('ÄND'),

    brightness: specialKey('¤'),
    slt: specialKey('SLT'),
    enter: specialKey('⏎'),

    shift: specialKey('⇪'),
    backspace: specialKey('DEL'),

    left: specialKey('←'),
    right: specialKey('→'),
    up: specialKey('↑'),
    down: specialKey('↓'),

    pageUp: specialKey('△'),
    pageDown: specialKey('▽'),

    tid: specialKey('TID'),
    rda: specialKey('RDA'),
    kda: specialKey('KDA'),
    rap: specialKey('RAP'),
    nyk: specialKey('NYK'),
    tjk: specialKey('TJK'),

    reset: specialKey('NOLLST')
};
