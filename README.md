# Hash.subscribe  [![Build Status](https://travis-ci.org/raiseandfall/Hash.subscribe.svg)](https://travis-ci.org/raiseandfall/Hash.subscribe)

A browser hash listener system using query string style parameters ( `#foo=bar&baz=qux` ), based on the subscribe design pattern.  

Features:  
- Browser Hash initialization
- Subscribe to Hash specific parameters
- Set specific Hash parameter
- Mute / Unmute subscription

## Still in early development.

## [CHANGELOG](./CHANGELOG.md)

## INSTALL
Coming soon.

## USAGE
```javascript
var Hash = require('hash.subscribe');

// Init browser hash
Hash.init('foo=bar');

// Subscribe to parameter(s)
Hash.subscribe(['foo', 'baz'], function(params) {
  if (params.foo.changed) {
    console.log('Param Foo has changed : ' + params.foo.values);
  }
});

// Set parameters
myHash.setHashParams({
  foo: ['bar'],
  baz: ['qux']
});
```

## API

### `init(hash)`
Parameter:  
- `hash` - String - default hash to initialize the page with

### `subscribe([hashParameters], callback)`
Parameters:  
- `hashParameters` - Array - Array of parameters names you want to subscribe to
- `callback` - Function - Callback function called when a parameter has changed

### ``

## CONTRIBUTE


## LICENSE
MIT
