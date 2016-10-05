module.exports = {
    __init__: ['soundEffects', 'signalrCommunication'],
    soundEffects: ['type', require('./SoundEffects')],
    signalrCommunication: ['type', require('./SignalRCommunication')],
    memory: ['type', require('./LocalStorageMemory')]
};