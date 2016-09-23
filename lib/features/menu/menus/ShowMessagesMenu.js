'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var MenuBase = require('./../MenuBase');

function ShowMessagesMenu(injector, eventBus, menu, largeDisplay, smallDisplay, messages, communication) {
    injector.invoke(MenuBase, this);

    this._eventBus = eventBus;
    this._largeDisplay = largeDisplay;
    this._smallDisplay = smallDisplay;
    this._messages = messages;
    this._communication = communication;

    menu.registerMenu('ISK', this);
    menu.registerMenu('MOT', this);
    menu.registerMenu('AVS', this);
    menu.registerMenu('EKV', this);
    menu.registerMenu('F1', this);
    menu.registerMenu('F2', this);
    menu.registerMenu('F3', this);
    menu.registerMenu('F4', this);
}

inherits(ShowMessagesMenu, MenuBase);

module.exports = ShowMessagesMenu;

ShowMessagesMenu.$inject = [
    'injector',
    'eventBus',
    'menu',
    'largeDisplay',
    'smallDisplay',
    'messages',
    'communication'
];

ShowMessagesMenu.prototype.onKeyPress = function (e) {
    if (MenuBase.prototype.onKeyPress.apply(this, arguments)) {
        return true;
    }

    if (e.key === 'SLT') {
        this._largeDisplay.clear();
        this._smallDisplay.clear();
        this.close();
        return true;
    }
    else if (!this._hasSent) {
        if (e.key == 'SND' && this._currentMessage) {
            var self = this;
            var message = self._currentMessage;
            self._largeDisplay.set('SÄNDER', { center: true });
            self._communication.send(message)
                .then(function () {
                    self._messages.setAsSent(message);
                    if (self._currentMessage !== message) {
                        return;
                    }
                    self._hasSent = true;
                    self._largeDisplay.set('SÄNT', { center: true });
                }, function (reason) {
                    if (self._currentMessage !== message) {
                        return;
                    }
                    self._hasSent = true;
                    self._largeDisplay.set(self._getErrorMessage(reason), { center: true });
                });
            return true;
        }
        else if (e.key == '⏎') {

        }
        else if (e.key === '→') {

        }
        else if (e.key === '←') {

        }
        else if (e.key === '↓') {

        }
        else if (e.key === '↑') {

        }
    }

    return false;
};

ShowMessagesMenu.prototype.open = function (registry) {
    MenuBase.prototype.open.apply(this, arguments);

    this._largeDisplay.clear();
    this._smallDisplay.clear();

    this._index = 0;
    this._registry = registry;
    this._currentMessage = this._messages.get(this._registry)[0];

    this.update();
};

ShowMessagesMenu.prototype.update = function () {
    if (this.isOpenChild()) {
        this._child.update();
        return;
    }
    else if (!this.isOpen()) {
        return;
    }

    if (!this._currentMessage) {
        this._largeDisplay.set(this._getEndOfRegistryString(), { center: true });
        this._smallDisplay.clear();
        return;
    }

    this._largeDisplay.set(this._currentMessage.toString(2));
    this._smallDisplay.set(this._currentMessage.messageFormat.nameShort);
};

ShowMessagesMenu.prototype._getEndOfRegistryString = function () {
    switch (this._registry) {
        case 'MOT': return '(MOTTAGNA)';
        case 'EKV': return '(MOTT EJ KVITT)';
        case 'ISK': return '(INSKRIVNA)';
        case 'AVS': return '(SÄNDA)';
        case 'F1':
        case 'F2':
        case 'F3':
        case 'F4': return 'EJ LAGRAT';
        default:
            throw new Error('Registry unkown: ' + this._registry);
    }
};

ShowMessagesMenu.prototype._getErrorMessage = function (reason) {
    switch (reason) {
        case this._communication.Error.Mod: return 'FEL MOD';
        case this._communication.Error.Header: return 'FEL HUVUD';
        case this._communication.Error.Busy: return 'UPPTAGET';
        case this._communication.Error.Memory: return 'MFULLT EJ LAGRAT';
        default:
            return (reason || 'OKÄNT FEL');
    }
};