'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Item Schema
 */
var ItemSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    image_src: {
        type: String,
        default: ''
    },
    file_src: {
        type: String,
        default: ''
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    tags: {
        type: Array,
        default: []
    },
    properties: {
        type: Array,
        default: []
    }
});

/**
 * Validations
 */
ItemSchema.path('name').validate(function(name) {
    return name.length;
}, 'Property cannot be blank');
ItemSchema.path('category').validate(function(category) {
    return !!category;
}, 'Category is mandatory');

mongoose.model('Item', ItemSchema);
