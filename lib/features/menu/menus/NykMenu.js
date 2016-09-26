'use strict';

var inherits = require('inherits');

var Ra180MenuBase = require('./../Ra180MenuBase');

function NykMenu(injector, kda) {
    injector.invoke(Ra180MenuBase, this);

    this.init('7', 'NYK', [
        {
            prefix: 'NYK',
            canToggle: function () {
                return !!kda.getPassiveKey() || !!kda.getActiveKey();
            },
            text: function () {
                var activeKey = kda.getActiveKey();
                if (!activeKey) {
                    return '###';
                }
                else {
                    return activeKey.checksum;
                }
            },
            toggle: function () {
                var activeKey = kda.getActiveKey();
                var passiveKey = kda.getPassiveKey();
                kda.setActiveKey(passiveKey);
                kda.setPassiveKey(activeKey);
            }
        }
    ]);
}

inherits(NykMenu, Ra180MenuBase);

module.exports = NykMenu;

NykMenu.$inject = ['injector', 'kda'];
