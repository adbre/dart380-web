'use strict';

var _ = require('lodash');

function DisplayBase(eventBus) {
    this._eventBus = eventBus;

    eventBus.on('off', function () {
        this.clear();
    }.bind(this));

    eventBus.on([
        'keyboard.keyPress',
        'selfTest.started'
    ], function () {
        this._onUserActivity();
    }.bind(this))
}

DisplayBase.$inject = [ 'eventBus' ];

module.exports = DisplayBase;

DisplayBase.prototype.init = function (name, size) {
    this.name = name;
    this.size = size;

    this.characters = [];
    for (var i=0; i < size; i++) {
        this.characters.push({
            text: '',
            cursor: false,
            blinking: false
        });
    }
};

DisplayBase.prototype.getCursor = function() {
    return _.findIndex(this.characters, function (c) {
        return c.cursor;
    });
};

DisplayBase.prototype.getBlinking = function() {
    return _.findIndex(this.characters, function (c) {
        return c.blinking;
    });
};

DisplayBase.prototype.setBlinking = function (position) {
    if (position === false) {
        _.forEach(this.characters, function (c, i) {
            c.blinking = false;
        });
    }
    else if (_.isArray(position)) {
        _.forEach(this.characters, function (c, i) {
            c.blinking = position.indexOf(i) !== -1;
        });
    }
    else {
        var blinking = this.getBlinking();
        if (blinking === position) {
            return;
        }

        if (blinking >= 0) {
            this.characters[blinking].blinking = false;
        }

        if (position >= 0) {
            this.characters[position].blinking = true;
        }
    }

    this._fireChanged();
};

DisplayBase.prototype.noBlinking = function () {
    this.setBlinking(-1);
};

DisplayBase.prototype.setCursor = function (position) {
    if (position === false) {
        _.forEach(this.characters, function (c, i) {
            c.cursor = false;
        });
    }
    else {
        var cursor = this.getCursor();
        if (cursor === position) {
            return;
        }

        if (cursor >= 0) {
            this.characters[cursor].cursor = false;
        }

        if (position >= 0) {
            this.characters[position].cursor = true;
        }
    }

    this._fireChanged();
};

DisplayBase.prototype.noCursor = function () {
    this.setCursor(-1);
};

DisplayBase.prototype.setText = function (text) {
    if (text.length > this.size) {
        text = text.substring(0, text.length);
    }

    if (this.text == text) {
        return;
    }

    _.forEach(this.characters, function (c, i) {
        c.text = text.length > i ? text[i] : '';
    });

    this.text = text;
    this._fireChanged();
};

DisplayBase.prototype.getText = function () {
    return this.text;
};

DisplayBase.prototype.toString = function () {
    var text = '';
    _.forEach(this.characters, function (c, i) {
        text += (!c.text ? ' ' : c.text);
    });

    return text;
};

DisplayBase.prototype.clear = function () {
    this.setText('');
    this.noCursor();
    this.noBlinking();
};

DisplayBase.prototype._fireChanged = function () {
    this._eventBus.fire(this.name+'.changed', { display: this });
};

DisplayBase.prototype._onUserActivity = function () {
    if (this._userActivityTimeout) {
        clearTimeout(this._userActivityTimeout);
    }

    if (this.hidden) {
        this.hidden = false;
        this._fireChanged();
    }

    this._userActivityTimeout = setTimeout(function() {
        this.hidden = true;
        this._fireChanged();
    }.bind(this), 30 * 1000);
};

DisplayBase.prototype.get = DisplayBase.prototype.getText;
DisplayBase.prototype.set = DisplayBase.prototype.setText;
