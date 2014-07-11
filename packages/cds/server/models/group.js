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
    category_name: {
        type: String
    },
    order: {
        type: Number,
        default: 100
    },
    is_main: {
        type: Boolean,
        default: false
    },
    is_singleselect: {
        type: Boolean,
        default: false
    },
    access: {
        type: String
    },
    sid: {
        type: Number
    }
});

/**
 * Validations
 */
GroupSchema.path('name').validate(function(name) {
    return name.length;
}, 'Group cannot be blank');

mongoose.model('Group', GroupSchema);
