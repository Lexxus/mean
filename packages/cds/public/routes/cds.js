'use strict';

angular.module('mean.cds').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider
        .state('cds', {
            url: '/cds',
            templateUrl: 'cds/views/index.html'
        })
        .state('category', {
        	url: '/cat/:cat',
        	templateUrl: 'cds/views/index.html'
        });
    }
]);
