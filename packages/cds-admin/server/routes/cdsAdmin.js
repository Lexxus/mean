'use strict';

var tags = require('../controllers/tags');

// The Package is past automatically as first parameter
module.exports = function(CdsAdmin, app, auth, database) {

    app.get('/cdsAdmin/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/cdsAdmin/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/cdsAdmin/tags/:parent?', auth.requiresAdmin, tags.find);

    app.get('/cdsAdmin/example/render', function(req, res, next) {
        CdsAdmin.render('index', {
            package: 'cds-admin'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
