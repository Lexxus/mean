'use strict';

var mongoose = require('mongoose');
var Group = mongoose.model('Group');

exports.getGroups = function(req, res, next) {
	var query = {
		category: req.params.cat_id
	};
	var fields = {
		category: false,
		category_name: false,
		sid: false,
		access: false,
		__v: false
	};
	var sort = {
		order: 1
	};
	if(req.query.is_main) {
		query.is_main = true;
	}
	Group.find(query, fields, {sort:sort}, function(err, groups) {
		if(err) return next(err);
		res.json(groups);
	});
};