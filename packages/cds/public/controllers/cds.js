'use strict';

angular.module('mean.cds').controller('CdsController', ['$scope', 'Global', 'Cds',
    function($scope, Global, Cds) {
        $scope.global = Global;
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
            total: 0
        };
        $scope.shop = {
            items: 0,
            total: 0
        };
        $scope.d3Pages = 0;
        $scope.shopPages = 0;
        $scope.pageCount = 9;
        $scope.shopPage = 1;
        $scope.d3Page = 1;

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
            load3dItems();
            loadShopItems();
        }

        function load3dItems() {
            filter.limit = $scope.pageCount;
            filter.skip = ($scope.d3Page - 1) * $scope.pageCount;
            Cds.getItems($scope.category._id, '3d', filter)
                .success(function(data) {
                    $scope.d3.items = data.result;
                    $scope.d3.total = data.total;
                    $scope.d3Pages = generatePages(data.total, $scope.pageCount, $scope.d3Page);
                })
                .error(errorHandler)
            ;
        }
        function loadShopItems() {
            filter.limit = $scope.pageCount;
            filter.skip = ($scope.shopPage - 1) * $scope.pageCount;
            Cds.getItems($scope.category._id, 'shop', filter)
                .success(function(data) {
                    $scope.shop.items = data.result;
                    $scope.shop.total = data.total;
                    $scope.shopPages = generatePages(data.total, $scope.pageCount, $scope.shopPage);
                })
                .error(errorHandler)
            ;
        }

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

        function generatePages(total, pageCount, pageCurrent) {
            var n = Math.ceil(total / pageCount);
            var pages = [];
            for(var i = 1, np; i <= n; i++) {
                if(i === 1 || i === n || pageCurrent === i || (i === 2 && pageCurrent === 3) || (i === n - 1 && pageCurrent === n - 2)) {
                    pages.push({t:i, n:i});
                }
                else {
                    if(i < pageCurrent) {
                        np = Math.round((pageCurrent - i) / 2) + i;
                        i = pageCurrent - 1;
                    }
                    else {
                        np = Math.round((n - i) / 2) + i;
                        i = n - 1;
                    }
                    pages.push({t:'...', n:np});
                }
            }
            return pages;
        }

        $scope.gotoPage = function(e) {
            e.preventDefault();
            $scope.shopPage = parseInt(e.target.hash.substr(1), 10);
            loadShopItems();
        };
    }
]);
