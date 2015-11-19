'use strict';

var Hash = require('../');
var test = require('tapes');

test('Testing initialization', function(t) {
  // Before Each
  t.afterEach(function(t) {
    Hash.destroy();
    t.end();
  });

  t.test('Hash.subscribe is defined', function(t) {
    t.plan(1);
    t.notEqual(Hash, null);
  });

  t.test('Hash.subscribe is a singleton', function(t) {
    t.plan(1);
    var hashInstance = Hash;
    t.deepEqual(hashInstance, Hash);

    t.test('teardown', function(t) {
      Hash.destroy();
    });
  });

  t.test('Hash can be initialized with a default hash String', function(t) {
    t.plan(1);
    var initHash = 'foo=bar';
    Hash.init(initHash);
    t.equal(window.location.hash, '#'+initHash);
  });

  t.test('Hash can be initialized with a default hash String containing the Hash character', function(t) {
    t.plan(1);
    var initHash = '#foo=bar';
    Hash.init(initHash);
    t.equal(window.location.hash, initHash);
  });

  t.test('Hash can be initialized with a default hash Object', function(t) {
    t.plan(1);
    var initHash = {'foo': ['bar']};
    var mockHashStr = '#foo=bar';
    Hash.init(initHash);
    t.equal(window.location.hash, mockHashStr);
  });

  t.end();
});

test('Testing Hash Manipulation', function(t) {
  // Before Each
  t.afterEach(function(t) {
    Hash.destroy();
    t.end();
  });

  t.test('The current hash can be retrieved as a string', function(t) {
    t.plan(1);
    var initHash = 'foo=bar';
    Hash.init(initHash);
    var currentHash = Hash.getHash();
    t.equal(currentHash, initHash);
  });

  t.test('The hash can be set as a string and retrieved as an array of parameters', function(t) {
    t.plan(1);
    var initHash = 'foo=bar1,bar2&baz=qux';
    var mockHash = {'foo': ['bar1', 'bar2'], 'baz': ['qux']};
    Hash.init();
    Hash.setHash(initHash);
    var currentHashParams = Hash.getHashParams();
    t.deepEqual(currentHashParams, mockHash);
  });

  t.end();
});

test('Testing Hash Subscription', function(t) {
  // Before Each
  t.afterEach(function(t) {
    Hash.destroy();
    t.end();
  });

  t.test('Should be able to subscribe to Hash and receive change notifications', function(t) {
    t.plan(1);

    var initHash = 'foo=bar';
    var updatedHash = 'foo=bar1';
    Hash.subscribe(['foo'], function(c) {
      if (c.foo.changed) {
        t.deepEqual(c.foo.values, ['bar']);
      } else {
        t.fail();
      }
    });
    Hash.init(initHash);
    //Hash.setHash(updatedHash);
  });

  t.test('Should be able to subscribe to only specific parameters', function(t) {
    //t.plan(1);
    t.end();
  });

  t.test('Should be able to mute subscription', function(t) {
    //t.plan(1);
    t.end();
  });

  t.test('Should be able to resume subscription', function(t) {
    //t.plan(1);
    t.end();
  });

  t.end();
});
