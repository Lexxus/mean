'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Property Schema
 */
var PropertySchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    group: {
        type: Schema.ObjectId,
        ref: 'Group'
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category'
    }
});

/**
 * Validations
 */
PropertySchema.path('name').validate(function(name) {
    return name.length;
}, 'Property cannot be blank');

mongoose.model('Property', PropertySchema);
