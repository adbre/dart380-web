module.exports = {
    __init__: [
        'menu',
        'tidMenu',
        'rdaMenu',
    ],
    menu: [ 'type', require('./RootMenu') ],

    tidMenu: ['type', require('./menus/TidMenu')],
    rdaMenu: ['type', require('./menus/RdaMenu')],
};