'use strict';

var mongoose = require('mongoose');
var Item = mongoose.model('Item');

exports.getItems = function(req, res, next) {
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
	var options = {
		limit: 9
	};

	var type = req.params.type;
	if(type) {
		if(type === '3d') {
			query.file_src = {$ne:''};
		}
		else if(type === 'shop') {
			query.file_src = '';
		}
	}

	var keys = Object.keys(req.query);
	if(keys.length) {
		keys.forEach(function(k) {
			if(k === 'from') {
				var skip = parseInt(req.query.from, 10);
				if(!isNaN(skip)) options.skip = skip;
				return;
			}
			if(k === 'limit') {
				var limit = parseInt(req.query.limit, 10);
				if(!isNaN(limit)) options.limit = limit;
			}
			var ss = req.query[k].split(',');
			if(ss.length === 1) {
				query[k] = ss[0];
			}
			else {
				query[k] = {$in:ss};
			}
		});
	}
	Item.find(query, fields, options, function(err, items) {
		if(err) return next(err);
		res.json(items);
	});
};