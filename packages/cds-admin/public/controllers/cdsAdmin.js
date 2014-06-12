'use strict';

angular.module('mean.cds-admin').controller('CdsAdminController', ['$scope', 'Global', 'CdsAdmin',
    function($scope, Global, CdsAdmin) {
        $scope.global = Global;
        $scope.package = {
            name: 'cds-admin'
        };
    }
]);
