'use strict';

var inherits = require('inherits');

var MenuBase = require('./MenuBase');

function RootMenu(injector, eventBus) {
    injector.invoke(MenuBase, this);

    var self = this;

    self._menus = {};

    eventBus.on('shutdown', function () {
        self.close();
    });

    eventBus.on('ready', function () {
        self.open();
    });

    eventBus.on('keyboard.keyPress', function (e) {
        if (!self.isOpen()) {
            return;
        }

        self.onKeyPress(e);
    });
}

inherits(RootMenu, MenuBase);

module.exports = RootMenu;

RootMenu.$inject = ['injector', 'eventBus'];

RootMenu.prototype.registerMenu = function (activationKey, menu) {
    if (this._menus[activationKey]) {
        throw new Error('Key has already been allocated for another menu. Key: ' + activationKey);
    }

    this._menus[activationKey] = menu;
};

RootMenu.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    if (!this.isOpenChild()) {
        var menu = this._menus[e.key];
        if (menu) {
            this.openChild(menu);
            return true;
        }
    }

    return false;
};