'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var MenuBase = require('./../MenuBase');

function TidMenu(injector, menu, eventBus, smallDisplay, largeDisplay, time) {
    injector.invoke(MenuBase, this);

    this._eventBus = eventBus;
    this._smallDisplay = smallDisplay;
    this._largeDisplay = largeDisplay;
    this._time = time;

    menu.registerMenu('1', this);

    this.init('TID', [
        {
            prefix: 'T',
            canEdit: true,
            text: function () {
                var time = this._time.get();
                return sprintf('%02d%02d%02d', time.hour, time.minute, time.second);
            }
        },
        {
            prefix: 'DAT',
            canEdit: true,
            text: function () {
                var time = this._time.get();
                return sprintf('%02d%02d', time.month, time.day);
            }
        }
    ]);

    eventBus.on('time.changed', this.update.bind(this));
}

inherits(TidMenu, MenuBase);

module.exports = TidMenu;

TidMenu.$inject = ['injector', 'menu', 'eventBus', 'smallDisplay', 'largeDisplay', 'time'];

TidMenu.prototype.startEdit = function() {
    if (this._isEditing) {
        return;
    }

    var menuItem = this.getMenuItem();

    this._input = '';
    this._cursor = 0;
    this._maxLength = 6;//this._smallDisplay.characters.length - menuItem.prefix + 1;
    this._isEditing = true;
    this.update();
};

TidMenu.prototype.endEdit = function() {
    this._isEditing = false;
    this.update();
};

TidMenu.prototype.cancelEdit = function() {
    this._isEditing = false;
    this.update();
};

TidMenu.prototype.writeEdit = function(char) {
    this._input += ''+ char;
    this._cursor = Math.min(this._cursor + 1, this._maxLength - 1);

    this.update();
};

TidMenu.prototype.open = function () {
    MenuBase.prototype.open.apply(this, arguments);

    this._largeDisplay.clear();
    this._smallDisplay.clear();

    this._menuItem = 0;

    this.update();
};

TidMenu.prototype.close = function () {
    MenuBase.prototype.close.apply(this, arguments);

    this._largeDisplay.clear();
    this._smallDisplay.clear();
};

TidMenu.prototype.init = function (name, menuItems) {
    this._name = name;
    this._menuItems = menuItems;
};

TidMenu.prototype.getMenuItem = function() {
    var self = this;
    var menuItem = _.assign({}, this._menuItems[this._menuItem]);
    _.forEach(menuItem, function (value, key) {
        if (_.isFunction(value)) {
            value = value.call(self);
        }

        menuItem[key] = value;
    });

    return menuItem;
};

TidMenu.prototype.update = function () {
    if (this.isOpenChild()) {
        this._child.update();
        return;
    }
    else if (!this.isOpen()) {
        return;
    }

    var menuItem = this.getMenuItem();

    if (this._menuItem === this._menuItems.length) {
        this._smallDisplay.set(sprintf('  (%s) ', this._name));
        return;
    } else if (this._menuItem > this._menuItems.length) {
        this._smallDisplay.clear();
        return;
    }

    var value = this._isEditing ? this._input : menuItem.text;

    this._smallDisplay.set(sprintf('%s:%s', menuItem.prefix, value));
    this._smallDisplay.setBlinking(menuItem.canEdit ? menuItem.prefix.length : -1);
    this._smallDisplay.setCursor(this._isEditing ? menuItem.prefix.length + 1 + this._cursor : -1);
};

TidMenu.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    var menu = this.getMenuItem();

    if (e.key === '⏎') {
        if (this._isEditing) {
            this.endEdit();
        }
        else {
            this._menuItem++;
            if (this._menuItem > 2) {
                this.close();
            } else {
                this.update();
            }
        }

        return true;
    }
    else if (e.key === 'SLT') {
        this.close();
        return true;
    }
    else if (e.key === 'ÄND' && menu && menu.canEdit) {
        this.startEdit();
        return true;
    }
    else if (this._isEditing && /^[0-9]$/.test(e.key)) {
        this.writeEdit(e.key);
        return true;
    }

    return false;
};
