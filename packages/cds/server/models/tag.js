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
    parent: {
        type: String,
        default: '',
        trim: true
    },
    hidden: {
        type: Boolean,
        default: false
    }
});

/**
 * Validations
 */
TagSchema.path('name').validate(function(name) {
    return name.length;
}, 'Tag cannot be blank');

mongoose.model('Tag', TagSchema);
