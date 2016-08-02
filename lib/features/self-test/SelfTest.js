'use strict';

var MESSAGE_INTERVAL = 2000;

function SelfTest(eventBus, largeDisplay, smallDisplay) {
    this._eventBus = eventBus;
    this._largeDisplay = largeDisplay;
    this._smallDisplay = smallDisplay;

    this.DELAY = MESSAGE_INTERVAL;

    eventBus.on('dart380.destroy', this.abort.bind(this));
}

SelfTest.$inject = ['eventBus', 'largeDisplay', 'smallDisplay'];

module.exports = SelfTest;

SelfTest.prototype.start = function () {
    if (this._isRunning) {
        return;
    }

    this._largeDisplay.clear();
    this._smallDisplay.clear();

    this._isRunning = true;
    this._startTest();
    this._eventBus.fire('selfTest.started', {});
};

SelfTest.prototype.abort = function () {
    clearTimeout(this._next);
    this._complete(false);
};

SelfTest.prototype.isRunning = function () {
   return !!this._isRunning;
};

SelfTest.prototype._enqueueNext = function (fn, interval) {
    this._next = setTimeout(fn, interval || MESSAGE_INTERVAL);
};

SelfTest.prototype._startTest = function () {
    this._smallDisplay.setText('TEST');
    this._enqueueNext(this._completeTest.bind(this));
};

SelfTest.prototype._completeTest = function () {
    this._smallDisplay.setText('TEST OK');
    this._enqueueNext(this._startMemoryCheck.bind(this));
};

SelfTest.prototype._startMemoryCheck = function () {
    var isMemoryCleared = true;
    if (!isMemoryCleared) {
        this._completeMemoryCheck();
        return;
    }

    this._smallDisplay.setText('NOLLST');
    this._enqueueNext(this._completeMemoryCheck.bind(this));
};

SelfTest.prototype._completeMemoryCheck = function () {
    this._complete();
};

SelfTest.prototype._complete = function (success) {
    if (!this._isRunning) {
        return;
    }

    this._isRunning = false;
    this._smallDisplay.clear();
    this._eventBus.fire('selfTest.done', { success: success === undefined ? true : !!success });
};