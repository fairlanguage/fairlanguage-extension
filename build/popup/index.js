// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../../manifest.json":[function(require,module,exports) {
module.exports = {
  "manifest_version": 2,
  "name": "Fairlanguage",
  "description": "I am flamingo.",
  "version": "0.8.6",
  "browser_action": {
    "default_icon": "icon-transparent.png",
    "default_popup": "popup.html"
  },
  "permissions": ["activeTab", "*://fairlanguage-api-dev.dev-star.de/*", "storage"],
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["build/index.js"],
    "run_at": "document_end"
  }],
  "web_accessible_resources": ["icon-off.png", "icon-transparent.png", "icon-white.png", "close.png"]
};
},{}],"../../config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  default: {
    enabled: true,
    consent: true,
    active: null,
    toolbar: true
  },
  options: {
    settingsString: false,
    hostString: false,
    enabled: false,
    consent: false,
    host: true,
    toolbar: false,
    dev: true
  },
  colors: {
    primary: ['#40B3FF', '#6652FF', '#F022EB', '#EBEBFF'],
    gradient: 'linear-gradient(to bottom, #4a9fe0 0%,#e102ff 100%)'
  },
  toolbar: {
    height: '150px',
    opacity: 1
  }
};
exports.default = _default;
},{}],"../controller/storage.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("../../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StorageController =
/*#__PURE__*/
function () {
  function StorageController() {
    _classCallCheck(this, StorageController);

    return 'I controll the storage.';
  }

  _createClass(StorageController, null, [{
    key: "getSettings",
    value: function getSettings() {
      return new Promise(function (resolve, reject) {
        chrome.storage.local.get(['settings'], function (storage) {
          if (storage.settings) {
            resolve(storage.settings);
          } else {
            var settings = {
              enabled: _config.default.default.enabled,
              consent: _config.default.default.consent,
              toolbar: _config.default.default.toolbar
            };
            chrome.storage.local.set({
              settings: settings
            }, function () {
              resolve(settings);
            });
          }

          reject(new Error('Reading settings from local storage'));
        });
      });
    }
  }, {
    key: "setEnabled",
    value: function setEnabled() {
      var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'toggle';
      return new Promise(function (resolve, reject) {
        chrome.storage.local.get(['settings'], function (storage) {
          var settings = storage.settings; //console.log(settings)

          settings.enabled = mode === 'toggle' ? !settings.enabled : mode; //console.log(settings)

          chrome.storage.local.set({
            settings: settings
          }, function () {
            if (settings) {
              resolve(settings.consent);
            } else {
              reject(new Error('Writing enabled settings to local storage'));
            }
          });
        });
      });
    }
  }, {
    key: "setConsent",
    value: function setConsent() {
      var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'toggle';
      return new Promise(function (resolve, reject) {
        chrome.storage.local.get(['settings'], function (storage) {
          var settings = storage.settings; //console.log(settings)

          settings.consent = mode === 'toggle' ? !settings.consent : mode; //console.log(settings)

          chrome.storage.local.set({
            settings: settings
          }, function () {
            if (settings) {
              resolve(settings.consent);
            } else {
              reject(new Error('Writing consent settings to local storage'));
            }
          });
        });
      });
    }
  }, {
    key: "setToolbar",
    value: function setToolbar() {
      var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'toggle';
      return new Promise(function (resolve, reject) {
        chrome.storage.local.get(['settings'], function (storage) {
          var settings = storage.settings; //console.log(settings)

          settings.toolbar = mode === 'toggle' ? !settings.toolbar : mode; //console.log(settings)

          chrome.storage.local.set({
            settings: settings
          }, function () {
            if (settings) {
              resolve(settings.toolbar);
            } else {
              reject(new Error('Writing toolbar settings to local storage'));
            }
          });
        });
      });
    }
  }, {
    key: "getHostSettings",
    value: function getHostSettings() {
      var currentHost = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.hostname;
      return new Promise(function (resolve, reject) {
        var settings;
        chrome.storage.local.get(['hosts'], function (storage) {
          console.log(storage.hosts); // If there aren't any entries, start with this one

          if (!storage.hosts) {
            settings = {
              enabled: null,
              name: currentHost
            };
            chrome.storage.local.set({
              hosts: [settings]
            }, function () {
              resolve(settings);
            });
          } // Look up this host


          settings = storage.hosts.find(function (hostInStorage) {
            return hostInStorage.name === currentHost;
          });

          if (settings) {
            resolve(settings);
          } else {
            // No settings for this host yet, make an empty entry
            settings = {
              enabled: null,
              name: currentHost
            };
            storage.hosts.push(settings);
            chrome.storage.local.set({
              hosts: storage.hosts
            }, function () {
              resolve(settings);
            });
          }

          reject(new Error('Reading host settings from local storage'));
        });
      });
    }
  }, {
    key: "setHost",
    value: function setHost() {
      var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'toggle';
      var currentHost = window.location.hostname;
      return new Promise(function (resolve, reject) {
        chrome.storage.local.get(['hosts'], function (storage) {
          if (storage.hosts) {
            var settings = storage.hosts.find(function (hostInStorage) {
              return hostInStorage.name === currentHost;
            });
            var index = storage.hosts.indexOf(settings);
            storage.hosts[index].enabled = mode === 'toggle' ? !storage.hosts[index].enabled : mode;
            chrome.storage.local.set({
              hosts: storage.hosts
            }, function () {
              if (settings) resolve(storage.hosts[index]);
            });
          }
        });
      });
    }
  }, {
    key: "getHosts",
    value: function getHosts() {
      return new Promise(function (resolve, reject) {
        chrome.storage.local.get(['hosts'], function (storage) {
          if (storage.hosts) resolve(storage.hosts);
          reject(new Error('Reading host settings from local storage'));
        });
      });
    }
  }, {
    key: "resetAllHosts",
    value: function resetAllHosts() {
      return new Promise(function (resolve, reject) {
        chrome.storage.local.set({
          hosts: []
        }, function () {
          resolve(true);
        });
        reject(new Error('No resetting hosts'));
      });
    }
  }]);

  return StorageController;
}();

