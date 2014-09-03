'use strict';

angular.module('mean.cds').controller('CdsController', ['$scope', '$modal', 'Global', 'Cds',
    function($scope, $modal, Global, Cds) {
        function changeCategory() {
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

            // load items
            changeFilter();
        }

        function changeFilter() {
            $scope.loadShopPageItems();
            $scope.load3dPageItems();
        }

        //Callbacks on paginator change
        $scope.loadShopPageItems = function() {
            filter.limit = $scope.pageCount;
            filter.skip = ($scope.shop.currentPage - 1) * $scope.pageCount;
            Cds.getItems($scope.category._id, 'shop', filter)
                .success(function(data) {
                    $scope.shop.items = data.result;
                    $scope.shop.total = data.total;
                })
                .error(errorHandler)
            ;
        };

        $scope.load3dPageItems = function() {
            filter.limit = $scope.pageCount;
            filter.skip = ($scope.d3.currentPage - 1) * $scope.pageCount;
            Cds.getItems($scope.category._id, '3d', filter)
                .success(function(data) {
                    $scope.d3.total = data.total;
                    $scope.d3.items = data.result;
                })
                .error(errorHandler)
            ;
        };

        $scope.toggleTag = function(tag, e) {
            toggleFilter('tags', tag, e);
        };

        $scope.toggleProp = function(prop, e) {
            toggleFilter('properties', prop, e);
        };

        function toggleFilter(type, fltr, e) {
            e.preventDefault();
            fltr.active = !fltr.active;
            var i = filter[type].indexOf(fltr.name);
            if(i === -1) {
                filter[type].push(fltr.name);
            }
            else {
                filter[type].splice(i, 1);
            }
            changeFilter();
        }

        $scope.deselectAll = function(groupName, e) {
            e.preventDefault();
            var isChanged = false;
            if(groupName === 'tags') {
                $scope.tags.forEach(function(tag) {
                    if(tag.active) {
                        isChanged = true;
                        tag.active = false;
                    }
                });
                filter.tags.length = 0;
            }
            else {
                $scope.fdata[groupName].forEach(function(p) {
                    if(p.active) {
                        isChanged = true;
                        p.active = false;
                        var i = filter.properties.indexOf(p.name);
                        if(i !== -1) {
                            filter.properties.splice(i, 1);
                        }
                    }
                });
            }
            if(isChanged) changeFilter();
        };

        function errorHandler(err) {
            console.log(err);
            showAlert('error', err.message);
        }

        function showAlert(message, type) {
            status.type = type || 'info';
            status.text = message;
        }

        function closePanel(panel) {
            if(panel === 'left') {
                if(model.showMode === 'right') {
                    model.showMode = 'both';
                }
                else {
                    model.showMode = 'right';
                }
            }
            else {
                if(model.showMode === 'left') {
                    model.showMode = 'both';
                }
                else {
                    model.showMode = 'left';
                }
            }
        }

        function openDetailsModal(item) {
            console.log('openDetailsModal:', item);
            $modal.open({
                templateUrl: 'itemDetailsModal.html',
                controller: function ($scope, $modalInstance, item) {
                    $scope.item = item;

                    $scope.close = function () {
                        $modalInstance.close();
                    };
                },
                size: 'lg',
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });
        }

        $scope.resetShopItems = function() {
            $scope.shop.items.forEach(function(item, index) {
                item.selected = '';
            });
        };
        $scope.global = Global;
        var model = $scope.model = {
            showMode: 'both',
            shopClass: ''
        };
        $scope.action = {
            close:       closePanel,
            //gotoPage:    gotoPage,
            openDetails: openDetailsModal
        };

        var status = {
        	type: 'error',
        	text: ''
        };
        var filter = {
            tags: [],
            properties: []
        };
        $scope.status = status;
        $scope.tags = [];
        $scope.fnames = [];
        $scope.fdata = {};
        $scope.d3 = {
            items: [],
            total: 0,
            currentPage: 1
        };
        $scope.shop = {
            items: 0,
            total: 0,
            currentPage: 1
        };
        $scope.pageCount = 5;
        $scope.shopHidden = false;
        $scope.d3Hidden = false;

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
    }
]);