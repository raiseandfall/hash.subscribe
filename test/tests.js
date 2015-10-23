'use strict';

var assert = require('assert'),
  Hash = require('../');

describe('Hash.subscribe is defined', function() {
  var hashInstance,
    hashInstance2;
  before(function() {
    hashInstance = Hash;
    hashInstance2 = Hash;
  });

  console.log(hashInstance);
  it('should be defined', function() {
    assert.notEqual(hashInstance, null);
  });

  it('should be a singleton', function() {
    assert.deepEqual(hashInstance, hashInstance2);
  });
});
