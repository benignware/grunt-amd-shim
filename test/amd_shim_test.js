'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.amd_shim = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  jquery: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/jquery');
    var expected = grunt.file.read('test/expected/jquery');
    test.equal(actual, expected, 'jquery should be properly shimmed');

    test.done();
    
  }, 
  mediaelement: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/mediaelement');
    var expected = grunt.file.read('test/expected/mediaelement');
    test.equal(actual, expected, 'mediaelement should be properly shimmed');

    test.done();
    
  }
};
