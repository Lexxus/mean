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
        ref: 'Category'
    },
    hidden: {
        type: Boolean,
        default: false
    }
});

/**
 * Validations
 */
GroupSchema.path('name').validate(function(name) {
    return name.length;
}, 'Group cannot be blank');

mongoose.model('Group', GroupSchema);
