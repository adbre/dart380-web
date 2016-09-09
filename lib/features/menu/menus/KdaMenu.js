'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var Ra180MenuBase = require('./../Ra180MenuBase');

function KdaMenu(injector, eventBus, mod, channel, keyChecksum) {
    injector.invoke(Ra180MenuBase, this);

    this._eventBus = eventBus;
    this._mod = mod;
    this._channel = channel;

    var self = this;

    self.reset();

    eventBus.on('mod.changed', function () {
        self.update();
    });

    eventBus.on('channel.changed', function () {
        self._current = self._data[channel.get() - 1];
        self.update();
    });

    eventBus.on('reset', function () {
        self.reset();
    });

    function supportFrequenceJumps() {
        return mod.get() === mod.SKYDD || mod.get() === mod.DRELA;
    }

    this.init('4', 'KDA', [
        {
            prefix: function () {
                if (self._current.disableKlar) {
                    return '**';
                }
                return 'FR';
            },
            canEdit: true,
            isAllowedInput: function (key) {
                if (key === '*' && supportFrequenceJumps()) {
                    return true;
                }

                return /^[0-9]$/.test(key);
            },
            text: function () {
                if (!supportFrequenceJumps() && self._current.disableKlar) {
                    return '00000';
                }
                return self._current.fr;
            },
            save: function (value) {
                if (value === '**' && supportFrequenceJumps()) {
                    self._current.disableKlar = !self._current.disableKlar;
                }
                else {
                    var MHz = parseInt(value) / 1000;
                    if (MHz < 30 || MHz > 87.975 ) {
                        return false;
                    }

                    self._current.fr = value;
                }
            }
        },
        {
            enabled: function () {
                return supportFrequenceJumps();
            },
            prefix: 'BD1',
            canEdit: true,
            text: function () {
                return self._current.bd1;
            },
            save: function (value) {
                self._current.bd1 = value;
            },
            onEndEdit: function () {
                if (self._current.bd1 != '9000') {
                    self.nextMenuItem();
                    self._ignoreStartEdit = true;
                    self.startEdit();
                    self._ignoreStartEdit = false;
                }
            }
        },
        {
            enabled: function () {
                return supportFrequenceJumps() && self._current.bd1 != '9000';
            },
            prefix: 'BD2',
            canEdit: true,
            text: function () {
                return self._current.bd2 || '';
            },
            save: function (value) {
                self._current.bd2 = value;
            },
            onStartEdit: function () {
                if (self._ignoreStartEdit) {
                    return;
                }
                self.previousMenuItem();
            },
            onEndEdit: function () {
                self.previousMenuItem();
            }
        },
        {
            enabled: function () {
                return supportFrequenceJumps();
            },
            prefix: 'SYNK',
            canToggle: function () {
                return self._current.synk;
            },
            text: function () {
                return self._current.synk ? 'JA' : 'NEJ';
            },
            toggle: function () {
                self._current.synk = false;
            }
        },
        {
            enabled: function () {
                return supportFrequenceJumps();
            },
            prefix: function () {
                if (self._isEditing) {
                    return sprintf('PN%d', self._pnyInput.length + 1);
                }

                return 'PNY';
            },
            canEdit: true,
            text: function () {
                var pny = self._current.pny;
                return pny && pny.checksum || '###';
            },
            save: function (value) {
                if (!keyChecksum.isValidGroup(value)) {
                    return false;
                }

                self._pnyInput.push(value);

                var checksum = keyChecksum.getChecksum(self._pnyInput);
                if (!checksum) {
                    return false;
                }

                self._current.pny = {
                    groups: [].concat(self._pnyInput),
                    checksum: checksum
                };
            },
            onStartEdit: function () {
                self._pnyInput = [];
            },
        }
    ]);

    eventBus.on('time.changed', this.update.bind(this));
}

inherits(KdaMenu, Ra180MenuBase);

module.exports = KdaMenu;

KdaMenu.$inject = ['injector', 'eventBus', 'mod', 'channel', 'keyChecksum'];

KdaMenu.prototype.reset = function () {
    this._data = [
        { fr: 30025, bd1: 9000, bd2: '0000', disableKlar: false, synk: false },
        { fr: 40025, bd1: 9000, bd2: '0000', disableKlar: false, synk: false },
        { fr: 50025, bd1: 9000, bd2: '0000', disableKlar: false, synk: false },
        { fr: 60025, bd1: 9000, bd2: '0000', disableKlar: false, synk: false },
        { fr: 70025, bd1: 9000, bd2: '0000', disableKlar: false, synk: false },
        { fr: 80025, bd1: 9000, bd2: '0000', disableKlar: false, synk: false },
        { fr: 87975, bd1: 9000, bd2: '0000', disableKlar: false, synk: false },
        { fr: 42025, bd1: 9000, bd2: '0000', disableKlar: false, synk: false },
    ];

    this._current = this._data[this._channel.get() - 1];
};
