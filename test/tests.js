// jshint strict:false,undef:false

var assert = require('assert'),
  Hash = require('../');

describe('Hash.subscribe is defined', function() {
  var hashInstance;
  before(function() {
    hashInstance = Hash;
    hashInstance2 = Hash;
  });

  console.log(hashInstance);
  it('should be defined', function() {
    assert.notEqual(hashInstance, null);
  });

  it('should be a singleton', function() {
    assert.equal(hashInstance, hashInstance2);
  });
});
