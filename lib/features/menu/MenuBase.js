'use strict';

function MenuBase(eventBus) {
    this._parent = null;
    this._child = null;
}

module.exports = MenuBase;

MenuBase.$inject = ['eventBus'];

MenuBase.prototype.isOpen = function () {
    return !!this._isOpen;
};

MenuBase.prototype.open = function () {
    this._isOpen = true;
};

MenuBase.prototype.isOpenChild = function () {
    return !!this._child;
};

MenuBase.prototype.openChild = function(child) {
    this._child = child;
    child._parent = this;
    child.open();
};

MenuBase.prototype.onKeyPress = function (e) {
    if (this._child) {
        return this._child.onKeyPress(e);
    }

    return false;
};

MenuBase.prototype.close = function () {
    this._isOpen = false;

    if (!this._parent || this._parent._child !== this) {
        return;
    }

    if (this._child) {
        this._child.close();
        this._child = null;
    }

    this._parent._child = null;
    this._parent = null;
};
