/*
 * grunt-amd-shim
 * https://github.com/benignware/grunt-amd-shim
 *
 * Copyright (c) 2014 rexblack
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    amd_shim: {
      jquery: {
        options: {
          globals: ['$', 'jQuery'] 
        },
        files: {
          'tmp/jquery': ['test/fixtures/jquery.min.js']
        }
      }, 
      mediaelement: {
        options: {
          exports: 'mejs', 
          dependencies: {
            jquery: '$'
          }, 
          globals: {
            mejs: 'my_mejs', 
            MediaElement: ''
          }
        },
        files: {
          'tmp/mediaelement': ['test/fixtures/mediaelement-and-player.min.js']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'amd_shim', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
