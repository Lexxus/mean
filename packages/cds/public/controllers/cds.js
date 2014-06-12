'use strict';

angular.module('mean.cds').controller('CdsController', ['$scope', 'Global', 'Cds',
    function($scope, Global, Cds) {
        $scope.global = Global;
        $scope.package = {
            name: 'cds'
        };
    }
]);
