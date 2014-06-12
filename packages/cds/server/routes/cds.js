'use strict';

// The Package is past automatically as first parameter
module.exports = function(Cds, app, auth, database) {

    app.get('/cds/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/cds/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

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
