'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    mysql = require('mysql'),
    config = require('../config/config'),
    mysqlReady = false;

var Category = mongoose.model('Category'),
	Tag = mongoose.model('Tag');

var mysqlConnection = mysql.createConnection(config.mysql);
mysqlConnection.connect(function(err) {
	if(err) {
		console.log('MySQL connection error:', err);
	}
	else {
		console.log('MySQL connection successfull');
		mysqlReady = true;
	}
});

/**
 * Migrate Categories
 */
exports.migrateCategories = function(req, res) {
	var q = 'SELECT * FROM c_type';
	mysqlConnection.query(q, function(err, types) {
		if(err) {
			res.send(400, 'MySQL query error: '+ JSON.stringify(err));
		}
		else if(Array.isArray(types)) {
			var data = types.map(function(t) {
				return {
					name: t.name,
					sid: t.id
				};
			});
			Category.create(data, function(err, dt) {
				if(err) res.json(500, err);
				else res.send(200, 'Successfully migrated '+ data.length +' records.');
			})
		}
		else {
			res.send(400, 'Categories not found');
		}
	});
};

/**
 * Migrate Tags
 */
exports.migrateTags = function(req, res) {
	var q = 'SELECT * FROM c_tag WHERE id=70';
	mysqlConnection.query(q, function(err, tags) {
		if(err) {
			res.send(400, 'MySQL query error: '+ JSON.stringify(err));
		}
		else if(Array.isArray(tags)) {
			// var data = types.map(function(t) {
			// 	return {
			// 		name: t.name,
			// 		sid: t.id
			// 	};
			// });
			// Category.create(data, function(err, dt) {
			// 	if(err) res.json(500, err);
			// 	else res.send(200, 'Successfully migrated '+ data.length +' records.');
			// })
			res.send(200, tags[0].name);
		}
	});
};

/**
 * Migrate Properties
 */
exports.migrateProperties = function(req, res) {
	res.send(200, mysqlReady ? 'OK' : 'MySQL not connected');
};