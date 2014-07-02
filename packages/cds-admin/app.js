'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var CdsAdmin = new Module('cds-admin');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
CdsAdmin.register(function(app, auth, database, Cds) {

    //We enable routing. By default the Package Object is passed to the routes
    CdsAdmin.routes(app, auth, database, Cds);

    //We are adding a link to the main menu for all authenticated users
    CdsAdmin.menus.add({
        title: 'Admin Panel',
        link: 'cdsAdmin example page',
        roles: ['admin'],
        menu: 'main'
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    CdsAdmin.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    CdsAdmin.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    CdsAdmin.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    return CdsAdmin;
});
