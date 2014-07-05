'use strict';

angular.module('mean.cds').controller('CdsController', ['$scope', 'Global', 'Cds',
    function($scope, Global, Cds) {
        $scope.global = Global;
        var status = {
        	type: 'error',
        	text: ''
        };
        $scope.status = status;
        $scope.tags = [];

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
	        		showAlert('error', err.message);
	        	})
	        ;
	    }

        window.addEventListener('hashchange', changeCategory, false);

        function changeCategory() {
            var catName = window.location.hash.split('/').pop();
            if(!$scope.categories) return;
            var isNotValid = $scope.categories.every(function(c) {
                var isCat = c.name === catName;
                if(isCat) {
                    $scope.category = c;
                }
                return !isCat;
            });
            if(isNotValid) return;

            Cds.getTags($scope.category._id)
                .success(function(data) {
                    $scope.tags = data;
                    console.log(data);
                })
                .error(function(err) {
                    console.log(err);
                    showAlert('error', err.message);
                })
            ;
        }

        function showAlert(message, type) {
            status.type = type || 'info';
            status.text = message;
        }
    }
]);
