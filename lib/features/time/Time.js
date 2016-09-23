'use strict';

var isUndefined = require('lodash').isUndefined;
var sprintf = require('sprintf-js').sprintf;

function Time(eventBus) {

    this._eventBus = eventBus;

    var self = this;

    eventBus.on('ready', function (e) {
        if (!self.isStarted()) {
            self.reset(true);
            self.start();
        }
    });

    eventBus.on('dart380.destroy', function () {
        self.stop();
        self.reset();
    });
}

module.exports = Time;

Time.$inject = ['eventBus'];

Time.prototype.get = function () {
    return {
        month: this._month,
        day: this._day,
        hour: this._hour,
        minute: this._minute,
        second: this._second
    };
};

Time.prototype.setTime = function (value) {
    var match = value.match(/^([0-9]{2})([0-9]{2})([0-9]{2})$/);
    return !!match && this.set({
        hour: parseInt(match[1]),
        minute: parseInt(match[2]),
        second: parseInt(match[3])
    });
};

Time.prototype.setDate = function (value) {
    var match = value.match(/^([0-9]{2})([0-9]{2})$/);
    return !!match && this.set({
        month: parseInt(match[1]),
        day: parseInt(match[2])
    });
};

Time.prototype.getTime = function () {
    var value = this.get();
    return sprintf('%02d%02d%02d', value.hour, value.minute, value.second);
};

Time.prototype.getDate = function () {
    var value = this.get();
    return sprintf('%02d%02d', value.month, value.day);
};

Time.prototype.set = function (value) {
    var month = isUndefined(value.month) ? this._month : value.month,
        day = isUndefined(value.day) ? this._day : value.day,
        hour = isUndefined(value.hour) ? this._hour : value.hour,
        minute = isUndefined(value.minute) ? this._minute : value.minute,
        second = isUndefined(value.second) ? this._second : value.second;

    if (month < 1 || month > 12) {
        return false;
    }

    if (day < 1 || day > this._numberOfDaysInMonth(month)) {
        return false;
    }

    if (hour < 0 || hour > 23) {
        return false;
    }

    if (minute < 0 || minute > 59) {
        return false;
    }

    if (second < 0 || second > 59) {
        return false;
    }

    this._month = month;
    this._day = day;
    this._hour = hour;
    this._minute = minute;
    this._second = second;

    this._fire('changed');
    return true;
};

Time.prototype.isStarted = function() {
    return !!this._interval;
};

Time.prototype.start = function () {
    if (this.isStarted()) {
        return;
    }

    this._interval = setInterval(this._onIntervalElapsed.bind(this), 1000);

    this._fire('start');
};

Time.prototype.stop = function() {
    clearInterval(this._interval);

    this._fire('stop');
};

Time.prototype.reset = function(silent) {
    this._lastIntervalTime = new Date().getTime();
    this._month = 1;
    this._day = 1;
    this._hour = 0;
    this._minute = 0;
    this._second = 0;

    if (silent) {
        return;
    }

    this._fire('reset');
};

Time.prototype._fire = function (event) {
    this._eventBus.fire('time.'+event, { time: this.get() });
};

Time.prototype._onIntervalElapsed = function() {
    this._second++;
    if (this._second >= 60) {
        this._second = 0;
        this._minute++;
    }

    if (this._minute >= 60) {
        this._minute = 0;
        this._hour++;
    }

    if (this._hour >= 24) {
        this._hour = 0;
        this._day++;
    }

    if (this._day > this._numberOfDaysInMonth()) {
        this._day = 1;
        this._month++;
    }

    if (this._month > 12) {
        this._month = 1;
    }

    /*
    var then = this._lastIntervalTime,
        now = new Date().getTime(),
        milliseconds = now - then;

    if (milliseconds < 1000) {
        return;
    } else {
        this._lastIntervalTime = now;
    }

    this._second += parseInt((milliseconds / 1000) % 60);
    this._minute += parseInt((milliseconds / (1000*60)) % 60);
    this._hour += parseInt((milliseconds / (1000*60*60)) % 24);

    if (this._second > 59) {
        this._minute += parseInt((this._second - 59) / 59);
        this._second = 0;
    }

    if (this._minute > 59) {
        this._hour += parseInt((this._minute - 59) / 59);
        this._minute = 0;
    }

    if (this._hour > 23) {
        this._day += parseInt((this._hour - 23) / 23);
        this._hour = 0;
    }

    if (this._day > this._numberOfDaysInMonth()) {
        this._day = 1;
        this._month++;
    }

    if (this._month > 12) {
        this._month = 1;
    }
 */
    this._fire('changed');
};

Time.prototype._numberOfDaysInMonth = function(month) {
    switch (month || this._month) {
        case 1: return 31;
        case 2: return 28;
        case 3: return 31;
        case 4: return 30;
        case 5: return 31;
        case 6: return 30;
        case 7: return 31;
        case 8: return 31;
        case 9: return 30;
        case 10: return 31;
        case 11: return 30;
        case 12: return 31;
        default:
            throw new Error('_month is out of range, expected 1-12, was ' + this._month);
    }
};