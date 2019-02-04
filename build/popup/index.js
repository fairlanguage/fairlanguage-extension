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
  "version": "0.8.2",
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
},{}],"../controller/storage.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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
    key: "getHostSettings",
    value: function getHostSettings() {
      var currentHost = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.hostname;
      return new Promise(function (resolve, reject) {
        var settings;
        chrome.storage.local.get(['hosts'], function (storage) {
          settings = storage.hosts.find(function (hostInStorage) {
            return hostInStorage.name === currentHost;
          });

          if (settings) {
            resolve(settings);
          }

          reject(new Error('No custom host settings'));
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
},{}],"index.js":[function(require,module,exports) {
"use strict";

var manifest = _interopRequireWildcard(require("../../manifest.json"));

var _storage = _interopRequireDefault(require("../controller/storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var displayVersion = document.getElementById('display-version');
displayVersion.textContent = manifest.version;
var display = document.getElementById('display');

var getCurrentHostSettings = function getCurrentHostSettings() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    var currentHostname = new URL(tabs[0].url).hostname;

    _storage.default.getHostSettings(currentHostname).then(function (settings) {
      display.value = JSON.stringify(settings);
    }).catch(function (error) {
      display.value = error;
    });
  });
};

getCurrentHostSettings();
document.getElementById('button-reset-hosts').addEventListener('click', function () {
  _storage.default.resetAllHosts();

  getCurrentHostSettings();
});
var displayActive = document.getElementById("active-status");
var buttonActive = document.getElementById("active-button");
/*
* activate/deactivate
*/

chrome.storage.local.get(['hosts'], function (storage) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    var tab = tabs[0];
    var currentHostname = new URL(tab.url).hostname;
    var hostInStorage = null;
    storage.hosts.forEach(function (host, index) {
      hostInStorage = host.name === currentHostname ? host : hostInStorage;
    }); //display.value = JSON.stringify(hostInStorage)

    if (!hostInStorage) {
      displayActive.textContent = 'not set';
      buttonActive.textContent = 'enable';
    } else {
      displayActive.textContent = hostInStorage.enabled;
      buttonActive.textContent = hostInStorage.enabled ? 'disable' : 'enable';
    }
  });
});
buttonActive.addEventListener('click', function () {
  chrome.storage.local.get(['hosts'], function (storage) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      var tab = tabs[0];
      var currentHostname = new URL(tab.url).hostname;
      var hostInStorage = null;
      storage.hosts.forEach(function (host, index) {
        hostInStorage = host.name === currentHostname ? host : hostInStorage;
      });

      if (!hostInStorage) {
        chrome.tabs.sendMessage(tab.id, {
          command: 'activate'
        });
        displayActive.textContent = 'true';
        buttonActive.textContent = 'disable';
      } else {
        if (hostInStorage.enabled) {
          chrome.tabs.sendMessage(tab.id, {
            command: 'deactivate'
          });
        } else {
          chrome.tabs.sendMessage(tab.id, {
            command: 'activate'
          });
        }

        displayActive.textContent = !hostInStorage.enabled;
        buttonActive.textContent = !hostInStorage.enabled ? 'disable' : 'enable';
      }
    });
  });
});
},{"../../manifest.json":"../../manifest.json","../controller/storage":"../controller/storage.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57899" + '/');

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