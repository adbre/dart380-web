'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;

var MenuBase = require('./../MenuBase');

function TidMenu(injector, menu, eventBus, smallDisplay, largeDisplay, time) {
    injector.invoke(MenuBase, this);

    this._eventBus = eventBus;
    this._smallDisplay = smallDisplay;
    this._largeDisplay = largeDisplay;
    this._time = time;

    menu.registerMenu('1', this);

    eventBus.on('time.changed', this._refresh.bind(this));
}

inherits(TidMenu, MenuBase);

module.exports = TidMenu;

TidMenu.$inject = ['injector', 'menu', 'eventBus', 'smallDisplay', 'largeDisplay', 'time'];

TidMenu.prototype.open = function () {
    MenuBase.prototype.open.apply(this, arguments);

    this._largeDisplay.clear();
    this._smallDisplay.clear();

    this._menuItem = 1;

    this._refresh();
};

TidMenu.prototype.close = function () {
    MenuBase.prototype.close.apply(this, arguments);

    this._largeDisplay.clear();
    this._smallDisplay.clear();
};

TidMenu.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    if (e.key === '⏎') {
        this._menuItem++;
        if (this._menuItem > 3) {
            this.close();
        } else {
            this._refresh();
        }
        return true;
    }
    else if (e.key === 'SLT') {
        this.close();
        return true;
    }

    return false;
};

TidMenu.prototype._refresh = function () {
    if (!this.isOpen() || this.isOpenChild()) {
        return;
    }

    if (this._menuItem === 1) {
        var time = this._time.get();
        this._smallDisplay.set(sprintf('T:%02d%02d%02d', time.hour, time.minute, time.second));
        this._smallDisplay.setBlinking(1);
    }
    else if (this._menuItem == 2) {
        var time = this._time.get();
        this._smallDisplay.set(sprintf('DAT:%02d%02d', time.month, time.day));
        this._smallDisplay.setBlinking(1);
    }
    else if (this._menuItem == 3) {
        this._smallDisplay.set('  (TID) ');
    } else {
        this._smallDisplay.clear();
    }
};
