'use strict'

var tape = require('tape');
var Hash = require('../');

tape('Hash.subscribe is defined', function(t) {
  t.plan(1);
  t.notEqual(Hash, null);
});

tape('Hash.subscribre is a singleton', function(t) {
  t.plan(1);
  var hashInstance = Hash;
  t.equal(hashInstance, Hash);
});

