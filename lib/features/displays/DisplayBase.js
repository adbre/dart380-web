'use strict';

function DisplayBase(eventBus) {
    this._eventBus = eventBus;
}

DisplayBase.$inject = [ 'eventBus' ];

module.exports = DisplayBase;

DisplayBase.prototype.init = function (name, size) {
    this.name = name;
    this.size = size;
};

DisplayBase.prototype.setText = function (text) {
    if (text.length > this.size) {
        text = text.substring(0, text.length);
    }

    if (this.text == text) {
        return;
    }

    this.text = text;
    this._eventBus.fire(this.name+'.changed', { display: this });
};

DisplayBase.prototype.getText = function () {
    return this.text;
};

DisplayBase.prototype.clear = function () {
    this.setText('');
};