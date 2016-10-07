module.exports = {
    __init__: ['soundEffects', 'signalrCommunication', 'localStorageCommunication','notifications'],
    soundEffects: ['type', require('./SoundEffects')],
    signalrCommunication: ['type', require('./SignalRCommunication')],
    localStorageCommunication: ['type', require('./LocalStorageCommunication')],
    memory: ['type', require('./LocalStorageMemory')],
    notifications: ['type', require('./Notifications')],
};