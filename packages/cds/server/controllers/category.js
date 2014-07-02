'use strict';

var mongoose = require('mongoose');
var Category = mongoose.model('Category');

exports.getCategory = function(req, res, next) {
	var id = req.params.id,
		query = id ? {_id:id} : {};

	if(req.user) {
		if(req.user.roles.indexOf('') === -1) {
			req.user.roles.push('');
		}
		query.access = {
			$in:req.user.roles
		};
	}
	console.log('query:', query);
	Category.find(query, function(err, categories) {
		if(err) return next(err);
		res.json(categories);
	});
};