exports.default = StorageController;
},{"../../config":"../../config.js"}],"index.js":[function(require,module,exports) {
"use strict";

var manifest = _interopRequireWildcard(require("../../manifest.json"));

var _config = _interopRequireDefault(require("../../config"));

var _storage = _interopRequireDefault(require("../controller/storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var captionSettings = document.getElementById('caption-settings');
var displaySettings = document.getElementById('string-settings');
captionSettings.style.display = _config.default.options.settingsString ? 'flex' : 'none';
displaySettings.style.display = _config.default.options.settingsString ? 'flex' : 'none';
var captionEnabled = document.getElementById('caption-enabled');
var statusEnabled = document.getElementById('status-enabled');
var buttonEnabled = document.getElementById('button-enabled');
statusEnabled.style.display = _config.default.options.enabled ? 'flex' : 'none';
buttonEnabled.style.display = _config.default.options.enabled ? 'flex' : 'none';
captionEnabled.style.display = _config.default.options.enabled ? 'flex' : 'none';
var captionConsent = document.getElementById('caption-consent');
var statusConsent = document.getElementById('status-consent');
var buttonConsent = document.getElementById('button-consent');
statusConsent.style.display = _config.default.options.consent ? 'flex' : 'none';
buttonConsent.style.display = _config.default.options.consent ? 'flex' : 'none';
captionConsent.style.display = _config.default.options.consent ? 'flex' : 'none';
var captionHost = document.getElementById('caption-host');
var stringHost = document.getElementById('string-host');
var displayHost = document.getElementById('active-status');
var buttonHostEnable = document.getElementById('active-button-enable');
var buttonHostDisable = document.getElementById('active-button-disable');
captionHost.style.display = _config.default.options.host ? 'flex' : 'none';
stringHost.style.display = _config.default.options.hostString ? 'flex' : 'none';
displayHost.style.display = _config.default.options.host ? 'flex' : 'none';
buttonHostEnable.style.display = _config.default.options.host ? 'flex' : 'none';
buttonHostDisable.style.display = _config.default.options.host ? 'flex' : 'none';
var captionToolbar = document.getElementById('caption-toolbar');
var statusToolbar = document.getElementById('status-toolbar');
var buttonToolbar = document.getElementById('button-toolbar');
captionToolbar.style.display = _config.default.options.toolbar ? 'flex' : 'none';
statusToolbar.style.display = _config.default.options.toolbar ? 'flex' : 'none';
buttonToolbar.style.display = _config.default.options.toolbar ? 'flex' : 'none';
var captionDev = document.getElementById('caption-dev');
var statusHosts = document.getElementById('status-hosts');
var buttonResetHosts = document.getElementById('button-reset-hosts');
captionDev.style.display = _config.default.options.dev ? 'flex' : 'none';
statusHosts.style.display = _config.default.options.dev ? 'flex' : 'none';
buttonResetHosts.style.display = _config.default.options.dev ? 'flex' : 'none';
var captionVersion = document.getElementById('caption-version');
var displayVersion = document.getElementById('display-version');
captionVersion.style.display = _config.default.options.dev ? 'flex' : 'none';
displayVersion.style.display = _config.default.options.dev ? 'flex' : 'none';
/**
 * Settings
 */

var getSettings = function getSettings() {
  _storage.default.getSettings().then(function (settings) {
    displaySettings.value = JSON.stringify(settings);
    statusEnabled.textContent = settings.enabled;
    buttonEnabled.textContent = settings.enabled ? 'disable' : 'enable';
    statusToolbar.textContent = settings.toolbar;
    buttonToolbar.textContent = settings.toolbar ? 'hide' : 'show';
    statusConsent.textContent = settings.consent;
    buttonConsent.textContent = settings.consent ? 'take' : 'give';
  }).catch(function (error) {
    displaySettings.value = error;
  });
};

var getCurrentHostSettings = function getCurrentHostSettings() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    var currentHostname = new URL(tabs[0].url).hostname;

    _storage.default.getHostSettings(currentHostname).then(function (settings) {
      stringHost.value = JSON.stringify(settings);
      displayHost.textContent = settings.enabled === null ? 'not set' : settings.enabled;
      buttonHostEnable.textContent = 'enable';
      buttonHostDisable.textContent = 'disable';
    }).catch(function (error) {
      display.value = error;
    });
  });
};

var getAllHosts = function getAllHosts() {
  _storage.default.getHosts().then(function (hosts) {
    statusHosts.textContent = 'hosts: ' + hosts.length;
  });
};

getSettings();
getCurrentHostSettings();
getAllHosts();
/**
 * Enabled
 */

buttonEnabled.addEventListener('click', function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      command: 'enabled'
    });
  });
});
chrome.runtime.onMessage.addListener(function (settings) {
  if (settings.enabled === undefined) return;

  _storage.default.getSettings().then(function (_settings) {
    displaySettings.value = JSON.stringify(_settings);
    statusEnabled.textContent = _settings.enabled;
    buttonEnabled.textContent = _settings.enabled ? 'disable' : 'enable';
  }).catch(function (error) {
    displaySettings.value = error;
  });
});
/**
 * Consent
 */

