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
        default: '',
        trim: true
    },
    hidden: {
        type: Boolean,
        default: false
    },
    access: {
        type: Array,
        default: []
    }
});

/**
 * Validations
 */
CategorySchema.path('name').validate(function(name) {
    return name.length;
}, 'Tag cannot be blank');

mongoose.model('Category', CategorySchema);
