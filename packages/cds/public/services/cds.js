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
            }
        };
    }
]);
