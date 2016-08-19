module.exports = {
    __init__: [
        'menu',
        'tidMenu'
    ],
    menu: [ 'type', require('./RootMenu') ],

    tidMenu: ['type', require('./tid/TidMenu')]
};