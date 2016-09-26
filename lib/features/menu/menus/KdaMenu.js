'use strict';

var inherits = require('inherits');
var sprintf = require('sprintf-js').sprintf;
var _ = require('lodash');

var Ra180MenuBase = require('./../Ra180MenuBase');

function KdaMenu(injector, eventBus, mod, kda, channel, keyChecksum) {
    injector.invoke(Ra180MenuBase, this);

    this._eventBus = eventBus;
    this._mod = mod;
    this._kda = kda;
    this._channel = channel;

    var self = this;

    eventBus.on(['mod.changed', 'channel.changed', 'kda.changed'], function () {
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
                if (kda.getDisableKlar()) {
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
                if (!supportFrequenceJumps() && kda.getDisableKlar()) {
                    return '00000';
                }
                return kda.getFrequency();
            },
            save: function (value) {
                if (value === '**' && supportFrequenceJumps()) {
                    kda.setDisableKlar(!kda.getDisableKlar());
                    return true;
                }
                else {
                    return kda.setFrequency(value);
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
                return kda.getBd1();
            },
            save: function (value) {
                return kda.setBd1(value);
            },
            onEndEdit: function () {
                if (kda.getBd1() != '9000') {
                    self.nextMenuItem();
                    self._ignoreStartEdit = true;
                    self.startEdit();
                    self._ignoreStartEdit = false;
                }
            }
        },
        {
            enabled: function () {
                return supportFrequenceJumps() && kda.getBd1() != '9000';
            },
            prefix: 'BD2',
            canEdit: true,
            text: function () {
                return kda.getBd2() || '';
            },
            save: function (value) {
                return kda.setBd2(value);
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
                return !!kda.getSynk();
            },
            text: function () {
                return kda.getSynk() ? 'JA' : 'NEJ';
            },
            toggle: function () {
                kda.setSynk(false);
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
                var pny = kda.getPassiveKey();
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

                kda.setPassiveKey({
                    groups: [].concat(self._pnyInput),
                    checksum: checksum
                });
            },
            onStartEdit: function () {
                self._pnyInput = [];
            },
        }
    ]);
}

inherits(KdaMenu, Ra180MenuBase);

module.exports = KdaMenu;

KdaMenu.$inject = ['injector', 'eventBus', 'mod', 'kda', 'channel', 'keyChecksum'];
