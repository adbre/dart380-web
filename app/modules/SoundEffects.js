'use strict';

function SoundEffects(eventBus, communication) {
    var sounds = {
        opm: 'assets/audio/opm.wav',
        msg: 'assets/audio/msg.wav'
    };

    var self = this;

    // By registering ourselfs as a communication provider, sending will be blocked
    // until the sound has played... creating a nice synchronization of the text message
    // and audio.
    communication.registerProvider({
        send: function () {
            return self.play(sounds.msg);
        }
    });

    eventBus.on('opm.opmtn.play', function () {
        self.play(sounds.opm);
    });

    eventBus.on('communication.received', function () {
        self.play(sounds.msg);
    });
}

module.exports = SoundEffects;

SoundEffects.$inject = ['eventBus', 'communication'];

SoundEffects.prototype.play = function (url) {
    return new Promise(function (resolve, reject) {
        try {
            var audio = new Audio(url);

            audio.addEventListener('ended', function () {
                resolve();
            });
            audio.addEventListener('error', function () {
                reject();
            });

            var promise = audio.play();
            if (promise !== undefined) {
                promise
                .catch(function (reason) {
                    reject(reason);
                });
            }
        }
        catch (error) {
            reject(error);
        }
    });
};