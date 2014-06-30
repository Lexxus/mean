'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Group Schema
 */
var GroupSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category',
        default: null
    },
    category_name: {
        type: String,
        default: ''
    },
    access: {
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
GroupSchema.path('name').validate(function(name) {
    return name.length;
}, 'Group cannot be blank');

mongoose.model('Group', GroupSchema);
