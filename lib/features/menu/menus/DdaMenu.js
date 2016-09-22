'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var Ra180MenuBase = require('./../Ra180MenuBase');

function DdaMenu(injector, eventBus, dda) {
    injector.invoke(Ra180MenuBase, this);

    this.init('DDA', 'DDA', [
        {
            prefix: 'AD',
            canEdit: true,
            isAllowedInput: function (key, value) {
                return /^(\*|[A-ZÅÄÖ]+[A-ZÅÄÖ0-9]*)$/.test(value + key);
            },
            text: dda.getAd.bind(dda),
            save: function (value) {
                dda.setAd(value);
            }
        },
        {
            prefix: 'SKR',
            options: dda.SKR,
            selectedOption: dda.getSkr.bind(dda),
            save: dda.setSkr.bind(dda)
        },
        {
            prefix: 'OPMTN',
            options: [true, false],
            selectedOption: dda.getOpmtn.bind(dda),
            save: dda.setOpmtn.bind(dda)
        },
        {
            prefix: 'SUM',
            options: [false, true],
            selectedOption: dda.getSum.bind(dda),
            save: dda.setSum.bind(dda)
        },
        {
            prefix: 'TKL',
            options: [false, true],
            selectedOption: dda.getTkl.bind(dda),
            save: dda.setTkl.bind(dda)
        },
        {
            prefix: 'BAT',
            text: '12.1'
        }
    ]);
}

inherits(DdaMenu, Ra180MenuBase);

module.exports = DdaMenu;

DdaMenu.$inject = ['injector', 'eventBus', 'dda'];
