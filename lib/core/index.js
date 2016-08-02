module.exports = {
    __init__: [ 'program' ],
    program: ['type', require('./Program')],
    eventBus: [ 'type', require('./EventBus') ]
};
