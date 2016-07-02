'use strict';

var path = require('path');

var basePath = '../../';
var absoluteBasePath = path.resolve(path.join(__dirname, basePath));

module.exports = function (karma)
{
    karma.set({
        basePath: basePath,

        frameworks: [
            'browserify',
            'jasmine',
            'jasmine-matchers'
        ],

        files: [
            {pattern: 'node_modules/karma-jasmine-html-reporter/src/css/jasmine.css'},
            {pattern: 'node_modules/karma-jasmine-html-reporter/src/lib/html.jasmine.reporter.js'},
            {pattern: 'node_modules/karma-jasmine-html-reporter/src/lib/adapter.js'},
            'test/**/*Spec.js'
        ],

        preprocessors: {
            'test/**/*Spec.js': ['browserify', 'env']
        },

        reporters: [
            'spec'
        ],

        browsers: ['PhantomJS'],

        browserNoActivityTimeout: 30000,

        singleWatch: false,
        autoWatch: true,

        browserify: {
            debug: true,
            paths: [ absoluteBasePath ]
        }
    });
};