buttonConsent.addEventListener('click', function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      command: 'consent'
    });
  });
});
chrome.runtime.onMessage.addListener(function (settings) {
  if (settings.consent === undefined) return;

  _storage.default.getSettings().then(function (_settings) {
    displaySettings.value = JSON.stringify(_settings);
    statusConsent.textContent = _settings.consent;
    buttonConsent.textContent = _settings.consent ? 'take' : 'give';
  }).catch(function (error) {
    displaySettings.value = error;
  });
});
/**
 * Toolbar
 */

buttonToolbar.addEventListener('click', function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      command: 'toolbar'
    });
  });
});
chrome.runtime.onMessage.addListener(function (settings) {
  if (settings.toolbar === undefined) return;

  _storage.default.getSettings().then(function (_settings) {
    displaySettings.value = JSON.stringify(_settings);
    statusToolbar.textContent = _settings.toolbar;
    buttonToolbar.textContent = _settings.toolbar ? 'hide' : 'show';
  }).catch(function (error) {
    displaySettings.value = error;
  });
});
/**
 * Hosts
 */

buttonHostEnable.addEventListener('click', function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      command: 'host-enable'
    });
  });
});
buttonHostDisable.addEventListener('click', function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      command: 'host-disable'
    });
  });
});
chrome.runtime.onMessage.addListener(function (settings) {
  if (settings.host === undefined) return;
  displayHost.textContent = settings.host.enabled;
  stringHost.value = JSON.stringify(settings.host);
});
/**
 * Reset hosts
 */

buttonResetHosts.addEventListener('click', function () {
  _storage.default.resetAllHosts();

  getCurrentHostSettings();
  getAllHosts();
});
/**
 * Version
 */

displayVersion.textContent = manifest.version;
},{"../../manifest.json":"../../manifest.json","../../config":"../../config.js","../controller/storage":"../controller/storage.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49944" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/index.map