'use strict';

const clubController = require('./clubController');

module.exports = function(app) {

    app.route('/clubs')
        .get(clubController.list);

    app.route('/clubs/:userId')
        .get(clubController.listByUser);

    app.route('/clubs/:clubId/subscribe/:userId')
        .put(clubController.subscribeUser);

    app.route('/clubs/:clubId/unsubscribe/:userId')
        .put(clubController.unsubscribeUser);
}