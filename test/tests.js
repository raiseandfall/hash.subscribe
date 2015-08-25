// jshint strict:false,undef:false

var assert = require('assert'),
  Hash = require('../');

describe('Hash', function() {
  var hashInstance;
  before(function() {
    hashInstance = Hash.getInstance();
  });
  it('should be a singleton', function() {
    assert.equal(hashInstance, Hash.getInstance());
  });
});
