'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var MenuBase = require('./MenuBase');

function get(value, obj) {
    if (_.isFunction(value)) {
        return value.call(obj);
    }
    else {
        return value;
    }
}

function Ra180MenuBase(injector, menu, eventBus, smallDisplay, largeDisplay) {
    injector.invoke(MenuBase, this);

    this._menu = menu;
    this._eventBus = eventBus;
    this._smallDisplay = smallDisplay;
    this._largeDisplay = largeDisplay;
}

inherits(Ra180MenuBase, MenuBase);

module.exports = Ra180MenuBase;

Ra180MenuBase.$inject = ['injector', 'menu', 'eventBus', 'smallDisplay', 'largeDisplay'];

Ra180MenuBase.prototype.init = function (key, name, menuItems) {
    this._menu.registerMenu(key, this);
    this._name = name;
    this._menuItems = menuItems;
};

Ra180MenuBase.prototype.startEdit = function() {
    if (this._isEditing) {
        return;
    }

    var menuItem = this._currentMenuItem;

    this._input = '';
    this._cursor = 0;
    this._maxLength = this._smallDisplay.size - get(menuItem.prefix, menuItem).length - 1;
    this._isEditing = true;
    this.update();
};

Ra180MenuBase.prototype.endEdit = function() {
    this._isEditing = false;
    this._currentMenuItem.save(this._input);
    this.update();
};

Ra180MenuBase.prototype.cancelEdit = function() {
    this._isEditing = false;
    this.update();
};

Ra180MenuBase.prototype.writeEdit = function(char) {
    this._input = this._input.substring(0, this._cursor) + char + (this._input.substring(this._cursor + 1) || '');
    this._cursor = Math.min(this._cursor + 1, this._maxLength - 1);

    this.update();
};

Ra180MenuBase.prototype.open = function () {
    MenuBase.prototype.open.apply(this, arguments);

    this._largeDisplay.clear();
    this._smallDisplay.clear();

    this._menuItem = 0;
    this._currentMenuItem = this._menuItems[this._menuItem];

    this.update();
};

Ra180MenuBase.prototype.close = function () {
    MenuBase.prototype.close.apply(this, arguments);

    if (this._isEditing) {
        this.cancelEdit();
    }

    this._largeDisplay.clear();
    this._smallDisplay.clear();
};

Ra180MenuBase.prototype.update = function () {
    if (this.isOpenChild()) {
        this._child.update();
        return;
    }
    else if (!this.isOpen()) {
        return;
    }

    var menuItem = this._currentMenuItem;

    if (this._menuItem === this._menuItems.length) {
        this._smallDisplay.set(sprintf('  (%s) ', this._name));
        return;
    } else if (this._menuItem > this._menuItems.length) {
        this._smallDisplay.clear();
        return;
    }

    var value = this._isEditing ? this._input : get(menuItem.text, menuItem);
    var prefix = get(menuItem.prefix, menuItem);
    var canEdit = get(menuItem.canEdit, menuItem);
    var separator = canEdit ? ':' : '=';

    this._smallDisplay.set(sprintf('%s%s%s', prefix, separator, value));

    if (this._isEditing) {
        var cursorIndex = prefix.length + separator.length + this._cursor;
        this._smallDisplay.setBlinking([prefix.length, cursorIndex]);
        this._smallDisplay.setCursor(cursorIndex);
    }
    else {
        this._smallDisplay.setBlinking(false);
        this._smallDisplay.setCursor(false);
    }
};

Ra180MenuBase.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    var menu = this._currentMenuItem;

    if (e.key === '⏎') {
        if (this._isEditing) {
            this.endEdit();
        }
        else {
            this._menuItem++;
            this._currentMenuItem = this._menuItem < this._menuItems.length ? this._menuItems[this._menuItem] : null;
            if (this._menuItem > this._menuItems.length) {
                this.close();
            } else {
                this.update();
            }
        }

        return true;
    }
    else if (e.key === 'SLT') {
        if (this._isEditing) {
            this.cancelEdit();
        }
        else {
            this.close();
        }
        return true;
    }
    else if (e.key === 'ÄND' && menu && get(menu.canEdit, menu)) {
        this.startEdit();
        return true;
    }
    else if (this._isEditing && /^[0-9]$/.test(e.key)) {
        this.writeEdit(e.key);
        return true;
    }

    return false;
};
