var clone = require('clone');

var Subscriber = function (hashParams, cb) {
  'use strict';

  var _subscriptions = hashParams;
  var _cb = cb;

  var notify = function (params) {
    _cb.call(this, params);
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
    muted: false,
    interval: null
  };

  /**
   * @function      init
   * @description   Called to initialize, optionally giving a default hash
   *
   * @param         defaultHash - Object | String - default hash
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
      _fn.interval = setInterval(checkIfHashHasChanged, 50);
    }

    // First default hash ( direct access or default )
    var curHash = getHash();
    if (curHash !== '') {
      checkIfHashHasChanged();
    } else if (defaultHash) {
      setHash(defaultHash);
      saveHash(Hash.getHash());
    }
  };

  /**
   * @function      destroy
   * @description   Destroys current Hash & subscribers
   **/
  var destroy = function () {
    // Setup
    if (isHashChangeSupported()) {
      if (window.addEventListener) {
        window.removeEventListener('hashchange', checkIfHashHasChanged);
      } else if (window.attachEvent) {
        window.detachEvent('onhashchange', checkIfHashHasChanged);
      }
    } else {
      clearInterval(_fn.interval);
    }

    // Destroy subscribers
    _fn.subscribers = [];
    // Destroy hash
    setHash('');
    // history.pushState('', document.title, window.location.pathname);
  };

  /**
   * @function      isArr
   * @description   Is the element an array
   * @param         obj - Object - is object an array?
   * @returns       boolean
   **/
  var isArr = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  /**
   * @function      areEqual
   * @description   Are two values equal?
   * @returns       boolean
   **/
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

  /**
   * @function      getHash
   * @description   Gets current hash
   * @param         keepHash : boolean - default: false
   *                whether or not to keep the hash character in return string
   * @returns       string
   **/
  var getHash = function (keepHash) {
    keepHash = keepHash || false;
    return window.location.hash.slice(keepHash ? 0 : 1);
  };

  /**
   * @function      isHashChangeSupported
   * @description   Checks if hash changed is supported
   * @returns       boolean
   **/
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

  /**
   * @function      checkIfHashHasChanged
   * @description   Checks if hash changed
   **/
  var checkIfHashHasChanged = function () {
    var curHash = getHash();
    if (curHash !== _fn.hash && !_fn.muted) {
      // Hash has changed
      hashHasChanged(curHash);
    }

    // Save for later
    saveHash(curHash);

    if (_fn.muted) {
      unmute();
    }
  };

  // Save hash for later
  var saveHash = function (curHash) {
    _fn.hash = curHash;
    _fn.hashParams = clone(getParamsFromHash(curHash));
  };

  /**
   * @function      setHash
   * @description   Sets hash
   * @param         newHash - string - new hash
   **/
  var setHash = function (newHash) {
    // Type
    if (typeof newHash !== 'string') {
      newHash = buildHashFromParams(newHash);
    } else {
      if (newHash !== '' && newHash.charAt(0) !== '#') {
        newHash = '#' + newHash;
      }
    }
    if (newHash === _fn.hash) {
      return;
    }
    window.location.hash = newHash;
  };

  /**
   * @function      getParamsFromHash
   * @description   Build hash params array from hash string
   * @param         hashStr - string - hash
   * @returns       Array of hash params (names & values)
   **/
  var getParamsFromHash = function (hashStr) {
    // Use current hash if not specified
    hashStr = hashStr || getHash();

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

  /**
   * @function      getParams
   * @description   Get hash params
   * @returns       Object of hash params
   **/
  var getParams = function () {
    var tmpHashParams = getParamsFromHash();
    return getChangedParams(tmpHashParams, false);
  };

  /**
   * @function      updateHashKeyValue
   * @description   Updates hash key value
   * @param         key - hash param
   * @param         value - hash param value
   **/
  var updateHashKeyValue = function (key, value) {
    var curParams = clone(_fn.hashParams);
    curParams[key] = value;

    // Set hash params
    setHash(curParams);
  };

  /**
   * @function      buildHashFromParams
   * @description    Build hash from params
   * @param         hashParamsObj - Object - Hash parameters
   * @returns       string
   **/
  var buildHashFromParams = function (hashParamsObj) {
    var hashParams = [];
    for (var i in hashParamsObj) {
      hashParams.push(i + '=' + (isArr(hashParamsObj[i]) ? hashParamsObj[i].join(',') : hashParamsObj[i]));
    }
    return hashParams.join('&');
  };

  /**
   * @function      hashHasChanged
   * @description   Called when hash has changed
   * @param         curHash - string - current hash
   **/
  var hashHasChanged = function (curHash) {
    var tmpHashParams = getParamsFromHash(curHash);
    var changedParams = getChangedParams(tmpHashParams);
    _fn.hashParams = clone(tmpHashParams);
    if (Object.keys(changedParams).length > 0) {
      notifySubscribers(changedParams);
    }
  };

  /**
   * @function      getChangedParams
   * @description   Get the paramaters that changed since last hash change
   * @param         params - Object - hash parameters
   *                includeChangedStatus - Boolean - include parameters changed status - default true
   * @returns       Array of changed params
   **/
  var getChangedParams = function (params, includeChangedStatus) {
    var finalParams = {};

    // For each param
    for (var p in params) {
      finalParams[p] = {
        values: clone(params[p])
      };
      if (includeChangedStatus !== false) {
        finalParams[p].changed = areEqual(params[p], _fn.hashParams[p]);
      }
    }

    return finalParams;
  };

  /**
   * @function      subscribe
   * @param         hashParams - Array - array of hash parameters names
   * @param         cb - function - callback function
   * @description   subscribe to hash
   **/
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

  /**
   * @function      notifySubscribers
   * @description   Notify subscribers if one of the parameters they subscribed to has changed
   * @param         params - Array
   **/
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

  /**
   * @function      mute
   * @description   mute subscription
   **/
  var mute = function () {
    _fn.muted = true;
  };

  /**
   * @function      unmute
   * @description   unmute subscription
   **/
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
    getParams: getParams,
    updateHashKeyValue: updateHashKeyValue,
    init: init,
    mute: mute,
    unmute: unmute,
    destroy: destroy
  };
})();

module.exports = Hash.getInstance();
