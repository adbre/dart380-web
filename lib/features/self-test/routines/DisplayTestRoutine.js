'use strict';

var CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#@%&/()=+´^$<>*?;,:._-\'';

function DisplayTestRoutine (eventBus, smallDisplay, largeDisplay) {

    this._smallDisplay = smallDisplay;
    this._largeDisplay = largeDisplay;

    eventBus.on('keyboard.keyPress', function (e) {
        if (e.key === '↑') {
            this._setInterval(this._intervalMilliseconds / 2);
        }
        else if (e.key === '↓') {
            this._setInterval(this._intervalMilliseconds * 2);
        }
    }.bind(this));
}

DisplayTestRoutine.$inject = ['eventBus', 'smallDisplay', 'largeDisplay'];

module.exports = DisplayTestRoutine;

DisplayTestRoutine.prototype.start = function () {
    this._index = 0;
    this._setInterval(250);
};

DisplayTestRoutine.prototype.stop = function () {
    this._setInterval(0);
};

DisplayTestRoutine.prototype._onElapsed = function () {
    var text = CHARACTERS.substr(this._index);
    this._largeDisplay.set(text);
    this._smallDisplay.set(text);

    if (this._index < CHARACTERS.length - 1) {
        this._index++;
    }
    else {
        this._index = 0;
    }
};

DisplayTestRoutine.prototype._setInterval = function (milliseconds) {
    if (this._interval) {
        clearInterval(this._interval);
    }

    if (milliseconds > 0) {
        this._intervalMilliseconds = milliseconds;
        setInterval(this._onElapsed.bind(this), milliseconds);
    }
};
