module.exports = {
    __init__: [
        'menu',
        'tidMenu',
        'rdaMenu',
        'kdaMenu',
    ],
    menu: [ 'type', require('./RootMenu') ],

    tidMenu: ['type', require('./menus/TidMenu')],
    rdaMenu: ['type', require('./menus/RdaMenu')],
    kdaMenu: ['type', require('./menus/KdaMenu')],
};