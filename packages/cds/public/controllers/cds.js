'use strict';

angular.module('mean.cds').controller('CdsController', ['$scope', 'Global', 'Cds',
    function($scope, Global, Cds) {
        $scope.global = Global;
        var status = {
        	type: 'error',
        	text: ''
        };
        $scope.status = status;

        if(Global.categories) {
        	$scope.categories = Global.categories;
            changeCategory();
        }
        else {
	        Cds.getCategories()
	        	.success(function(data) {
	        		Global.categories = data;
	        		$scope.categories = data;
                    changeCategory();
	        	})
	        	.error(function(err) {
	        		console.log(err);
	        		status.type = 'error';
	        		status.text = err.message;
	        	})
	        ;
	    }

        window.addEventListener('hashchange', changeCategory, false);

        function changeCategory() {
            var cat = window.location.hash.split('/').pop();
            if(!$scope.categories) return;
            var isNotValid = $scope.categories.every(function(c) {
                return c.name !== cat; 
            });
            if(isNotValid) return;
            $scope.category = cat;
        }
    }
]);
