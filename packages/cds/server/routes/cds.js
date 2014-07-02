'use strict';

var categoryController = require('../controllers/category'),
    tagController = require('../controllers/tag');

// The Package is past automatically as first parameter
module.exports = function(Cds, app, auth, database) {

    app.get('/cds/category/:id?', categoryController.getCategory);

    app.get('/cds/tags/:cat_id', tagController.getTags);

    app.get('/cds/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/cds/example/render', function(req, res, next) {
        Cds.render('index', {
            package: 'cds'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
