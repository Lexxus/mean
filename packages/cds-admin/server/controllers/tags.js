'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Tag = mongoose.model('Tag');

/**
 * Find tags by parent
 */
exports.find = function(req, res) {
	var query = {
		parent: req.params.parent || null
	};
	Tag.find(query).sort('name').exec(function(err, tags) {
		if(err) {
			return res.render('500', process.env.NODE_ENV !== 'production' ? JSON.stringify(err) : 'Some terrible bugs destroy the system :(');
		}
		res.json(tags);
	});
};