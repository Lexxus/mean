'use strict';

angular.module('mean.cds').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('cds example page', {
            url: '/cds/example',
            templateUrl: 'cds/views/index.html'
        });
    }
]);
