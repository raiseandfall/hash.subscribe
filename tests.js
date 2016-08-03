'use strict';

var Hash = require('./');
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
  });

  t.test('Hash can be initialized with a default hash String', function(t) {
    t.plan(1);
    var initHash = 'foo=bar';
    Hash.init(initHash);
    t.equal(window.location.hash, '#'+initHash);
  });

  t.end();
});

test('Testing setters', function(t) {
  t.afterEach(function(t) {
    Hash.destroy();
    t.end();
  });

  t.test('Hash can be set with a default hash String containing the Hash character', function(t) {
    t.plan(1);
    var initHash = '#foo=bar';
    Hash.init(initHash);
    t.equal(window.location.hash, initHash);
  });

  t.test('Hash can be set with a default hash Object', function(t) {
    t.plan(1);
    var initHash = {'baz': ['qux','fubar']};
    var mockHashStr = '#baz=qux,fubar';
    Hash.init(initHash);
    t.equal(window.location.hash, mockHashStr);
  });

  t.test('Can update one parameter only', function(t) {
    t.plan(2);
    var initHash = {'baz': ['qux'], 'foo': ['bar']};
    Hash.init(initHash);
    t.equal(Hash.getHash(), 'baz=qux&foo=bar');
    Hash.updateHashKeyValue('foo', ['bar1', 'bar2']);
    t.equal(Hash.getHash(), 'baz=qux&foo=bar1,bar2');
  });

  t.test('Can delete one parameter only', function(t) {
    t.plan(2);
    var initHash = {'qux': ['baz'], 'bar': ['foo']};
    Hash.init(initHash);
    t.equal(Hash.getHash(), 'qux=baz&bar=foo');
    Hash.deleteParam('qux');
    t.equal(Hash.getHash(), 'bar=foo');
  });

  t.test('Can delete several parameters', function(t) {
    t.plan(2);
    var initHash = {'baz': ['qux'], 'foo': ['bar'], 'place': ['holder']};
    Hash.init(initHash);
    t.equal(Hash.getHash(), 'baz=qux&foo=bar&place=holder');
    Hash.deleteParam(['baz', 'place']);
    t.equal(Hash.getHash(), 'foo=bar');
  });

  t.end();
});

test('Testing getters', function(t) {
  // Before Each
  t.afterEach(function(t) {
    Hash.destroy();
    t.end();
  });

  t.test('getHash returns the hash as a string', function(t) {
    t.plan(1);
    var initHash = 'foo=bar';
    Hash.init(initHash);
    var currentHash = Hash.getHash();
    t.equal(currentHash, initHash);
  });

  t.test('getHash returns the hash as an array of parameters', function(t) {
    t.plan(1);
    var initHash = 'baz=qux&foo=bar1,bar2';
    var mockHash = {'foo': {values: ['bar1', 'bar2']}, 'baz': {values: ['qux']}};
    Hash.init(initHash);
    var currentHashParams = Hash.getParams();
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
    Hash.init(initHash);
    var updatedHash = 'foo=bar1';
    Hash.subscribe(['foo'], function(c) {
      if (c.foo.changed) {
        t.deepEqual(c.foo.values, ['bar1']);
      } else {
        t.fail();
      }
    });
    Hash.setHash(updatedHash);
  });

  t.test('Should be able to mute subscription', function(t) {
    t.plan(1);

    Hash.init('baz=qux');
    Hash.subscribe(['baz'], function(c) {
      if (c.baz.changed) {
        t.deepEqual(c.baz.values, ['qux2']);
      } else {
        t.fail();
      }
    });
    Hash.mute();
    Hash.setHash('baz=qux1');
    Hash.unmute();
    Hash.setHash('baz=qux2');
  });

  t.test('Should receive notification changed=false when hash param does not change', function(t) {
    t.plan(2);

    var initHash = 'bar=1&hoo=1';
    Hash.init(initHash);
    Hash.subscribe(['bar', 'hoo'], function(c) {
      t.equal(c.bar.changed, true);
      t.equal(c.hoo.changed, false);
    });
    window.location.hash = 'bar=2&hoo=1';
  });

  t.end();
});
