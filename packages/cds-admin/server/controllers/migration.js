'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    mysql = require('mysql'),
    config = require('../config/config'),
    mysqlReady = false;

var Category = mongoose.model('Category'),
	Tag = mongoose.model('Tag'),
	Group = mongoose.model('Group'),
	Property = mongoose.model('Property'),
	Item = mongoose.model('Item');

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
			res.send(500, 'MySQL query error: '+ JSON.stringify(err));
		}
		else if(Array.isArray(types)) {
			var data = types.map(function(t) {
				return {
					name: t.name,
					sid: t.id
				};
			});
			Category.create(data, function(err) {
				if(err) res.json(500, err);
				else res.send(200, 'Categories successfully migrated '+ data.length +' records.');
			});
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
	Category.find(function(err, cats) {
		if(err) {
			return res.json(500, err);
		}
		var categories = {};
		cats.forEach(function(cat) {
			categories[cat.sid] = {
				id: cat._id,
				name: cat.name
			};
		});
		var q = 'SELECT * FROM c_tag';
		mysqlConnection.query(q, function(err, tags) {
			if(err) {
				res.send(500, 'MySQL query error: '+ JSON.stringify(err));
			}
			else if(Array.isArray(tags)) {
				var tt = {}, ts = {};
				var data = tags.map(function(t) {
					var cat = categories[t.type_id];
					var tag = {
						name: t.name,
						sid: t.id
					};
					if(cat) {
						tag.category = cat.id;
						tag.category_name = cat.name;
					}
					if(t.tag_id > 0) {
						tt[t.id] = t.tag_id;
						ts[t.tag_id] = null;
					}
					return tag;
				});
				Tag.create(data, function(err) {
					if(err) return res.json(500, err);
					Tag.find({sid:{$in:Object.keys(ts)}}, function(err, tags) {
						tags.forEach(function(tag) {
							ts[tag.sid] = {
								id: tag._id,
								name: tag.name,
								cat_id: tag.category,
								cat_name: tag.category_name
							};
						});
						Tag.find({sid:{$in:Object.keys(tt)}}, function(err, tags) {
							tags.forEach(function(tag) {
								var d = ts[tt[tag.sid]];
								tag.parent_tag = d.id;
								tag.parent_tag_name = d.name;
								tag.category = d.cat_id;
								tag.category_name = d.cat_name;
								tag.save();
							});
							console.log(tags);
							res.send(200, 'Tags successfully migrated '+ data.length +' records.');
						});
					});
				});
			}
		});
	});
};

/**
 * Migrate Properties
 */
exports.migrateProperties = function(req, res) {
	Category.find(function(err, cats) {
		if(err) {
			return res.json(500, err);
		}
		var categories = {};
		cats.forEach(function(cat) {
			categories[cat.sid] = {
				id: cat._id,
				name: cat.name
			};
		});
		var q = 'SELECT * FROM c_property_group';
		mysqlConnection.query(q, function(err, groups) {
			if(err) {
				res.send(500, 'MySQL query error: '+ JSON.stringify(err));
			}
			else if(Array.isArray(groups)) {
				var grData = groups.map(function(g) {
					var cat = categories[g.type_id];
					var group = {
						name: g.name,
						sid: g.id
					};
					if(cat) {
						group.category = cat.id;
						group.category_name = cat.name;
					}
					return group;
				});
				Group.create(grData, function(err) {
					if(err) return res.json(500, err);
					Group.find(function(err, groups) {
						if(err) return res.json(500, err);
						var g = {};
						groups.forEach(function(group) {
							g[group.sid] = {
								id: group._id,
								name: group.name
							};
						});
						properties(g);
					});
				});
			}
		});
		function properties(g) {
			var q = 'SELECT * FROM c_property';
			mysqlConnection.query(q, function(err, props) {
				if(err) {
					res.send(500, 'MySQL query error: '+ JSON.stringify(err));
				}
				else if(Array.isArray(props)) {
					var pData = props.map(function(p) {
						var prop = {
							name: p.name,
							sid: p.id
						};
						if(p.group_id > 0) {
							prop.group = g[p.group_id].id;
							prop.group_name = g[p.group_id].name;
						}
						if(p.type_id > 0) {
							prop.category = categories[p.type_id].id;
							prop.category_name = categories[p.type_id].name;
						}
						return prop;
					});
					Property.create(pData, function(err) {
						if(err) return res.json(500, err);
						console.log(pData);
						res.send(200, 'Groups were successfully migrated '+ g.length +' records. Properties were successfully migrated '+ pData.length +' records.');
					});
				}
			});
		}
	});
};

/**
 * Migrate Items
 */
exports.migrateItems = function(req, res) {
	var categories = {},
		props = {},
		tags = {};
	var async = require('async');
	async.parallel([
		function(cb) {
			Category.find(function(err, cats) {
				if(err) return cb(err);
				cats.forEach(function(cat) {
					categories[cat.sid] = {
						id: cat._id,
						name: cat.name
					};
				});
				cb();
			});
		},
		function(cb) {
			Property.find(function(err, ps) {
				if(err) return cb(err);
				ps.forEach(function(p) {
					props[p.sid] = {
						id: p._id,
						name: p.name
					};
				});
				cb();
			});
		},
		function(cb) {
			Tag.find(function(err, ts) {
				if(err) return cb(err);
				ts.forEach(function(t) {
					tags[t.sid] = {
						id: t._id,
						name: t.name
					};
				});
				cb();
			});
		}
	],  function(err) {
		if(err) return res.json(500, err);
		var q = 'SELECT * FROM c_item ORDER BY id LIMIT ',
			n = 0;
		function getItem() {
			mysqlConnection.query(q+ n +',1', function(err, row) {
				if(err) return res.json(500, err);
				if(!row || !row.length) return res.send(200, 'Items migrated - '+ n);
				saveItem(row[0], function(err) {
					if(err) res.json(500, err);
					else getItem(n++);
				});
			});
		}
		getItem();
	});

	function saveItem(row, done) {
		async.series({
			// get tags of the item
			ts: function(cb) {
				mysqlConnection.query('SELECT * FROM c_item_tag WHERE item_id='+ row.id, cb);
			},
			// get properties of the item
			ps: function(cb) {
				mysqlConnection.query('SELECT * FROM c_item_property WHERE item_id='+ row.id, cb);
			}
		},  function(err, r) {
			if(err) return done(err);
			var ts = r.ts[0],
				ps = r.ps[0];
			var item = {
				name: row.name,
				description: row.description,
				image_src: row.image_src,
				file_src: row.file_src,
				category: row.type_id,
				category_name: categories[row.type_id].name,
				tags: ts.map(function(t) {
					var tag = tags[t.tag_id];
					if(tag) return tag.name;
				}),
				properties: ps.map(function(p) {
					var prop = props[p.property_id];
					if(prop) return prop.name;
				}),
				creation_date: row.creation_date
			};
			Item.create(item, done);
		});
	}
};