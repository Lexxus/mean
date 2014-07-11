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
        $scope.fnames = [];
        $scope.fdata = {};
        $scope.d3items = [];
        $scope.shopitems = [];

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
	        	.error(errorHandler)
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

            // load tags
            Cds.getTags($scope.category._id)
                .success(function(data) {
                    $scope.tags = data;
                })
                .error(errorHandler)
            ;

            // load filter groups
            Cds.getGroups($scope.category._id, true)
                .success(function(data) {
                    if(!data || !data.length) return;
                    $scope.fgroups = data;
                    getProperties();
                })
                .error(errorHandler)
            ;

            // load properties
            function getProperties() {
                Cds.getProperties($scope.category._id)
                    .success(function(data) {
                        if(!data || !data.length) return;
                        var fdata = {}, g;
                        data.forEach(function(p) {
                            if(g !== p.group_name) {
                                g = p.group_name;
                                if(!fdata[g]) fdata[g] = [];
                            }
                            fdata[g].push({
                                _id: p._id,
                                name: p.name
                            });
                        });
                        $scope.fdata = fdata;
                    })
                    .error(errorHandler)
                ;
            }
            // load items
            changeFilter();
        }

        function changeFilter() {
            Cds.getItems($scope.category._id, '3d')
                .success(function(data) {
                    $scope.d3items = data;
                })
                .error(errorHandler)
            ;
            Cds.getItems($scope.category._id, 'shop')
                .success(function(data) {
                    $scope.shopitems = data;
                })
                .error(errorHandler)
            ;
        }

        function errorHandler(err) {
            console.log(err);
            showAlert('error', err.message);
        }

        function showAlert(message, type) {
            status.type = type || 'info';
            status.text = message;
        }
    }
]);
