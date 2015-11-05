'use strict';

var Hash = require('../');
var tape = require('tape');

tape('Hash.subscribe is defined', function(t) {
  t.plan(1);
  t.notEqual(Hash, null);
});

tape('Hash.subscribe is a singleton', function(t) {
  t.plan(1);
  var hashInstance = Hash;
  t.deepEqual(hashInstance, Hash);
});

tape('Hash can be initialized with a default hash', function(t) {
  t.plan(1);
  var initHash = 'foo=bar';
  Hash.init(initHash);
  t.equal(window.location.hash, '#'+initHash);
});

tape('The current hash can be retrieved as a string', function(t) {
  t.plan(1);
  var initHash = 'foo=bar';
  Hash.init(initHash);
  var currentHash = Hash.getHash();
  t.equal(currentHash, initHash);
});

tape('The hash can be set as a string and retrieved as an array of parameters', function(t) {
  t.plan(1);
  var initHash = 'foo=bar1,bar2&baz=qux';
  var mockHash = {'foo': ['bar1', 'bar2'], 'baz': ['qux']};
  Hash.init();
  Hash.setHash(initHash);
  var currentHashParams = Hash.getHashParams();

  t.deepEqual(currentHashParams, mockHash);
});
