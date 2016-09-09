'use strict';

var _ = require('lodash');

function KeyChecksum() {
    this.groups = 8;
}

module.exports = KeyChecksum;

KeyChecksum.prototype.isValidCharacter = function (char) {
    return !!(/^[0-7]$/.test(char));
};

KeyChecksum.prototype.isValidGroup = function (group) {
    if (!_.isString(group) || !group.match(/^[0-7]{4}$/)) {
        return false;
    }

    return this.getChecksum(group.substring(0, 3)) === group;
};

KeyChecksum.prototype.isValidKey = function (groups) {
    var self = this;

    if (groups.length !== this.groups) {
        return false;
    }

    return !!_.every(groups, function (group) {
        return self.isValidGroup(group);
    });
};

KeyChecksum.prototype.getChecksum = function (value) {
    var self = this;

    if (_.isArray(value) && value.length === 8) {
        var verticalGroups = ['', '', ''];
        for (var y=0; y < value.length; y++) {
            var group = value[y];
            if (!this.isValidGroup(group)) {
                return false;
            }

            for (var x=0; x < 3; x++) {
                verticalGroups[x] += '' + group[x];
            }
        }

        return _.map(verticalGroups, function (group) {
            return self.getChecksum(group);
        }).join('');
    }
    else if (_.isString(value)) {
        var checksum = _.reduce(value, function (sum, c) {
            return sum ^ parseInt(c);
        });

        if (value.length === 3) {
            return value + checksum;
        }
        else {
            return checksum;
        }
    }
    else {
        return false;
    }
};

KeyChecksum.prototype.next = function () {
    var self = this;
    var groups = [];
    for (var i=0; i < this.groups; i++) {
        var group = getRandomKeyDigit() + '' + getRandomKeyDigit() + '' + getRandomKeyDigit();
        groups.push(this.getChecksum(group));
    }

    return {
        groups: groups,
        checksum: this.getChecksum(groups)
    };
};

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomKeyDigit() {
    return getRandomInt(0, 7);
}