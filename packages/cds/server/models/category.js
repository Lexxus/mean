'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Category Schema
 */
var CategorySchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    sid: {
        type: Number,
        default: 0
    },
    access: {
        type: String,
        default: ''
    }
});

/**
 * Validations
 */
CategorySchema.path('name').validate(function(name) {
    return name.length;
}, 'Tag cannot be blank');

mongoose.model('Category', CategorySchema);
