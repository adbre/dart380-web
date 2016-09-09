module.exports = {
    __init__: [
        'menu',
        'tidMenu',
        'rdaMenu',
    ],
    menu: [ 'type', require('./RootMenu') ],

    tidMenu: ['type', require('./tid/TidMenu')],
    rdaMenu: ['type', require('./rda/RdaMenu')],
};