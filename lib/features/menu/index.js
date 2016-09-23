module.exports = {
    __init__: [
        'menu',
        'tidMenu',
        'rdaMenu',
        'kdaMenu',

        'fmtMenu',
        'ddaMenu',
        'showMessageMenu',

        'editMessage'
    ],
    menu: [ 'type', require('./RootMenu') ],

    tidMenu: ['type', require('./menus/TidMenu')],
    rdaMenu: ['type', require('./menus/RdaMenu')],
    kdaMenu: ['type', require('./menus/KdaMenu')],

    fmtMenu: ['type', require('./menus/FmtMenu')],
    ddaMenu: ['type', require('./menus/DdaMenu')],

    showMessageMenu: ['type', require('./menus/ShowMessagesMenu')],

    editMessage: ['type', require('./menus/EditMessage')]
};