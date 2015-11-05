'use strict'

var tape = require('tape');
var Hash = require('../hash');
console.log('t:', Hash);

tape('Hash.subscribe is defined', function(t) {
  t.plan(1);
  t.notEqual(Hash, null);
});

tape('Hash.subscribe is a singleton', function(t) {
  t.plan(1);
  var hashInstance = Hash;
  t.deepEqual(hashInstance, Hash);
});

tape('Hash can be initialized', function(t) {
  t.plan(1);
  var initHash = 'foo=bar';

console.log('t:',Hash);

  //Hash.init(initHash);

  console.log(window.location.hash);

  t.equal(window.location.hash, initHash);
});
