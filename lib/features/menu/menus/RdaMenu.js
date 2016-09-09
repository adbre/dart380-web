'use strict';

var inherits = require('inherits');

var Ra180MenuBase = require('./../Ra180MenuBase');

function RdaMenu(injector) {
    injector.invoke(Ra180MenuBase, this);

    this.init('2', 'RDA', [
        {
            prefix: 'SDX',
            canEdit: false,
            text: 'NEJ'
        },
        {
            prefix: 'OPMTN',
            canEdit: false,
            text: 'JA'
        },
        {
            prefix: 'BAT',
            canEdit: false,
            text: '12.5'
        }
    ]);
}

inherits(RdaMenu, Ra180MenuBase);

module.exports = RdaMenu;

RdaMenu.$inject = ['injector'];
