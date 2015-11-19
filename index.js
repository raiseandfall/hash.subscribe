var clone = require('clone');

var Subscriber = function (hashParams, cb) {
  'use strict';

  var _subscriptions = hashParams;
  var _cb = cb;

  var notify = function (params) {
    _cb.call(this.params);
  };

  return {
    subscriptions: _subscriptions,
    notify: notify
  };
};

var Hash = (function () {
  'use strict';

  // Init
  var _fn = {
    hash: '',
    hashParams: {},
    subscribers: [],
    subscribedPerParams: {},
    history: window.history,
    muted: false
  };

  /**
   * @function    init
   * @description Called to initialize, optionally giving a default hash
   *
   * @param       defaultHash - Array | String - default hash
   *
   **/
  var init = function (defaultHash) {
    // Setup
    if (isHashChangeSupported()) {
      if (window.addEventListener) {
        window.addEventListener('hashchange', checkIfHashHasChanged, false);
      } else if (window.attachEvent) {
        window.attachEvent('onhashchange', checkIfHashHasChanged);
      }
    } else {
      // Change Opera navigation mode to improve history support.
      if (_fn.history.navigationMode) {
        _fn.history.navigationMode = 'compatible';
      }
      setInterval(checkIfHashHasChanged, 50);
    }

    // First default hash ( direct access or default )
    var curHash = getHash();
    if (curHash !== '') {
      checkIfHashHasChanged();
    } else if (defaultHash) {
      setHash(defaultHash);
    }
  };

  /**
   * @function    destroy
   * @description Destroy current Hash & subscribers
   *
   **/
  var destroy = function () {
    // Destroy subscribers
    _fn.subscribers = [];
    // Destroy hash
    setHash('');
    // history.pushState('', document.title, window.location.pathname);
  };

  // @function      isArr
  // @role          is the element an array
  // @returns       boolean
  //
  var isArr = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  // @function      areEqual
  // @role          are two values equal
  // @returns       boolean
  //
  var areEqual = function (obj1, obj2) {
    // If new obj2 is undefined or null -> new param
    if (typeof obj2 === 'undefined' || obj2 === null) {
      return true;
    }

    // Strings ?
    if (typeof obj1 === 'string') {
      return obj1 === obj2;
    // Arrays ?
    } else if (isArr(obj1) && isArr(obj2)) {
      if (obj1.length !== obj2.length) {
        return true;
      }
      return obj1.sort().join() !== obj2.sort().join();
    }
  };

  // @function      getHash
  // @role          get current hash
  // @returns       string
  //
  var getHash = function () {
    var index = window.location.href.indexOf('#');
    return (index === -1 ? '' : window.location.href.substr(index + 1));
  };

  // @function      isHashChangeSupported
  // @role          check if hash changed is supported
  // @returns       boolean
  //
  var isHashChangeSupported = function () {
    var eventName = 'onhashchange';
    var isSupported = (eventName in document.body);
    if (!isSupported) {
      document.body.setAttribute(eventName, 'return;');
      isSupported = typeof document.body[eventName] === 'function';
    }
    // documentMode logic from YUI to filter out IE8 Compat Mode (which generates false positives).
    return isSupported && (document.documentMode === undefined || document.documentMode > 7);
  };

  // @function      checkIfHashHasChanged
  // @role          check if hash changed
  //
  var checkIfHashHasChanged = function () {
    var curHash = getHash();
    if (curHash !== _fn.hash && !_fn.muted) {
      // Hash has changed
      hashHasChanged(curHash);

      // Save for later
      _fn.hash = curHash;
      _fn.hashParams = clone(getHashParams(curHash));
    }

    if (_fn.muted) {
      unmute();
    }
  };

  // @function      setHash
  // @role          set hash
  //
  var setHash = function (newHash) {
    // Type
    if (typeof newHash !== 'string') {
      newHash = buildHashFromParams(newHash);
    }
    console.log('1 - PASS', newHash, _fn.hash);
    if (newHash === _fn.hash) {
      return;
    }
    console.log('2 - PASS', newHash);
    window.location.hash = newHash;
  };

  // @function      getHashParams
  // @role          build hash params array from hash string
  // @returns       Array of hash params (names & values)
  //
  var getHashParams = function (pHashStr) {
    // Use current hash if not specified
    var hashStr = pHashStr || getHash();

    var currHashParams = {};

    if (hashStr.length > 0) {
      var cutParamType = hashStr.split('&');

      for (var j in cutParamType) {
        var paramObj = cutParamType[j].split('=');
        if (paramObj[1].length > 0) {
          var paramValues = paramObj[1].split(',');
          currHashParams[paramObj[0]] = paramValues;
        }
      }
    }

    return currHashParams;
  };

  // @function      setHashParams
  // @role          set hash params
  //
  var setHashParams = function (hashParamsArr) {
    var hashStr = buildHashFromParams(hashParamsArr);
    setHash(hashStr);
  };

  // @function      updateHashKeyValue
  // @role          update hash key value
  // @params        key - hash param
  //
  var updateHashKeyValue = function (key, value) {
    var curParams = clone(_fn.hashParams);
    curParams[key] = value;
    // Set hash params
    setHashParams(curParams);
  };

  // @function      buildHashFromParams
  // @role          build hash from params
  // @returns       string
  //
  var buildHashFromParams = function (hashParamsArr) {
    var hashParams = [];
    for (var i in hashParamsArr) {
      hashParams.push(i + '=' + (isArr(hashParamsArr[i]) ? hashParamsArr[i].join(',') : hashParamsArr[i]));
    }
    return hashParams.join('&');
  };

  // @function      hashHasChanged
  // @role          called when hash has changed
  //
  var hashHasChanged = function (curHash) {
    var tmpHashParams = getHashParams(curHash);
    var changedParams = getChangedParams(tmpHashParams);
    _fn.hashParams = clone(tmpHashParams);
    if (Object.keys(changedParams).length > 0) {
      notifySubscribers(changedParams);
    }
  };

  // @function      getChangedParams
  // @role          Get the paramaters that changed since last hash change
  // @returns       Array of changed params
  //
  var getChangedParams = function (params) {
    var changed = {};

    // For each param
    for (var p in params) {
      changed[p] = {
        changed: areEqual(params[p], _fn.hashParams[p]),
        values: clone(params[p])
      };
    }

    return changed;
  };

  // @function      subscribe
  // @role          subscribe to hash
  //
  var subscribe = function (hashParams, cb) {
    // New subscriber
    var subscriber = new Subscriber(hashParams, cb);
    var subscriberIdx = _fn.subscribers.push(subscriber);

    // Register params that subscriber is subscribing to
    for (var p in hashParams) {
      var paramName = hashParams[p];
      if (paramName in _fn.subscribedPerParams === false) {
        _fn.subscribedPerParams[paramName] = [];
      }
      _fn.subscribedPerParams[hashParams[p]].push(subscriberIdx - 1);
    }
  };

  // @function      notifySubscribers
  // @role          Notify subscribers if one of the parameters they subscribed to has changed
  //
  var notifySubscribers = function (params) {
    for (var s in _fn.subscribers) {
      var subscriptions = _fn.subscribers[s].subscriptions;
      var paramsToNotify = {};

      for (var ss in subscriptions) {
        var subscription = subscriptions[ss];
        if (subscription in params) {
          paramsToNotify[subscription] = params[subscription];
        }
      }

      if (Object.keys(paramsToNotify).length > 0) {
        _fn.subscribers[s].notify(paramsToNotify);
      }
    }
  };

  // Mute
  var mute = function () {
    _fn.muted = true;
  };
  var unmute = function () {
    _fn.muted = false;
  };

  return {
    getInstance: function () {
      if (!this._instance) {
        this._instance = Hash;
      }
      return this._instance;
    },
    subscribe: subscribe,
    getHash: getHash,
    setHash: setHash,
    getHashParams: getHashParams,
    setHashParams: setHashParams,
    updateHashKeyValue: updateHashKeyValue,
    init: init,
    mute: mute,
    unmute: unmute,
    destroy: destroy
  };
})();

module.exports = Hash.getInstance();
