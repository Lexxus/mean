'use strict';

angular.module('mean.cds-admin').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('cdsAdmin example page', {
            url: '/cdsAdmin/example',
            templateUrl: 'cds-admin/views/index.html'
        });
    }
]);
