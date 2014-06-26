'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Tag Schema
 */
var TagSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    parent_tag: {
        type: Schema.ObjectId,
        default: null
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    sid: {
        type: Number,
        default: 0
    }
});

/**
 * Validations
 */
TagSchema.path('name').validate(function(name) {
    return name.length;
}, 'Tag cannot be blank');

mongoose.model('Tag', TagSchema);
