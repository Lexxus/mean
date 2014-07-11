'use strict';

angular.module('mean.cds')
.factory('Cds', ['$http',
    function($http) {
        return {
            getCategories: function() {
            	return $http.get('/cds/category');
            },
            getCategoryById: function(id) {
            	return $http.get('/cds/category/'+id);
            },
            getTags: function(categoryId) {
                return $http.get('/cds/tags/'+ categoryId);
            },
            getGroups: function(categoryId, isMain) {
                return $http.get('/cds/groups/'+ categoryId +(isMain ? '?is_main=1' : ''));
            },
            getProperties: function(categoryId) {
                return $http.get('/cds/properties/'+ categoryId);
            },
            getItems: function(categoryId, type, params) {
                var uri = '/cds/items/'+ categoryId;
                if(type) {
                    uri += '/'+ type;
                }
                if(typeof params === 'object') {
                    var p = Object.keys(params).map(function(k) {
                        return k +'='+ params[k];
                    });
                    uri += '?'+ p.join('&');
                }
                console.log('GET', uri);
                return $http.get(uri);
            }
        };
    }
]);
