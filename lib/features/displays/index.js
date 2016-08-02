module.exports = {
    __init__: ['largeDisplay','smallDisplay'],
    largeDisplay: [ 'type', require('./LargeDisplay') ],
    smallDisplay: [ 'type', require('./SmallDisplay') ]
};