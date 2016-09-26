'use strict';

var MESSAGE_INTERVAL = 2000;

var routines = {
    3: require('./routines/DisplayTestRoutine')
};

function SelfTest(injector, eventBus, largeDisplay, smallDisplay, memory) {
    this._injector = injector;
    this._eventBus = eventBus;
    this._largeDisplay = largeDisplay;
    this._smallDisplay = smallDisplay;
    this._memory = memory;

    this.DELAY = MESSAGE_INTERVAL;

    eventBus.on('dart380.destroy', this.abort.bind(this));
}

SelfTest.$inject = ['injector', 'eventBus', 'largeDisplay', 'smallDisplay', 'memory'];

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
    if (!this._memory.isEmpty()) {
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

SelfTest.prototype.startRoutine = function (value) {
    var routineType = routines[value];
    if (!routineType) {
        return false;
    }

    var routine = this._injector.instantiate(routineType);
    routine.start();
    return routine;
};



