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
    group_name: {
        type: String,
        default: ''
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    category_name: {
        type: String,
        default: ''
    },
    sid: {
        type: Number,
        default: 0
    }
});

/**
 * Validations
 */
PropertySchema.path('name').validate(function(name) {
    return name.length;
}, 'Property cannot be blank');

mongoose.model('Property', PropertySchema);
