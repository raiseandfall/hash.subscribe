# Hash.subscribe 

[![Build
Status](https://travis-ci.org/raiseandfall/hash.subscribe.svg)](https://travis-ci.org/raiseandfall/hash.subscribe)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

A browser hash listener system using query string style parameters ( `#foo=bar&baz=qux` ), based on the subscribe design pattern.  

Features:  
- Browser Hash initialization
- Subscribe to Hash specific parameters
- Set specific Hash parameter
- Mute / Unmute subscription

## [CHANGELOG](./CHANGELOG.md)

## INSTALL
```shell
$ npm install hash.subscribe
```

## USAGE
```javascript
var Hash = require('hash.subscribe');

// Init browser hash
Hash.init('foo=bar');

// Set parameters (object)
Hash.setHash({
  foo: ['bar'],
  baz: ['qux']
});

// Set hash (string)
Hash.setHash('foo=bar&baz=qux');

// Update one key value
Hash.updateHashKeyValue('foo', ['bar1', 'bar2']);

// Delete one param
Hash.deleteParam('baz');

// Subscribe to parameter(s)
Hash.subscribe(['foo', 'baz'], function(params) {
  if (params.foo.changed) {
    console.log('Param Foo has changed : ' + params.foo.values);
  }
});

// More examples in the test file...
```

## API

### `init(hash)`
Parameter:  
- `hash` - String | Object - default hash to initialize the page with

### `getHash(keepHash)`
Get current hash  
Parameter:  
- `keepHash` - Boolean - whether or not to keep the hash character in the return string  
Returns: String

### `getParams`
Get current hash parameters  
Returns: Object

### `getParam(key)`
Get values of one hash parameter  
Parameter:  
- `key` - string - parameter name  
Returns: Array

### `setHash(hash)`
Updates current hash  
Parameter:  
- `hash` - String | Object - new hash

### `updateHashKeyValue(key, value)`
Updates one hash key  
Parameters:  
- `key` - String - hash key to update  
- `value` - Array - new value(s) for key  

### `deleteParam(params)`
Deletes hash param(s)  
Parameter:  
- `params` - String | Array - param(s) name(s) to delete

### `subscribe([hashParameters], callback)`
Subscribe to specific parameters  
Parameters:  
- `hashParameters` - Array - Array of parameters names you want to subscribe to
- `callback` - Function - Callback function called when a parameter has changed

### `mute()`
Mutes subscription to Hash

### `unmute()`
Resume subscription to Hash  

### `destroy()` 
Destroys current hash value

## CONTRIBUTE

### Development task
```shell
$ git clone git@github.com:raiseandfall/Hash.subscribe.git && cd Hash.subscribe
$ npm run dev
```

### Run tests independently
```shell
$ npm run test
```

## LICENSE
MIT
