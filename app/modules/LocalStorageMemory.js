'use strict';

var inherits = require('inherits');

var Memory = require('../../lib/features/memory/Memory');

function LocalStorageMemory(injector) {
    injector.invoke(Memory, this);

    this._storage = window.localStorage || this._storage;
}

inherits(LocalStorageMemory, Memory);

LocalStorageMemory.$inject = ['injector'];

module.exports = LocalStorageMemory;
