'use strict';

// there has to be a better way to bootstrap package models for mocha tests
require('../../../server/models/tag');

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    Tag = mongoose.model('Tag');

//Globals
var tag;

//The tests
describe('<Unit Test>', function() {
    describe('Model Tag:', function() {
        beforeEach(function(done) {
            tag = new Tag({
                name: 'Tag name',
                parent: null
            });
            done();
        });

        describe('Method Save', function() {
            it('should be able to save without problems', function(done) {
                return tag.save(function(err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should be able to show an error when try to save without name', function(done) {
                tag.name = '';

                return tag.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        afterEach(function(done) {
            tag.remove();
            done();
        });
    });
});
