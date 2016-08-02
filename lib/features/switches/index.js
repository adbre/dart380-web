module.exports = {
    __init__: ['switchChannel', 'switchMod', 'switchVolume'],
    switchChannel: [ 'type', require('./SwitchChannel') ],
    switchMod: [ 'type', require('./SwitchMod') ],
    switchVolume: [ 'type', require('./SwitchVolume') ]
};