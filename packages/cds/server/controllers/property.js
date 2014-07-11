'use strict';

var mongoose = require('mongoose');
var Property = mongoose.model('Property');

exports.getProps = function(req, res, next) {
	var query = {
		category: req.params.cat_id
	};
	var fields = {
		_id: true,
		name: true,
		group_name: true
	};
	var sort = {
		group_name: 1,
		name: 1
	};
	Property.find(query, fields, {sort:sort}, function(err, props) {
		if(err) return next(err);
		res.json(props);
	});
};