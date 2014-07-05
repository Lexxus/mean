'use strict';

var mongoose = require('mongoose');
var Tag = mongoose.model('Tag');

exports.getTags = function(req, res, next) {
	var query = {
		category: req.params.cat_id,
		parent_tag: null
	};
	Tag.find(query, function(err, tags) {
		if(err) return next(err);
		res.json(tags);
	});
};