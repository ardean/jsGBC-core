!function(e){function t(e){Object.defineProperty(this,e,{enumerable:!0,get:function(){return this[m][e]}})}function r(e){var t;if(e&&e.__esModule){t={};for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);t.__useDefault&&delete t.__useDefault,t.__esModule=!0}else{if("[object Module]"===Object.prototype.toString.call(e)||"undefined"!=typeof System&&System.isModule&&System.isModule(e))return e;t={default:e,__useDefault:!0}}return new o(t)}function o(e){Object.defineProperty(this,m,{value:e}),Object.keys(e).forEach(t,this)}function n(e){return"@node/"===e.substr(0,6)?c(e,r(v(e.substr(6))),{}):p[e]}function u(e){var t=n(e);if(!t)throw new Error('Module "'+e+'" expected, but not contained in build.');if(t.module)return t.module;var r=t.linkRecord;return d(t,r),a(t,r,[]),t.module}function d(e,t){if(!t.depLoads){t.declare&&i(e,t),t.depLoads=[];for(var r=0;r<t.deps.length;r++){var o=n(t.deps[r]);t.depLoads.push(o),o.linkRecord&&d(o,o.linkRecord);var u=t.setters&&t.setters[r];u&&(u(o.module||o.linkRecord.moduleObj),o.importerSetters.push(u))}return e}}function i(t,r){var o=r.moduleObj,n=t.importerSetters,u=!1,d=r.declare.call(e,function(e,t){if(!u){if("object"==typeof e)for(var r in e)"__useDefault"!==r&&(o[r]=e[r]);else o[e]=t;u=!0;for(var d=0;d<n.length;d++)n[d](o);return u=!1,t}},{id:t.key});"function"!=typeof d?(r.setters=d.setters,r.execute=d.execute):(r.setters=[],r.execute=d)}function l(e,t,r){return p[e]={key:e,module:void 0,importerSetters:[],linkRecord:{deps:t,depLoads:void 0,declare:r,setters:void 0,execute:void 0,moduleObj:{}}}}function f(e,t,r,o){return p[e]={key:e,module:void 0,importerSetters:[],linkRecord:{deps:t,depLoads:void 0,declare:void 0,execute:o,executingRequire:r,moduleObj:{default:{},__useDefault:!0},setters:void 0}}}function s(e,t,r){return function(o){for(var n=0;n<e.length;n++)if(e[n]===o){var u,d=t[n],i=d.linkRecord;return u=i?-1===r.indexOf(d)?a(d,i,r):i.moduleObj:d.module,u.__useDefault?u.default:u}}}function a(t,r,n){if(n.push(t),t.module)return t.module;var u;if(r.setters){for(var d=0;d<r.deps.length;d++){var i=r.depLoads[d],l=i.linkRecord;l&&-1===n.indexOf(i)&&(u=a(i,l,l.setters?n:[]))}r.execute.call(y)}else{var f={id:t.key},c=r.moduleObj;Object.defineProperty(f,"exports",{configurable:!0,set:function(e){c.default=e},get:function(){return c.default}});var p=s(r.deps,r.depLoads,n);if(!r.executingRequire)for(var d=0;d<r.deps.length;d++)p(r.deps[d]);var m=r.execute.call(e,p,c.default,f);if(void 0!==m?c.default=m:f.exports!==c.default&&(c.default=f.exports),c.default&&c.default.__esModule)for(var v in c.default)Object.hasOwnProperty.call(c.default,v)&&"default"!==v&&(c[v]=c.default[v])}var f=t.module=new o(r.moduleObj);if(!r.setters)for(var d=0;d<t.importerSetters.length;d++)t.importerSetters[d](f);return f}function c(e,t){return p[e]={key:e,module:t,importerSetters:[],linkRecord:void 0}}var p={},m="undefined"!=typeof Symbol?Symbol():"@@baseObject";o.prototype=Object.create(null),"undefined"!=typeof Symbol&&Symbol.toStringTag&&(o.prototype[Symbol.toStringTag]="Module");var v="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&"undefined"!=typeof require.resolve&&"undefined"!=typeof process&&process.platform&&require,y={};return Object.freeze&&Object.freeze(y),function(e,t,n,d){return function(i){i(function(i){var s={_nodeRequire:v,register:l,registerDynamic:f,registry:{get:function(e){return p[e].module},set:c},newModule:function(e){return new o(e)}};c("@empty",new o({}));for(var a=0;a<t.length;a++)c(t[a],r(arguments[a],{}));d(s);var m=u(e[0]);if(e.length>1)for(var a=1;a<e.length;a++)u(e[a]);return n?m.default:(m instanceof o&&Object.defineProperty(m,"__esModule",{value:!0}),m)})}}}("undefined"!=typeof self?self:global)

(["a"], [], false, function($__System) {
var require = this.require, exports = this.exports, module = this.module;
$__System.registerDynamic('b', [], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.

  function EventEmitter() {
    this._events = this._events || {};
    this._maxListeners = this._maxListeners || undefined;
  }
  module.exports = EventEmitter;

  // Backwards-compat with node 0.10.x
  EventEmitter.EventEmitter = EventEmitter;

  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners = 10;

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function (n) {
    if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
    this._maxListeners = n;
    return this;
  };

  EventEmitter.prototype.emit = function (type) {
    var er, handler, len, args, i, listeners;

    if (!this._events) this._events = {};

    // If there is no 'error' event listener then throw.
    if (type === 'error') {
      if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
        er = arguments[1];
        if (er instanceof Error) {
          throw er; // Unhandled 'error' event
        }
        throw TypeError('Uncaught, unspecified "error" event.');
      }
    }

    handler = this._events[type];

    if (isUndefined(handler)) return false;

    if (isFunction(handler)) {
      switch (arguments.length) {
        // fast cases
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        // slower
        default:
          args = Array.prototype.slice.call(arguments, 1);
          handler.apply(this, args);
      }
    } else if (isObject(handler)) {
      args = Array.prototype.slice.call(arguments, 1);
      listeners = handler.slice();
      len = listeners.length;
      for (i = 0; i < len; i++) listeners[i].apply(this, args);
    }

    return true;
  };

  EventEmitter.prototype.addListener = function (type, listener) {
    var m;

    if (!isFunction(listener)) throw TypeError('listener must be a function');

    if (!this._events) this._events = {};

    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

    if (!this._events[type])
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;else if (isObject(this._events[type]))
      // If we've already got an array, just append.
      this._events[type].push(listener);else
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];

    // Check for listener leak
    if (isObject(this._events[type]) && !this._events[type].warned) {
      if (!isUndefined(this._maxListeners)) {
        m = this._maxListeners;
      } else {
        m = EventEmitter.defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
        if (typeof console.trace === 'function') {
          // not supported in IE 10
          console.trace();
        }
      }
    }

    return this;
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.once = function (type, listener) {
    if (!isFunction(listener)) throw TypeError('listener must be a function');

    var fired = false;

    function g() {
      this.removeListener(type, g);

      if (!fired) {
        fired = true;
        listener.apply(this, arguments);
      }
    }

    g.listener = listener;
    this.on(type, g);

    return this;
  };

  // emits a 'removeListener' event iff the listener was removed
  EventEmitter.prototype.removeListener = function (type, listener) {
    var list, position, length, i;

    if (!isFunction(listener)) throw TypeError('listener must be a function');

    if (!this._events || !this._events[type]) return this;

    list = this._events[type];
    length = list.length;
    position = -1;

    if (list === listener || isFunction(list.listener) && list.listener === listener) {
      delete this._events[type];
      if (this._events.removeListener) this.emit('removeListener', type, listener);
    } else if (isObject(list)) {
      for (i = length; i-- > 0;) {
        if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
      }

      if (position < 0) return this;

      if (list.length === 1) {
        list.length = 0;
        delete this._events[type];
      } else {
        list.splice(position, 1);
      }

      if (this._events.removeListener) this.emit('removeListener', type, listener);
    }

    return this;
  };

  EventEmitter.prototype.removeAllListeners = function (type) {
    var key, listeners;

    if (!this._events) return this;

    // not listening for removeListener, no need to emit
    if (!this._events.removeListener) {
      if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
      return this;
    }

    // emit removeListener for all listeners on all events
    if (arguments.length === 0) {
      for (key in this._events) {
        if (key === 'removeListener') continue;
        this.removeAllListeners(key);
      }
      this.removeAllListeners('removeListener');
      this._events = {};
      return this;
    }

    listeners = this._events[type];

    if (isFunction(listeners)) {
      this.removeListener(type, listeners);
    } else if (listeners) {
      // LIFO order
      while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
    }
    delete this._events[type];

    return this;
  };

  EventEmitter.prototype.listeners = function (type) {
    var ret;
    if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
    return ret;
  };

  EventEmitter.prototype.listenerCount = function (type) {
    if (this._events) {
      var evlistener = this._events[type];

      if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
    }
    return 0;
  };

  EventEmitter.listenerCount = function (emitter, type) {
    return emitter.listenerCount(type);
  };

  function isFunction(arg) {
    return typeof arg === 'function';
  }

  function isNumber(arg) {
    return typeof arg === 'number';
  }

  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }

  function isUndefined(arg) {
    return arg === void 0;
  }
});
$__System.registerDynamic("c", [], true, function ($__require, exports, module) {
    var global = this || self,
        GLOBAL = global;
    module.exports = Date.now || now;

    function now() {
        return new Date().getTime();
    }
});
$__System.registerDynamic('d', ['c'], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;

  /**
   * Module dependencies.
   */

  var now = $__require('c');

  /**
   * Returns a function, that, as long as it continues to be invoked, will not
   * be triggered. The function will be called after it stops being called for
   * N milliseconds. If `immediate` is passed, trigger the function on the
   * leading edge, instead of the trailing.
   *
   * @source underscore.js
   * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
   * @param {Function} function to wrap
   * @param {Number} timeout in ms (`100`)
   * @param {Boolean} whether to execute at the beginning (`false`)
   * @api public
   */

  module.exports = function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    if (null == wait) wait = 100;

    function later() {
      var last = now() - timestamp;

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function debounced() {
      context = this;
      args = arguments;
      timestamp = now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };
});
$__System.register('a', ['b', 'd'], function (_export, _context5) {
  "use strict";

  var EventEmitter, debounce, _regeneratorRuntime, _asyncToGenerator, _classCallCheck, _createClass, _possibleConstructorReturn, _inherits, settings, fetchFileAsArrayBuffer, util, LCD, TickTable, Resampler, AudioDevice, dutyLookup, AudioController, bitInstructions, SecondaryTickTable, mainInstructions, PostBootRegisterState, initialState, StateManager, Joypad, MemoryWriter, MemoryReader, Memory, CPU, LocalStorage, ROM, MBC, MBC1, MBC2, RTC, MBC3, MBC5, MBC7, Cartridge, Actions, GameBoy$1;

  function toTypedArray(baseArray, memtype) {
    // TODO: remove
    try {
      if (!baseArray || !baseArray.length < 1) return [];

      var length = baseArray.length;

      var typedArrayTemp = void 0;
      switch (memtype) {
        case "uint8":
          typedArrayTemp = new Uint8Array(length);
          break;
        case "int8":
          typedArrayTemp = new Int8Array(length);
          break;
        case "int32":
          typedArrayTemp = new Int32Array(length);
          break;
        case "float32":
          typedArrayTemp = new Float32Array(length);
      }

      for (var index = 0; index < length; index++) {
        typedArrayTemp[index] = baseArray[index];
      }

      return typedArrayTemp;
    } catch (error) {
      console.log("Could not convert an array to a typed array: " + error.message, 1);
      return baseArray;
    }
  }

  function fromTypedArray(baseArray) {
    // TODO: remove
    try {
      if (!baseArray || !baseArray.length) {
        return [];
      }
      var arrayTemp = [];
      for (var index = 0; index < baseArray.length; ++index) {
        arrayTemp[index] = baseArray[index];
      }
      return arrayTemp;
    } catch (error) {
      console.log("Conversion from a typed array failed: " + error.message, 1);
      return baseArray;
    }
  }

  function getTypedArray(length, defaultValue, numberType) {
    // TODO: remove and use fillTypedArray
    var arrayHandle = void 0;
    switch (numberType) {
      case "int8":
        arrayHandle = new Int8Array(length);
        break;
      case "uint8":
        arrayHandle = new Uint8Array(length);
        break;
      case "int32":
        arrayHandle = new Int32Array(length);
        break;
      case "float32":
        arrayHandle = new Float32Array(length);
        break;
      default:
        break;
    }

    if (defaultValue !== 0) {
      var index = 0;
      while (index < length) {
        arrayHandle[index++] = defaultValue;
      }
    }

    return arrayHandle;
  }

  function stringToArrayBuffer(data) {
    var array = new Uint8Array(data.length);
    for (var i = 0, strLen = data.length; i < strLen; i++) {
      array[i] = data.charCodeAt(i);
    }

    return array;
  }

  function concatArrayBuffers() {
    var totalLength = 0;

    for (var _len = arguments.length, buffers = Array(_len), _key = 0; _key < _len; _key++) {
      buffers[_key] = arguments[_key];
    }

    for (var i = 0; i < buffers.length; i++) {
      totalLength += buffers[i].byteLength;
    }

    var array = new Uint8Array(totalLength);

    for (var _i = 0; _i < buffers.length; _i++) {
      var typedArray = new Uint8Array(buffers[_i]);
      if (_i === 0) {
        array.set(typedArray);
      } else {
        array.set(typedArray, buffers[_i - 1].byteLength);
      }
    }

    return array.buffer;
  }

  function downloadFile(filename, arrayBuffer) {
    var a = document.createElement("a");
    var blob = new Blob([new Uint8Array(arrayBuffer)], { type: "application/octet-binary" });
    var url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function uploadFile(extensions) {
    return new Promise(function (resolve) {
      var input = document.createElement("input");
      input.type = "file";
      input.accept = extensions.map(function (extension) {
        return "." + extension;
      }).join(", ");

      function inputChange() {
        if (this.files.length > 0) {
          var file = this.files[0];
          var binaryHandle = new FileReader();
          binaryHandle.addEventListener("load", function () {
            if (this.readyState === 2) {
              resolve(this.result);
            }
          });
          binaryHandle.readAsArrayBuffer(file);
        }
        input.removeEventListener("change", inputChange);
      }

      input.addEventListener("change", inputChange);
      input.click();
    });
  }

  function GameBoyCore(_ref) {
    var _ref$audio = _ref.audio,
        audioOptions = _ref$audio === undefined ? {} : _ref$audio,
        api = _ref.api,
        _ref$lcd = _ref.lcd,
        lcdOptions = _ref$lcd === undefined ? {} : _ref$lcd;

    this.api = api;
    this.events = new EventEmitter(); // TODO: use as super

    lcdOptions.gameboy = this;

    this.memoryNew = new Memory({ gameboy: this });

    this.cpu = new CPU();
    this.audioDevice = new AudioDevice({
      context: audioOptions.context,
      channels: 2,
      volume: settings.soundVolume
    });
    this.audioController = new AudioController({
      cpu: this.cpu,
      gameboy: this
    });
    this.joypad = new Joypad(this);
    this.lcd = new LCD(lcdOptions);
    this.stateManager = new StateManager(this);
    this.stateManager.init();

    //GB BOOT ROM
    //Add 256 byte boot rom here if you are going to use it.
    this.GBBOOTROM = [];

    //GBC BOOT ROM
    //Add 2048 byte boot rom here if you are going to use it.
    this.GBCBOOTROM = [];

    this.memoryReadNormal = this.memoryReadNormal.bind(this);
    this.memoryWriteNormal = this.memoryWriteNormal.bind(this);
    this.memoryWriteGBCRAM = this.memoryWriteGBCRAM.bind(this);
    this.memoryWriteMBCRAM = this.memoryWriteMBCRAM.bind(this);
    this.memoryWriteMBC3RAM = this.memoryWriteMBC3RAM.bind(this);
    this.memoryReadGBCMemory = this.memoryReadGBCMemory.bind(this);
    this.memoryReadROM = this.memoryReadROM.bind(this);
    this.memoryHighWriteNormal = this.memoryHighWriteNormal.bind(this);
    this.memoryHighReadNormal = this.memoryHighReadNormal.bind(this);
    this.MBC5WriteRAMBank = this.MBC5WriteRAMBank.bind(this);
    this.MBCWriteEnable = this.MBCWriteEnable.bind(this);
    this.memoryReadMBC = this.memoryReadMBC.bind(this);
    this.memoryReadMBC3 = this.memoryReadMBC3.bind(this);
    this.memoryReadMBC7 = this.memoryReadMBC7.bind(this);

    this.BGGBLayerRender = this.BGGBLayerRender.bind(this);
    this.WindowGBLayerRender = this.WindowGBLayerRender.bind(this);
    this.SpriteGBLayerRender = this.SpriteGBLayerRender.bind(this);
    this.SpriteGBCLayerRender = this.SpriteGBCLayerRender.bind(this);

    this.usedGBCBootROM = false; // Did we boot to the GBC boot ROM?
    this.stopEmulator = 3; // Has the emulation been paused or a frame has ended?
    this.IRQLineMatched = 0; // CPU IRQ assertion.

    // Main RAM, MBC RAM, GBC Main RAM, VRAM, etc.
    this.memoryReader = []; // Array of functions mapped to read back memory
    this.memoryWriter = []; // Array of functions mapped to write to memory
    this.memoryHighReader = []; // Array of functions mapped to read back 0xFFXX memory
    this.memoryHighWriter = []; // Array of functions mapped to write to 0xFFXX memory
    this.spriteCount = 252; // Mode 3 extra clocking counter (Depends on how many sprites are on the current line.).
    this.LINECONTROL = []; // Array of functions to handle each scan line we do (onscreen + offscreen)
    this.DISPLAYOFFCONTROL = [function () {}]; // Array of line 0 function to handle the LCD controller when it's off (Do nothing!).

    this.LCDCONTROL = null; //Pointer to either LINECONTROL or DISPLAYOFFCONTROL.
    this.initializeLCDController(); //Compile the LCD controller functions.

    //Graphics Variables
    this.drewFrame = false; //Throttle how many draws we can do to once per iteration.
    this.midScanlineOffset = -1; //mid-scanline rendering offset.
    this.pixelEnd = 0; //track the x-coord limit for line rendering (mid-scanline usage).
    this.currentX = 0; //The x-coord we left off at for mid-scanline rendering.

    //BG Tile Pointer Caches:
    this.BGCHRCurrentBank = null;

    //Tile Data Cache:
    this.tileCache = null;

    //Palettes:
    this.colors = [0xefffde, 0xadd794, 0x529273, 0x183442]; // "Classic" GameBoy palette colors.
    this.OBJPalette = null;
    this.BGPalette = null;
    this.updateGBBGPalette = this.updateGBRegularBGPalette;
    this.updateGBOBJPalette = this.updateGBRegularOBJPalette;
    this.BGLayerRender = null; // Reference to the BG rendering function.
    this.WindowLayerRender = null; // Reference to the window rendering function.
    this.SpriteLayerRender = null; // Reference to the OAM rendering function.
    this.pixelStart = 0; // Temp variable for holding the current working framebuffer offset.
  }


  function base64ToArrayBuffer(data) {
    if (!data || data.length <= 0) return null;

    data = atob(data);
    var array = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
      array[i] = data.charCodeAt(i);
    }
    return array.buffer;
  }

  function arrayBufferToBase64(array) {
    if (!array || array.length <= 0) return null;

    array = new Uint8Array(array);
    var data = "";
    for (var i = 0; i < array.byteLength; i++) {
      data += String.fromCharCode(array[i]);
    }

    return btoa(data);
  }

  return {
    setters: [function (_b) {
      EventEmitter = _b.default;
    }, function (_d) {
      debounce = _d.default;
    }],
    execute: function () {
      _regeneratorRuntime = function (module) {
        /**
         * Copyright (c) 2014, Facebook, Inc.
         * All rights reserved.
         *
         * This source code is licensed under the BSD-style license found in the
         * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
         * additional grant of patent rights can be found in the PATENTS file in
         * the same directory.
         */

        !function (global) {
          "use strict";

          var Op = Object.prototype;
          var hasOwn = Op.hasOwnProperty;
          var undefined; // More compressible than void 0.
          var $Symbol = typeof Symbol === "function" ? Symbol : {};
          var iteratorSymbol = $Symbol.iterator || "@@iterator";
          var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

          var inModule = typeof module === "object";
          var runtime = global.regeneratorRuntime;
          if (runtime) {
            if (inModule) {
              // If regeneratorRuntime is defined globally and we're in a module,
              // make the exports object identical to regeneratorRuntime.
              module.exports = runtime;
            }
            // Don't bother evaluating the rest of this file if the runtime was
            // already defined globally.
            return;
          }

          // Define the runtime globally (as expected by generated code) as either
          // module.exports (if we're in a module) or a new, empty object.
          runtime = global.regeneratorRuntime = inModule ? module.exports : {};

          function wrap(innerFn, outerFn, self, tryLocsList) {
            // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
            var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
            var generator = Object.create(protoGenerator.prototype);
            var context = new Context(tryLocsList || []);

            // The ._invoke method unifies the implementations of the .next,
            // .throw, and .return methods.
            generator._invoke = makeInvokeMethod(innerFn, self, context);

            return generator;
          }
          runtime.wrap = wrap;

          // Try/catch helper to minimize deoptimizations. Returns a completion
          // record like context.tryEntries[i].completion. This interface could
          // have been (and was previously) designed to take a closure to be
          // invoked without arguments, but in all the cases we care about we
          // already have an existing method we want to call, so there's no need
          // to create a new function object. We can even get away with assuming
          // the method takes exactly one argument, since that happens to be true
          // in every case, so we don't have to touch the arguments object. The
          // only additional allocation required is the completion record, which
          // has a stable shape and so hopefully should be cheap to allocate.
          function tryCatch(fn, obj, arg) {
            try {
              return { type: "normal", arg: fn.call(obj, arg) };
            } catch (err) {
              return { type: "throw", arg: err };
            }
          }

          var GenStateSuspendedStart = "suspendedStart";
          var GenStateSuspendedYield = "suspendedYield";
          var GenStateExecuting = "executing";
          var GenStateCompleted = "completed";

          // Returning this object from the innerFn has the same effect as
          // breaking out of the dispatch switch statement.
          var ContinueSentinel = {};

          // Dummy constructor functions that we use as the .constructor and
          // .constructor.prototype properties for functions that return Generator
          // objects. For full spec compliance, you may wish to configure your
          // minifier not to mangle the names of these two functions.
          function Generator() {}
          function GeneratorFunction() {}
          function GeneratorFunctionPrototype() {}

          // This is a polyfill for %IteratorPrototype% for environments that
          // don't natively support it.
          var IteratorPrototype = {};
          IteratorPrototype[iteratorSymbol] = function () {
            return this;
          };

          var getProto = Object.getPrototypeOf;
          var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
          if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
            // This environment has a native %IteratorPrototype%; use it instead
            // of the polyfill.
            IteratorPrototype = NativeIteratorPrototype;
          }

          var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
          GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
          GeneratorFunctionPrototype.constructor = GeneratorFunction;
          GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

          // Helper for defining the .next, .throw, and .return methods of the
          // Iterator interface in terms of a single ._invoke method.
          function defineIteratorMethods(prototype) {
            ["next", "throw", "return"].forEach(function (method) {
              prototype[method] = function (arg) {
                return this._invoke(method, arg);
              };
            });
          }

          runtime.isGeneratorFunction = function (genFun) {
            var ctor = typeof genFun === "function" && genFun.constructor;
            return ctor ? ctor === GeneratorFunction ||
            // For the native GeneratorFunction constructor, the best we can
            // do is to check its .name property.
            (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
          };

          runtime.mark = function (genFun) {
            if (Object.setPrototypeOf) {
              Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
            } else {
              genFun.__proto__ = GeneratorFunctionPrototype;
              if (!(toStringTagSymbol in genFun)) {
                genFun[toStringTagSymbol] = "GeneratorFunction";
              }
            }
            genFun.prototype = Object.create(Gp);
            return genFun;
          };

          // Within the body of any async function, `await x` is transformed to
          // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
          // `hasOwn.call(value, "__await")` to determine if the yielded value is
          // meant to be awaited.
          runtime.awrap = function (arg) {
            return { __await: arg };
          };

          function AsyncIterator(generator) {
            function invoke(method, arg, resolve, reject) {
              var record = tryCatch(generator[method], generator, arg);
              if (record.type === "throw") {
                reject(record.arg);
              } else {
                var result = record.arg;
                var value = result.value;
                if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
                  return Promise.resolve(value.__await).then(function (value) {
                    invoke("next", value, resolve, reject);
                  }, function (err) {
                    invoke("throw", err, resolve, reject);
                  });
                }

                return Promise.resolve(value).then(function (unwrapped) {
                  // When a yielded Promise is resolved, its final value becomes
                  // the .value of the Promise<{value,done}> result for the
                  // current iteration. If the Promise is rejected, however, the
                  // result for this iteration will be rejected with the same
                  // reason. Note that rejections of yielded Promises are not
                  // thrown back into the generator function, as is the case
                  // when an awaited Promise is rejected. This difference in
                  // behavior between yield and await is important, because it
                  // allows the consumer to decide what to do with the yielded
                  // rejection (swallow it and continue, manually .throw it back
                  // into the generator, abandon iteration, whatever). With
                  // await, by contrast, there is no opportunity to examine the
                  // rejection reason outside the generator function, so the
                  // only option is to throw it from the await expression, and
                  // let the generator function handle the exception.
                  result.value = unwrapped;
                  resolve(result);
                }, reject);
              }
            }

            if (typeof process === "object" && process.domain) {
              invoke = process.domain.bind(invoke);
            }

            var previousPromise;

            function enqueue(method, arg) {
              function callInvokeWithMethodAndArg() {
                return new Promise(function (resolve, reject) {
                  invoke(method, arg, resolve, reject);
                });
              }

              return previousPromise =
              // If enqueue has been called before, then we want to wait until
              // all previous Promises have been resolved before calling invoke,
              // so that results are always delivered in the correct order. If
              // enqueue has not been called before, then it is important to
              // call invoke immediately, without waiting on a callback to fire,
              // so that the async generator function has the opportunity to do
              // any necessary setup in a predictable way. This predictability
              // is why the Promise constructor synchronously invokes its
              // executor callback, and why async functions synchronously
              // execute code before the first await. Since we implement simple
              // async functions in terms of async generators, it is especially
              // important to get this right, even though it requires care.
              previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
              // Avoid propagating failures to Promises returned by later
              // invocations of the iterator.
              callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
            }

            // Define the unified helper method that is used to implement .next,
            // .throw, and .return (see defineIteratorMethods).
            this._invoke = enqueue;
          }

          defineIteratorMethods(AsyncIterator.prototype);
          runtime.AsyncIterator = AsyncIterator;

          // Note that simple async functions are implemented on top of
          // AsyncIterator objects; they just return a Promise for the value of
          // the final result produced by the iterator.
          runtime.async = function (innerFn, outerFn, self, tryLocsList) {
            var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

            return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
            : iter.next().then(function (result) {
              return result.done ? result.value : iter.next();
            });
          };

          function makeInvokeMethod(innerFn, self, context) {
            var state = GenStateSuspendedStart;

            return function invoke(method, arg) {
              if (state === GenStateExecuting) {
                throw new Error("Generator is already running");
              }

              if (state === GenStateCompleted) {
                if (method === "throw") {
                  throw arg;
                }

                // Be forgiving, per 25.3.3.3.3 of the spec:
                // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
                return doneResult();
              }

              while (true) {
                var delegate = context.delegate;
                if (delegate) {
                  if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
                    // A return or throw (when the delegate iterator has no throw
                    // method) always terminates the yield* loop.
                    context.delegate = null;

                    // If the delegate iterator has a return method, give it a
                    // chance to clean up.
                    var returnMethod = delegate.iterator["return"];
                    if (returnMethod) {
                      var record = tryCatch(returnMethod, delegate.iterator, arg);
                      if (record.type === "throw") {
                        // If the return method threw an exception, let that
                        // exception prevail over the original return or throw.
                        method = "throw";
                        arg = record.arg;
                        continue;
                      }
                    }

                    if (method === "return") {
                      // Continue with the outer return, now that the delegate
                      // iterator has been terminated.
                      continue;
                    }
                  }

                  var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);

                  if (record.type === "throw") {
                    context.delegate = null;

                    // Like returning generator.throw(uncaught), but without the
                    // overhead of an extra function call.
                    method = "throw";
                    arg = record.arg;
                    continue;
                  }

                  // Delegate generator ran and handled its own exceptions so
                  // regardless of what the method was, we continue as if it is
                  // "next" with an undefined arg.
                  method = "next";
                  arg = undefined;

                  var info = record.arg;
                  if (info.done) {
                    context[delegate.resultName] = info.value;
                    context.next = delegate.nextLoc;
                  } else {
                    state = GenStateSuspendedYield;
                    return info;
                  }

                  context.delegate = null;
                }

                if (method === "next") {
                  // Setting context._sent for legacy support of Babel's
                  // function.sent implementation.
                  context.sent = context._sent = arg;
                } else if (method === "throw") {
                  if (state === GenStateSuspendedStart) {
                    state = GenStateCompleted;
                    throw arg;
                  }

                  if (context.dispatchException(arg)) {
                    // If the dispatched exception was caught by a catch block,
                    // then let that catch block handle the exception normally.
                    method = "next";
                    arg = undefined;
                  }
                } else if (method === "return") {
                  context.abrupt("return", arg);
                }

                state = GenStateExecuting;

                var record = tryCatch(innerFn, self, context);
                if (record.type === "normal") {
                  // If an exception is thrown from innerFn, we leave state ===
                  // GenStateExecuting and loop back for another invocation.
                  state = context.done ? GenStateCompleted : GenStateSuspendedYield;

                  var info = {
                    value: record.arg,
                    done: context.done
                  };

                  if (record.arg === ContinueSentinel) {
                    if (context.delegate && method === "next") {
                      // Deliberately forget the last sent value so that we don't
                      // accidentally pass it on to the delegate.
                      arg = undefined;
                    }
                  } else {
                    return info;
                  }
                } else if (record.type === "throw") {
                  state = GenStateCompleted;
                  // Dispatch the exception by looping back around to the
                  // context.dispatchException(arg) call above.
                  method = "throw";
                  arg = record.arg;
                }
              }
            };
          }

          // Define Generator.prototype.{next,throw,return} in terms of the
          // unified ._invoke helper method.
          defineIteratorMethods(Gp);

          Gp[toStringTagSymbol] = "Generator";

          Gp.toString = function () {
            return "[object Generator]";
          };

          function pushTryEntry(locs) {
            var entry = { tryLoc: locs[0] };

            if (1 in locs) {
              entry.catchLoc = locs[1];
            }

            if (2 in locs) {
              entry.finallyLoc = locs[2];
              entry.afterLoc = locs[3];
            }

            this.tryEntries.push(entry);
          }

          function resetTryEntry(entry) {
            var record = entry.completion || {};
            record.type = "normal";
            delete record.arg;
            entry.completion = record;
          }

          function Context(tryLocsList) {
            // The root entry object (effectively a try statement without a catch
            // or a finally block) gives us a place to store values thrown from
            // locations where there is no enclosing try statement.
            this.tryEntries = [{ tryLoc: "root" }];
            tryLocsList.forEach(pushTryEntry, this);
            this.reset(true);
          }

          runtime.keys = function (object) {
            var keys = [];
            for (var key in object) {
              keys.push(key);
            }
            keys.reverse();

            // Rather than returning an object with a next method, we keep
            // things simple and return the next function itself.
            return function next() {
              while (keys.length) {
                var key = keys.pop();
                if (key in object) {
                  next.value = key;
                  next.done = false;
                  return next;
                }
              }

              // To avoid creating an additional object, we just hang the .value
              // and .done properties off the next function object itself. This
              // also ensures that the minifier will not anonymize the function.
              next.done = true;
              return next;
            };
          };

          function values(iterable) {
            if (iterable) {
              var iteratorMethod = iterable[iteratorSymbol];
              if (iteratorMethod) {
                return iteratorMethod.call(iterable);
              }

              if (typeof iterable.next === "function") {
                return iterable;
              }

              if (!isNaN(iterable.length)) {
                var i = -1,
                    next = function next() {
                  while (++i < iterable.length) {
                    if (hasOwn.call(iterable, i)) {
                      next.value = iterable[i];
                      next.done = false;
                      return next;
                    }
                  }

                  next.value = undefined;
                  next.done = true;

                  return next;
                };

                return next.next = next;
              }
            }

            // Return an iterator with no values.
            return { next: doneResult };
          }
          runtime.values = values;

          function doneResult() {
            return { value: undefined, done: true };
          }

          Context.prototype = {
            constructor: Context,

            reset: function reset(skipTempReset) {
              this.prev = 0;
              this.next = 0;
              // Resetting context._sent for legacy support of Babel's
              // function.sent implementation.
              this.sent = this._sent = undefined;
              this.done = false;
              this.delegate = null;

              this.tryEntries.forEach(resetTryEntry);

              if (!skipTempReset) {
                for (var name in this) {
                  // Not sure about the optimal order of these conditions:
                  if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                    this[name] = undefined;
                  }
                }
              }
            },

            stop: function stop() {
              this.done = true;

              var rootEntry = this.tryEntries[0];
              var rootRecord = rootEntry.completion;
              if (rootRecord.type === "throw") {
                throw rootRecord.arg;
              }

              return this.rval;
            },

            dispatchException: function dispatchException(exception) {
              if (this.done) {
                throw exception;
              }

              var context = this;
              function handle(loc, caught) {
                record.type = "throw";
                record.arg = exception;
                context.next = loc;
                return !!caught;
              }

              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                var record = entry.completion;

                if (entry.tryLoc === "root") {
                  // Exception thrown outside of any try block that could handle
                  // it, so set the completion value of the entire function to
                  // throw the exception.
                  return handle("end");
                }

                if (entry.tryLoc <= this.prev) {
                  var hasCatch = hasOwn.call(entry, "catchLoc");
                  var hasFinally = hasOwn.call(entry, "finallyLoc");

                  if (hasCatch && hasFinally) {
                    if (this.prev < entry.catchLoc) {
                      return handle(entry.catchLoc, true);
                    } else if (this.prev < entry.finallyLoc) {
                      return handle(entry.finallyLoc);
                    }
                  } else if (hasCatch) {
                    if (this.prev < entry.catchLoc) {
                      return handle(entry.catchLoc, true);
                    }
                  } else if (hasFinally) {
                    if (this.prev < entry.finallyLoc) {
                      return handle(entry.finallyLoc);
                    }
                  } else {
                    throw new Error("try statement without catch or finally");
                  }
                }
              }
            },

            abrupt: function abrupt(type, arg) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                  var finallyEntry = entry;
                  break;
                }
              }

              if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
                // Ignore the finally entry if control is not jumping to a
                // location outside the try/catch block.
                finallyEntry = null;
              }

              var record = finallyEntry ? finallyEntry.completion : {};
              record.type = type;
              record.arg = arg;

              if (finallyEntry) {
                this.next = finallyEntry.finallyLoc;
              } else {
                this.complete(record);
              }

              return ContinueSentinel;
            },

            complete: function complete(record, afterLoc) {
              if (record.type === "throw") {
                throw record.arg;
              }

              if (record.type === "break" || record.type === "continue") {
                this.next = record.arg;
              } else if (record.type === "return") {
                this.rval = record.arg;
                this.next = "end";
              } else if (record.type === "normal" && afterLoc) {
                this.next = afterLoc;
              }
            },

            finish: function finish(finallyLoc) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (entry.finallyLoc === finallyLoc) {
                  this.complete(entry.completion, entry.afterLoc);
                  resetTryEntry(entry);
                  return ContinueSentinel;
                }
              }
            },

            "catch": function _catch(tryLoc) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (entry.tryLoc === tryLoc) {
                  var record = entry.completion;
                  if (record.type === "throw") {
                    var thrown = record.arg;
                    resetTryEntry(entry);
                  }
                  return thrown;
                }
              }

              // The context.catch method must only be called with a location
              // argument that corresponds to a known catch block.
              throw new Error("illegal catch attempt");
            },

            delegateYield: function delegateYield(iterable, resultName, nextLoc) {
              this.delegate = {
                iterator: values(iterable),
                resultName: resultName,
                nextLoc: nextLoc
              };

              return ContinueSentinel;
            }
          };
        }(
        // Among the various tricks for obtaining a reference to the global
        // object, this seems to be the most reliable technique that does not
        // use indirect eval (which violates Content Security Policy).
        typeof global === "object" ? global : typeof window === "object" ? window : typeof self === "object" ? self : this);
        return module.exports;
      }({ exports: {} });

      _asyncToGenerator = function (fn) {
        return function () {
          var gen = fn.apply(this, arguments);
          return new Promise(function (resolve, reject) {
            function step(key, arg) {
              try {
                var info = gen[key](arg);
                var value = info.value;
              } catch (error) {
                reject(error);
                return;
              }

              if (info.done) {
                resolve(value);
              } else {
                return Promise.resolve(value).then(function (value) {
                  step("next", value);
                }, function (err) {
                  step("throw", err);
                });
              }
            }

            return step("next");
          });
        };
      };

      _classCallCheck = function (instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };

      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _possibleConstructorReturn = function (self, call) {
        if (!self) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
      };

      _inherits = function (subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      };

      settings = {
        soundOn: true, // Turn on sound.
        bootBootRomFirst: true, // Boot with boot ROM first?
        gbHasPriority: false, // Give priority to GameBoy mode
        soundVolume: 0.7, // Volume level set.
        colorizeGBMode: true, // Colorize GB mode?
        runInterval: 8, // Interval for the emulator loop.
        minAudioBufferSpanAmountOverXInterpreterIterations: 10, // Audio buffer minimum span amount over x interpreter iterations.
        maxAudioBufferSpanAmountOverXInterpreterIterations: 20, // Audio buffer maximum span amount over x interpreter iterations.
        alwaysAllowRWtoBanks: false, // Override MBC RAM disabling and always allow reading and writing to the banks.
        forceGBBootRom: false, // Use the GameBoy boot ROM instead of the GameBoy Color boot ROM.
        // User controlled channel enables.
        enabledChannels: [true, true, true, true]
      };

      fetchFileAsArrayBuffer = function () {
        var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(url) {
          var res;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return fetch(url);

                case 2:
                  res = _context.sent;
                  _context.next = 5;
                  return res.arrayBuffer();

                case 5:
                  return _context.abrupt("return", _context.sent);

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function fetchFileAsArrayBuffer(_x) {
          return _ref.apply(this, arguments);
        };
      }();

      _export('util', util = Object.freeze({
        toTypedArray: toTypedArray,
        fromTypedArray: fromTypedArray,
        getTypedArray: getTypedArray,
        stringToArrayBuffer: stringToArrayBuffer,
        fetchFileAsArrayBuffer: fetchFileAsArrayBuffer,
        concatArrayBuffers: concatArrayBuffers,
        downloadFile: downloadFile,
        uploadFile: uploadFile
      }));

      LCD = function () {
        function LCD(_ref) {
          var canvas = _ref.canvas,
              context = _ref.context,
              offscreenCanvas = _ref.offscreenCanvas,
              offscreenContext = _ref.offscreenContext,
              gameboy = _ref.gameboy,
              width = _ref.width,
              height = _ref.height;

          _classCallCheck(this, LCD);

          this.canvas = canvas;
          this.context = context;
          this.offscreenCanvas = offscreenCanvas;
          this.offscreenContext = offscreenContext;
          this.gameboy = gameboy;
          this.offscreenWidth = 160;
          this.offscreenHeight = 144;
          this.offscreenRGBCount = this.offscreenWidth * this.offscreenHeight * 3;
          this.offscreenRGBACount = this.offscreenWidth * this.offscreenHeight * 4;
          this.width = width || this.offscreenWidth;
          this.height = height || this.offscreenHeight;
          this.swizzledFrame = null; // The secondary gfx buffer that holds the converted RGBA values.
          this.canvasBuffer = null; // imageData handle

          this.resizePathClear = true;

          if (typeof document !== "undefined") {
            if (!this.canvas) this.canvas = document.createElement("canvas");
            if (!this.offscreenCanvas) this.offscreenCanvas = document.createElement("canvas");
          }

          if (this.canvas) {
            this.canvas.height = this.height;
            this.canvas.width = this.width;

            if (!this.context) this.context = this.canvas.getContext("2d");
          }

          if (this.offscreenCanvas) {
            this.offscreenCanvas.height = this.offscreenHeight;
            this.offscreenCanvas.width = this.offscreenWidth;

            if (!this.offscreenContext) this.offscreenContext = this.offscreenCanvas.getContext("2d");
          }

          if (!this.context) {
            throw new Error("please provide a canvas context in the lcd options");
          }

          if (!this.offscreenContext) {
            throw new Error("please provide a canvas offscreen context in the lcd options");
          }
        }

        _createClass(LCD, [{
          key: "init",
          value: function init() {
            this.offscreenContext.msImageSmoothingEnabled = false;
            this.offscreenContext.mozImageSmoothingEnabled = false;
            this.offscreenContext.webkitImageSmoothingEnabled = false;
            this.offscreenContext.imageSmoothingEnabled = false;

            this.context.msImageSmoothingEnabled = false;
            this.context.mozImageSmoothingEnabled = false;
            this.context.webkitImageSmoothingEnabled = false;
            this.context.imageSmoothingEnabled = false;

            this.canvasBuffer = this.offscreenContext.createImageData(this.offscreenWidth, this.offscreenHeight);

            var index = this.offscreenRGBACount;
            while (index > 0) {
              index -= 4;
              this.canvasBuffer.data[index] = 0xf8;
              this.canvasBuffer.data[index + 1] = 0xf8;
              this.canvasBuffer.data[index + 2] = 0xf8;
              this.canvasBuffer.data[index + 3] = 0xff; // opacity
            }

            this.graphicsBlit();
            if (!this.swizzledFrame) this.swizzledFrame = getTypedArray(this.offscreenRGBCount, 0xff, "uint8");

            //Test the draw system and browser vblank latching:
            this.drewFrame = true; //Copy the latest graphics to buffer.
            this.requestDraw();
          }
        }, {
          key: "graphicsBlit",
          value: function graphicsBlit() {
            if (this.offscreenWidth === this.width && this.offscreenHeight === this.height) {
              this.context.putImageData(this.canvasBuffer, 0, 0);
            } else {
              this.offscreenContext.putImageData(this.canvasBuffer, 0, 0);
              this.context.drawImage(this.offscreenCanvas, 0, 0, this.width, this.height);
            }
          }
        }, {
          key: "requestDraw",
          value: function requestDraw() {
            if (this.drewFrame) {
              this.dispatchDraw();
            }
          }
        }, {
          key: "dispatchDraw",
          value: function dispatchDraw() {
            if (this.offscreenRGBACount > 0) {
              //We actually updated the graphics internally, so copy out:
              if (this.offscreenRGBACount === 92160) {
                this.processDraw(this.swizzledFrame);
              } else {
                // this.resizeFrameBuffer();
              }
            }
          }
        }, {
          key: "resizeFrameBuffer",
          value: function resizeFrameBuffer() {
            // Resize in javascript with resize.js:
            if (this.resizePathClear) {
              this.resizePathClear = false;
              this.resizer.resize(this.swizzledFrame);
            }
          }
        }, {
          key: "processDraw",
          value: function processDraw(frameBuffer) {
            var canvasData = this.canvasBuffer.data;
            var bufferIndex = 0;
            var canvasIndex = 0;

            while (canvasIndex < this.offscreenRGBACount) {
              canvasData[canvasIndex++] = frameBuffer[bufferIndex++];
              canvasData[canvasIndex++] = frameBuffer[bufferIndex++];
              canvasData[canvasIndex++] = frameBuffer[bufferIndex++];
              ++canvasIndex;
            }

            this.graphicsBlit();
            this.drewFrame = false;
          }
        }, {
          key: "prepareFrame",
          value: function prepareFrame() {
            //Copy the internal frame buffer to the output buffer:
            this.swizzleFrameBuffer();
            this.drewFrame = true;
          }
        }, {
          key: "swizzleFrameBuffer",
          value: function swizzleFrameBuffer() {
            //Convert our dirty 24-bit (24-bit, with internal render flags above it) framebuffer to an 8-bit buffer with separate indices for the RGB channels:
            var frameBuffer = this.gameboy.frameBuffer;
            var swizzledFrame = this.swizzledFrame;
            var bufferIndex = 0;
            var canvasIndex = 0;
            while (canvasIndex < this.offscreenRGBCount) {
              swizzledFrame[canvasIndex++] = frameBuffer[bufferIndex] >> 16 & 0xff; // red
              swizzledFrame[canvasIndex++] = frameBuffer[bufferIndex] >> 8 & 0xff; // green
              swizzledFrame[canvasIndex++] = frameBuffer[bufferIndex] & 0xff; // blue
              ++bufferIndex;
            }
          }
        }, {
          key: "DisplayShowOff",
          value: function DisplayShowOff() {
            if (this.drewBlank === 0) {
              // Output a blank screen to the output framebuffer:
              this.clearFrameBuffer();
              this.drewFrame = true;
            }
            this.drewBlank = 2;
          }
        }, {
          key: "clearFrameBuffer",
          value: function clearFrameBuffer() {
            var frameBuffer = this.swizzledFrame;
            var bufferIndex = 0;
            if (this.cartridge.useGBCMode || this.colorizedGBPalettes) {
              while (bufferIndex < this.offscreenRGBCount) {
                frameBuffer[bufferIndex++] = 248;
              }
            } else {
              while (bufferIndex < this.offscreenRGBCount) {
                frameBuffer[bufferIndex++] = 239;
                frameBuffer[bufferIndex++] = 255;
                frameBuffer[bufferIndex++] = 222;
              }
            }
          }
        }]);

        return LCD;
      }();

      TickTable = [// Number of machine cycles for each instruction:
      /*   0,  1,  2,  3,  4,  5,  6,  7,      8,  9,  A, B,  C,  D, E,  F*/
      4, 12, 8, 8, 4, 4, 8, 4, 20, 8, 8, 8, 4, 4, 8, 4, //0
      4, 12, 8, 8, 4, 4, 8, 4, 12, 8, 8, 8, 4, 4, 8, 4, //1
      8, 12, 8, 8, 4, 4, 8, 4, 8, 8, 8, 8, 4, 4, 8, 4, //2
      8, 12, 8, 8, 12, 12, 12, 4, 8, 8, 8, 8, 4, 4, 8, 4, //3

      4, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 4, 8, 4, //4
      4, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 4, 8, 4, //5
      4, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 4, 8, 4, //6
      8, 8, 8, 8, 8, 8, 4, 8, 4, 4, 4, 4, 4, 4, 8, 4, //7

      4, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 4, 8, 4, //8
      4, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 4, 8, 4, //9
      4, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 4, 8, 4, //A
      4, 4, 4, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 4, 8, 4, //B

      8, 12, 12, 16, 12, 16, 8, 16, 8, 16, 12, 0, 12, 24, 8, 16, //C
      8, 12, 12, 4, 12, 16, 8, 16, 8, 16, 12, 4, 12, 4, 8, 16, //D
      12, 12, 8, 4, 4, 16, 8, 16, 16, 4, 16, 4, 4, 4, 8, 16, //E
      12, 12, 8, 4, 4, 16, 8, 16, 12, 8, 16, 4, 0, 4, 8, 16 //F
      ];

      Resampler = function () {
        function Resampler(fromSampleRate, toSampleRate, channels, outputBufferSize, noReturn) {
          _classCallCheck(this, Resampler);

          this.fromSampleRate = fromSampleRate;
          this.toSampleRate = toSampleRate;
          this.channels = channels | 0;
          this.outputBufferSize = outputBufferSize;
          this.noReturn = !!noReturn;
          this.initialize();
        }

        _createClass(Resampler, [{
          key: "initialize",
          value: function initialize() {
            if (this.fromSampleRate > 0 && this.toSampleRate > 0 && this.channels > 0) {
              if (this.fromSampleRate === this.toSampleRate) {
                this.resampler = this.bypassResampler;
                this.ratioWeight = 1;
              } else {
                this.ratioWeight = this.fromSampleRate / this.toSampleRate;
                if (this.fromSampleRate < this.toSampleRate) {
                  this.compileLinearInterpolationFunction();
                  this.lastWeight = 1;
                } else {
                  this.compileMultiTapFunction();
                  this.tailExists = false;
                  this.lastWeight = 0;
                }

                this.initializeBuffers();
              }
            } else {
              throw new Error("Invalid settings specified for the resampler.");
            }
          }
        }, {
          key: "compileLinearInterpolationFunction",
          value: function compileLinearInterpolationFunction() {
            var toCompile = "var bufferLength = buffer.length;\
  	var outLength = this.outputBufferSize;\
  	if ((bufferLength % " + this.channels + ") === 0) {\
  		if (bufferLength > 0) {\
  			var weight = this.lastWeight;\
  			var firstWeight = 0;\
  			var secondWeight = 0;\
  			var sourceOffset = 0;\
  			var outputOffset = 0;\
  			var outputBuffer = this.outputBuffer;\
  			for (; weight < 1; weight += " + this.ratioWeight + ") {\
  				secondWeight = weight % 1;\
  				firstWeight = 1 - secondWeight;";
            for (var channel = 0; channel < this.channels; ++channel) {
              toCompile += "outputBuffer[outputOffset++] = (this.lastOutput[" + channel + "] * firstWeight) + (buffer[" + channel + "] * secondWeight);";
            }
            toCompile += "}\
  			weight -= 1;\
  			for (bufferLength -= " + this.channels + ", sourceOffset = Math.floor(weight) * " + this.channels + "; outputOffset < outLength && sourceOffset < bufferLength;) {\
  				secondWeight = weight % 1;\
  				firstWeight = 1 - secondWeight;";
            for (var _channel = 0; _channel < this.channels; ++_channel) {
              toCompile += "outputBuffer[outputOffset++] = (buffer[sourceOffset" + (_channel > 0 ? " + " + _channel : "") + "] * firstWeight) + (buffer[sourceOffset + " + (this.channels + _channel) + "] * secondWeight);";
            }
            toCompile += "weight += " + this.ratioWeight + ";\
  				sourceOffset = Math.floor(weight) * " + this.channels + ";\
  			}";
            for (var _channel2 = 0; _channel2 < this.channels; ++_channel2) {
              toCompile += "this.lastOutput[" + _channel2 + "] = buffer[sourceOffset++];";
            }
            toCompile += 'this.lastWeight = weight % 1;\
  			return this.bufferSlice(outputOffset);\
  		}\
  		else {\
  			return (this.noReturn) ? 0 : [];\
  		}\
  	}\
  	else {\
  		throw(new Error("Buffer was of incorrect sample length."));\
  	}';
            this.resampler = Function("buffer", toCompile);
          }
        }, {
          key: "compileMultiTapFunction",
          value: function compileMultiTapFunction() {
            var toCompile = "var bufferLength = buffer.length;\
  	var outLength = this.outputBufferSize;\
  	if ((bufferLength % " + this.channels + ") === 0) {\
  		if (bufferLength > 0) {\
  			var weight = 0;";
            for (var channel = 0; channel < this.channels; ++channel) {
              toCompile += "var output" + channel + " = 0;";
            }
            toCompile += "var actualPosition = 0;\
  			var amountToNext = 0;\
  			var alreadyProcessedTail = !this.tailExists;\
  			this.tailExists = false;\
  			var outputBuffer = this.outputBuffer;\
  			var outputOffset = 0;\
  			var currentPosition = 0;\
  			do {\
  				if (alreadyProcessedTail) {\
  					weight = " + this.ratioWeight + ";";
            for (var _channel3 = 0; _channel3 < this.channels; ++_channel3) {
              toCompile += "output" + _channel3 + " = 0;";
            }
            toCompile += "}\
  				else {\
  					weight = this.lastWeight;";
            for (var _channel4 = 0; _channel4 < this.channels; ++_channel4) {
              toCompile += "output" + _channel4 + " = this.lastOutput[" + _channel4 + "];";
            }
            toCompile += "alreadyProcessedTail = true;\
  				}\
  				while (weight > 0 && actualPosition < bufferLength) {\
  					amountToNext = 1 + actualPosition - currentPosition;\
  					if (weight >= amountToNext) {";
            for (var _channel5 = 0; _channel5 < this.channels; ++_channel5) {
              toCompile += "output" + _channel5 + " += buffer[actualPosition++] * amountToNext;";
            }
            toCompile += "currentPosition = actualPosition;\
  						weight -= amountToNext;\
  					}\
  					else {";
            for (var _channel6 = 0; _channel6 < this.channels; ++_channel6) {
              toCompile += "output" + _channel6 + " += buffer[actualPosition" + (_channel6 > 0 ? " + " + _channel6 : "") + "] * weight;";
            }
            toCompile += "currentPosition += weight;\
  						weight = 0;\
  						break;\
  					}\
  				}\
  				if (weight <= 0) {";
            for (var _channel7 = 0; _channel7 < this.channels; ++_channel7) {
              toCompile += "outputBuffer[outputOffset++] = output" + _channel7 + " / " + this.ratioWeight + ";";
            }
            toCompile += "}\
  				else {\
  					this.lastWeight = weight;";
            for (var _channel8 = 0; _channel8 < this.channels; ++_channel8) {
              toCompile += "this.lastOutput[" + _channel8 + "] = output" + _channel8 + ";";
            }
            toCompile += 'this.tailExists = true;\
  					break;\
  				}\
  			} while (actualPosition < bufferLength && outputOffset < outLength);\
  			return this.bufferSlice(outputOffset);\
  		}\
  		else {\
  			return (this.noReturn) ? 0 : [];\
  		}\
  	}\
  	else {\
  		throw(new Error("Buffer was of incorrect sample length."));\
  	}';
            this.resampler = Function("buffer", toCompile);
          }
        }, {
          key: "bypassResampler",
          value: function bypassResampler(buffer) {
            if (this.noReturn) {
              this.outputBuffer = buffer;
              return buffer.length;
            } else {
              return buffer;
            }
          }
        }, {
          key: "bufferSlice",
          value: function bufferSlice(sliceAmount) {
            if (this.noReturn) {
              return sliceAmount;
            } else {
              try {
                return this.outputBuffer.subarray(0, sliceAmount);
              } catch (error) {
                try {
                  this.outputBuffer.length = sliceAmount;
                  return this.outputBuffer;
                } catch (error) {
                  return this.outputBuffer.slice(0, sliceAmount);
                }
              }
            }
          }
        }, {
          key: "initializeBuffers",
          value: function initializeBuffers() {
            try {
              this.outputBuffer = new Float32Array(this.outputBufferSize);
              this.lastOutput = new Float32Array(this.channels);
            } catch (error) {
              this.outputBuffer = [];
              this.lastOutput = [];
            }
          }
        }]);

        return Resampler;
      }();

      AudioDevice = function () {
        function AudioDevice(_ref) {
          var context = _ref.context,
              channels = _ref.channels,
              minBufferSize = _ref.minBufferSize,
              volume = _ref.volume;

          _classCallCheck(this, AudioDevice);

          this.context = context || new AudioContext();
          this.samplesPerCallback = 2048; // Has to be between 2048 and 4096 (If over, then samples are ignored, if under then silence is added).
          this.channelsAllocated = Math.max(channels, 1);
          this.bufferSize = this.samplesPerCallback * this.channelsAllocated;
          this.minBufferSize = this.bufferSize;
          this.setVolume(volume);
        }

        _createClass(AudioDevice, [{
          key: "setSampleRate",
          value: function setSampleRate(sampleRate) {
            this.sampleRate = Math.abs(sampleRate);
          }
        }, {
          key: "setMaxBufferSize",
          value: function setMaxBufferSize(maxBufferSize) {
            this.maxBufferSize = Math.floor(maxBufferSize) > this.minBufferSize + this.channelsAllocated ? maxBufferSize & -this.channelsAllocated : this.minBufferSize * this.channelsAllocated;
          }
        }, {
          key: "writeAudio",
          value: function writeAudio(buffer) {
            var bufferCounter = 0;
            while (bufferCounter < buffer.length && this.audioBufferSize < this.maxBufferSize) {
              this.audioContextSampleBuffer[this.audioBufferSize++] = buffer[bufferCounter++];
            }
          }
        }, {
          key: "remainingBuffer",
          value: function remainingBuffer() {
            return Math.floor(this.resampledSamplesLeft() * this.resampleControl.ratioWeight / this.channelsAllocated) * this.channelsAllocated + this.audioBufferSize;
          }
        }, {
          key: "initializeAudio",
          value: function initializeAudio() {
            var _this = this;

            if (!this.audioNode) {
              this.audioNode = this.context.createScriptProcessor(this.samplesPerCallback, 0, this.channelsAllocated);

              this.audioNode.onaudioprocess = function (e) {
                return _this.processAudio(e);
              };
              this.audioNode.connect(this.context.destination);
              this.resetCallbackAPIAudioBuffer(this.context.sampleRate);
            }
          }
        }, {
          key: "processAudio",
          value: function processAudio(e) {
            var buffers = [];
            var bufferCount = 0;

            while (bufferCount < this.channelsAllocated) {
              buffers[bufferCount] = e.outputBuffer.getChannelData(bufferCount);
              ++bufferCount;
            }

            this.refillResampledBuffer();

            var index = 0;
            while (index < this.samplesPerCallback && this.resampleBufferStart !== this.resampleBufferEnd) {
              bufferCount = 0;
              while (bufferCount < this.channelsAllocated) {
                buffers[bufferCount][index] = this.resampledBuffer[this.resampleBufferStart++] * this.volume;

                ++bufferCount;
              }

              if (this.resampleBufferStart === this.resampleBufferSize) {
                this.resampleBufferStart = 0;
              }

              ++index;
            }

            while (index < this.samplesPerCallback) {
              for (bufferCount = 0; bufferCount < this.channelsAllocated; ++bufferCount) {
                buffers[bufferCount][index] = 0;
              }
              ++index;
            }
          }
        }, {
          key: "setVolume",
          value: function setVolume(volume) {
            this.volume = Math.max(0, Math.min(1, volume));
          }
        }, {
          key: "resetCallbackAPIAudioBuffer",
          value: function resetCallbackAPIAudioBuffer(sampleRate) {
            this.audioBufferSize = this.resampleBufferEnd = this.resampleBufferStart = 0;
            this.initializeResampler(sampleRate);
            this.resampledBuffer = new Float32Array(this.resampleBufferSize);
          }
        }, {
          key: "refillResampledBuffer",
          value: function refillResampledBuffer() {
            if (this.audioBufferSize > 0) {
              var resampleLength = this.resampleControl.resampler(this.getBufferSamples());
              var resampledResult = this.resampleControl.outputBuffer;

              for (var i = 0; i < resampleLength;) {
                this.resampledBuffer[this.resampleBufferEnd++] = resampledResult[i++];

                if (this.resampleBufferEnd === this.resampleBufferSize) {
                  this.resampleBufferEnd = 0;
                }

                if (this.resampleBufferStart === this.resampleBufferEnd) {
                  this.resampleBufferStart += this.channelsAllocated;

                  if (this.resampleBufferStart === this.resampleBufferSize) {
                    this.resampleBufferStart = 0;
                  }
                }
              }
              this.audioBufferSize = 0;
            }
          }
        }, {
          key: "initializeResampler",
          value: function initializeResampler(sampleRate) {
            this.audioContextSampleBuffer = new Float32Array(this.maxBufferSize);
            this.resampleBufferSize = Math.max(this.maxBufferSize * Math.ceil(sampleRate / this.sampleRate) + this.channelsAllocated, this.bufferSize);

            this.resampleControl = new Resampler(this.sampleRate, sampleRate, this.channelsAllocated, this.resampleBufferSize, true);
          }
        }, {
          key: "resampledSamplesLeft",
          value: function resampledSamplesLeft() {
            return (this.resampleBufferStart <= this.resampleBufferEnd ? 0 : this.resampleBufferSize) + this.resampleBufferEnd - this.resampleBufferStart;
          }
        }, {
          key: "getBufferSamples",
          value: function getBufferSamples() {
            return this.audioContextSampleBuffer.subarray(0, this.audioBufferSize);
          }
        }]);

        return AudioDevice;
      }();

      dutyLookup = [
      //Map the duty values given to ones we can work with.
      [false, false, false, false, false, false, false, true], [true, false, false, false, false, false, false, true], [true, false, false, false, false, true, true, true], [false, true, true, true, true, true, true, false]];

      AudioController = function () {
        // Buffer maintenance metric
        // Used to sample the audio system every x CPU instructions
        function AudioController(_ref) {
          var cpu = _ref.cpu,
              gameboy = _ref.gameboy;

          _classCallCheck(this, AudioController);

          this.LSFR15Table = null;
          this.LSFR7Table = null;
          this.noiseSampleTable = null;
          this.bufferLength = 0;
          this.audioTicks = 0;
          this.audioIndex = 0;
          this.bufferContainAmount = 0;
          this.bufferPosition = 0;
          this.downsampleInput = 0;

          this.cpu = cpu;
          this.gameboy = gameboy;
          this.generateWhiteNoise();
          this.initStartState();
        } // Used to keep alignment on audio generation
        // Used to keep alignment on audio generation
        // Length of the sound buffers


        _createClass(AudioController, [{
          key: "setMemory",
          value: function setMemory(memory) {
            this.memory = memory;
          }
        }, {
          key: "initMemory",
          value: function initMemory() {
            this.channel3PCM = getTypedArray(0x20, 0, "int8");
          }
        }, {
          key: "initStartState",
          value: function initStartState() {
            this.channel1FrequencyTracker = 0x2000;
            this.channel1DutyTracker = 0;
            this.channel1CachedDuty = dutyLookup[2];
            this.channel1totalLength = 0;
            this.channel1envelopeVolume = 0;
            this.channel1envelopeType = false;
            this.channel1envelopeSweeps = 0;
            this.channel1envelopeSweepsLast = 0;
            this.channel1consecutive = true;
            this.channel1frequency = 0;
            this.channel1SweepFault = false;
            this.channel1ShadowFrequency = 0;
            this.channel1timeSweep = 1;
            this.channel1lastTimeSweep = 0;
            this.channel1Swept = false;
            this.channel1frequencySweepDivider = 0;
            this.channel1decreaseSweep = false;
            this.channel2FrequencyTracker = 0x2000;
            this.channel2DutyTracker = 0;
            this.channel2CachedDuty = dutyLookup[2];
            this.channel2totalLength = 0;
            this.channel2envelopeVolume = 0;
            this.channel2envelopeType = false;
            this.channel2envelopeSweeps = 0;
            this.channel2envelopeSweepsLast = 0;
            this.channel2consecutive = true;
            this.channel2frequency = 0;
            this.channel3canPlay = false;
            this.channel3totalLength = 0;
            this.channel3patternType = 4;
            this.channel3frequency = 0;
            this.channel3consecutive = true;
            this.channel3Counter = 0x800;
            this.channel4FrequencyPeriod = 8;
            this.channel4totalLength = 0;
            this.channel4envelopeVolume = 0;
            this.channel4currentVolume = 0;
            this.channel4envelopeType = false;
            this.channel4envelopeSweeps = 0;
            this.channel4envelopeSweepsLast = 0;
            this.channel4consecutive = true;
            this.channel4BitRange = 0x7fff;
            this.channel4VolumeShifter = 15;
            this.channel1FrequencyCounter = 0x2000;
            this.channel2FrequencyCounter = 0x2000;
            this.channel3Counter = 0x800;
            this.channel3FrequencyPeriod = 0x800;
            this.channel3lastSampleLookup = 0;
            this.channel4lastSampleLookup = 0;
            this.VinLeftChannelMasterVolume = 8;
            this.VinRightChannelMasterVolume = 8;
            this.mixerOutputCache = 0;
            this.sequencerClocks = 0x2000;
            this.sequencePosition = 0;
            this.channel4FrequencyPeriod = 8;
            this.channel4Counter = 8;
            this.cachedChannel3Sample = 0;
            this.cachedChannel4Sample = 0;
            this.channel1Enabled = false;
            this.channel2Enabled = false;
            this.channel3Enabled = false;
            this.channel4Enabled = false;
            this.channel1canPlay = false;
            this.channel2canPlay = false;
            this.channel4canPlay = false;
            this.audioClocksUntilNextEvent = 1;
            this.audioClocksUntilNextEventCounter = 1;
            this.cacheChannel1OutputLevel();
            this.cacheChannel2OutputLevel();
            this.cacheChannel3OutputLevel();
            this.cacheChannel4OutputLevel();
            this.noiseSampleTable = this.LSFR15Table;
          }

          //Below are the audio generation functions timed against the CPU:

        }, {
          key: "generate",
          value: function generate(numSamples) {
            if (this.gameboy.soundMasterEnabled && !this.gameboy.CPUStopped) {
              for (var clockUpTo = 0; numSamples > 0;) {
                clockUpTo = Math.min(this.audioClocksUntilNextEventCounter, this.sequencerClocks, numSamples);
                this.audioClocksUntilNextEventCounter -= clockUpTo;
                this.sequencerClocks -= clockUpTo;
                numSamples -= clockUpTo;
                while (clockUpTo > 0) {
                  var multiplier = Math.min(clockUpTo, this.resamplerFirstPassFactor - this.audioIndex);
                  clockUpTo -= multiplier;
                  this.audioIndex += multiplier;
                  this.downsampleInput += this.mixerOutputCache * multiplier;
                  if (this.audioIndex === this.resamplerFirstPassFactor) {
                    this.audioIndex = 0;
                    this.outputAudio();
                  }
                }
                if (this.sequencerClocks === 0) {
                  this.audioComputeSequencer();
                  this.sequencerClocks = 0x2000;
                }
                if (this.audioClocksUntilNextEventCounter === 0) {
                  this.computeChannels();
                }
              }
            } else {
              //SILENT OUTPUT:
              while (numSamples > 0) {
                var _multiplier = Math.min(numSamples, this.resamplerFirstPassFactor - this.audioIndex);
                numSamples -= _multiplier;
                this.audioIndex += _multiplier;
                if (this.audioIndex === this.resamplerFirstPassFactor) {
                  this.audioIndex = 0;
                  this.outputAudio();
                }
              }
            }
          }

          //Generate audio, but don't actually output it (Used for when sound is disabled by user/browser):

        }, {
          key: "generateFake",
          value: function generateFake(numSamples) {
            if (this.gameboy.soundMasterEnabled && !this.gameboy.CPUStopped) {
              var clockUpTo = 0;
              while (numSamples > 0) {
                clockUpTo = Math.min(this.audioClocksUntilNextEventCounter, this.sequencerClocks, numSamples);
                this.audioClocksUntilNextEventCounter -= clockUpTo;
                this.sequencerClocks -= clockUpTo;
                numSamples -= clockUpTo;
                if (this.sequencerClocks === 0) {
                  this.audioComputeSequencer();
                  this.sequencerClocks = 0x2000;
                }
                if (this.audioClocksUntilNextEventCounter === 0) {
                  this.computeChannels();
                }
              }
            }
          }
        }, {
          key: "runJIT",
          value: function runJIT() {
            // Audio Sample Generation Timing:
            if (settings.soundOn) {
              this.generate(this.audioTicks);
            } else {
              this.generateFake(this.audioTicks);
            }
            this.audioTicks = 0;
          }
        }, {
          key: "clockAudioEnvelope",
          value: function clockAudioEnvelope() {
            //Channel 1:
            if (this.channel1envelopeSweepsLast > -1) {
              if (this.channel1envelopeSweeps > 0) {
                --this.channel1envelopeSweeps;
              } else {
                if (!this.channel1envelopeType) {
                  if (this.channel1envelopeVolume > 0) {
                    --this.channel1envelopeVolume;
                    this.channel1envelopeSweeps = this.channel1envelopeSweepsLast;
                    this.cacheChannel1OutputLevel();
                  } else {
                    this.channel1envelopeSweepsLast = -1;
                  }
                } else if (this.channel1envelopeVolume < 0xf) {
                  ++this.channel1envelopeVolume;
                  this.channel1envelopeSweeps = this.channel1envelopeSweepsLast;
                  this.cacheChannel1OutputLevel();
                } else {
                  this.channel1envelopeSweepsLast = -1;
                }
              }
            }
            //Channel 2:
            if (this.channel2envelopeSweepsLast > -1) {
              if (this.channel2envelopeSweeps > 0) {
                --this.channel2envelopeSweeps;
              } else {
                if (!this.channel2envelopeType) {
                  if (this.channel2envelopeVolume > 0) {
                    --this.channel2envelopeVolume;
                    this.channel2envelopeSweeps = this.channel2envelopeSweepsLast;
                    this.cacheChannel2OutputLevel();
                  } else {
                    this.channel2envelopeSweepsLast = -1;
                  }
                } else if (this.channel2envelopeVolume < 0xf) {
                  ++this.channel2envelopeVolume;
                  this.channel2envelopeSweeps = this.channel2envelopeSweepsLast;
                  this.cacheChannel2OutputLevel();
                } else {
                  this.channel2envelopeSweepsLast = -1;
                }
              }
            }
            //Channel 4:
            if (this.channel4envelopeSweepsLast > -1) {
              if (this.channel4envelopeSweeps > 0) {
                --this.channel4envelopeSweeps;
              } else {
                if (!this.channel4envelopeType) {
                  if (this.channel4envelopeVolume > 0) {
                    this.channel4currentVolume = --this.channel4envelopeVolume << this.channel4VolumeShifter;
                    this.channel4envelopeSweeps = this.channel4envelopeSweepsLast;
                    this.cacheChannel4Update();
                  } else {
                    this.channel4envelopeSweepsLast = -1;
                  }
                } else if (this.channel4envelopeVolume < 0xf) {
                  this.channel4currentVolume = ++this.channel4envelopeVolume << this.channel4VolumeShifter;
                  this.channel4envelopeSweeps = this.channel4envelopeSweepsLast;
                  this.cacheChannel4Update();
                } else {
                  this.channel4envelopeSweepsLast = -1;
                }
              }
            }
          }
        }, {
          key: "performChannel1AudioSweepDummy",
          value: function performChannel1AudioSweepDummy() {
            //Channel 1:
            if (this.channel1frequencySweepDivider > 0) {
              if (!this.channel1decreaseSweep) {
                var channel1ShadowFrequency = this.channel1ShadowFrequency + (this.channel1ShadowFrequency >> this.channel1frequencySweepDivider);
                if (channel1ShadowFrequency <= 0x7ff) {
                  //Run overflow check twice:
                  if (channel1ShadowFrequency + (channel1ShadowFrequency >> this.channel1frequencySweepDivider) > 0x7ff) {
                    this.channel1SweepFault = true;
                    this.checkChannel1Enable();
                    this.memory[0xff26] &= 0xfe; //Channel #1 On Flag Off
                  }
                } else {
                  this.channel1SweepFault = true;
                  this.checkChannel1Enable();
                  this.memory[0xff26] &= 0xfe; //Channel #1 On Flag Off
                }
              }
            }
          }
        }, {
          key: "audioComputeSequencer",
          value: function audioComputeSequencer() {
            switch (this.sequencePosition++) {
              case 0:
                this.clockAudioLength();
                break;
              case 2:
                this.clockAudioLength();
                this.clockAudioSweep();
                break;
              case 4:
                this.clockAudioLength();
                break;
              case 6:
                this.clockAudioLength();
                this.clockAudioSweep();
                break;
              case 7:
                this.clockAudioEnvelope();
                this.sequencePosition = 0;
            }
          }
        }, {
          key: "clockAudioLength",
          value: function clockAudioLength() {
            //Channel 1:
            if (this.channel1totalLength > 1) {
              --this.channel1totalLength;
            } else if (this.channel1totalLength === 1) {
              this.channel1totalLength = 0;
              this.checkChannel1Enable();
              this.memory[0xff26] &= 0xfe; //Channel #1 On Flag Off
            }
            //Channel 2:
            if (this.channel2totalLength > 1) {
              --this.channel2totalLength;
            } else if (this.channel2totalLength === 1) {
              this.channel2totalLength = 0;
              this.checkChannel2Enable();
              this.memory[0xff26] &= 0xfd; //Channel #2 On Flag Off
            }
            //Channel 3:
            if (this.channel3totalLength > 1) {
              --this.channel3totalLength;
            } else if (this.channel3totalLength === 1) {
              this.channel3totalLength = 0;
              this.checkChannel3Enable();
              this.memory[0xff26] &= 0xfb; //Channel #3 On Flag Off
            }
            //Channel 4:
            if (this.channel4totalLength > 1) {
              --this.channel4totalLength;
            } else if (this.channel4totalLength === 1) {
              this.channel4totalLength = 0;
              this.checkChannel4Enable();
              this.memory[0xff26] &= 0xf7; //Channel #4 On Flag Off
            }
          }
        }, {
          key: "clockAudioSweep",
          value: function clockAudioSweep() {
            //Channel 1:
            if (!this.channel1SweepFault && this.channel1timeSweep > 0) {
              if (--this.channel1timeSweep === 0) {
                this.runAudioSweep();
              }
            }
          }
        }, {
          key: "runAudioSweep",
          value: function runAudioSweep() {
            //Channel 1:
            if (this.channel1lastTimeSweep > 0) {
              if (this.channel1frequencySweepDivider > 0) {
                this.channel1Swept = true;
                if (this.channel1decreaseSweep) {
                  this.channel1ShadowFrequency -= this.channel1ShadowFrequency >> this.channel1frequencySweepDivider;
                  this.channel1frequency = this.channel1ShadowFrequency & 0x7ff;
                  this.channel1FrequencyTracker = 0x800 - this.channel1frequency << 2;
                } else {
                  this.channel1ShadowFrequency += this.channel1ShadowFrequency >> this.channel1frequencySweepDivider;
                  this.channel1frequency = this.channel1ShadowFrequency;
                  if (this.channel1ShadowFrequency <= 0x7ff) {
                    this.channel1FrequencyTracker = 0x800 - this.channel1frequency << 2;
                    //Run overflow check twice:
                    if (this.channel1ShadowFrequency + (this.channel1ShadowFrequency >> this.channel1frequencySweepDivider) > 0x7ff) {
                      this.channel1SweepFault = true;
                      this.checkChannel1Enable();
                      this.memory[0xff26] &= 0xfe; //Channel #1 On Flag Off
                    }
                  } else {
                    this.channel1frequency &= 0x7ff;
                    this.channel1SweepFault = true;
                    this.checkChannel1Enable();
                    this.memory[0xff26] &= 0xfe; //Channel #1 On Flag Off
                  }
                }
                this.channel1timeSweep = this.channel1lastTimeSweep;
              } else {
                //Channel has sweep disabled and timer becomes a length counter:
                this.channel1SweepFault = true;
                this.checkChannel1Enable();
              }
            }
          }
        }, {
          key: "computeChannels",
          value: function computeChannels() {
            //Clock down the four audio channels to the next closest audio event:
            this.channel1FrequencyCounter -= this.audioClocksUntilNextEvent;
            this.channel2FrequencyCounter -= this.audioClocksUntilNextEvent;
            this.channel3Counter -= this.audioClocksUntilNextEvent;
            this.channel4Counter -= this.audioClocksUntilNextEvent;
            //Channel 1 counter:
            if (this.channel1FrequencyCounter === 0) {
              this.channel1FrequencyCounter = this.channel1FrequencyTracker;
              this.channel1DutyTracker = this.channel1DutyTracker + 1 & 0x7;
              this.cacheChannel1OutputLevelTrimary();
            }
            //Channel 2 counter:
            if (this.channel2FrequencyCounter === 0) {
              this.channel2FrequencyCounter = this.channel2FrequencyTracker;
              this.channel2DutyTracker = this.channel2DutyTracker + 1 & 0x7;
              this.cacheChannel2OutputLevelTrimary();
            }
            //Channel 3 counter:
            if (this.channel3Counter === 0) {
              if (this.channel3canPlay) {
                this.channel3lastSampleLookup = this.channel3lastSampleLookup + 1 & 0x1f;
              }
              this.channel3Counter = this.channel3FrequencyPeriod;
              this.cacheChannel3Update();
            }
            //Channel 4 counter:
            if (this.channel4Counter === 0) {
              this.channel4lastSampleLookup = this.channel4lastSampleLookup + 1 & this.channel4BitRange;
              this.channel4Counter = this.channel4FrequencyPeriod;
              this.cacheChannel4Update();
            }
            //Find the number of clocks to next closest counter event:
            this.audioClocksUntilNextEventCounter = this.audioClocksUntilNextEvent = Math.min(this.channel1FrequencyCounter, this.channel2FrequencyCounter, this.channel3Counter, this.channel4Counter);
          }
        }, {
          key: "checkChannel1Enable",
          value: function checkChannel1Enable() {
            this.channel1Enabled = (this.channel1consecutive || this.channel1totalLength > 0) && !this.channel1SweepFault && this.channel1canPlay;
            this.cacheChannel1OutputLevelSecondary();
          }
        }, {
          key: "cacheChannel1OutputLevel",
          value: function cacheChannel1OutputLevel() {
            this.channel1currentSampleLeft = this.leftChannel1 ? this.channel1envelopeVolume : 0;
            this.channel1currentSampleRight = this.rightChannel1 ? this.channel1envelopeVolume : 0;
            this.cacheChannel1OutputLevelSecondary();
          }
        }, {
          key: "checkChannel1VolumeEnable",
          value: function checkChannel1VolumeEnable() {
            this.channel1canPlay = this.memory[0xff12] > 7;
            this.checkChannel1Enable();
            this.cacheChannel1OutputLevelSecondary();
          }
        }, {
          key: "cacheChannel1OutputLevelSecondary",
          value: function cacheChannel1OutputLevelSecondary() {
            if (this.channel1Enabled) {
              this.channel1currentSampleLeftSecondary = this.channel1currentSampleLeft;
              this.channel1currentSampleRightSecondary = this.channel1currentSampleRight;
            } else {
              this.channel1currentSampleLeftSecondary = 0;
              this.channel1currentSampleRightSecondary = 0;
            }
            this.cacheChannel1OutputLevelTrimary();
          }
        }, {
          key: "cacheChannel1OutputLevelTrimary",
          value: function cacheChannel1OutputLevelTrimary() {
            if (this.channel1CachedDuty[this.channel1DutyTracker] && settings.enabledChannels[0]) {
              this.channel1currentSampleLeftTrimary = this.channel1currentSampleLeftSecondary;
              this.channel1currentSampleRightTrimary = this.channel1currentSampleRightSecondary;
            } else {
              this.channel1currentSampleLeftTrimary = 0;
              this.channel1currentSampleRightTrimary = 0;
            }
            this.cacheMixerOutputLevel();
          }
        }, {
          key: "checkChannel2Enable",
          value: function checkChannel2Enable() {
            this.channel2Enabled = (this.channel2consecutive || this.channel2totalLength > 0) && this.channel2canPlay;
            this.cacheChannel2OutputLevelSecondary();
          }
        }, {
          key: "cacheChannel2OutputLevel",
          value: function cacheChannel2OutputLevel() {
            this.channel2currentSampleLeft = this.leftChannel2 ? this.channel2envelopeVolume : 0;
            this.channel2currentSampleRight = this.rightChannel2 ? this.channel2envelopeVolume : 0;
            this.cacheChannel2OutputLevelSecondary();
          }
        }, {
          key: "checkChannel2VolumeEnable",
          value: function checkChannel2VolumeEnable() {
            this.channel2canPlay = this.memory[0xff17] > 7;
            this.checkChannel2Enable();
            this.cacheChannel2OutputLevelSecondary();
          }
        }, {
          key: "cacheChannel2OutputLevelSecondary",
          value: function cacheChannel2OutputLevelSecondary() {
            if (this.channel2Enabled) {
              this.channel2currentSampleLeftSecondary = this.channel2currentSampleLeft;
              this.channel2currentSampleRightSecondary = this.channel2currentSampleRight;
            } else {
              this.channel2currentSampleLeftSecondary = 0;
              this.channel2currentSampleRightSecondary = 0;
            }
            this.cacheChannel2OutputLevelTrimary();
          }
        }, {
          key: "cacheChannel2OutputLevelTrimary",
          value: function cacheChannel2OutputLevelTrimary() {
            if (this.channel2CachedDuty[this.channel2DutyTracker] && settings.enabledChannels[1]) {
              this.channel2currentSampleLeftTrimary = this.channel2currentSampleLeftSecondary;
              this.channel2currentSampleRightTrimary = this.channel2currentSampleRightSecondary;
            } else {
              this.channel2currentSampleLeftTrimary = 0;
              this.channel2currentSampleRightTrimary = 0;
            }
            this.cacheMixerOutputLevel();
          }
        }, {
          key: "cacheChannel3Update",
          value: function cacheChannel3Update() {
            this.cachedChannel3Sample = this.channel3PCM[this.channel3lastSampleLookup] >> this.channel3patternType;
            this.cacheChannel3OutputLevel();
          }
        }, {
          key: "checkChannel3Enable",
          value: function checkChannel3Enable() {
            this.channel3Enabled /*this.channel3canPlay && */ = this.channel3consecutive || this.channel3totalLength > 0;
            this.channel3OutputLevelSecondaryCache();
          }
        }, {
          key: "cacheChannel3OutputLevel",
          value: function cacheChannel3OutputLevel() {
            this.channel3currentSampleLeft = this.leftChannel3 ? this.cachedChannel3Sample : 0;
            this.channel3currentSampleRight = this.rightChannel3 ? this.cachedChannel3Sample : 0;
            this.channel3OutputLevelSecondaryCache();
          }
        }, {
          key: "channel3OutputLevelSecondaryCache",
          value: function channel3OutputLevelSecondaryCache() {
            if (this.channel3Enabled && settings.enabledChannels[2]) {
              this.channel3currentSampleLeftSecondary = this.channel3currentSampleLeft;
              this.channel3currentSampleRightSecondary = this.channel3currentSampleRight;
            } else {
              this.channel3currentSampleLeftSecondary = 0;
              this.channel3currentSampleRightSecondary = 0;
            }
            this.cacheMixerOutputLevel();
          }
        }, {
          key: "checkChannel4Enable",
          value: function checkChannel4Enable() {
            this.channel4Enabled = (this.channel4consecutive || this.channel4totalLength > 0) && this.channel4canPlay;
            this.cacheChannel4OutputLevelSecondary();
          }
        }, {
          key: "cacheChannel4Update",
          value: function cacheChannel4Update() {
            this.cachedChannel4Sample = this.noiseSampleTable[this.channel4currentVolume | this.channel4lastSampleLookup];
            this.cacheChannel4OutputLevel();
          }
        }, {
          key: "cacheChannel4OutputLevel",
          value: function cacheChannel4OutputLevel() {
            this.channel4currentSampleLeft = this.leftChannel4 ? this.cachedChannel4Sample : 0;
            this.channel4currentSampleRight = this.rightChannel4 ? this.cachedChannel4Sample : 0;
            this.cacheChannel4OutputLevelSecondary();
          }
        }, {
          key: "checkChannel4VolumeEnable",
          value: function checkChannel4VolumeEnable() {
            this.channel4canPlay = this.memory[0xff21] > 7;
            this.checkChannel4Enable();
            this.cacheChannel4OutputLevelSecondary();
          }
        }, {
          key: "cacheChannel4OutputLevelSecondary",
          value: function cacheChannel4OutputLevelSecondary() {
            if (this.channel4Enabled && settings.enabledChannels[3]) {
              this.channel4currentSampleLeftSecondary = this.channel4currentSampleLeft;
              this.channel4currentSampleRightSecondary = this.channel4currentSampleRight;
            } else {
              this.channel4currentSampleLeftSecondary = 0;
              this.channel4currentSampleRightSecondary = 0;
            }
            this.cacheMixerOutputLevel();
          }
        }, {
          key: "cacheMixerOutputLevel",
          value: function cacheMixerOutputLevel() {
            var currentLeftSample = this.channel1currentSampleLeftTrimary + this.channel2currentSampleLeftTrimary + this.channel3currentSampleLeftSecondary + this.channel4currentSampleLeftSecondary;
            var currentRightSample = this.channel1currentSampleRightTrimary + this.channel2currentSampleRightTrimary + this.channel3currentSampleRightSecondary + this.channel4currentSampleRightSecondary;
            this.mixerOutputCache = currentLeftSample * this.VinLeftChannelMasterVolume << 16 | currentRightSample * this.VinRightChannelMasterVolume;
          }
        }, {
          key: "connectDevice",
          value: function connectDevice(device) {
            this.resamplerFirstPassFactor = Math.max(Math.min(Math.floor(this.cpu.clocksPerSecond / 44100), Math.floor(0xffff / 0x1e0)), 1);
            this.downSampleInputDivider = 1 / (this.resamplerFirstPassFactor * 0xf0);

            var sampleRate = this.cpu.clocksPerSecond / this.resamplerFirstPassFactor;
            var maxBufferSize = Math.max(this.cpu.baseCyclesPerIteration * settings.maxAudioBufferSpanAmountOverXInterpreterIterations / this.resamplerFirstPassFactor, 8192) << 1;
            device.setSampleRate(sampleRate);
            device.setMaxBufferSize(maxBufferSize);
            device.initializeAudio();

            this.device = device;
          }
        }, {
          key: "setVolume",
          value: function setVolume(volume) {
            this.device && this.device.setVolume(volume);
          }
        }, {
          key: "adjustUnderrun",
          value: function adjustUnderrun() {
            if (!settings.soundOn) return;
            var underrunAmount = this.device.remainingBuffer();
            if (typeof underrunAmount === "number") {
              underrunAmount = this.bufferContainAmount - Math.max(underrunAmount, 0);
              if (underrunAmount > 0) {
                this.recalculateIterationClockLimitForAudio((underrunAmount >> 1) * this.resamplerFirstPassFactor);
              }
            }
          }
        }, {
          key: "recalculateIterationClockLimitForAudio",
          value: function recalculateIterationClockLimitForAudio(audioClocking) {
            this.cpu.cyclesTotal += Math.min(audioClocking >> 2 << 2, this.cpu.cyclesTotalBase << 1);
          }
        }, {
          key: "outputAudio",
          value: function outputAudio() {
            this.fillBuffer();
            if (this.bufferPosition === this.bufferLength) {
              this.device.writeAudio(this.buffer);
              this.bufferPosition = 0;
            }
            this.downsampleInput = 0;
          }
        }, {
          key: "fillBuffer",
          value: function fillBuffer() {
            this.buffer[this.bufferPosition++] = (this.downsampleInput >>> 16) * this.downSampleInputDivider - 1;
            this.buffer[this.bufferPosition++] = (this.downsampleInput & 0xffff) * this.downSampleInputDivider - 1;
          }
        }, {
          key: "initBuffer",
          value: function initBuffer() {
            this.audioIndex = 0;
            this.bufferPosition = 0;
            this.downsampleInput = 0;
            this.bufferContainAmount = Math.max(this.cpu.baseCyclesPerIteration * settings.minAudioBufferSpanAmountOverXInterpreterIterations / this.resamplerFirstPassFactor, 4096) << 1;
            this.bufferLength = this.cpu.baseCyclesPerIteration / this.resamplerFirstPassFactor << 1;
            this.buffer = getTypedArray(this.bufferLength, 0, "float32");
          }
        }, {
          key: "generateWhiteNoise",
          value: function generateWhiteNoise() {
            // Noise Sample Tables
            this.LSFR7Table = this.generateLSFR7Table();
            this.LSFR15Table = this.generateLSFR15Table();

            // Set the default noise table
            this.noiseSampleTable = this.LSFR15Table;
          }
        }, {
          key: "generateLSFR7Table",
          value: function generateLSFR7Table() {
            // 7-bit LSFR Cache Generation:
            var LSFR7Table = getTypedArray(0x800, 0, "int8");
            var LSFR = 0x7f; // Seed value has all its bits set.
            for (var index = 0; index < 0x80; ++index) {
              // Normalize the last LSFR value for usage:
              var randomFactor = 1 - (LSFR & 1); // Docs say it's the inverse.
              // Cache the different volume level results:
              LSFR7Table[0x080 | index] = randomFactor;
              LSFR7Table[0x100 | index] = randomFactor * 0x2;
              LSFR7Table[0x180 | index] = randomFactor * 0x3;
              LSFR7Table[0x200 | index] = randomFactor * 0x4;
              LSFR7Table[0x280 | index] = randomFactor * 0x5;
              LSFR7Table[0x300 | index] = randomFactor * 0x6;
              LSFR7Table[0x380 | index] = randomFactor * 0x7;
              LSFR7Table[0x400 | index] = randomFactor * 0x8;
              LSFR7Table[0x480 | index] = randomFactor * 0x9;
              LSFR7Table[0x500 | index] = randomFactor * 0xa;
              LSFR7Table[0x580 | index] = randomFactor * 0xb;
              LSFR7Table[0x600 | index] = randomFactor * 0xc;
              LSFR7Table[0x680 | index] = randomFactor * 0xd;
              LSFR7Table[0x700 | index] = randomFactor * 0xe;
              LSFR7Table[0x780 | index] = randomFactor * 0xf;
              // Recompute the LSFR algorithm:
              var LSFRShifted = LSFR >> 1;
              LSFR = LSFRShifted | ((LSFRShifted ^ LSFR) & 0x1) << 6;
            }

            return LSFR7Table;
          }
        }, {
          key: "generateLSFR15Table",
          value: function generateLSFR15Table() {
            // 15-bit LSFR Cache Generation:
            var LSFR15Table = getTypedArray(0x80000, 0, "int8");
            var LSFR = 0x7fff; // Seed value has all its bits set.
            for (var index = 0; index < 0x8000; ++index) {
              // Normalize the last LSFR value for usage:
              var randomFactor = 1 - (LSFR & 1); // Docs say it's the inverse.
              // Cache the different volume level results:
              LSFR15Table[0x08000 | index] = randomFactor;
              LSFR15Table[0x10000 | index] = randomFactor * 0x2;
              LSFR15Table[0x18000 | index] = randomFactor * 0x3;
              LSFR15Table[0x20000 | index] = randomFactor * 0x4;
              LSFR15Table[0x28000 | index] = randomFactor * 0x5;
              LSFR15Table[0x30000 | index] = randomFactor * 0x6;
              LSFR15Table[0x38000 | index] = randomFactor * 0x7;
              LSFR15Table[0x40000 | index] = randomFactor * 0x8;
              LSFR15Table[0x48000 | index] = randomFactor * 0x9;
              LSFR15Table[0x50000 | index] = randomFactor * 0xa;
              LSFR15Table[0x58000 | index] = randomFactor * 0xb;
              LSFR15Table[0x60000 | index] = randomFactor * 0xc;
              LSFR15Table[0x68000 | index] = randomFactor * 0xd;
              LSFR15Table[0x70000 | index] = randomFactor * 0xe;
              LSFR15Table[0x78000 | index] = randomFactor * 0xf;
              // Recompute the LSFR algorithm:
              var LSFRShifted = LSFR >> 1;
              LSFR = LSFRShifted | ((LSFRShifted ^ LSFR) & 0x1) << 14;
            }

            return LSFR15Table;
          }
        }]);

        return AudioController;
      }();

      bitInstructions = [
      //RLC B
      //#0x00:
      function () {
        this.FCarry = this.registerB > 0x7f;
        this.registerB = this.registerB << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerB === 0;
      },
      //RLC C
      //#0x01:
      function () {
        this.FCarry = this.registerC > 0x7f;
        this.registerC = this.registerC << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerC === 0;
      },
      //RLC D
      //#0x02:
      function () {
        this.FCarry = this.registerD > 0x7f;
        this.registerD = this.registerD << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerD === 0;
      },
      //RLC E
      //#0x03:
      function () {
        this.FCarry = this.registerE > 0x7f;
        this.registerE = this.registerE << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerE === 0;
      },
      //RLC H
      //#0x04:
      function () {
        this.FCarry = this.registersHL > 0x7fff;
        this.registersHL = this.registersHL << 1 & 0xfe00 | (this.FCarry ? 0x100 : 0) | this.registersHL & 0xff;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registersHL < 0x100;
      },
      //RLC L
      //#0x05:
      function () {
        this.FCarry = (this.registersHL & 0x80) === 0x80;
        this.registersHL = this.registersHL & 0xff00 | this.registersHL << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = (this.registersHL & 0xff) === 0;
      },
      //RLC (HL)
      //#0x06:
      function () {
        var temp_var = this.memoryReader[this.registersHL](this.registersHL);
        this.FCarry = temp_var > 0x7f;
        temp_var = temp_var << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.memoryWriter[this.registersHL](this.registersHL, temp_var);
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = temp_var === 0;
      },
      //RLC A
      //#0x07:
      function () {
        this.FCarry = this.registerA > 0x7f;
        this.registerA = this.registerA << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerA === 0;
      },
      //RRC B
      //#0x08:
      function () {
        this.FCarry = (this.registerB & 0x01) === 0x01;
        this.registerB = (this.FCarry ? 0x80 : 0) | this.registerB >> 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerB === 0;
      },
      //RRC C
      //#0x09:
      function () {
        this.FCarry = (this.registerC & 0x01) === 0x01;
        this.registerC = (this.FCarry ? 0x80 : 0) | this.registerC >> 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerC === 0;
      },
      //RRC D
      //#0x0A:
      function () {
        this.FCarry = (this.registerD & 0x01) === 0x01;
        this.registerD = (this.FCarry ? 0x80 : 0) | this.registerD >> 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerD === 0;
      },
      //RRC E
      //#0x0B:
      function () {
        this.FCarry = (this.registerE & 0x01) === 0x01;
        this.registerE = (this.FCarry ? 0x80 : 0) | this.registerE >> 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerE === 0;
      },
      //RRC H
      //#0x0C:
      function () {
        this.FCarry = (this.registersHL & 0x0100) === 0x0100;
        this.registersHL = (this.FCarry ? 0x8000 : 0) | this.registersHL >> 1 & 0xff00 | this.registersHL & 0xff;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registersHL < 0x100;
      },
      //RRC L
      //#0x0D:
      function () {
        this.FCarry = (this.registersHL & 0x01) === 0x01;
        this.registersHL = this.registersHL & 0xff00 | (this.FCarry ? 0x80 : 0) | (this.registersHL & 0xff) >> 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = (this.registersHL & 0xff) === 0;
      },
      //RRC (HL)
      //#0x0E:
      function () {
        var temp_var = this.memoryReader[this.registersHL](this.registersHL);
        this.FCarry = (temp_var & 0x01) === 0x01;
        temp_var = (this.FCarry ? 0x80 : 0) | temp_var >> 1;
        this.memoryWriter[this.registersHL](this.registersHL, temp_var);
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = temp_var === 0;
      },
      //RRC A
      //#0x0F:
      function () {
        this.FCarry = (this.registerA & 0x01) === 0x01;
        this.registerA = (this.FCarry ? 0x80 : 0) | this.registerA >> 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerA === 0;
      },
      //RL B
      //#0x10:
      function () {
        var newFCarry = this.registerB > 0x7f;
        this.registerB = this.registerB << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerB === 0;
      },
      //RL C
      //#0x11:
      function () {
        var newFCarry = this.registerC > 0x7f;
        this.registerC = this.registerC << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerC === 0;
      },
      //RL D
      //#0x12:
      function () {
        var newFCarry = this.registerD > 0x7f;
        this.registerD = this.registerD << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerD === 0;
      },
      //RL E
      //#0x13:
      function () {
        var newFCarry = this.registerE > 0x7f;
        this.registerE = this.registerE << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerE === 0;
      },
      //RL H
      //#0x14:
      function () {
        var newFCarry = this.registersHL > 0x7fff;
        this.registersHL = this.registersHL << 1 & 0xfe00 | (this.FCarry ? 0x100 : 0) | this.registersHL & 0xff;
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registersHL < 0x100;
      },
      //RL L
      //#0x15:
      function () {
        var newFCarry = (this.registersHL & 0x80) === 0x80;
        this.registersHL = this.registersHL & 0xff00 | this.registersHL << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = (this.registersHL & 0xff) === 0;
      },
      //RL (HL)
      //#0x16:
      function () {
        var temp_var = this.memoryReader[this.registersHL](this.registersHL);
        var newFCarry = temp_var > 0x7f;
        temp_var = temp_var << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.FCarry = newFCarry;
        this.memoryWriter[this.registersHL](this.registersHL, temp_var);
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = temp_var === 0;
      },
      //RL A
      //#0x17:
      function () {
        var newFCarry = this.registerA > 0x7f;
        this.registerA = this.registerA << 1 & 0xff | (this.FCarry ? 1 : 0);
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerA === 0;
      },
      //RR B
      //#0x18:
      function () {
        var newFCarry = (this.registerB & 0x01) === 0x01;
        this.registerB = (this.FCarry ? 0x80 : 0) | this.registerB >> 1;
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerB === 0;
      },
      //RR C
      //#0x19:
      function () {
        var newFCarry = (this.registerC & 0x01) === 0x01;
        this.registerC = (this.FCarry ? 0x80 : 0) | this.registerC >> 1;
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerC === 0;
      },
      //RR D
      //#0x1A:
      function () {
        var newFCarry = (this.registerD & 0x01) === 0x01;
        this.registerD = (this.FCarry ? 0x80 : 0) | this.registerD >> 1;
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerD === 0;
      },
      //RR E
      //#0x1B:
      function () {
        var newFCarry = (this.registerE & 0x01) === 0x01;
        this.registerE = (this.FCarry ? 0x80 : 0) | this.registerE >> 1;
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerE === 0;
      },
      //RR H
      //#0x1C:
      function () {
        var newFCarry = (this.registersHL & 0x0100) === 0x0100;
        this.registersHL = (this.FCarry ? 0x8000 : 0) | this.registersHL >> 1 & 0xff00 | this.registersHL & 0xff;
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registersHL < 0x100;
      },
      //RR L
      //#0x1D:
      function () {
        var newFCarry = (this.registersHL & 0x01) === 0x01;
        this.registersHL = this.registersHL & 0xff00 | (this.FCarry ? 0x80 : 0) | (this.registersHL & 0xff) >> 1;
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = (this.registersHL & 0xff) === 0;
      },
      //RR (HL)
      //#0x1E:
      function () {
        var temp_var = this.memoryReader[this.registersHL](this.registersHL);
        var newFCarry = (temp_var & 0x01) === 0x01;
        temp_var = (this.FCarry ? 0x80 : 0) | temp_var >> 1;
        this.FCarry = newFCarry;
        this.memoryWriter[this.registersHL](this.registersHL, temp_var);
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = temp_var === 0;
      },
      //RR A
      //#0x1F:
      function () {
        var newFCarry = (this.registerA & 0x01) === 0x01;
        this.registerA = (this.FCarry ? 0x80 : 0) | this.registerA >> 1;
        this.FCarry = newFCarry;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerA === 0;
      },
      //SLA B
      //#0x20:
      function () {
        this.FCarry = this.registerB > 0x7f;
        this.registerB = this.registerB << 1 & 0xff;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerB === 0;
      },
      //SLA C
      //#0x21:
      function () {
        this.FCarry = this.registerC > 0x7f;
        this.registerC = this.registerC << 1 & 0xff;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerC === 0;
      },
      //SLA D
      //#0x22:
      function () {
        this.FCarry = this.registerD > 0x7f;
        this.registerD = this.registerD << 1 & 0xff;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerD === 0;
      },
      //SLA E
      //#0x23:
      function () {
        this.FCarry = this.registerE > 0x7f;
        this.registerE = this.registerE << 1 & 0xff;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerE === 0;
      },
      //SLA H
      //#0x24:
      function () {
        this.FCarry = this.registersHL > 0x7fff;
        this.registersHL = this.registersHL << 1 & 0xfe00 | this.registersHL & 0xff;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registersHL < 0x100;
      },
      //SLA L
      //#0x25:
      function () {
        this.FCarry = (this.registersHL & 0x0080) === 0x0080;
        this.registersHL = this.registersHL & 0xff00 | this.registersHL << 1 & 0xff;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = (this.registersHL & 0xff) === 0;
      },
      //SLA (HL)
      //#0x26:
      function () {
        var temp_var = this.memoryReader[this.registersHL](this.registersHL);
        this.FCarry = temp_var > 0x7f;
        temp_var = temp_var << 1 & 0xff;
        this.memoryWriter[this.registersHL](this.registersHL, temp_var);
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = temp_var === 0;
      },
      //SLA A
      //#0x27:
      function () {
        this.FCarry = this.registerA > 0x7f;
        this.registerA = this.registerA << 1 & 0xff;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerA === 0;
      },
      //SRA B
      //#0x28:
      function () {
        this.FCarry = (this.registerB & 0x01) === 0x01;
        this.registerB = this.registerB & 0x80 | this.registerB >> 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerB === 0;
      },
      //SRA C
      //#0x29:
      function () {
        this.FCarry = (this.registerC & 0x01) === 0x01;
        this.registerC = this.registerC & 0x80 | this.registerC >> 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerC === 0;
      },
      //SRA D
      //#0x2A:
      function () {
        this.FCarry = (this.registerD & 0x01) === 0x01;
        this.registerD = this.registerD & 0x80 | this.registerD >> 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerD === 0;
      },
      //SRA E
      //#0x2B:
      function () {
        this.FCarry = (this.registerE & 0x01) === 0x01;
        this.registerE = this.registerE & 0x80 | this.registerE >> 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerE === 0;
      },
      //SRA H
      //#0x2C:
      function () {
        this.FCarry = (this.registersHL & 0x0100) === 0x0100;
        this.registersHL = this.registersHL >> 1 & 0xff00 | this.registersHL & 0x80ff;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registersHL < 0x100;
      },
      //SRA L
      //#0x2D:
      function () {
        this.FCarry = (this.registersHL & 0x0001) === 0x0001;
        this.registersHL = this.registersHL & 0xff80 | (this.registersHL & 0xff) >> 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = (this.registersHL & 0xff) === 0;
      },
      //SRA (HL)
      //#0x2E:
      function () {
        var temp_var = this.memoryReader[this.registersHL](this.registersHL);
        this.FCarry = (temp_var & 0x01) === 0x01;
        temp_var = temp_var & 0x80 | temp_var >> 1;
        this.memoryWriter[this.registersHL](this.registersHL, temp_var);
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = temp_var === 0;
      },
      //SRA A
      //#0x2F:
      function () {
        this.FCarry = (this.registerA & 0x01) === 0x01;
        this.registerA = this.registerA & 0x80 | this.registerA >> 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerA === 0;
      },
      //SWAP B
      //#0x30:
      function () {
        this.registerB = (this.registerB & 0xf) << 4 | this.registerB >> 4;
        this.FZero = this.registerB === 0;
        this.FCarry = this.FHalfCarry = this.FSubtract = false;
      },
      //SWAP C
      //#0x31:
      function () {
        this.registerC = (this.registerC & 0xf) << 4 | this.registerC >> 4;
        this.FZero = this.registerC === 0;
        this.FCarry = this.FHalfCarry = this.FSubtract = false;
      },
      //SWAP D
      //#0x32:
      function () {
        this.registerD = (this.registerD & 0xf) << 4 | this.registerD >> 4;
        this.FZero = this.registerD === 0;
        this.FCarry = this.FHalfCarry = this.FSubtract = false;
      },
      //SWAP E
      //#0x33:
      function () {
        this.registerE = (this.registerE & 0xf) << 4 | this.registerE >> 4;
        this.FZero = this.registerE === 0;
        this.FCarry = this.FHalfCarry = this.FSubtract = false;
      },
      //SWAP H
      //#0x34:
      function () {
        this.registersHL = (this.registersHL & 0xf00) << 4 | (this.registersHL & 0xf000) >> 4 | this.registersHL & 0xff;
        this.FZero = this.registersHL < 0x100;
        this.FCarry = this.FHalfCarry = this.FSubtract = false;
      },
      //SWAP L
      //#0x35:
      function () {
        this.registersHL = this.registersHL & 0xff00 | (this.registersHL & 0xf) << 4 | (this.registersHL & 0xf0) >> 4;
        this.FZero = (this.registersHL & 0xff) === 0;
        this.FCarry = this.FHalfCarry = this.FSubtract = false;
      },
      //SWAP (HL)
      //#0x36:
      function () {
        var temp_var = this.memoryReader[this.registersHL](this.registersHL);
        temp_var = (temp_var & 0xf) << 4 | temp_var >> 4;
        this.memoryWriter[this.registersHL](this.registersHL, temp_var);
        this.FZero = temp_var === 0;
        this.FCarry = this.FHalfCarry = this.FSubtract = false;
      },
      //SWAP A
      //#0x37:
      function () {
        this.registerA = (this.registerA & 0xf) << 4 | this.registerA >> 4;
        this.FZero = this.registerA === 0;
        this.FCarry = this.FHalfCarry = this.FSubtract = false;
      },
      //SRL B
      //#0x38:
      function () {
        this.FCarry = (this.registerB & 0x01) === 0x01;
        this.registerB >>= 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerB === 0;
      },
      //SRL C
      //#0x39:
      function () {
        this.FCarry = (this.registerC & 0x01) === 0x01;
        this.registerC >>= 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerC === 0;
      },
      //SRL D
      //#0x3A:
      function () {
        this.FCarry = (this.registerD & 0x01) === 0x01;
        this.registerD >>= 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerD === 0;
      },
      //SRL E
      //#0x3B:
      function () {
        this.FCarry = (this.registerE & 0x01) === 0x01;
        this.registerE >>= 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerE === 0;
      },
      //SRL H
      //#0x3C:
      function () {
        this.FCarry = (this.registersHL & 0x0100) === 0x0100;
        this.registersHL = this.registersHL >> 1 & 0xff00 | this.registersHL & 0xff;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registersHL < 0x100;
      },
      //SRL L
      //#0x3D:
      function () {
        this.FCarry = (this.registersHL & 0x0001) === 0x0001;
        this.registersHL = this.registersHL & 0xff00 | (this.registersHL & 0xff) >> 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = (this.registersHL & 0xff) === 0;
      },
      //SRL (HL)
      //#0x3E:
      function () {
        var temp_var = this.memoryReader[this.registersHL](this.registersHL);
        this.FCarry = (temp_var & 0x01) === 0x01;
        this.memoryWriter[this.registersHL](this.registersHL, temp_var >> 1);
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = temp_var < 2;
      },
      //SRL A
      //#0x3F:
      function () {
        this.FCarry = (this.registerA & 0x01) === 0x01;
        this.registerA >>= 1;
        this.FHalfCarry = this.FSubtract = false;
        this.FZero = this.registerA === 0;
      },
      //BIT 0, B
      //#0x40:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerB & 0x01) === 0;
      },
      //BIT 0, C
      //#0x41:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerC & 0x01) === 0;
      },
      //BIT 0, D
      //#0x42:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerD & 0x01) === 0;
      },
      //BIT 0, E
      //#0x43:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerE & 0x01) === 0;
      },
      //BIT 0, H
      //#0x44:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x0100) === 0;
      },
      //BIT 0, L
      //#0x45:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x0001) === 0;
      },
      //BIT 0, (HL)
      //#0x46:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.memoryReader[this.registersHL](this.registersHL) & 0x01) === 0;
      },
      //BIT 0, A
      //#0x47:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerA & 0x01) === 0;
      },
      //BIT 1, B
      //#0x48:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerB & 0x02) === 0;
      },
      //BIT 1, C
      //#0x49:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerC & 0x02) === 0;
      },
      //BIT 1, D
      //#0x4A:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerD & 0x02) === 0;
      },
      //BIT 1, E
      //#0x4B:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerE & 0x02) === 0;
      },
      //BIT 1, H
      //#0x4C:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x0200) === 0;
      },
      //BIT 1, L
      //#0x4D:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x0002) === 0;
      },
      //BIT 1, (HL)
      //#0x4E:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.memoryReader[this.registersHL](this.registersHL) & 0x02) === 0;
      },
      //BIT 1, A
      //#0x4F:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerA & 0x02) === 0;
      },
      //BIT 2, B
      //#0x50:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerB & 0x04) === 0;
      },
      //BIT 2, C
      //#0x51:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerC & 0x04) === 0;
      },
      //BIT 2, D
      //#0x52:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerD & 0x04) === 0;
      },
      //BIT 2, E
      //#0x53:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerE & 0x04) === 0;
      },
      //BIT 2, H
      //#0x54:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x0400) === 0;
      },
      //BIT 2, L
      //#0x55:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x0004) === 0;
      },
      //BIT 2, (HL)
      //#0x56:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.memoryReader[this.registersHL](this.registersHL) & 0x04) === 0;
      },
      //BIT 2, A
      //#0x57:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerA & 0x04) === 0;
      },
      //BIT 3, B
      //#0x58:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerB & 0x08) === 0;
      },
      //BIT 3, C
      //#0x59:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerC & 0x08) === 0;
      },
      //BIT 3, D
      //#0x5A:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerD & 0x08) === 0;
      },
      //BIT 3, E
      //#0x5B:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerE & 0x08) === 0;
      },
      //BIT 3, H
      //#0x5C:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x0800) === 0;
      },
      //BIT 3, L
      //#0x5D:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x0008) === 0;
      },
      //BIT 3, (HL)
      //#0x5E:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.memoryReader[this.registersHL](this.registersHL) & 0x08) === 0;
      },
      //BIT 3, A
      //#0x5F:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerA & 0x08) === 0;
      },
      //BIT 4, B
      //#0x60:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerB & 0x10) === 0;
      },
      //BIT 4, C
      //#0x61:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerC & 0x10) === 0;
      },
      //BIT 4, D
      //#0x62:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerD & 0x10) === 0;
      },
      //BIT 4, E
      //#0x63:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerE & 0x10) === 0;
      },
      //BIT 4, H
      //#0x64:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x1000) === 0;
      },
      //BIT 4, L
      //#0x65:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x0010) === 0;
      },
      //BIT 4, (HL)
      //#0x66:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.memoryReader[this.registersHL](this.registersHL) & 0x10) === 0;
      },
      //BIT 4, A
      //#0x67:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerA & 0x10) === 0;
      },
      //BIT 5, B
      //#0x68:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerB & 0x20) === 0;
      },
      //BIT 5, C
      //#0x69:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerC & 0x20) === 0;
      },
      //BIT 5, D
      //#0x6A:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerD & 0x20) === 0;
      },
      //BIT 5, E
      //#0x6B:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerE & 0x20) === 0;
      },
      //BIT 5, H
      //#0x6C:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x2000) === 0;
      },
      //BIT 5, L
      //#0x6D:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x0020) === 0;
      },
      //BIT 5, (HL)
      //#0x6E:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.memoryReader[this.registersHL](this.registersHL) & 0x20) === 0;
      },
      //BIT 5, A
      //#0x6F:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerA & 0x20) === 0;
      },
      //BIT 6, B
      //#0x70:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerB & 0x40) === 0;
      },
      //BIT 6, C
      //#0x71:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerC & 0x40) === 0;
      },
      //BIT 6, D
      //#0x72:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerD & 0x40) === 0;
      },
      //BIT 6, E
      //#0x73:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerE & 0x40) === 0;
      },
      //BIT 6, H
      //#0x74:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x4000) === 0;
      },
      //BIT 6, L
      //#0x75:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x0040) === 0;
      },
      //BIT 6, (HL)
      //#0x76:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.memoryReader[this.registersHL](this.registersHL) & 0x40) === 0;
      },
      //BIT 6, A
      //#0x77:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerA & 0x40) === 0;
      },
      //BIT 7, B
      //#0x78:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerB & 0x80) === 0;
      },
      //BIT 7, C
      //#0x79:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerC & 0x80) === 0;
      },
      //BIT 7, D
      //#0x7A:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerD & 0x80) === 0;
      },
      //BIT 7, E
      //#0x7B:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerE & 0x80) === 0;
      },
      //BIT 7, H
      //#0x7C:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x8000) === 0;
      },
      //BIT 7, L
      //#0x7D:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registersHL & 0x0080) === 0;
      },
      //BIT 7, (HL)
      //#0x7E:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.memoryReader[this.registersHL](this.registersHL) & 0x80) === 0;
      },
      //BIT 7, A
      //#0x7F:
      function () {
        this.FHalfCarry = true;
        this.FSubtract = false;
        this.FZero = (this.registerA & 0x80) === 0;
      },
      //RES 0, B
      //#0x80:
      function () {
        this.registerB &= 0xfe;
      },
      //RES 0, C
      //#0x81:
      function () {
        this.registerC &= 0xfe;
      },
      //RES 0, D
      //#0x82:
      function () {
        this.registerD &= 0xfe;
      },
      //RES 0, E
      //#0x83:
      function () {
        this.registerE &= 0xfe;
      },
      //RES 0, H
      //#0x84:
      function () {
        this.registersHL &= 0xfeff;
      },
      //RES 0, L
      //#0x85:
      function () {
        this.registersHL &= 0xfffe;
      },
      //RES 0, (HL)
      //#0x86:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) & 0xfe);
      },
      //RES 0, A
      //#0x87:
      function () {
        this.registerA &= 0xfe;
      },
      //RES 1, B
      //#0x88:
      function () {
        this.registerB &= 0xfd;
      },
      //RES 1, C
      //#0x89:
      function () {
        this.registerC &= 0xfd;
      },
      //RES 1, D
      //#0x8A:
      function () {
        this.registerD &= 0xfd;
      },
      //RES 1, E
      //#0x8B:
      function () {
        this.registerE &= 0xfd;
      },
      //RES 1, H
      //#0x8C:
      function () {
        this.registersHL &= 0xfdff;
      },
      //RES 1, L
      //#0x8D:
      function () {
        this.registersHL &= 0xfffd;
      },
      //RES 1, (HL)
      //#0x8E:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) & 0xfd);
      },
      //RES 1, A
      //#0x8F:
      function () {
        this.registerA &= 0xfd;
      },
      //RES 2, B
      //#0x90:
      function () {
        this.registerB &= 0xfb;
      },
      //RES 2, C
      //#0x91:
      function () {
        this.registerC &= 0xfb;
      },
      //RES 2, D
      //#0x92:
      function () {
        this.registerD &= 0xfb;
      },
      //RES 2, E
      //#0x93:
      function () {
        this.registerE &= 0xfb;
      },
      //RES 2, H
      //#0x94:
      function () {
        this.registersHL &= 0xfbff;
      },
      //RES 2, L
      //#0x95:
      function () {
        this.registersHL &= 0xfffb;
      },
      //RES 2, (HL)
      //#0x96:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) & 0xfb);
      },
      //RES 2, A
      //#0x97:
      function () {
        this.registerA &= 0xfb;
      },
      //RES 3, B
      //#0x98:
      function () {
        this.registerB &= 0xf7;
      },
      //RES 3, C
      //#0x99:
      function () {
        this.registerC &= 0xf7;
      },
      //RES 3, D
      //#0x9A:
      function () {
        this.registerD &= 0xf7;
      },
      //RES 3, E
      //#0x9B:
      function () {
        this.registerE &= 0xf7;
      },
      //RES 3, H
      //#0x9C:
      function () {
        this.registersHL &= 0xf7ff;
      },
      //RES 3, L
      //#0x9D:
      function () {
        this.registersHL &= 0xfff7;
      },
      //RES 3, (HL)
      //#0x9E:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) & 0xf7);
      },
      //RES 3, A
      //#0x9F:
      function () {
        this.registerA &= 0xf7;
      },
      //RES 3, B
      //#0xA0:
      function () {
        this.registerB &= 0xef;
      },
      //RES 4, C
      //#0xA1:
      function () {
        this.registerC &= 0xef;
      },
      //RES 4, D
      //#0xA2:
      function () {
        this.registerD &= 0xef;
      },
      //RES 4, E
      //#0xA3:
      function () {
        this.registerE &= 0xef;
      },
      //RES 4, H
      //#0xA4:
      function () {
        this.registersHL &= 0xefff;
      },
      //RES 4, L
      //#0xA5:
      function () {
        this.registersHL &= 0xffef;
      },
      //RES 4, (HL)
      //#0xA6:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) & 0xef);
      },
      //RES 4, A
      //#0xA7:
      function () {
        this.registerA &= 0xef;
      },
      //RES 5, B
      //#0xA8:
      function () {
        this.registerB &= 0xdf;
      },
      //RES 5, C
      //#0xA9:
      function () {
        this.registerC &= 0xdf;
      },
      //RES 5, D
      //#0xAA:
      function () {
        this.registerD &= 0xdf;
      },
      //RES 5, E
      //#0xAB:
      function () {
        this.registerE &= 0xdf;
      },
      //RES 5, H
      //#0xAC:
      function () {
        this.registersHL &= 0xdfff;
      },
      //RES 5, L
      //#0xAD:
      function () {
        this.registersHL &= 0xffdf;
      },
      //RES 5, (HL)
      //#0xAE:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) & 0xdf);
      },
      //RES 5, A
      //#0xAF:
      function () {
        this.registerA &= 0xdf;
      },
      //RES 6, B
      //#0xB0:
      function () {
        this.registerB &= 0xbf;
      },
      //RES 6, C
      //#0xB1:
      function () {
        this.registerC &= 0xbf;
      },
      //RES 6, D
      //#0xB2:
      function () {
        this.registerD &= 0xbf;
      },
      //RES 6, E
      //#0xB3:
      function () {
        this.registerE &= 0xbf;
      },
      //RES 6, H
      //#0xB4:
      function () {
        this.registersHL &= 0xbfff;
      },
      //RES 6, L
      //#0xB5:
      function () {
        this.registersHL &= 0xffbf;
      },
      //RES 6, (HL)
      //#0xB6:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) & 0xbf);
      },
      //RES 6, A
      //#0xB7:
      function () {
        this.registerA &= 0xbf;
      },
      //RES 7, B
      //#0xB8:
      function () {
        this.registerB &= 0x7f;
      },
      //RES 7, C
      //#0xB9:
      function () {
        this.registerC &= 0x7f;
      },
      //RES 7, D
      //#0xBA:
      function () {
        this.registerD &= 0x7f;
      },
      //RES 7, E
      //#0xBB:
      function () {
        this.registerE &= 0x7f;
      },
      //RES 7, H
      //#0xBC:
      function () {
        this.registersHL &= 0x7fff;
      },
      //RES 7, L
      //#0xBD:
      function () {
        this.registersHL &= 0xff7f;
      },
      //RES 7, (HL)
      //#0xBE:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) & 0x7f);
      },
      //RES 7, A
      //#0xBF:
      function () {
        this.registerA &= 0x7f;
      },
      //SET 0, B
      //#0xC0:
      function () {
        this.registerB |= 0x01;
      },
      //SET 0, C
      //#0xC1:
      function () {
        this.registerC |= 0x01;
      },
      //SET 0, D
      //#0xC2:
      function () {
        this.registerD |= 0x01;
      },
      //SET 0, E
      //#0xC3:
      function () {
        this.registerE |= 0x01;
      },
      //SET 0, H
      //#0xC4:
      function () {
        this.registersHL |= 0x0100;
      },
      //SET 0, L
      //#0xC5:
      function () {
        this.registersHL |= 0x01;
      },
      //SET 0, (HL)
      //#0xC6:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) | 0x01);
      },
      //SET 0, A
      //#0xC7:
      function () {
        this.registerA |= 0x01;
      },
      //SET 1, B
      //#0xC8:
      function () {
        this.registerB |= 0x02;
      },
      //SET 1, C
      //#0xC9:
      function () {
        this.registerC |= 0x02;
      },
      //SET 1, D
      //#0xCA:
      function () {
        this.registerD |= 0x02;
      },
      //SET 1, E
      //#0xCB:
      function () {
        this.registerE |= 0x02;
      },
      //SET 1, H
      //#0xCC:
      function () {
        this.registersHL |= 0x0200;
      },
      //SET 1, L
      //#0xCD:
      function () {
        this.registersHL |= 0x02;
      },
      //SET 1, (HL)
      //#0xCE:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) | 0x02);
      },
      //SET 1, A
      //#0xCF:
      function () {
        this.registerA |= 0x02;
      },
      //SET 2, B
      //#0xD0:
      function () {
        this.registerB |= 0x04;
      },
      //SET 2, C
      //#0xD1:
      function () {
        this.registerC |= 0x04;
      },
      //SET 2, D
      //#0xD2:
      function () {
        this.registerD |= 0x04;
      },
      //SET 2, E
      //#0xD3:
      function () {
        this.registerE |= 0x04;
      },
      //SET 2, H
      //#0xD4:
      function () {
        this.registersHL |= 0x0400;
      },
      //SET 2, L
      //#0xD5:
      function () {
        this.registersHL |= 0x04;
      },
      //SET 2, (HL)
      //#0xD6:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) | 0x04);
      },
      //SET 2, A
      //#0xD7:
      function () {
        this.registerA |= 0x04;
      },
      //SET 3, B
      //#0xD8:
      function () {
        this.registerB |= 0x08;
      },
      //SET 3, C
      //#0xD9:
      function () {
        this.registerC |= 0x08;
      },
      //SET 3, D
      //#0xDA:
      function () {
        this.registerD |= 0x08;
      },
      //SET 3, E
      //#0xDB:
      function () {
        this.registerE |= 0x08;
      },
      //SET 3, H
      //#0xDC:
      function () {
        this.registersHL |= 0x0800;
      },
      //SET 3, L
      //#0xDD:
      function () {
        this.registersHL |= 0x08;
      },
      //SET 3, (HL)
      //#0xDE:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) | 0x08);
      },
      //SET 3, A
      //#0xDF:
      function () {
        this.registerA |= 0x08;
      },
      //SET 4, B
      //#0xE0:
      function () {
        this.registerB |= 0x10;
      },
      //SET 4, C
      //#0xE1:
      function () {
        this.registerC |= 0x10;
      },
      //SET 4, D
      //#0xE2:
      function () {
        this.registerD |= 0x10;
      },
      //SET 4, E
      //#0xE3:
      function () {
        this.registerE |= 0x10;
      },
      //SET 4, H
      //#0xE4:
      function () {
        this.registersHL |= 0x1000;
      },
      //SET 4, L
      //#0xE5:
      function () {
        this.registersHL |= 0x10;
      },
      //SET 4, (HL)
      //#0xE6:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) | 0x10);
      },
      //SET 4, A
      //#0xE7:
      function () {
        this.registerA |= 0x10;
      },
      //SET 5, B
      //#0xE8:
      function () {
        this.registerB |= 0x20;
      },
      //SET 5, C
      //#0xE9:
      function () {
        this.registerC |= 0x20;
      },
      //SET 5, D
      //#0xEA:
      function () {
        this.registerD |= 0x20;
      },
      //SET 5, E
      //#0xEB:
      function () {
        this.registerE |= 0x20;
      },
      //SET 5, H
      //#0xEC:
      function () {
        this.registersHL |= 0x2000;
      },
      //SET 5, L
      //#0xED:
      function () {
        this.registersHL |= 0x20;
      },
      //SET 5, (HL)
      //#0xEE:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) | 0x20);
      },
      //SET 5, A
      //#0xEF:
      function () {
        this.registerA |= 0x20;
      },
      //SET 6, B
      //#0xF0:
      function () {
        this.registerB |= 0x40;
      },
      //SET 6, C
      //#0xF1:
      function () {
        this.registerC |= 0x40;
      },
      //SET 6, D
      //#0xF2:
      function () {
        this.registerD |= 0x40;
      },
      //SET 6, E
      //#0xF3:
      function () {
        this.registerE |= 0x40;
      },
      //SET 6, H
      //#0xF4:
      function () {
        this.registersHL |= 0x4000;
      },
      //SET 6, L
      //#0xF5:
      function () {
        this.registersHL |= 0x40;
      },
      //SET 6, (HL)
      //#0xF6:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) | 0x40);
      },
      //SET 6, A
      //#0xF7:
      function () {
        this.registerA |= 0x40;
      },
      //SET 7, B
      //#0xF8:
      function () {
        this.registerB |= 0x80;
      },
      //SET 7, C
      //#0xF9:
      function () {
        this.registerC |= 0x80;
      },
      //SET 7, D
      //#0xFA:
      function () {
        this.registerD |= 0x80;
      },
      //SET 7, E
      //#0xFB:
      function () {
        this.registerE |= 0x80;
      },
      //SET 7, H
      //#0xFC:
      function () {
        this.registersHL |= 0x8000;
      },
      //SET 7, L
      //#0xFD:
      function () {
        this.registersHL |= 0x80;
      },
      //SET 7, (HL)
      //#0xFE:
      function () {
        this.memoryWriter[this.registersHL](this.registersHL, this.memoryReader[this.registersHL](this.registersHL) | 0x80);
      },
      //SET 7, A
      //#0xFF:
      function () {
        this.registerA |= 0x80;
      }];
      SecondaryTickTable = [// Number of machine cycles for each 0xCBXX instruction:
      /*  0, 1, 2, 3, 4, 5,  6, 7,        8, 9, A, B, C, D,  E, F*/
      8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 16, 8, //0
      8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 16, 8, //1
      8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 16, 8, //2
      8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 16, 8, //3

      8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, //4
      8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, //5
      8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, //6
      8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, //7

      8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 16, 8, //8
      8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 16, 8, //9
      8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 16, 8, //A
      8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 16, 8, //B

      8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 16, 8, //C
      8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 16, 8, //D
      8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 16, 8, //E
      8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 16, 8 //F
      ];
      mainInstructions = [
      //NOP
      //#0x00:
      function () {
        //Do Nothing...
      },
      //LD BC, nn
      //#0x01:
      function () {
        this.registerC = this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.registerB = this.memoryRead(this.programCounter + 1 & 0xffff);
        this.programCounter = this.programCounter + 2 & 0xffff;
      },
      //LD (BC), A
      //#0x02:
      function () {
        this.memoryWrite(this.registerB << 8 | this.registerC, this.registerA);
      },
      //INC BC
      //#0x03:
      function () {
        var temp_var = (this.registerB << 8 | this.registerC) + 1;
        this.registerB = temp_var >> 8 & 0xff;
        this.registerC = temp_var & 0xff;
      },
      //INC B
      //#0x04:
      function () {
        this.registerB = this.registerB + 1 & 0xff;
        this.FZero = this.registerB === 0;
        this.FHalfCarry = (this.registerB & 0xf) === 0;
        this.FSubtract = false;
      },
      //DEC B
      //#0x05:
      function () {
        this.registerB = this.registerB - 1 & 0xff;
        this.FZero = this.registerB === 0;
        this.FHalfCarry = (this.registerB & 0xf) === 0xf;
        this.FSubtract = true;
      },
      //LD B, n
      //#0x06:
      function () {
        this.registerB = this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 1 & 0xffff;
      },
      //RLCA
      //#0x07:
      function () {
        this.FCarry = this.registerA > 0x7f;
        this.registerA = this.registerA << 1 & 0xff | this.registerA >> 7;
        this.FZero = this.FSubtract = this.FHalfCarry = false;
      },
      //LD (nn), SP
      //#0x08:
      function () {
        var temp_var = this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 2 & 0xffff;
        this.memoryWrite(temp_var, this.stackPointer & 0xff);
        this.memoryWrite(temp_var + 1 & 0xffff, this.stackPointer >> 8);
      },
      //ADD HL, BC
      //#0x09:
      function () {
        var dirtySum = this.registersHL + (this.registerB << 8 | this.registerC);
        this.FHalfCarry = (this.registersHL & 0xfff) > (dirtySum & 0xfff);
        this.FCarry = dirtySum > 0xffff;
        this.registersHL = dirtySum & 0xffff;
        this.FSubtract = false;
      },
      //LD A, (BC)
      //#0x0A:
      function () {
        this.registerA = this.memoryRead(this.registerB << 8 | this.registerC);
      },
      //DEC BC
      //#0x0B:
      function () {
        var temp_var = (this.registerB << 8 | this.registerC) - 1 & 0xffff;
        this.registerB = temp_var >> 8;
        this.registerC = temp_var & 0xff;
      },
      //INC C
      //#0x0C:
      function () {
        this.registerC = this.registerC + 1 & 0xff;
        this.FZero = this.registerC === 0;
        this.FHalfCarry = (this.registerC & 0xf) === 0;
        this.FSubtract = false;
      },
      //DEC C
      //#0x0D:
      function () {
        this.registerC = this.registerC - 1 & 0xff;
        this.FZero = this.registerC === 0;
        this.FHalfCarry = (this.registerC & 0xf) === 0xf;
        this.FSubtract = true;
      },
      //LD C, n
      //#0x0E:
      function () {
        this.registerC = this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 1 & 0xffff;
      },
      //RRCA
      //#0x0F:
      function () {
        this.registerA = this.registerA >> 1 | (this.registerA & 1) << 7;
        this.FCarry = this.registerA > 0x7f;
        this.FZero = this.FSubtract = this.FHalfCarry = false;
      },
      //STOP
      //#0x10:
      function () {
        if (this.cartridge.useGBCMode) {
          if ((this.memory[0xff4d] & 0x01) === 0x01) {
            //Speed change requested.
            if (this.memory[0xff4d] > 0x7f) {
              // Go back to single speed mode.
              console.log("Going into single clock speed mode.");
              this.doubleSpeedShifter = 0;
              this.memory[0xff4d] &= 0x7f; // Clear the double speed mode flag.
            } else {
              // Go to double speed mode.
              console.log("Going into double clock speed mode.");
              this.doubleSpeedShifter = 1;
              this.memory[0xff4d] |= 0x80; // Set the double speed mode flag.
            }
            this.memory[0xff4d] &= 0xfe; // Reset the request bit.
          } else {
            this.handleSTOP();
          }
        } else {
          this.handleSTOP();
        }
      },
      //LD DE, nn
      //#0x11:
      function () {
        this.registerE = this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.registerD = this.memoryRead(this.programCounter + 1 & 0xffff);
        this.programCounter = this.programCounter + 2 & 0xffff;
      },
      //LD (DE), A
      //#0x12:
      function () {
        this.memoryWrite(this.registerD << 8 | this.registerE, this.registerA);
      },
      //INC DE
      //#0x13:
      function () {
        var temp_var = (this.registerD << 8 | this.registerE) + 1;
        this.registerD = temp_var >> 8 & 0xff;
        this.registerE = temp_var & 0xff;
      },
      //INC D
      //#0x14:
      function () {
        this.registerD = this.registerD + 1 & 0xff;
        this.FZero = this.registerD === 0;
        this.FHalfCarry = (this.registerD & 0xf) === 0;
        this.FSubtract = false;
      },
      //DEC D
      //#0x15:
      function () {
        this.registerD = this.registerD - 1 & 0xff;
        this.FZero = this.registerD === 0;
        this.FHalfCarry = (this.registerD & 0xf) === 0xf;
        this.FSubtract = true;
      },
      //LD D, n
      //#0x16:
      function () {
        this.registerD = this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 1 & 0xffff;
      },
      //RLA
      //#0x17:
      function () {
        var carry_flag = this.FCarry ? 1 : 0;
        this.FCarry = this.registerA > 0x7f;
        this.registerA = this.registerA << 1 & 0xff | carry_flag;
        this.FZero = this.FSubtract = this.FHalfCarry = false;
      },
      //JR n
      //#0x18:
      function () {
        this.programCounter = this.programCounter + (this.memoryReader[this.programCounter].apply(this, [this.programCounter]) << 24 >> 24) + 1 & 0xffff;
      },
      //ADD HL, DE
      //#0x19:
      function () {
        var dirtySum = this.registersHL + (this.registerD << 8 | this.registerE);
        this.FHalfCarry = (this.registersHL & 0xfff) > (dirtySum & 0xfff);
        this.FCarry = dirtySum > 0xffff;
        this.registersHL = dirtySum & 0xffff;
        this.FSubtract = false;
      },
      //LD A, (DE)
      //#0x1A:
      function () {
        this.registerA = this.memoryRead(this.registerD << 8 | this.registerE);
      },
      //DEC DE
      //#0x1B:
      function () {
        var temp_var = (this.registerD << 8 | this.registerE) - 1 & 0xffff;
        this.registerD = temp_var >> 8;
        this.registerE = temp_var & 0xff;
      },
      //INC E
      //#0x1C:
      function () {
        this.registerE = this.registerE + 1 & 0xff;
        this.FZero = this.registerE === 0;
        this.FHalfCarry = (this.registerE & 0xf) === 0;
        this.FSubtract = false;
      },
      //DEC E
      //#0x1D:
      function () {
        this.registerE = this.registerE - 1 & 0xff;
        this.FZero = this.registerE === 0;
        this.FHalfCarry = (this.registerE & 0xf) === 0xf;
        this.FSubtract = true;
      },
      //LD E, n
      //#0x1E:
      function () {
        this.registerE = this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 1 & 0xffff;
      },
      //RRA
      //#0x1F:
      function () {
        var carry_flag = this.FCarry ? 0x80 : 0;
        this.FCarry = (this.registerA & 1) === 1;
        this.registerA = this.registerA >> 1 | carry_flag;
        this.FZero = this.FSubtract = this.FHalfCarry = false;
      },
      //JR NZ, n
      //#0x20:
      function () {
        if (!this.FZero) {
          this.programCounter = this.programCounter + (this.memoryReader[this.programCounter].apply(this, [this.programCounter]) << 24 >> 24) + 1 & 0xffff;
          this.CPUTicks += 4;
        } else {
          this.programCounter = this.programCounter + 1 & 0xffff;
        }
      },
      //LD HL, nn
      //#0x21:
      function () {
        this.registersHL = this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 2 & 0xffff;
      },
      //LDI (HL), A
      //#0x22:
      function () {
        this.memoryWriter[this.registersHL].apply(this, [this.registersHL, this.registerA]);
        this.registersHL = this.registersHL + 1 & 0xffff;
      },
      //INC HL
      //#0x23:
      function () {
        this.registersHL = this.registersHL + 1 & 0xffff;
      },
      //INC H
      //#0x24:
      function () {
        var H = (this.registersHL >> 8) + 1 & 0xff;
        this.FZero = H === 0;
        this.FHalfCarry = (H & 0xf) === 0;
        this.FSubtract = false;
        this.registersHL = H << 8 | this.registersHL & 0xff;
      },
      //DEC H
      //#0x25:
      function () {
        var H = (this.registersHL >> 8) - 1 & 0xff;
        this.FZero = H === 0;
        this.FHalfCarry = (H & 0xf) === 0xf;
        this.FSubtract = true;
        this.registersHL = H << 8 | this.registersHL & 0xff;
      },
      //LD H, n
      //#0x26:
      function () {
        this.registersHL = this.memoryReader[this.programCounter].apply(this, [this.programCounter]) << 8 | this.registersHL & 0xff;
        this.programCounter = this.programCounter + 1 & 0xffff;
      },
      //DAA
      //#0x27:
      function () {
        if (!this.FSubtract) {
          if (this.FCarry || this.registerA > 0x99) {
            this.registerA = this.registerA + 0x60 & 0xff;
            this.FCarry = true;
          }
          if (this.FHalfCarry || (this.registerA & 0xf) > 0x9) {
            this.registerA = this.registerA + 0x06 & 0xff;
            this.FHalfCarry = false;
          }
        } else if (this.FCarry && this.FHalfCarry) {
          this.registerA = this.registerA + 0x9a & 0xff;
          this.FHalfCarry = false;
        } else if (this.FCarry) {
          this.registerA = this.registerA + 0xa0 & 0xff;
        } else if (this.FHalfCarry) {
          this.registerA = this.registerA + 0xfa & 0xff;
          this.FHalfCarry = false;
        }
        this.FZero = this.registerA === 0;
      },
      //JR Z, n
      //#0x28:
      function () {
        if (this.FZero) {
          this.programCounter = this.programCounter + (this.memoryReader[this.programCounter].apply(this, [this.programCounter]) << 24 >> 24) + 1 & 0xffff;
          this.CPUTicks += 4;
        } else {
          this.programCounter = this.programCounter + 1 & 0xffff;
        }
      },
      //ADD HL, HL
      //#0x29:
      function () {
        this.FHalfCarry = (this.registersHL & 0xfff) > 0x7ff;
        this.FCarry = this.registersHL > 0x7fff;
        this.registersHL = this.registersHL << 1 & 0xffff;
        this.FSubtract = false;
      },
      //LDI A, (HL)
      //#0x2A:
      function () {
        this.registerA = this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
        this.registersHL = this.registersHL + 1 & 0xffff;
      },
      //DEC HL
      //#0x2B:
      function () {
        this.registersHL = this.registersHL - 1 & 0xffff;
      },
      //INC L
      //#0x2C:
      function () {
        var L = this.registersHL + 1 & 0xff;
        this.FZero = L === 0;
        this.FHalfCarry = (L & 0xf) === 0;
        this.FSubtract = false;
        this.registersHL = this.registersHL & 0xff00 | L;
      },
      //DEC L
      //#0x2D:
      function () {
        var L = this.registersHL - 1 & 0xff;
        this.FZero = L === 0;
        this.FHalfCarry = (L & 0xf) === 0xf;
        this.FSubtract = true;
        this.registersHL = this.registersHL & 0xff00 | L;
      },
      //LD L, n
      //#0x2E:
      function () {
        this.registersHL = this.registersHL & 0xff00 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 1 & 0xffff;
      },
      //CPL
      //#0x2F:
      function () {
        this.registerA ^= 0xff;
        this.FSubtract = this.FHalfCarry = true;
      },
      //JR NC, n
      //#0x30:
      function () {
        if (!this.FCarry) {
          this.programCounter = this.programCounter + (this.memoryReader[this.programCounter].apply(this, [this.programCounter]) << 24 >> 24) + 1 & 0xffff;
          this.CPUTicks += 4;
        } else {
          this.programCounter = this.programCounter + 1 & 0xffff;
        }
      },
      //LD SP, nn
      //#0x31:
      function () {
        this.stackPointer = this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 2 & 0xffff;
      },
      //LDD (HL), A
      //#0x32:
      function () {
        this.memoryWriter[this.registersHL].apply(this, [this.registersHL, this.registerA]);
        this.registersHL = this.registersHL - 1 & 0xffff;
      },
      //INC SP
      //#0x33:
      function () {
        this.stackPointer = this.stackPointer + 1 & 0xffff;
      },
      //INC (HL)
      //#0x34:
      function () {
        var temp_var = this.memoryReader[this.registersHL].apply(this, [this.registersHL]) + 1 & 0xff;
        this.FZero = temp_var === 0;
        this.FHalfCarry = (temp_var & 0xf) === 0;
        this.FSubtract = false;
        this.memoryWriter[this.registersHL].apply(this, [this.registersHL, temp_var]);
      },
      //DEC (HL)
      //#0x35:
      function () {
        var temp_var = this.memoryReader[this.registersHL].apply(this, [this.registersHL]) - 1 & 0xff;
        this.FZero = temp_var === 0;
        this.FHalfCarry = (temp_var & 0xf) === 0xf;
        this.FSubtract = true;
        this.memoryWriter[this.registersHL].apply(this, [this.registersHL, temp_var]);
      },
      //LD (HL), n
      //#0x36:
      function () {
        this.memoryWriter[this.registersHL].apply(this, [this.registersHL, this.memoryReader[this.programCounter].apply(this, [this.programCounter])]);
        this.programCounter = this.programCounter + 1 & 0xffff;
      },
      //SCF
      //#0x37:
      function () {
        this.FCarry = true;
        this.FSubtract = this.FHalfCarry = false;
      },
      //JR C, n
      //#0x38:
      function () {
        if (this.FCarry) {
          this.programCounter = this.programCounter + (this.memoryReader[this.programCounter].apply(this, [this.programCounter]) << 24 >> 24) + 1 & 0xffff;
          this.CPUTicks += 4;
        } else {
          this.programCounter = this.programCounter + 1 & 0xffff;
        }
      },
      //ADD HL, SP
      //#0x39:
      function () {
        var dirtySum = this.registersHL + this.stackPointer;
        this.FHalfCarry = (this.registersHL & 0xfff) > (dirtySum & 0xfff);
        this.FCarry = dirtySum > 0xffff;
        this.registersHL = dirtySum & 0xffff;
        this.FSubtract = false;
      },
      //LDD A, (HL)
      //#0x3A:
      function () {
        this.registerA = this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
        this.registersHL = this.registersHL - 1 & 0xffff;
      },
      //DEC SP
      //#0x3B:
      function () {
        this.stackPointer = this.stackPointer - 1 & 0xffff;
      },
      //INC A
      //#0x3C:
      function () {
        this.registerA = this.registerA + 1 & 0xff;
        this.FZero = this.registerA === 0;
        this.FHalfCarry = (this.registerA & 0xf) === 0;
        this.FSubtract = false;
      },
      //DEC A
      //#0x3D:
      function () {
        this.registerA = this.registerA - 1 & 0xff;
        this.FZero = this.registerA === 0;
        this.FHalfCarry = (this.registerA & 0xf) === 0xf;
        this.FSubtract = true;
      },
      //LD A, n
      //#0x3E:
      function () {
        this.registerA = this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 1 & 0xffff;
      },
      //CCF
      //#0x3F:
      function () {
        this.FCarry = !this.FCarry;
        this.FSubtract = this.FHalfCarry = false;
      },
      //LD B, B
      //#0x40:
      function () {
        //Do nothing...
      },
      //LD B, C
      //#0x41:
      function () {
        this.registerB = this.registerC;
      },
      //LD B, D
      //#0x42:
      function () {
        this.registerB = this.registerD;
      },
      //LD B, E
      //#0x43:
      function () {
        this.registerB = this.registerE;
      },
      //LD B, H
      //#0x44:
      function () {
        this.registerB = this.registersHL >> 8;
      },
      //LD B, L
      //#0x45:
      function () {
        this.registerB = this.registersHL & 0xff;
      },
      //LD B, (HL)
      //#0x46:
      function () {
        this.registerB = this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
      },
      //LD B, A
      //#0x47:
      function () {
        this.registerB = this.registerA;
      },
      //LD C, B
      //#0x48:
      function () {
        this.registerC = this.registerB;
      },
      //LD C, C
      //#0x49:
      function () {
        //Do nothing...
      },
      //LD C, D
      //#0x4A:
      function () {
        this.registerC = this.registerD;
      },
      //LD C, E
      //#0x4B:
      function () {
        this.registerC = this.registerE;
      },
      //LD C, H
      //#0x4C:
      function () {
        this.registerC = this.registersHL >> 8;
      },
      //LD C, L
      //#0x4D:
      function () {
        this.registerC = this.registersHL & 0xff;
      },
      //LD C, (HL)
      //#0x4E:
      function () {
        this.registerC = this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
      },
      //LD C, A
      //#0x4F:
      function () {
        this.registerC = this.registerA;
      },
      //LD D, B
      //#0x50:
      function () {
        this.registerD = this.registerB;
      },
      //LD D, C
      //#0x51:
      function () {
        this.registerD = this.registerC;
      },
      //LD D, D
      //#0x52:
      function () {
        //Do nothing...
      },
      //LD D, E
      //#0x53:
      function () {
        this.registerD = this.registerE;
      },
      //LD D, H
      //#0x54:
      function () {
        this.registerD = this.registersHL >> 8;
      },
      //LD D, L
      //#0x55:
      function () {
        this.registerD = this.registersHL & 0xff;
      },
      //LD D, (HL)
      //#0x56:
      function () {
        this.registerD = this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
      },
      //LD D, A
      //#0x57:
      function () {
        this.registerD = this.registerA;
      },
      //LD E, B
      //#0x58:
      function () {
        this.registerE = this.registerB;
      },
      //LD E, C
      //#0x59:
      function () {
        this.registerE = this.registerC;
      },
      //LD E, D
      //#0x5A:
      function () {
        this.registerE = this.registerD;
      },
      //LD E, E
      //#0x5B:
      function () {
        //Do nothing...
      },
      //LD E, H
      //#0x5C:
      function () {
        this.registerE = this.registersHL >> 8;
      },
      //LD E, L
      //#0x5D:
      function () {
        this.registerE = this.registersHL & 0xff;
      },
      //LD E, (HL)
      //#0x5E:
      function () {
        this.registerE = this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
      },
      //LD E, A
      //#0x5F:
      function () {
        this.registerE = this.registerA;
      },
      //LD H, B
      //#0x60:
      function () {
        this.registersHL = this.registerB << 8 | this.registersHL & 0xff;
      },
      //LD H, C
      //#0x61:
      function () {
        this.registersHL = this.registerC << 8 | this.registersHL & 0xff;
      },
      //LD H, D
      //#0x62:
      function () {
        this.registersHL = this.registerD << 8 | this.registersHL & 0xff;
      },
      //LD H, E
      //#0x63:
      function () {
        this.registersHL = this.registerE << 8 | this.registersHL & 0xff;
      },
      //LD H, H
      //#0x64:
      function () {
        //Do nothing...
      },
      //LD H, L
      //#0x65:
      function () {
        this.registersHL = (this.registersHL & 0xff) * 0x101;
      },
      //LD H, (HL)
      //#0x66:
      function () {
        this.registersHL = this.memoryReader[this.registersHL].apply(this, [this.registersHL]) << 8 | this.registersHL & 0xff;
      },
      //LD H, A
      //#0x67:
      function () {
        this.registersHL = this.registerA << 8 | this.registersHL & 0xff;
      },
      //LD L, B
      //#0x68:
      function () {
        this.registersHL = this.registersHL & 0xff00 | this.registerB;
      },
      //LD L, C
      //#0x69:
      function () {
        this.registersHL = this.registersHL & 0xff00 | this.registerC;
      },
      //LD L, D
      //#0x6A:
      function () {
        this.registersHL = this.registersHL & 0xff00 | this.registerD;
      },
      //LD L, E
      //#0x6B:
      function () {
        this.registersHL = this.registersHL & 0xff00 | this.registerE;
      },
      //LD L, H
      //#0x6C:
      function () {
        this.registersHL = this.registersHL & 0xff00 | this.registersHL >> 8;
      },
      //LD L, L
      //#0x6D:
      function () {
        //Do nothing...
      },
      //LD L, (HL)
      //#0x6E:
      function () {
        this.registersHL = this.registersHL & 0xff00 | this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
      },
      //LD L, A
      //#0x6F:
      function () {
        this.registersHL = this.registersHL & 0xff00 | this.registerA;
      },
      //LD (HL), B
      //#0x70:
      function () {
        this.memoryWriter[this.registersHL].apply(this, [this.registersHL, this.registerB]);
      },
      //LD (HL), C
      //#0x71:
      function () {
        this.memoryWriter[this.registersHL].apply(this, [this.registersHL, this.registerC]);
      },
      //LD (HL), D
      //#0x72:
      function () {
        this.memoryWriter[this.registersHL].apply(this, [this.registersHL, this.registerD]);
      },
      //LD (HL), E
      //#0x73:
      function () {
        this.memoryWriter[this.registersHL].apply(this, [this.registersHL, this.registerE]);
      },
      //LD (HL), H
      //#0x74:
      function () {
        this.memoryWriter[this.registersHL].apply(this, [this.registersHL, this.registersHL >> 8]);
      },
      //LD (HL), L
      //#0x75:
      function () {
        this.memoryWriter[this.registersHL].apply(this, [this.registersHL, this.registersHL & 0xff]);
      },
      //HALT
      //#0x76:
      function () {
        //See if there's already an IRQ match:
        if ((this.interruptsEnabled & this.interruptsRequested & 0x1f) > 0) {
          if (!this.cartridge.useGBCMode && !this.usedBootROM) {
            //HALT bug in the DMG CPU model (Program Counter fails to increment for one instruction after HALT):
            this.skipPCIncrement = true;
          } else {
            //CGB gets around the HALT PC bug by doubling the hidden NOP.
            this.CPUTicks += 4;
          }
        } else {
          //CPU is stalled until the next IRQ match:
          this.calculateHALTPeriod();
        }
      },
      //LD (HL), A
      //#0x77:
      function () {
        this.memoryWriter[this.registersHL].apply(this, [this.registersHL, this.registerA]);
      },
      //LD A, B
      //#0x78:
      function () {
        this.registerA = this.registerB;
      },
      //LD A, C
      //#0x79:
      function () {
        this.registerA = this.registerC;
      },
      //LD A, D
      //#0x7A:
      function () {
        this.registerA = this.registerD;
      },
      //LD A, E
      //#0x7B:
      function () {
        this.registerA = this.registerE;
      },
      //LD A, H
      //#0x7C:
      function () {
        this.registerA = this.registersHL >> 8;
      },
      //LD A, L
      //#0x7D:
      function () {
        this.registerA = this.registersHL & 0xff;
      },
      //LD, A, (HL)
      //#0x7E:
      function () {
        this.registerA = this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
      },
      //LD A, A
      //#0x7F:
      function () {
        //Do Nothing...
      },
      //ADD A, B
      //#0x80:
      function () {
        var dirtySum = this.registerA + this.registerB;
        this.FHalfCarry = (dirtySum & 0xf) < (this.registerA & 0xf);
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADD A, C
      //#0x81:
      function () {
        var dirtySum = this.registerA + this.registerC;
        this.FHalfCarry = (dirtySum & 0xf) < (this.registerA & 0xf);
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADD A, D
      //#0x82:
      function () {
        var dirtySum = this.registerA + this.registerD;
        this.FHalfCarry = (dirtySum & 0xf) < (this.registerA & 0xf);
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADD A, E
      //#0x83:
      function () {
        var dirtySum = this.registerA + this.registerE;
        this.FHalfCarry = (dirtySum & 0xf) < (this.registerA & 0xf);
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADD A, H
      //#0x84:
      function () {
        var dirtySum = this.registerA + (this.registersHL >> 8);
        this.FHalfCarry = (dirtySum & 0xf) < (this.registerA & 0xf);
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADD A, L
      //#0x85:
      function () {
        var dirtySum = this.registerA + (this.registersHL & 0xff);
        this.FHalfCarry = (dirtySum & 0xf) < (this.registerA & 0xf);
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADD A, (HL)
      //#0x86:
      function () {
        var dirtySum = this.registerA + this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
        this.FHalfCarry = (dirtySum & 0xf) < (this.registerA & 0xf);
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADD A, A
      //#0x87:
      function () {
        this.FHalfCarry = (this.registerA & 0x8) === 0x8;
        this.FCarry = this.registerA > 0x7f;
        this.registerA = this.registerA << 1 & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADC A, B
      //#0x88:
      function () {
        var dirtySum = this.registerA + this.registerB + (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) + (this.registerB & 0xf) + (this.FCarry ? 1 : 0) > 0xf;
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADC A, C
      //#0x89:
      function () {
        var dirtySum = this.registerA + this.registerC + (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) + (this.registerC & 0xf) + (this.FCarry ? 1 : 0) > 0xf;
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADC A, D
      //#0x8A:
      function () {
        var dirtySum = this.registerA + this.registerD + (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) + (this.registerD & 0xf) + (this.FCarry ? 1 : 0) > 0xf;
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADC A, E
      //#0x8B:
      function () {
        var dirtySum = this.registerA + this.registerE + (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) + (this.registerE & 0xf) + (this.FCarry ? 1 : 0) > 0xf;
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADC A, H
      //#0x8C:
      function () {
        var tempValue = this.registersHL >> 8;
        var dirtySum = this.registerA + tempValue + (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) + (tempValue & 0xf) + (this.FCarry ? 1 : 0) > 0xf;
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADC A, L
      //#0x8D:
      function () {
        var tempValue = this.registersHL & 0xff;
        var dirtySum = this.registerA + tempValue + (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) + (tempValue & 0xf) + (this.FCarry ? 1 : 0) > 0xf;
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADC A, (HL)
      //#0x8E:
      function () {
        var tempValue = this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
        var dirtySum = this.registerA + tempValue + (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) + (tempValue & 0xf) + (this.FCarry ? 1 : 0) > 0xf;
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //ADC A, A
      //#0x8F:
      function () {
        //shift left register A one bit for some ops here as an optimization:
        var dirtySum = this.registerA << 1 | (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA << 1 & 0x1e | (this.FCarry ? 1 : 0)) > 0xf;
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //SUB A, B
      //#0x90:
      function () {
        var dirtySum = this.registerA - this.registerB;
        this.FHalfCarry = (this.registerA & 0xf) < (dirtySum & 0xf);
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //SUB A, C
      //#0x91:
      function () {
        var dirtySum = this.registerA - this.registerC;
        this.FHalfCarry = (this.registerA & 0xf) < (dirtySum & 0xf);
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //SUB A, D
      //#0x92:
      function () {
        var dirtySum = this.registerA - this.registerD;
        this.FHalfCarry = (this.registerA & 0xf) < (dirtySum & 0xf);
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //SUB A, E
      //#0x93:
      function () {
        var dirtySum = this.registerA - this.registerE;
        this.FHalfCarry = (this.registerA & 0xf) < (dirtySum & 0xf);
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //SUB A, H
      //#0x94:
      function () {
        var dirtySum = this.registerA - (this.registersHL >> 8);
        this.FHalfCarry = (this.registerA & 0xf) < (dirtySum & 0xf);
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //SUB A, L
      //#0x95:
      function () {
        var dirtySum = this.registerA - (this.registersHL & 0xff);
        this.FHalfCarry = (this.registerA & 0xf) < (dirtySum & 0xf);
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //SUB A, (HL)
      //#0x96:
      function () {
        var dirtySum = this.registerA - this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
        this.FHalfCarry = (this.registerA & 0xf) < (dirtySum & 0xf);
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //SUB A, A
      //#0x97:
      function () {
        //number - same number === 0
        this.registerA = 0;
        this.FHalfCarry = this.FCarry = false;
        this.FZero = this.FSubtract = true;
      },
      //SBC A, B
      //#0x98:
      function () {
        var dirtySum = this.registerA - this.registerB - (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) - (this.registerB & 0xf) - (this.FCarry ? 1 : 0) < 0;
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = true;
      },
      //SBC A, C
      //#0x99:
      function () {
        var dirtySum = this.registerA - this.registerC - (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) - (this.registerC & 0xf) - (this.FCarry ? 1 : 0) < 0;
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = true;
      },
      //SBC A, D
      //#0x9A:
      function () {
        var dirtySum = this.registerA - this.registerD - (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) - (this.registerD & 0xf) - (this.FCarry ? 1 : 0) < 0;
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = true;
      },
      //SBC A, E
      //#0x9B:
      function () {
        var dirtySum = this.registerA - this.registerE - (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) - (this.registerE & 0xf) - (this.FCarry ? 1 : 0) < 0;
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = true;
      },
      //SBC A, H
      //#0x9C:
      function () {
        var temp_var = this.registersHL >> 8;
        var dirtySum = this.registerA - temp_var - (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) - (temp_var & 0xf) - (this.FCarry ? 1 : 0) < 0;
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = true;
      },
      //SBC A, L
      //#0x9D:
      function () {
        var dirtySum = this.registerA - (this.registersHL & 0xff) - (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) - (this.registersHL & 0xf) - (this.FCarry ? 1 : 0) < 0;
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = true;
      },
      //SBC A, (HL)
      //#0x9E:
      function () {
        var temp_var = this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
        var dirtySum = this.registerA - temp_var - (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) - (temp_var & 0xf) - (this.FCarry ? 1 : 0) < 0;
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = true;
      },
      //SBC A, A
      //#0x9F:
      function () {
        //Optimized SBC A:
        if (this.FCarry) {
          this.FZero = false;
          this.FSubtract = this.FHalfCarry = this.FCarry = true;
          this.registerA = 0xff;
        } else {
          this.FHalfCarry = this.FCarry = false;
          this.FSubtract = this.FZero = true;
          this.registerA = 0;
        }
      },
      //AND B
      //#0xA0:
      function () {
        this.registerA &= this.registerB;
        this.FZero = this.registerA === 0;
        this.FHalfCarry = true;
        this.FSubtract = this.FCarry = false;
      },
      //AND C
      //#0xA1:
      function () {
        this.registerA &= this.registerC;
        this.FZero = this.registerA === 0;
        this.FHalfCarry = true;
        this.FSubtract = this.FCarry = false;
      },
      //AND D
      //#0xA2:
      function () {
        this.registerA &= this.registerD;
        this.FZero = this.registerA === 0;
        this.FHalfCarry = true;
        this.FSubtract = this.FCarry = false;
      },
      //AND E
      //#0xA3:
      function () {
        this.registerA &= this.registerE;
        this.FZero = this.registerA === 0;
        this.FHalfCarry = true;
        this.FSubtract = this.FCarry = false;
      },
      //AND H
      //#0xA4:
      function () {
        this.registerA &= this.registersHL >> 8;
        this.FZero = this.registerA === 0;
        this.FHalfCarry = true;
        this.FSubtract = this.FCarry = false;
      },
      //AND L
      //#0xA5:
      function () {
        this.registerA &= this.registersHL;
        this.FZero = this.registerA === 0;
        this.FHalfCarry = true;
        this.FSubtract = this.FCarry = false;
      },
      //AND (HL)
      //#0xA6:
      function () {
        this.registerA &= this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
        this.FZero = this.registerA === 0;
        this.FHalfCarry = true;
        this.FSubtract = this.FCarry = false;
      },
      //AND A
      //#0xA7:
      function () {
        //number & same number = same number
        this.FZero = this.registerA === 0;
        this.FHalfCarry = true;
        this.FSubtract = this.FCarry = false;
      },
      //XOR B
      //#0xA8:
      function () {
        this.registerA ^= this.registerB;
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FHalfCarry = this.FCarry = false;
      },
      //XOR C
      //#0xA9:
      function () {
        this.registerA ^= this.registerC;
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FHalfCarry = this.FCarry = false;
      },
      //XOR D
      //#0xAA:
      function () {
        this.registerA ^= this.registerD;
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FHalfCarry = this.FCarry = false;
      },
      //XOR E
      //#0xAB:
      function () {
        this.registerA ^= this.registerE;
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FHalfCarry = this.FCarry = false;
      },
      //XOR H
      //#0xAC:
      function () {
        this.registerA ^= this.registersHL >> 8;
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FHalfCarry = this.FCarry = false;
      },
      //XOR L
      //#0xAD:
      function () {
        this.registerA ^= this.registersHL & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FHalfCarry = this.FCarry = false;
      },
      //XOR (HL)
      //#0xAE:
      function () {
        this.registerA ^= this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FHalfCarry = this.FCarry = false;
      },
      //XOR A
      //#0xAF:
      function () {
        //number ^ same number === 0
        this.registerA = 0;
        this.FZero = true;
        this.FSubtract = this.FHalfCarry = this.FCarry = false;
      },
      //OR B
      //#0xB0:
      function () {
        this.registerA |= this.registerB;
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FCarry = this.FHalfCarry = false;
      },
      //OR C
      //#0xB1:
      function () {
        this.registerA |= this.registerC;
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FCarry = this.FHalfCarry = false;
      },
      //OR D
      //#0xB2:
      function () {
        this.registerA |= this.registerD;
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FCarry = this.FHalfCarry = false;
      },
      //OR E
      //#0xB3:
      function () {
        this.registerA |= this.registerE;
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FCarry = this.FHalfCarry = false;
      },
      //OR H
      //#0xB4:
      function () {
        this.registerA |= this.registersHL >> 8;
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FCarry = this.FHalfCarry = false;
      },
      //OR L
      //#0xB5:
      function () {
        this.registerA |= this.registersHL & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FCarry = this.FHalfCarry = false;
      },
      //OR (HL)
      //#0xB6:
      function () {
        this.registerA |= this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FCarry = this.FHalfCarry = false;
      },
      //OR A
      //#0xB7:
      function () {
        //number | same number === same number
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FCarry = this.FHalfCarry = false;
      },
      //CP B
      //#0xB8:
      function () {
        var dirtySum = this.registerA - this.registerB;
        this.FHalfCarry = (dirtySum & 0xf) > (this.registerA & 0xf);
        this.FCarry = dirtySum < 0;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //CP C
      //#0xB9:
      function () {
        var dirtySum = this.registerA - this.registerC;
        this.FHalfCarry = (dirtySum & 0xf) > (this.registerA & 0xf);
        this.FCarry = dirtySum < 0;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //CP D
      //#0xBA:
      function () {
        var dirtySum = this.registerA - this.registerD;
        this.FHalfCarry = (dirtySum & 0xf) > (this.registerA & 0xf);
        this.FCarry = dirtySum < 0;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //CP E
      //#0xBB:
      function () {
        var dirtySum = this.registerA - this.registerE;
        this.FHalfCarry = (dirtySum & 0xf) > (this.registerA & 0xf);
        this.FCarry = dirtySum < 0;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //CP H
      //#0xBC:
      function () {
        var dirtySum = this.registerA - (this.registersHL >> 8);
        this.FHalfCarry = (dirtySum & 0xf) > (this.registerA & 0xf);
        this.FCarry = dirtySum < 0;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //CP L
      //#0xBD:
      function () {
        var dirtySum = this.registerA - (this.registersHL & 0xff);
        this.FHalfCarry = (dirtySum & 0xf) > (this.registerA & 0xf);
        this.FCarry = dirtySum < 0;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //CP (HL)
      //#0xBE:
      function () {
        var dirtySum = this.registerA - this.memoryReader[this.registersHL].apply(this, [this.registersHL]);
        this.FHalfCarry = (dirtySum & 0xf) > (this.registerA & 0xf);
        this.FCarry = dirtySum < 0;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //CP A
      //#0xBF:
      function () {
        this.FHalfCarry = this.FCarry = false;
        this.FZero = this.FSubtract = true;
      },
      //RET !FZ
      //#0xC0:
      function () {
        if (!this.FZero) {
          this.programCounter = this.memoryRead(this.stackPointer + 1 & 0xffff) << 8 | this.memoryReader[this.stackPointer].apply(this, [this.stackPointer]);
          this.stackPointer = this.stackPointer + 2 & 0xffff;
          this.CPUTicks += 12;
        }
      },
      //POP BC
      //#0xC1:
      function () {
        this.registerC = this.memoryReader[this.stackPointer].apply(this, [this.stackPointer]);
        this.registerB = this.memoryRead(this.stackPointer + 1 & 0xffff);
        this.stackPointer = this.stackPointer + 2 & 0xffff;
      },
      //JP !FZ, nn
      //#0xC2:
      function () {
        if (!this.FZero) {
          this.programCounter = this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
          this.CPUTicks += 4;
        } else {
          this.programCounter = this.programCounter + 2 & 0xffff;
        }
      },
      //JP nn
      //#0xC3:
      function () {
        this.programCounter = this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
      },
      //CALL !FZ, nn
      //#0xC4:
      function () {
        if (!this.FZero) {
          var temp_pc = this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
          this.programCounter = this.programCounter + 2 & 0xffff;
          this.stackPointer = this.stackPointer - 1 & 0xffff;
          this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
          this.stackPointer = this.stackPointer - 1 & 0xffff;
          this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
          this.programCounter = temp_pc;
          this.CPUTicks += 12;
        } else {
          this.programCounter = this.programCounter + 2 & 0xffff;
        }
      },
      //PUSH BC
      //#0xC5:
      function () {
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.registerB]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.registerC]);
      },
      //ADD, n
      //#0xC6:
      function () {
        var dirtySum = this.registerA + this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 1 & 0xffff;
        this.FHalfCarry = (dirtySum & 0xf) < (this.registerA & 0xf);
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //RST 0
      //#0xC7:
      function () {
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
        this.programCounter = 0;
      },
      //RET FZ
      //#0xC8:
      function () {
        if (this.FZero) {
          this.programCounter = this.memoryRead(this.stackPointer + 1 & 0xffff) << 8 | this.memoryReader[this.stackPointer].apply(this, [this.stackPointer]);
          this.stackPointer = this.stackPointer + 2 & 0xffff;
          this.CPUTicks += 12;
        }
      },
      //RET
      //#0xC9:
      function () {
        this.programCounter = this.memoryRead(this.stackPointer + 1 & 0xffff) << 8 | this.memoryReader[this.stackPointer].apply(this, [this.stackPointer]);
        this.stackPointer = this.stackPointer + 2 & 0xffff;
      },
      //JP FZ, nn
      //#0xCA:
      function () {
        if (this.FZero) {
          this.programCounter = this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
          this.CPUTicks += 4;
        } else {
          this.programCounter = this.programCounter + 2 & 0xffff;
        }
      },
      //Secondary OP Code Set:
      //#0xCB:
      function () {
        var operationCode = this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        //Increment the program counter to the next instruction:
        this.programCounter = this.programCounter + 1 & 0xffff;
        //Get how many CPU cycles the current 0xCBXX op code counts for:
        this.CPUTicks += SecondaryTickTable[operationCode];
        //Execute secondary OP codes for the 0xCB OP code call.
        bitInstructions[operationCode].apply(this);
      },
      //CALL FZ, nn
      //#0xCC:
      function () {
        if (this.FZero) {
          var temp_pc = this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
          this.programCounter = this.programCounter + 2 & 0xffff;
          this.stackPointer = this.stackPointer - 1 & 0xffff;
          this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
          this.stackPointer = this.stackPointer - 1 & 0xffff;
          this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
          this.programCounter = temp_pc;
          this.CPUTicks += 12;
        } else {
          this.programCounter = this.programCounter + 2 & 0xffff;
        }
      },
      //CALL nn
      //#0xCD:
      function () {
        var temp_pc = this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 2 & 0xffff;
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
        this.programCounter = temp_pc;
      },
      //ADC A, n
      //#0xCE:
      function () {
        var tempValue = this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 1 & 0xffff;
        var dirtySum = this.registerA + tempValue + (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) + (tempValue & 0xf) + (this.FCarry ? 1 : 0) > 0xf;
        this.FCarry = dirtySum > 0xff;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = false;
      },
      //RST 0x8
      //#0xCF:
      function () {
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
        this.programCounter = 0x8;
      },
      //RET !FC
      //#0xD0:
      function () {
        if (!this.FCarry) {
          this.programCounter = this.memoryRead(this.stackPointer + 1 & 0xffff) << 8 | this.memoryReader[this.stackPointer].apply(this, [this.stackPointer]);
          this.stackPointer = this.stackPointer + 2 & 0xffff;
          this.CPUTicks += 12;
        }
      },
      //POP DE
      //#0xD1:
      function () {
        this.registerE = this.memoryReader[this.stackPointer].apply(this, [this.stackPointer]);
        this.registerD = this.memoryRead(this.stackPointer + 1 & 0xffff);
        this.stackPointer = this.stackPointer + 2 & 0xffff;
      },
      //JP !FC, nn
      //#0xD2:
      function () {
        if (!this.FCarry) {
          this.programCounter = this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
          this.CPUTicks += 4;
        } else {
          this.programCounter = this.programCounter + 2 & 0xffff;
        }
      },
      //0xD3 - Illegal
      //#0xD3:
      function () {
        console.log("Illegal op code 0xD3 called, pausing emulation.", 2);
        pause();
      },
      //CALL !FC, nn
      //#0xD4:
      function () {
        if (!this.FCarry) {
          var temp_pc = this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
          this.programCounter = this.programCounter + 2 & 0xffff;
          this.stackPointer = this.stackPointer - 1 & 0xffff;
          this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
          this.stackPointer = this.stackPointer - 1 & 0xffff;
          this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
          this.programCounter = temp_pc;
          this.CPUTicks += 12;
        } else {
          this.programCounter = this.programCounter + 2 & 0xffff;
        }
      },
      //PUSH DE
      //#0xD5:
      function () {
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.registerD]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.registerE]);
      },
      //SUB A, n
      //#0xD6:
      function () {
        var dirtySum = this.registerA - this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 1 & 0xffff;
        this.FHalfCarry = (this.registerA & 0xf) < (dirtySum & 0xf);
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //RST 0x10
      //#0xD7:
      function () {
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
        this.programCounter = 0x10;
      },
      //RET FC
      //#0xD8:
      function () {
        if (this.FCarry) {
          this.programCounter = this.memoryRead(this.stackPointer + 1 & 0xffff) << 8 | this.memoryReader[this.stackPointer].apply(this, [this.stackPointer]);
          this.stackPointer = this.stackPointer + 2 & 0xffff;
          this.CPUTicks += 12;
        }
      },
      //RETI
      //#0xD9:
      function () {
        this.programCounter = this.memoryRead(this.stackPointer + 1 & 0xffff) << 8 | this.memoryReader[this.stackPointer].apply(this, [this.stackPointer]);
        this.stackPointer = this.stackPointer + 2 & 0xffff;
        //Immediate for HALT:
        this.IRQEnableDelay = this.IRQEnableDelay === 2 || this.memoryReader[this.programCounter].apply(this, [this.programCounter]) === 0x76 ? 1 : 2;
      },
      //JP FC, nn
      //#0xDA:
      function () {
        if (this.FCarry) {
          this.programCounter = this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
          this.CPUTicks += 4;
        } else {
          this.programCounter = this.programCounter + 2 & 0xffff;
        }
      },
      //0xDB - Illegal
      //#0xDB:
      function () {
        console.log("Illegal op code 0xDB called, pausing emulation.", 2);
        pause();
      },
      //CALL FC, nn
      //#0xDC:
      function () {
        if (this.FCarry) {
          var temp_pc = this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
          this.programCounter = this.programCounter + 2 & 0xffff;
          this.stackPointer = this.stackPointer - 1 & 0xffff;
          this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
          this.stackPointer = this.stackPointer - 1 & 0xffff;
          this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
          this.programCounter = temp_pc;
          this.CPUTicks += 12;
        } else {
          this.programCounter = this.programCounter + 2 & 0xffff;
        }
      },
      //0xDD - Illegal
      //#0xDD:
      function () {
        console.log("Illegal op code 0xDD called, pausing emulation.", 2);
        pause();
      },
      //SBC A, n
      //#0xDE:
      function () {
        var temp_var = this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 1 & 0xffff;
        var dirtySum = this.registerA - temp_var - (this.FCarry ? 1 : 0);
        this.FHalfCarry = (this.registerA & 0xf) - (temp_var & 0xf) - (this.FCarry ? 1 : 0) < 0;
        this.FCarry = dirtySum < 0;
        this.registerA = dirtySum & 0xff;
        this.FZero = this.registerA === 0;
        this.FSubtract = true;
      },
      //RST 0x18
      //#0xDF:
      function () {
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
        this.programCounter = 0x18;
      },
      //LDH (n), A
      //#0xE0:
      function () {
        this.memoryHighWrite(this.memoryReader[this.programCounter].apply(this, [this.programCounter]), this.registerA);
        this.programCounter = this.programCounter + 1 & 0xffff;
      },
      //POP HL
      //#0xE1:
      function () {
        this.registersHL = this.memoryRead(this.stackPointer + 1 & 0xffff) << 8 | this.memoryReader[this.stackPointer].apply(this, [this.stackPointer]);
        this.stackPointer = this.stackPointer + 2 & 0xffff;
      },
      //LD (0xFF00 + C), A
      //#0xE2:
      function () {
        this.memoryHighWriter[this.registerC].apply(this, [this.registerC, this.registerA]);
      },
      //0xE3 - Illegal
      //#0xE3:
      function () {
        console.log("Illegal op code 0xE3 called, pausing emulation.", 2);
        pause();
      },
      //0xE4 - Illegal
      //#0xE4:
      function () {
        console.log("Illegal op code 0xE4 called, pausing emulation.", 2);
        pause();
      },
      //PUSH HL
      //#0xE5:
      function () {
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.registersHL >> 8]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.registersHL & 0xff]);
      },
      //AND n
      //#0xE6:
      function () {
        this.registerA &= this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 1 & 0xffff;
        this.FZero = this.registerA === 0;
        this.FHalfCarry = true;
        this.FSubtract = this.FCarry = false;
      },
      //RST 0x20
      //#0xE7:
      function () {
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
        this.programCounter = 0x20;
      },
      //ADD SP, n
      //#0xE8:
      function () {
        var temp_value2 = this.memoryReader[this.programCounter].apply(this, [this.programCounter]) << 24 >> 24;
        this.programCounter = this.programCounter + 1 & 0xffff;
        var temp_value = this.stackPointer + temp_value2 & 0xffff;
        temp_value2 = this.stackPointer ^ temp_value2 ^ temp_value;
        this.stackPointer = temp_value;
        this.FCarry = (temp_value2 & 0x100) === 0x100;
        this.FHalfCarry = (temp_value2 & 0x10) === 0x10;
        this.FZero = this.FSubtract = false;
      },
      //JP, (HL)
      //#0xE9:
      function () {
        this.programCounter = this.registersHL;
      },
      //LD n, A
      //#0xEA:
      function () {
        this.memoryWrite(this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]), this.registerA);
        this.programCounter = this.programCounter + 2 & 0xffff;
      },
      //0xEB - Illegal
      //#0xEB:
      function () {
        console.log("Illegal op code 0xEB called, pausing emulation.", 2);
        pause();
      },
      //0xEC - Illegal
      //#0xEC:
      function () {
        console.log("Illegal op code 0xEC called, pausing emulation.", 2);
        pause();
      },
      //0xED - Illegal
      //#0xED:
      function () {
        console.log("Illegal op code 0xED called, pausing emulation.", 2);
        pause();
      },
      //XOR n
      //#0xEE:
      function () {
        this.registerA ^= this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 1 & 0xffff;
        this.FZero = this.registerA === 0;
        this.FSubtract = this.FHalfCarry = this.FCarry = false;
      },
      //RST 0x28
      //#0xEF:
      function () {
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
        this.programCounter = 0x28;
      },
      //LDH A, (n)
      //#0xF0:
      function () {
        this.registerA = this.memoryHighRead(this.memoryReader[this.programCounter].apply(this, [this.programCounter]));
        this.programCounter = this.programCounter + 1 & 0xffff;
      },
      //POP AF
      //#0xF1:
      function () {
        var temp_var = this.memoryReader[this.stackPointer].apply(this, [this.stackPointer]);
        this.FZero = temp_var > 0x7f;
        this.FSubtract = (temp_var & 0x40) === 0x40;
        this.FHalfCarry = (temp_var & 0x20) === 0x20;
        this.FCarry = (temp_var & 0x10) === 0x10;
        this.registerA = this.memoryRead(this.stackPointer + 1 & 0xffff);
        this.stackPointer = this.stackPointer + 2 & 0xffff;
      },
      //LD A, (0xFF00 + C)
      //#0xF2:
      function () {
        this.registerA = this.memoryHighReader[this.registerC].apply(this, [this.registerC]);
      },
      //DI
      //#0xF3:
      function () {
        this.IME = false;
        this.IRQEnableDelay = 0;
      },
      //0xF4 - Illegal
      //#0xF4:
      function () {
        console.log("Illegal op code 0xF4 called, pausing emulation.", 2);
        pause();
      },
      //PUSH AF
      //#0xF5:
      function () {
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.registerA]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, (this.FZero ? 0x80 : 0) | (this.FSubtract ? 0x40 : 0) | (this.FHalfCarry ? 0x20 : 0) | (this.FCarry ? 0x10 : 0)]);
      },
      //OR n
      //#0xF6:
      function () {
        this.registerA |= this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.FZero = this.registerA === 0;
        this.programCounter = this.programCounter + 1 & 0xffff;
        this.FSubtract = this.FCarry = this.FHalfCarry = false;
      },
      //RST 0x30
      //#0xF7:
      function () {
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
        this.programCounter = 0x30;
      },
      //LDHL SP, n
      //#0xF8:
      function () {
        var temp_var = this.memoryReader[this.programCounter].apply(this, [this.programCounter]) << 24 >> 24;
        this.programCounter = this.programCounter + 1 & 0xffff;
        this.registersHL = this.stackPointer + temp_var & 0xffff;
        temp_var = this.stackPointer ^ temp_var ^ this.registersHL;
        this.FCarry = (temp_var & 0x100) === 0x100;
        this.FHalfCarry = (temp_var & 0x10) === 0x10;
        this.FZero = this.FSubtract = false;
      },
      //LD SP, HL
      //#0xF9:
      function () {
        this.stackPointer = this.registersHL;
      },
      //LD A, (nn)
      //#0xFA:
      function () {
        this.registerA = this.memoryRead(this.memoryRead(this.programCounter + 1 & 0xffff) << 8 | this.memoryReader[this.programCounter].apply(this, [this.programCounter]));
        this.programCounter = this.programCounter + 2 & 0xffff;
      },
      //EI
      //#0xFB:
      function () {
        //Immediate for HALT:
        this.IRQEnableDelay = this.IRQEnableDelay === 2 || this.memoryReader[this.programCounter].apply(this, [this.programCounter]) === 0x76 ? 1 : 2;
      },
      //0xFC - Illegal
      //#0xFC:
      function () {
        console.log("Illegal op code 0xFC called, pausing emulation.", 2);
        pause();
      },
      //0xFD - Illegal
      //#0xFD:
      function () {
        console.log("Illegal op code 0xFD called, pausing emulation.", 2);
        pause();
      },
      //CP n
      //#0xFE:
      function () {
        var dirtySum = this.registerA - this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
        this.programCounter = this.programCounter + 1 & 0xffff;
        this.FHalfCarry = (dirtySum & 0xf) > (this.registerA & 0xf);
        this.FCarry = dirtySum < 0;
        this.FZero = dirtySum === 0;
        this.FSubtract = true;
      },
      //RST 0x38
      //#0xFF:
      function () {
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
        this.stackPointer = this.stackPointer - 1 & 0xffff;
        this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
        this.programCounter = 0x38;
      }];
      PostBootRegisterState = [// Dump of the post-BOOT I/O register state (From gambatte):
      0x0F, 0x00, 0x7C, 0xFF, 0x00, 0x00, 0x00, 0xF8, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01, 0x80, 0xBF, 0xF3, 0xFF, 0xBF, 0xFF, 0x3F, 0x00, 0xFF, 0xBF, 0x7F, 0xFF, 0x9F, 0xFF, 0xBF, 0xFF, 0xFF, 0x00, 0x00, 0xBF, 0x77, 0xF3, 0xF1, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x91, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFC, 0x00, 0x00, 0x00, 0x00, 0xFF, 0x7E, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x3E, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0xFF, 0xC1, 0x00, 0xFE, 0xFF, 0xFF, 0xFF, 0xF8, 0xFF, 0x00, 0x00, 0x00, 0x8F, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xCE, 0xED, 0x66, 0x66, 0xCC, 0x0D, 0x00, 0x0B, 0x03, 0x73, 0x00, 0x83, 0x00, 0x0C, 0x00, 0x0D, 0x00, 0x08, 0x11, 0x1F, 0x88, 0x89, 0x00, 0x0E, 0xDC, 0xCC, 0x6E, 0xE6, 0xDD, 0xDD, 0xD9, 0x99, 0xBB, 0xBB, 0x67, 0x63, 0x6E, 0x0E, 0xEC, 0xCC, 0xDD, 0xDC, 0x99, 0x9F, 0xBB, 0xB9, 0x33, 0x3E, 0x45, 0xEC, 0x52, 0xFA, 0x08, 0xB7, 0x07, 0x5D, 0x01, 0xFD, 0xC0, 0xFF, 0x08, 0xFC, 0x00, 0xE5, 0x0B, 0xF8, 0xC2, 0xCE, 0xF4, 0xF9, 0x0F, 0x7F, 0x45, 0x6D, 0x3D, 0xFE, 0x46, 0x97, 0x33, 0x5E, 0x08, 0xEF, 0xF1, 0xFF, 0x86, 0x83, 0x24, 0x74, 0x12, 0xFC, 0x00, 0x9F, 0xB4, 0xB7, 0x06, 0xD5, 0xD0, 0x7A, 0x00, 0x9E, 0x04, 0x5F, 0x41, 0x2F, 0x1D, 0x77, 0x36, 0x75, 0x81, 0xAA, 0x70, 0x3A, 0x98, 0xD1, 0x71, 0x02, 0x4D, 0x01, 0xC1, 0xFF, 0x0D, 0x00, 0xD3, 0x05, 0xF9, 0x00, 0x0B, 0x00];
      initialState = [true, // Whether we're in the GBC boot ROM.
      //CPU Registers and Flags:
      0x01, // Register A (Accumulator)
      true, // Register F  - Result was zero
      false, // Register F  - Subtraction was executed
      true, // Register F  - Half carry or half borrow
      true, // Register F  - Carry or borrow
      0x00, // Register B
      0x13, // Register C
      0x00, // Register D
      0xd8, // Register E
      0x014d, // Registers H and L combined
      0xfffe, // Stack Pointer
      0x0100, // Program Counter
      //Some CPU Emulation State Variables:
      false, // Has the CPU been suspended until the next interrupt?
      true, // Are interrupts enabled?
      false, // HDMA Transfer Flag - GBC only
      0, // The number of clock cycles emulated.
      0, // GBC double speed clocking shifter.
      [], // Main Core Memory
      [], // Extra VRAM bank for GBC.
      0, // Current VRAM bank for GBC.
      [], // GBC main RAM Banks
      false, // GameBoy Color detection.
      1, // Currently Switched GameBoy Color ram bank
      -0xd000, // GBC RAM offset from address start.
      0, // Offset of the ROM bank switching.
      0, // The parsed current ROM bank selection.
      0, // The scan line mode (for lines 1-144 it's 2-3-0, for 145-154 it's 1)
      false, // Should we trigger an interrupt if LY==LYC?
      false, // Should we trigger an interrupt if in mode 2?
      false, // Should we trigger an interrupt if in mode 1?
      false, // Should we trigger an interrupt if in mode 0?
      false, // Is the emulated LCD controller on?
      0, // The current bank of the character map the window uses.
      false, // Is the windows enabled?
      false, // Are sprites enabled?
      true, // Are we doing 8x8 or 8x16 sprites?
      0, // The current bank of the character map the background uses.
      0x80, // Fast mapping of the tile numbering/
      false, // Is TIMA enabled?
      56, // DIV Ticks Counter (Invisible lower 8-bit)
      60, // Counter for how many instructions have been executed on a scanline so far.
      0, // Counter for the TIMA timer.
      1024, // Timer Max Ticks
      0, // Serial IRQ Timer
      0, // Serial Transfer Shift Timer
      0, // Serial Transfer Shift Timer Refill
      0, // Are the interrupts on queue to be enabled?
      new Date().getTime(), // The last time we iterated the main loop.
      0, // To prevent the repeating of drawing a blank screen.
      [], // The internal frame-buffer.
      true, // Is the BG enabled?
      true, // Can we flag the BG for priority over sprites?
      0x2000, // channel1FrequencyTracker
      0x200, // channel1FrequencyCounter
      0, // channel1totalLength
      0, // channel1envelopeVolume
      false, // channel1envelopeType
      0, // channel1envelopeSweeps
      0, // channel1envelopeSweepsLast
      true, // channel1consecutive
      0, // channel1frequency
      false, // channel1SweepFault
      0, // channel1ShadowFrequency
      1, // channel1timeSweep
      0, // channel1lastTimeSweep
      false, // channel1Swept
      0, // channel1frequencySweepDivider
      false, // channel1decreaseSweep
      0x2000, // channel2FrequencyTracker
      0x200, // channel2FrequencyCounter
      0, // channel2totalLength
      0, // channel2envelopeVolume
      false, // channel2envelopeType
      0, // channel2envelopeSweeps
      0, // channel2envelopeSweepsLast
      true, // channel2consecutive
      0, // channel2frequency
      false, // channel3canPlay
      0, // channel3totalLength
      4, // channel3patternType
      0, // channel3frequency
      true, // channel3consecutive
      null, // Channel 3 adjusted sample buffer.
      8, // channel4FrequencyPeriod
      0, // channel4lastSampleLookup
      0, // channel4totalLength
      0, // channel4envelopeVolume
      0, // channel4currentVolume
      false, // channel4envelopeType
      0, // channel4envelopeSweeps
      0, // channel4envelopeSweepsLast
      true, // channel4consecutive
      0x7fff, // channel4BitRange
      false, // As its name implies
      // Vin Shit:
      8, // Computed post-mixing volume.
      8, // Computed post-mixing volume.
      // Channel paths enabled:
      false, // leftChannel1
      false, // leftChannel2
      false, // leftChannel3
      false, // leftChannel4
      false, // rightChannel1
      false, // rightChannel2
      false, // rightChannel3
      false, // rightChannel4
      // Channel output level caches:
      0, // channel1currentSampleLeft
      0, // channel1currentSampleRight
      0, // channel2currentSampleLeft
      0, // channel2currentSampleRight
      0, // channel3currentSampleLeft
      0, // channel3currentSampleRight
      0, // channel4currentSampleLeft
      0, // channel4currentSampleRight
      0, // channel1currentSampleLeftSecondary
      0, // channel1currentSampleRightSecondary
      0, // channel2currentSampleLeftSecondary
      0, // channel2currentSampleRightSecondary
      0, // channel3currentSampleLeftSecondary
      0, // channel3currentSampleRightSecondary
      0, // channel4currentSampleLeftSecondary
      0, // channel4currentSampleRightSecondary
      0, // channel1currentSampleLeftTrimary
      0, // channel1currentSampleRightTrimary
      0, // channel2currentSampleLeftTrimary
      0, // channel2currentSampleRightTrimary
      0, // mixerOutputCache
      0, // channel1DutyTracker
      dutyLookup[2], // channel1CachedDuty
      0, // channel2DutyTracker
      dutyLookup[2], // channel2CachedDuty
      false, // channel1Enabled
      false, // channel2Enabled
      false, // channel3Enabled
      false, // channel4Enabled
      0x2000, // sequencerClocks
      0, // sequencePosition
      0x800, // channel3Counter
      8, // channel4Counter
      0, // cachedChannel3Sample
      0, // cachedChannel4Sample
      0x800, // channel3FrequencyPeriod
      0, // channel3lastSampleLookup
      144, // Actual scan line...
      0, // Last rendered scan line...
      0, // queuedScanLines
      // RTC (Real Time Clock for MBC3):
      false, // RTCisLatched
      0, // RTC latched seconds.
      0, // RTC latched minutes.
      0, // RTC latched hours.
      0, // RTC latched lower 8-bits of the day counter.
      0, // RTC latched high-bit of the day counter.
      0, // RTC seconds counter.
      0, // RTC minutes counter.
      0, // RTC hours counter.
      0, // RTC days counter.
      false, // Did the RTC overflow and wrap the day counter?
      false, // Is the RTC allowed to clock up?
      false, // Updated upon ROM loading...
      false, // Did we trip the DMG Halt bug?
      0, // Tracker for STAT triggering.
      -0xf000, // GBC RAM (ECHO mirroring) offset from address start.
      0, // Current Y offset of the window.
      0, // Current X offset of the window.
      null, // gbcOBJRawPalette
      null, // gbcBGRawPalette
      null, // gbOBJPalette
      null, // gbBGPalette
      null, // gbcOBJPalette
      null, // gbcBGPalette
      null, // gbBGColorizedPalette
      null, // gbOBJColorizedPalette
      null, // cachedBGPaletteConversion
      null, // cachedOBJPaletteConversion
      // BG Tile Pointer Caches:
      null, // BGCHRBank1
      null, // BGCHRBank2
      0, // Post-Halt clocking.
      0, // IF Register
      0, // IE Register
      0, // HALT clocking overrun carry over.
      false, // colorizedGBPalettes
      0, // Register SCY (Y-Scroll)
      0, // Register SCX (X-Scroll)
      false, // CPU STOP status.
      1, // audioClocksUntilNextEvent
      1 // audioClocksUntilNextEventCounter
      ];

      StateManager = function () {
        function StateManager(gameboy) {
          _classCallCheck(this, StateManager);

          this.gameboy = gameboy;
        }

        _createClass(StateManager, [{
          key: "init",
          value: function init() {
            this.loadOld(initialState.slice(0));
          }
        }, {
          key: "get",
          value: function get() {
            var gameboy = this.gameboy;
            if (!gameboy.cartridge) return null;

            return concatArrayBuffers(gameboy.memory.buffer.slice(0), gameboy.VRAM.buffer.slice(0));

            // return [
            //   gameboy.inBootstrap,
            //   gameboy.registerA,
            //   gameboy.FZero,
            //   gameboy.FSubtract,
            //   gameboy.FHalfCarry,
            //   gameboy.FCarry,
            //   gameboy.registerB,
            //   gameboy.registerC,
            //   gameboy.registerD,
            //   gameboy.registerE,
            //   gameboy.registersHL,
            //   gameboy.stackPointer,
            //   gameboy.programCounter,
            //   gameboy.halt,
            //   gameboy.IME,
            //   gameboy.hdmaRunning,
            //   gameboy.CPUTicks,
            //   gameboy.doubleSpeedShifter,
            //   // fromTypedArray(gameboy.memory),
            //   // fromTypedArray(gameboy.VRAM),
            //   gameboy.currVRAMBank,
            //   fromTypedArray(gameboy.GBCMemory),
            //   gameboy.useGBCMode,
            //   gameboy.gbcRamBank,
            //   gameboy.gbcRamBankPosition,
            //   gameboy.ROMBank1Offset,
            //   gameboy.cartridge.mbc.currentROMBank,
            //   gameboy.modeSTAT,
            //   gameboy.LYCMatchTriggerSTAT,
            //   gameboy.mode2TriggerSTAT,
            //   gameboy.mode1TriggerSTAT,
            //   gameboy.mode0TriggerSTAT,
            //   gameboy.LCDisOn,
            //   gameboy.gfxWindowCHRBankPosition,
            //   gameboy.gfxWindowDisplay,
            //   gameboy.gfxSpriteShow,
            //   gameboy.gfxSpriteNormalHeight,
            //   gameboy.gfxBackgroundCHRBankPosition,
            //   gameboy.gfxBackgroundBankOffset,
            //   gameboy.TIMAEnabled,
            //   gameboy.DIVTicks,
            //   gameboy.LCDTicks,
            //   gameboy.timerTicks,
            //   gameboy.TACClocker,
            //   gameboy.serialTimer,
            //   gameboy.serialShiftTimer,
            //   gameboy.serialShiftTimerAllocated,
            //   gameboy.IRQEnableDelay,
            //   gameboy.cartridge.hasRTC &&
            //   gameboy.cartridge.mbc3.rtc.lastTime,
            //   gameboy.drewBlank,
            //   fromTypedArray(gameboy.frameBuffer),
            //   gameboy.bgEnabled,
            //   gameboy.BGPriorityEnabled,
            //   gameboy.audioController.channel1FrequencyTracker,
            //   gameboy.channel1FrequencyCounter,
            //   gameboy.channel1totalLength,
            //   gameboy.channel1envelopeVolume,
            //   gameboy.channel1envelopeType,
            //   gameboy.channel1envelopeSweeps,
            //   gameboy.channel1envelopeSweepsLast,
            //   gameboy.channel1consecutive,
            //   gameboy.channel1frequency,
            //   gameboy.channel1SweepFault,
            //   gameboy.channel1ShadowFrequency,
            //   gameboy.channel1timeSweep,
            //   gameboy.channel1lastTimeSweep,
            //   gameboy.channel1Swept,
            //   gameboy.channel1frequencySweepDivider,
            //   gameboy.channel1decreaseSweep,
            //   gameboy.channel2FrequencyTracker,
            //   gameboy.channel2FrequencyCounter,
            //   gameboy.channel2totalLength,
            //   gameboy.channel2envelopeVolume,
            //   gameboy.channel2envelopeType,
            //   gameboy.channel2envelopeSweeps,
            //   gameboy.channel2envelopeSweepsLast,
            //   gameboy.channel2consecutive,
            //   gameboy.channel2frequency,
            //   gameboy.channel3canPlay,
            //   gameboy.channel3totalLength,
            //   gameboy.channel3patternType,
            //   gameboy.channel3frequency,
            //   gameboy.channel3consecutive,
            //   fromTypedArray(gameboy.channel3PCM),
            //   gameboy.audioController.channel4FrequencyPeriod,
            //   gameboy.audioController.channel4lastSampleLookup,
            //   gameboy.channel4totalLength,
            //   gameboy.channel4envelopeVolume,
            //   gameboy.channel4currentVolume,
            //   gameboy.channel4envelopeType,
            //   gameboy.channel4envelopeSweeps,
            //   gameboy.channel4envelopeSweepsLast,
            //   gameboy.channel4consecutive,
            //   gameboy.channel4BitRange,
            //   gameboy.soundMasterEnabled,
            //   gameboy.audioController.VinLeftChannelMasterVolume,
            //   gameboy.audioController.VinRightChannelMasterVolume,
            //   gameboy.leftChannel1,
            //   gameboy.leftChannel2,
            //   gameboy.leftChannel3,
            //   gameboy.leftChannel4,
            //   gameboy.rightChannel1,
            //   gameboy.rightChannel2,
            //   gameboy.rightChannel3,
            //   gameboy.rightChannel4,
            //   gameboy.channel1currentSampleLeft,
            //   gameboy.channel1currentSampleRight,
            //   gameboy.channel2currentSampleLeft,
            //   gameboy.channel2currentSampleRight,
            //   gameboy.channel3currentSampleLeft,
            //   gameboy.channel3currentSampleRight,
            //   gameboy.channel4currentSampleLeft,
            //   gameboy.channel4currentSampleRight,
            //   gameboy.channel1currentSampleLeftSecondary,
            //   gameboy.channel1currentSampleRightSecondary,
            //   gameboy.channel2currentSampleLeftSecondary,
            //   gameboy.channel2currentSampleRightSecondary,
            //   gameboy.channel3currentSampleLeftSecondary,
            //   gameboy.channel3currentSampleRightSecondary,
            //   gameboy.channel4currentSampleLeftSecondary,
            //   gameboy.channel4currentSampleRightSecondary,
            //   gameboy.channel1currentSampleLeftTrimary,
            //   gameboy.channel1currentSampleRightTrimary,
            //   gameboy.channel2currentSampleLeftTrimary,
            //   gameboy.channel2currentSampleRightTrimary,
            //   gameboy.audioController.mixerOutputCache,
            //   gameboy.audioController.channel1DutyTracker,
            //   gameboy.audioController.channel1CachedDuty,
            //   gameboy.audioController.channel2DutyTracker,
            //   gameboy.audioController.channel2CachedDuty,
            //   gameboy.audioController.channel1Enabled,
            //   gameboy.audioController.channel2Enabled,
            //   gameboy.audioController.channel3Enabled,
            //   gameboy.audioController.channel4Enabled,
            //   gameboy.audioController.sequencerClocks,
            //   gameboy.audioController.sequencePosition,
            //   gameboy.channel3Counter,
            //   gameboy.audioController.channel4Counter,
            //   gameboy.audioController.cachedChannel3Sample,
            //   gameboy.audioController.cachedChannel4Sample,
            //   gameboy.channel3FrequencyPeriod,
            //   gameboy.channel3lastSampleLookup,
            //   gameboy.actualScanLine,
            //   gameboy.lastUnrenderedLine,
            //   gameboy.queuedScanLines,
            //   gameboy.cartridge.hasRTC &&
            //   gameboy.cartridge.mbc3.rtc.RTCisLatched,
            //   gameboy.cartridge.hasRTC &&
            //   gameboy.cartridge.mbc3.rtc.latchedSeconds,
            //   gameboy.cartridge.hasRTC &&
            //   gameboy.cartridge.mbc3.rtc.latchedMinutes,
            //   gameboy.cartridge.hasRTC &&
            //   gameboy.cartridge.mbc3.rtc.latchedHours,
            //   gameboy.cartridge.hasRTC &&
            //   gameboy.cartridge.mbc3.rtc.latchedLDays,
            //   gameboy.cartridge.hasRTC &&
            //   gameboy.cartridge.mbc3.rtc.latchedHDays,
            //   gameboy.cartridge.hasRTC &&
            //   gameboy.cartridge.mbc3.rtc.RTCSeconds,
            //   gameboy.cartridge.hasRTC &&
            //   gameboy.cartridge.mbc3.rtc.RTCMinutes,
            //   gameboy.cartridge.hasRTC &&
            //   gameboy.cartridge.mbc3.rtc.RTCHours,
            //   gameboy.cartridge.hasRTC &&
            //   gameboy.cartridge.mbc3.rtc.RTCDays,
            //   gameboy.cartridge.hasRTC &&
            //   gameboy.cartridge.mbc3.rtc.RTCDayOverFlow,
            //   gameboy.cartridge.hasRTC &&
            //   gameboy.cartridge.mbc3.rtc.RTCHALT,
            //   gameboy.usedBootROM,
            //   gameboy.skipPCIncrement,
            //   gameboy.STATTracker,
            //   gameboy.gbcRamBankPositionECHO,
            //   gameboy.windowY,
            //   gameboy.windowX,
            //   fromTypedArray(gameboy.gbcOBJRawPalette),
            //   fromTypedArray(gameboy.gbcBGRawPalette),
            //   fromTypedArray(gameboy.gbOBJPalette),
            //   fromTypedArray(gameboy.gbBGPalette),
            //   fromTypedArray(gameboy.gbcOBJPalette),
            //   fromTypedArray(gameboy.gbcBGPalette),
            //   fromTypedArray(gameboy.gbBGColorizedPalette),
            //   fromTypedArray(gameboy.gbOBJColorizedPalette),
            //   fromTypedArray(gameboy.cachedBGPaletteConversion),
            //   fromTypedArray(gameboy.cachedOBJPaletteConversion),
            //   fromTypedArray(gameboy.BGCHRBank1),
            //   fromTypedArray(gameboy.BGCHRBank2),
            //   gameboy.haltPostClocks,
            //   gameboy.interruptsRequested,
            //   gameboy.interruptsEnabled,
            //   gameboy.remainingClocks,
            //   gameboy.colorizedGBPalettes,
            //   gameboy.backgroundY,
            //   gameboy.backgroundX,
            //   gameboy.CPUStopped,
            //   gameboy.audioController.audioClocksUntilNextEvent,
            //   gameboy.audioController.audioClocksUntilNextEventCounter
            // ];
          }
        }, {
          key: "load",
          value: function load(state) {
            var index = 0;
            var gameboy = this.gameboy;
          }
        }, {
          key: "loadOld",
          value: function loadOld(state) {
            var index = 0;
            var gameboy = this.gameboy;

            gameboy.inBootstrap = state[index++];
            gameboy.registerA = state[index++];
            gameboy.FZero = state[index++];
            gameboy.FSubtract = state[index++];
            gameboy.FHalfCarry = state[index++];
            gameboy.FCarry = state[index++];
            gameboy.registerB = state[index++];
            gameboy.registerC = state[index++];
            gameboy.registerD = state[index++];
            gameboy.registerE = state[index++];
            gameboy.registersHL = state[index++];
            gameboy.stackPointer = state[index++];
            gameboy.programCounter = state[index++];
            gameboy.halt = state[index++];
            gameboy.IME = state[index++];
            gameboy.hdmaRunning = state[index++];
            gameboy.CPUTicks = state[index++];
            gameboy.doubleSpeedShifter = state[index++];
            gameboy.memory = toTypedArray(state[index++], "uint8");
            gameboy.VRAM = toTypedArray(state[index++], "uint8");
            gameboy.currVRAMBank = state[index++];
            gameboy.GBCMemory = toTypedArray(state[index++], "uint8");
            gameboy.useGBCMode = state[index++];
            gameboy.gbcRamBank = state[index++];
            gameboy.gbcRamBankPosition = state[index++];
            gameboy.ROMBank1Offset = state[index++];
            if (gameboy.cartridge) {
              gameboy.cartridge.mbc.currentROMBank = state[index++];
            } else {
              index++;
            }
            gameboy.modeSTAT = state[index++];
            gameboy.LYCMatchTriggerSTAT = state[index++];
            gameboy.mode2TriggerSTAT = state[index++];
            gameboy.mode1TriggerSTAT = state[index++];
            gameboy.mode0TriggerSTAT = state[index++];
            gameboy.LCDisOn = state[index++];
            gameboy.gfxWindowCHRBankPosition = state[index++];
            gameboy.gfxWindowDisplay = state[index++];
            gameboy.gfxSpriteShow = state[index++];
            gameboy.gfxSpriteNormalHeight = state[index++];
            gameboy.gfxBackgroundCHRBankPosition = state[index++];
            gameboy.gfxBackgroundBankOffset = state[index++];
            gameboy.TIMAEnabled = state[index++];
            gameboy.DIVTicks = state[index++];
            gameboy.LCDTicks = state[index++];
            gameboy.timerTicks = state[index++];
            gameboy.TACClocker = state[index++];
            gameboy.serialTimer = state[index++];
            gameboy.serialShiftTimer = state[index++];
            gameboy.serialShiftTimerAllocated = state[index++];
            gameboy.IRQEnableDelay = state[index++];
            if (gameboy.cartridge && gameboy.cartridge.hasRTC) {
              gameboy.cartridge.mbc3.rtc.lastTime = state[index++];
            } else {
              index++;
            }
            gameboy.drewBlank = state[index++];
            gameboy.frameBuffer = toTypedArray(state[index++], "int32");
            gameboy.bgEnabled = state[index++];
            gameboy.BGPriorityEnabled = state[index++];
            gameboy.audioController.channel1FrequencyTracker = state[index++];
            gameboy.channel1FrequencyCounter = state[index++];
            gameboy.channel1totalLength = state[index++];
            gameboy.channel1envelopeVolume = state[index++];
            gameboy.channel1envelopeType = state[index++];
            gameboy.channel1envelopeSweeps = state[index++];
            gameboy.channel1envelopeSweepsLast = state[index++];
            gameboy.channel1consecutive = state[index++];
            gameboy.channel1frequency = state[index++];
            gameboy.channel1SweepFault = state[index++];
            gameboy.channel1ShadowFrequency = state[index++];
            gameboy.channel1timeSweep = state[index++];
            gameboy.channel1lastTimeSweep = state[index++];
            gameboy.channel1Swept = state[index++];
            gameboy.channel1frequencySweepDivider = state[index++];
            gameboy.channel1decreaseSweep = state[index++];
            gameboy.channel2FrequencyTracker = state[index++];
            gameboy.channel2FrequencyCounter = state[index++];
            gameboy.channel2totalLength = state[index++];
            gameboy.channel2envelopeVolume = state[index++];
            gameboy.channel2envelopeType = state[index++];
            gameboy.channel2envelopeSweeps = state[index++];
            gameboy.channel2envelopeSweepsLast = state[index++];
            gameboy.channel2consecutive = state[index++];
            gameboy.channel2frequency = state[index++];
            gameboy.channel3canPlay = state[index++];
            gameboy.channel3totalLength = state[index++];
            gameboy.channel3patternType = state[index++];
            gameboy.channel3frequency = state[index++];
            gameboy.channel3consecutive = state[index++];
            gameboy.channel3PCM = toTypedArray(state[index++], "int8");
            gameboy.audioController.channel4FrequencyPeriod = state[index++];
            gameboy.audioController.channel4lastSampleLookup = state[index++];
            gameboy.channel4totalLength = state[index++];
            gameboy.channel4envelopeVolume = state[index++];
            gameboy.channel4currentVolume = state[index++];
            gameboy.channel4envelopeType = state[index++];
            gameboy.channel4envelopeSweeps = state[index++];
            gameboy.channel4envelopeSweepsLast = state[index++];
            gameboy.channel4consecutive = state[index++];
            gameboy.channel4BitRange = state[index++];
            gameboy.soundMasterEnabled = state[index++];
            gameboy.audioController.VinLeftChannelMasterVolume = state[index++];
            gameboy.audioController.VinRightChannelMasterVolume = state[index++];
            gameboy.leftChannel1 = state[index++];
            gameboy.leftChannel2 = state[index++];
            gameboy.leftChannel3 = state[index++];
            gameboy.leftChannel4 = state[index++];
            gameboy.rightChannel1 = state[index++];
            gameboy.rightChannel2 = state[index++];
            gameboy.rightChannel3 = state[index++];
            gameboy.rightChannel4 = state[index++];
            gameboy.channel1currentSampleLeft = state[index++];
            gameboy.channel1currentSampleRight = state[index++];
            gameboy.channel2currentSampleLeft = state[index++];
            gameboy.channel2currentSampleRight = state[index++];
            gameboy.channel3currentSampleLeft = state[index++];
            gameboy.channel3currentSampleRight = state[index++];
            gameboy.channel4currentSampleLeft = state[index++];
            gameboy.channel4currentSampleRight = state[index++];
            gameboy.channel1currentSampleLeftSecondary = state[index++];
            gameboy.channel1currentSampleRightSecondary = state[index++];
            gameboy.channel2currentSampleLeftSecondary = state[index++];
            gameboy.channel2currentSampleRightSecondary = state[index++];
            gameboy.channel3currentSampleLeftSecondary = state[index++];
            gameboy.channel3currentSampleRightSecondary = state[index++];
            gameboy.channel4currentSampleLeftSecondary = state[index++];
            gameboy.channel4currentSampleRightSecondary = state[index++];
            gameboy.channel1currentSampleLeftTrimary = state[index++];
            gameboy.channel1currentSampleRightTrimary = state[index++];
            gameboy.channel2currentSampleLeftTrimary = state[index++];
            gameboy.channel2currentSampleRightTrimary = state[index++];
            gameboy.audioController.mixerOutputCache = state[index++];
            gameboy.audioController.channel1DutyTracker = state[index++];
            gameboy.audioController.channel1CachedDuty = state[index++];
            gameboy.audioController.channel2DutyTracker = state[index++];
            gameboy.audioController.channel2CachedDuty = state[index++];
            gameboy.audioController.channel1Enabled = state[index++];
            gameboy.audioController.channel2Enabled = state[index++];
            gameboy.audioController.channel3Enabled = state[index++];
            gameboy.audioController.channel4Enabled = state[index++];
            gameboy.audioController.sequencerClocks = state[index++];
            gameboy.audioController.sequencePosition = state[index++];
            gameboy.channel3Counter = state[index++];
            gameboy.audioController.channel4Counter = state[index++];
            gameboy.audioController.cachedChannel3Sample = state[index++];
            gameboy.audioController.cachedChannel4Sample = state[index++];
            gameboy.channel3FrequencyPeriod = state[index++];
            gameboy.channel3lastSampleLookup = state[index++];
            gameboy.actualScanLine = state[index++];
            gameboy.lastUnrenderedLine = state[index++];
            gameboy.queuedScanLines = state[index++];
            if (gameboy.cartridge && gameboy.cartridge.hasRTC) {
              gameboy.cartridge.mbc3.rtc.RTCisLatched = state[index++];
              gameboy.cartridge.mbc3.rtc.latchedSeconds = state[index++];
              gameboy.cartridge.mbc3.rtc.latchedMinutes = state[index++];
              gameboy.cartridge.mbc3.rtc.latchedHours = state[index++];
              gameboy.cartridge.mbc3.rtc.latchedLDays = state[index++];
              gameboy.cartridge.mbc3.rtc.latchedHDays = state[index++];
              gameboy.cartridge.mbc3.rtc.RTCSeconds = state[index++];
              gameboy.cartridge.mbc3.rtc.RTCMinutes = state[index++];
              gameboy.cartridge.mbc3.rtc.RTCHours = state[index++];
              gameboy.cartridge.mbc3.rtc.RTCDays = state[index++];
              gameboy.cartridge.mbc3.rtc.RTCDayOverFlow = state[index++];
              gameboy.cartridge.mbc3.rtc.RTCHALT = state[index++];
            } else {
              index += 12;
            }
            gameboy.usedBootROM = state[index++];
            gameboy.skipPCIncrement = state[index++];
            gameboy.STATTracker = state[index++];
            gameboy.gbcRamBankPositionECHO = state[index++];
            gameboy.windowY = state[index++];
            gameboy.windowX = state[index++];
            gameboy.gbcOBJRawPalette = toTypedArray(state[index++], "uint8");
            gameboy.gbcBGRawPalette = toTypedArray(state[index++], "uint8");
            gameboy.gbOBJPalette = toTypedArray(state[index++], "int32");
            gameboy.gbBGPalette = toTypedArray(state[index++], "int32");
            gameboy.gbcOBJPalette = toTypedArray(state[index++], "int32");
            gameboy.gbcBGPalette = toTypedArray(state[index++], "int32");
            gameboy.gbBGColorizedPalette = toTypedArray(state[index++], "int32");
            gameboy.gbOBJColorizedPalette = toTypedArray(state[index++], "int32");
            gameboy.cachedBGPaletteConversion = toTypedArray(state[index++], "int32");
            gameboy.cachedOBJPaletteConversion = toTypedArray(state[index++], "int32");
            gameboy.BGCHRBank1 = toTypedArray(state[index++], "uint8");
            gameboy.BGCHRBank2 = toTypedArray(state[index++], "uint8");
            gameboy.haltPostClocks = state[index++];
            gameboy.interruptsRequested = state[index++];
            gameboy.interruptsEnabled = state[index++];
            gameboy.checkIRQMatching();
            gameboy.remainingClocks = state[index++];
            gameboy.colorizedGBPalettes = state[index++];
            gameboy.backgroundY = state[index++];
            gameboy.backgroundX = state[index++];
            gameboy.CPUStopped = state[index++];
            gameboy.audioController.audioClocksUntilNextEvent = state[index++];
            gameboy.audioController.audioClocksUntilNextEventCounter = state[index];
          }
        }]);

        return StateManager;
      }();

      Joypad = function () {
        // Joypad State (two four-bit states actually)

        function Joypad(gameboy) {
          _classCallCheck(this, Joypad);

          this.initialValue = 0xf;
          this.value = 0xff;

          this.gameboy = gameboy;
        } // for memory


        _createClass(Joypad, [{
          key: "down",
          value: function down(key) {
            this.value &= 0xff ^ 1 << key;
            if (this.gameboy.cartridge && !this.gameboy.cartridge.useGBCMode && (!this.gameboy.usedBootROM || !this.gameboy.usedGBCBootROM)) {
              this.gameboy.interruptsRequested |= 0x10; // A real GBC doesn't set this!
              this.gameboy.remainingClocks = 0;
              this.gameboy.checkIRQMatching();
            }

            this.writeToMemory();
          }
        }, {
          key: "up",
          value: function up(key) {
            this.value |= 1 << key;
            this.writeToMemory();
          }
        }, {
          key: "writeToMemory",
          value: function writeToMemory() {
            this.gameboy.memory[0xff00] = (this.gameboy.memory[0xff00] & 0x30) + (((this.gameboy.memory[0xff00] & 0x20) === 0 ? this.value >> 4 : 0xf) & ((this.gameboy.memory[0xff00] & 0x10) === 0 ? this.value & 0xf : 0xf));
            this.gameboy.CPUStopped = false;
          }
        }]);

        return Joypad;
      }();

      MemoryWriter = function () {
        function MemoryWriter(_ref) {
          var data = _ref.data,
              gameboy = _ref.gameboy;

          _classCallCheck(this, MemoryWriter);

          this.data = data;
          this.gameboy = gameboy;
        }

        _createClass(MemoryWriter, [{
          key: "write",
          value: function write(address, data) {
            return this.gameboy.memoryWriter[address].apply(this.gameboy, [address, data]);
          }
        }]);

        return MemoryWriter;
      }();

      MemoryReader = function () {
        function MemoryReader(_ref) {
          var data = _ref.data,
              gameboy = _ref.gameboy;

          _classCallCheck(this, MemoryReader);

          this.data = data;
          this.gameboy = gameboy;
        }

        _createClass(MemoryReader, [{
          key: "read",
          value: function read(address) {
            return this.gameboy.memoryReader[address].apply(this.gameboy, [address]);
          }
        }]);

        return MemoryReader;
      }();

      Memory = function () {
        function Memory(gameboy) {
          _classCallCheck(this, Memory);

          this.data = getTypedArray(0x10000, 0, "uint8");

          this.gameboy = gameboy;
          this.writer = new MemoryWriter({
            gameboy: gameboy,
            data: this.data
          });
          this.reader = new MemoryReader({
            gameboy: gameboy,
            data: this.data
          });
        }

        _createClass(Memory, [{
          key: "write",
          value: function write(address, data) {
            return this.writer.write(address, data);
          }
        }, {
          key: "read",
          value: function read(address) {
            return this.reader.read(address);
          }
        }]);

        return Memory;
      }();

      CPU = function () {
        // Clocking per iteration rounding catch.
        // Relative CPU clocking to speed set base.
        // Times for how many instructions to execute before ending the loop.
        function CPU() {
          _classCallCheck(this, CPU);

          this.speed = 1;
          this.ticks = 0;
          this.cyclesTotal = 0;
          this.cyclesTotalBase = 0;
          this.cyclesTotalCurrent = 0;
          this.cyclesTotalRoundoff = 0;
          this.baseCyclesPerIteration = 0;
          this.totalLinesPassed = 0;

          this.calculateTimings();
        } // CPU clocks per iteration at 1x speed.
        // Relative CPU clocking to speed set, the directly used value.
        // Relative CPU clocking to speed set, rounded appropriately.


        _createClass(CPU, [{
          key: "calculateTimings",
          value: function calculateTimings() {
            this.clocksPerSecond = this.speed * 0x400000;
            this.baseCyclesPerIteration = this.clocksPerSecond / 1000 * settings.runInterval;
            this.cyclesTotalRoundoff = this.baseCyclesPerIteration % 4;
            this.cyclesTotalBase = this.cyclesTotal = this.baseCyclesPerIteration - this.cyclesTotalRoundoff | 0;
            this.cyclesTotalCurrent = 0;
          }
        }, {
          key: "setSpeed",
          value: function setSpeed(speed) {
            this.speed = speed;
            this.calculateTimings();
          }
        }]);

        return CPU;
      }();

      GameBoyCore.prototype.loadState = function (state) {
        this.stateManager.load(state);

        this.initializeReferencesFromSaveState();
        this.memoryReadJumpCompile();
        this.memoryWriteJumpCompile();
        this.lcd.init();
        this.initSound();
        this.audioController.noiseSampleTable = this.audioController.channel4BitRange === 0x7fff ? this.audioController.LSFR15Table : this.audioController.LSFR7Table;
        this.audioController.channel4VolumeShifter = this.audioController.channel4BitRange === 0x7fff ? 15 : 7;
      };
      GameBoyCore.prototype.connectCartridge = function (cartridge) {
        cartridge.connect(this);
        this.cartridge = cartridge;
        this.cartridge.interpret();
      };
      GameBoyCore.prototype.start = function (cartridge) {
        var _this = this;

        this.init();
        this.connectCartridge(cartridge);
        this.cartridge.mbc.setupROM();

        if (this.cartridge && this.cartridge.mbc) {
          this.cartridge.mbc.on("ramWrite", function () {
            _this.events.emit("sramWrite");
          });
        }

        if (!this.usedBootROM) {
          this.inBootstrap = false;
          this.setupRAM();
          this.initSkipBootstrap();
        } else {
          this.setupRAM();
          this.initBootstrap();
        }

        // Check for IRQ matching upon initialization:
        this.checkIRQMatching();
      };
      GameBoyCore.prototype.init = function () {
        this.stateManager.init();
        this.initMemory(); // Write the startup memory.
        this.lcd.init(); // Initialize the graphics.
        this.initSound(); // Sound object initialization.
      };
      GameBoyCore.prototype.setupRAM = function () {
        this.cartridge.setupRAM();

        // Setup the RAM for GBC mode.
        if (this.cartridge.useGBCMode) {
          this.VRAM = getTypedArray(0x2000, 0, "uint8");
          this.GBCMemory = getTypedArray(0x7000, 0, "uint8");
        }

        this.memoryReadJumpCompile();
        this.memoryWriteJumpCompile();

        this.initializeModeSpecificArrays();
      };
      GameBoyCore.prototype.initMemory = function () {
        // Initialize the RAM:
        this.memory = getTypedArray(0x10000, 0, "uint8"); // TODO: remove
        this.audioController.setMemory(this.memory);
        this.memoryNew.data = this.memory;
        this.frameBuffer = getTypedArray(23040, 0xf8f8f8, "int32");
        this.BGCHRBank1 = getTypedArray(0x800, 0, "uint8");
        this.audioController.initMemory();
      };
      GameBoyCore.prototype.generateCacheArray = function (tileAmount) {
        var tileArray = [];
        var tileNumber = 0;
        while (tileNumber < tileAmount) {
          tileArray[tileNumber++] = getTypedArray(64, 0, "uint8");
        }
        return tileArray;
      };
      GameBoyCore.prototype.initSkipBootstrap = function () {
        // Fill in the boot ROM set register values
        // Default values to the GB boot ROM values, then fill in the GBC boot ROM values after ROM loading
        var index = 0xff;
        while (index >= 0) {
          if (index >= 0x30 && index < 0x40) {
            this.memoryWrite(0xff00 | index, PostBootRegisterState[index]);
          } else {
            switch (index) {
              case 0x00:
              case 0x01:
              case 0x02:
              case 0x05:
              case 0x07:
              case 0x0f:
              case 0xff:
                this.memoryWrite(0xff00 | index, PostBootRegisterState[index]);
                break;
              default:
                this.memory[0xff00 | index] = PostBootRegisterState[index];
            }
          }
          --index;
        }

        if (this.cartridge.useGBCMode) {
          this.memory[0xff6c] = 0xfe;
          this.memory[0xff74] = 0xfe;
        } else {
          this.memory[0xff48] = 0xff;
          this.memory[0xff49] = 0xff;
          this.memory[0xff6c] = 0xff;
          this.memory[0xff74] = 0xff;
        }

        // Start as an unset device:
        console.log("Starting without the GBC boot ROM.");
        this.registerA = this.cartridge.useGBCMode ? 0x11 : 0x1;
        this.registerB = 0;
        this.registerC = 0x13;
        this.registerD = 0;
        this.registerE = 0xd8;
        this.FZero = true;
        this.FSubtract = false;
        this.FHalfCarry = true;
        this.FCarry = true;
        this.registersHL = 0x014d;
        this.LCDCONTROL = this.LINECONTROL;
        this.IME = false;
        this.IRQLineMatched = 0;
        this.interruptsRequested = 225;
        this.interruptsEnabled = 0;
        this.hdmaRunning = false;
        this.CPUTicks = 12;
        this.STATTracker = 0;
        this.modeSTAT = 1;
        this.spriteCount = 252;
        this.LYCMatchTriggerSTAT = false;
        this.mode2TriggerSTAT = false;
        this.mode1TriggerSTAT = false;
        this.mode0TriggerSTAT = false;
        this.LCDisOn = true;
        this.audioController.channel1FrequencyTracker = 0x2000;
        this.audioController.channel1DutyTracker = 0;
        this.audioController.channel1CachedDuty = dutyLookup[2];
        this.audioController.channel1totalLength = 0;
        this.audioController.channel1envelopeVolume = 0;
        this.audioController.channel1envelopeType = false;
        this.audioController.channel1envelopeSweeps = 0;
        this.audioController.channel1envelopeSweepsLast = 0;
        this.audioController.channel1consecutive = true;
        this.audioController.channel1frequency = 1985;
        this.audioController.channel1SweepFault = true;
        this.audioController.channel1ShadowFrequency = 1985;
        this.audioController.channel1timeSweep = 1;
        this.audioController.channel1lastTimeSweep = 0;
        this.audioController.channel1Swept = false;
        this.audioController.channel1frequencySweepDivider = 0;
        this.audioController.channel1decreaseSweep = false;
        this.audioController.channel2FrequencyTracker = 0x2000;
        this.audioController.channel2DutyTracker = 0;
        this.audioController.channel2CachedDuty = dutyLookup[2];
        this.audioController.channel2totalLength = 0;
        this.audioController.channel2envelopeVolume = 0;
        this.audioController.channel2envelopeType = false;
        this.audioController.channel2envelopeSweeps = 0;
        this.audioController.channel2envelopeSweepsLast = 0;
        this.audioController.channel2consecutive = true;
        this.audioController.channel2frequency = 0;
        this.audioController.channel3canPlay = false;
        this.audioController.channel3totalLength = 0;
        this.audioController.channel3patternType = 4;
        this.audioController.channel3frequency = 0;
        this.audioController.channel3consecutive = true;
        this.audioController.channel3Counter = 0x418;
        this.audioController.channel4FrequencyPeriod = 8;
        this.audioController.channel4totalLength = 0;
        this.audioController.channel4envelopeVolume = 0;
        this.audioController.channel4currentVolume = 0;
        this.audioController.channel4envelopeType = false;
        this.audioController.channel4envelopeSweeps = 0;
        this.audioController.channel4envelopeSweepsLast = 0;
        this.audioController.channel4consecutive = true;
        this.audioController.channel4BitRange = 0x7fff;
        this.audioController.channel4VolumeShifter = 15;
        this.audioController.channel1FrequencyCounter = 0x200;
        this.audioController.channel2FrequencyCounter = 0x200;
        this.audioController.channel3Counter = 0x800;
        this.audioController.channel3FrequencyPeriod = 0x800;
        this.audioController.channel3lastSampleLookup = 0;
        this.audioController.channel4lastSampleLookup = 0;
        this.audioController.VinLeftChannelMasterVolume = 8;
        this.audioController.VinRightChannelMasterVolume = 8;
        this.soundMasterEnabled = true;
        this.audioController.leftChannel1 = true;
        this.audioController.leftChannel2 = true;
        this.audioController.leftChannel3 = true;
        this.audioController.leftChannel4 = true;
        this.audioController.rightChannel1 = true;
        this.audioController.rightChannel2 = true;
        this.audioController.rightChannel3 = false;
        this.audioController.rightChannel4 = false;
        this.DIVTicks = 27044;
        this.LCDTicks = 160;
        this.timerTicks = 0;
        this.TIMAEnabled = false;
        this.TACClocker = 1024;
        this.serialTimer = 0;
        this.serialShiftTimer = 0;
        this.serialShiftTimerAllocated = 0;
        this.IRQEnableDelay = 0;
        this.actualScanLine = 144;
        this.lastUnrenderedLine = 0;
        this.gfxWindowDisplay = false;
        this.gfxSpriteShow = false;
        this.gfxSpriteNormalHeight = true;
        this.bgEnabled = true;
        this.BGPriorityEnabled = true;
        this.gfxWindowCHRBankPosition = 0;
        this.gfxBackgroundCHRBankPosition = 0;
        this.gfxBackgroundBankOffset = 0;
        this.windowY = 0;
        this.windowX = 0;
        this.drewBlank = 0;
        this.midScanlineOffset = -1;
        this.currentX = 0;
      };
      GameBoyCore.prototype.initBootstrap = function () {
        console.log("Starting selected boot ROM");

        this.programCounter = 0;
        this.stackPointer = 0;
        this.IME = false;
        this.LCDTicks = 0;
        this.DIVTicks = 0;
        this.registerA = 0;
        this.registerB = 0;
        this.registerC = 0;
        this.registerD = 0;
        this.registerE = 0;
        this.FZero = this.FSubtract = this.FHalfCarry = this.FCarry = false;
        this.registersHL = 0;
        this.audioController.leftChannel1 = false;
        this.audioController.leftChannel2 = false;
        this.audioController.leftChannel3 = false;
        this.audioController.leftChannel4 = false;
        this.audioController.rightChannel1 = false;
        this.audioController.rightChannel2 = false;
        this.audioController.rightChannel3 = false;
        this.audioController.rightChannel4 = false;
        this.audioController.channel2frequency = this.audioController.channel1frequency = 0;
        this.audioController.channel4consecutive = this.audioController.channel2consecutive = this.audioController.channel1consecutive = false;
        this.audioController.VinLeftChannelMasterVolume = 8;
        this.audioController.VinRightChannelMasterVolume = 8;
        this.memory[0xff00] = this.joypad.initialValue;
      };
      GameBoyCore.prototype.disableBootROM = function () {
        // Remove any traces of the boot ROM from ROM memory.
        var index = 0;
        while (index < 0x100) {
          this.memory[index] = this.cartridge.rom.getByte(index); // Replace the GameBoy or GameBoy Color boot ROM with the game ROM.
          ++index;
        }

        if (this.usedGBCBootROM) {
          // Remove any traces of the boot ROM from ROM memory.
          for (index = 0x200; index < 0x900; ++index) {
            this.memory[index] = this.cartridge.rom.getByte(index); // Replace the GameBoy Color boot ROM with the game ROM.
          }
          if (!this.cartridge.useGBCMode) {
            // Clean up the post-boot (GB mode only) state:
            this.adjustGBCtoGBMode();
          } else {
            this.recompileBootIOWriteHandling();
          }
        } else {
          this.recompileBootIOWriteHandling();
        }
      };
      GameBoyCore.prototype.setSpeed = function (speed) {
        this.cpu.setSpeed(speed);
        this.initSound();
      };
      GameBoyCore.prototype.initSound = function () {
        this.audioController.connectDevice(this.audioDevice);
        this.audioController.setVolume(settings.soundOn ? settings.soundVolume : 0);
        this.audioController.initBuffer();
      };
      GameBoyCore.prototype.writeChannel3RAM = function (address, data) {
        if (this.audioController.channel3canPlay) {
          this.audioController.runJIT();
          //address = this.audioController.channel3lastSampleLookup >> 1;
        }
        this.memory[0xff30 | address] = data;
        address <<= 1;
        this.audioController.channel3PCM[address] = data >> 4;
        this.audioController.channel3PCM[address | 1] = data & 0xf;
      };
      GameBoyCore.prototype.run = function () {
        // The preprocessing before the actual iteration loop:
        if ((this.stopEmulator & 2) === 0) {
          if ((this.stopEmulator & 1) === 1) {
            if (!this.CPUStopped) {
              this.stopEmulator = 0;

              this.audioController.adjustUnderrun();

              if (this.cartridge.hasRTC) {
                this.cartridge.mbc.rtc.updateClock();
              }

              if (!this.halt) {
                this.executeIteration();
              } else {
                // Finish the HALT rundown execution.
                this.CPUTicks = 0;
                this.calculateHALTPeriod();

                if (!this.halt) {
                  this.executeIteration();
                } else {
                  this.updateCore();
                  this.iterationEndRoutine();
                }
              }
              // Request the graphics target to be updated:
              this.lcd.requestDraw();
            } else {
              this.audioController.adjustUnderrun();
              this.audioController.audioTicks += this.cpu.cyclesTotal;
              this.audioController.runJIT();
              this.stopEmulator |= 1; // End current loop.
            }
          } else {
            // We can only get here if there was an internal error, but the loop was restarted.
            console.error("Iterator restarted a faulted core.");
          }
        }
      };
      GameBoyCore.prototype.executeIteration = function () {
        // Iterate the interpreter loop
        while (this.stopEmulator === 0) {
          // Interrupt Arming:
          switch (this.IRQEnableDelay) {
            case 1:
              this.IME = true;
              this.checkIRQMatching();
              --this.IRQEnableDelay;
              break;
            case 2:
              --this.IRQEnableDelay;
              break;
            default:
              break;
          }
          //Is an IRQ set to fire?:
          if (this.IRQLineMatched > 0) {
            //IME is true and and interrupt was matched:
            this.launchIRQ();
          }
          //Fetch the current opcode:
          var operationCode = this.memoryReader[this.programCounter].apply(this, [this.programCounter]);
          //Increment the program counter to the next instruction:
          this.programCounter = this.programCounter + 1 & 0xffff;
          //Check for the program counter quirk:
          if (this.skipPCIncrement) {
            this.programCounter = this.programCounter - 1 & 0xffff;
            this.skipPCIncrement = false;
          }
          //Get how many CPU cycles the current instruction counts for:
          this.CPUTicks = TickTable[operationCode];

          //Execute the current instruction:
          mainInstructions[operationCode].apply(this);

          //Update the state (Inlined updateCoreFull manually here):
          //Update the clocking for the LCD emulation:
          var timedTicks = this.CPUTicks >> this.doubleSpeedShifter;
          this.LCDTicks += timedTicks; //LCD Timing
          this.LCDCONTROL[this.actualScanLine](this); //Scan Line and STAT Mode Control

          //Single-speed relative timing for A/V emulation:
          this.audioController.audioTicks += timedTicks; //Audio Timing
          this.cpu.ticks += timedTicks; //Emulator Timing
          //CPU Timers:
          this.DIVTicks += this.CPUTicks; //DIV Timing
          if (this.TIMAEnabled) {
            //TIMA Timing
            this.timerTicks += this.CPUTicks;
            while (this.timerTicks >= this.TACClocker) {
              this.timerTicks -= this.TACClocker;
              if (++this.memory[0xff05] === 0x100) {
                this.memory[0xff05] = this.memory[0xff06];
                this.interruptsRequested |= 0x4;
                this.checkIRQMatching();
              }
            }
          }
          if (this.serialTimer > 0) {
            //Serial Timing
            //IRQ Counter:
            this.serialTimer -= this.CPUTicks;
            if (this.serialTimer <= 0) {
              this.interruptsRequested |= 0x8;
              this.checkIRQMatching();
            }
            //Bit Shit Counter:
            this.serialShiftTimer -= this.CPUTicks;
            if (this.serialShiftTimer <= 0) {
              this.serialShiftTimer = this.serialShiftTimerAllocated;
              this.memory[0xff01] = this.memory[0xff01] << 1 & 0xfe | 0x01; // We could shift in actual link data here if we were to implement such!!!
            }
          }
          //End of iteration routine:
          if (this.cpu.ticks >= this.cpu.cyclesTotal) {
            this.iterationEndRoutine();
          }
        }
      };
      GameBoyCore.prototype.iterationEndRoutine = function () {
        if ((this.stopEmulator & 0x1) === 0) {
          this.audioController.runJIT(); //Make sure we at least output once per iteration.
          //Update DIV Alignment (Integer overflow safety):
          this.memory[0xff04] = this.memory[0xff04] + (this.DIVTicks >> 8) & 0xff;
          this.DIVTicks &= 0xff;
          //Update emulator flags:
          this.stopEmulator |= 1; //End current loop.
          this.cpu.ticks -= this.cpu.cyclesTotal;
          this.cpu.cyclesTotalCurrent += this.cpu.cyclesTotalRoundoff;
          this.recalculateIterationClockLimit();
        }
      };
      GameBoyCore.prototype.handleSTOP = function () {
        this.CPUStopped = true; //Stop CPU until joypad input changes.
        this.iterationEndRoutine();
        if (this.cpu.ticks < 0) {
          this.audioController.audioTicks -= this.cpu.ticks;
          this.audioController.runJIT();
        }
      };
      GameBoyCore.prototype.recalculateIterationClockLimit = function () {
        var endModulus = this.cpu.cyclesTotalCurrent % 4;
        this.cpu.cyclesTotal = this.cpu.cyclesTotalBase + this.cpu.cyclesTotalCurrent - endModulus;
        this.cpu.cyclesTotalCurrent = endModulus;
      };
      GameBoyCore.prototype.scanLineMode2 = function () {
        //OAM Search Period
        if (this.STATTracker !== 1) {
          if (this.mode2TriggerSTAT) {
            this.interruptsRequested |= 0x2;
            this.checkIRQMatching();
          }
          this.STATTracker = 1;
          this.modeSTAT = 2;
        }
      };
      GameBoyCore.prototype.scanLineMode3 = function () {
        //Scan Line Drawing Period
        if (this.modeSTAT !== 3) {
          if (this.STATTracker === 0 && this.mode2TriggerSTAT) {
            this.interruptsRequested |= 0x2;
            this.checkIRQMatching();
          }
          this.STATTracker = 1;
          this.modeSTAT = 3;
        }
      };
      GameBoyCore.prototype.scanLineMode0 = function () {
        //Horizontal Blanking Period
        if (this.modeSTAT !== 0) {
          if (this.STATTracker !== 2) {
            if (this.STATTracker === 0) {
              if (this.mode2TriggerSTAT) {
                this.interruptsRequested |= 0x2;
                this.checkIRQMatching();
              }
              this.modeSTAT = 3;
            }
            this.incrementScanLineQueue();
            this.updateSpriteCount(this.actualScanLine);
            this.STATTracker = 2;
          }
          if (this.LCDTicks >= this.spriteCount) {
            if (this.hdmaRunning) {
              this.executeHDMA();
            }
            if (this.mode0TriggerSTAT) {
              this.interruptsRequested |= 0x2;
              this.checkIRQMatching();
            }
            this.STATTracker = 3;
            this.modeSTAT = 0;
          }
        }
      };
      GameBoyCore.prototype.clocksUntilLYCMatch = function () {
        if (this.memory[0xff45] !== 0) {
          if (this.memory[0xff45] > this.actualScanLine) {
            return 456 * (this.memory[0xff45] - this.actualScanLine);
          }
          return 456 * (154 - this.actualScanLine + this.memory[0xff45]);
        }
        return 456 * (this.actualScanLine === 153 && this.memory[0xff44] === 0 ? 154 : 153 - this.actualScanLine) + 8;
      };
      GameBoyCore.prototype.clocksUntilMode0 = function () {
        switch (this.modeSTAT) {
          case 0:
            if (this.actualScanLine === 143) {
              this.updateSpriteCount(0);
              return this.spriteCount + 5016;
            }
            this.updateSpriteCount(this.actualScanLine + 1);
            return this.spriteCount + 456;
          case 2:
          case 3:
            this.updateSpriteCount(this.actualScanLine);
            return this.spriteCount;
          case 1:
            this.updateSpriteCount(0);
            return this.spriteCount + 456 * (154 - this.actualScanLine);
        }
      };
      GameBoyCore.prototype.updateSpriteCount = function (line) {
        this.spriteCount = 252;
        if (this.cartridge.useGBCMode && this.gfxSpriteShow) {
          //Is the window enabled and are we in CGB mode?
          var lineAdjusted = line + 0x10;
          var yoffset = 0;
          var yCap = this.gfxSpriteNormalHeight ? 0x8 : 0x10;
          for (var OAMAddress = 0xfe00; OAMAddress < 0xfea0 && this.spriteCount < 312; OAMAddress += 4) {
            yoffset = lineAdjusted - this.memory[OAMAddress];
            if (yoffset > -1 && yoffset < yCap) {
              this.spriteCount += 6;
            }
          }
        }
      };
      GameBoyCore.prototype.matchLYC = function () {
        //LYC Register Compare
        if (this.memory[0xff44] === this.memory[0xff45]) {
          this.memory[0xff41] |= 0x04;
          if (this.LYCMatchTriggerSTAT) {
            this.interruptsRequested |= 0x2;
            this.checkIRQMatching();
          }
        } else {
          this.memory[0xff41] &= 0x7b;
        }
      };
      GameBoyCore.prototype.updateCore = function () {
        //Update the clocking for the LCD emulation:
        this.LCDTicks += this.CPUTicks >> this.doubleSpeedShifter; // LCD Timing
        this.LCDCONTROL[this.actualScanLine](this); //Scan Line and STAT Mode Control
        //Single-speed relative timing for A/V emulation:
        var timedTicks = this.CPUTicks >> this.doubleSpeedShifter; // CPU clocking can be updated from the LCD handling.
        this.audioController.audioTicks += timedTicks; // Audio Timing
        this.cpu.ticks += timedTicks; // CPU Timing
        //CPU Timers:
        this.DIVTicks += this.CPUTicks; // DIV Timing
        if (this.TIMAEnabled) {
          //TIMA Timing
          this.timerTicks += this.CPUTicks;
          while (this.timerTicks >= this.TACClocker) {
            this.timerTicks -= this.TACClocker;
            if (++this.memory[0xff05] === 0x100) {
              this.memory[0xff05] = this.memory[0xff06];
              this.interruptsRequested |= 0x4;
              this.checkIRQMatching();
            }
          }
        }
        if (this.serialTimer > 0) {
          //Serial Timing
          //IRQ Counter:
          this.serialTimer -= this.CPUTicks;
          if (this.serialTimer <= 0) {
            this.interruptsRequested |= 0x8;
            this.checkIRQMatching();
          }
          //Bit Shit Counter:
          this.serialShiftTimer -= this.CPUTicks;
          if (this.serialShiftTimer <= 0) {
            this.serialShiftTimer = this.serialShiftTimerAllocated;
            this.memory[0xff01] = this.memory[0xff01] << 1 & 0xfe | 0x01; //We could shift in actual link data here if we were to implement such!!!
          }
        }
      };
      GameBoyCore.prototype.updateCoreFull = function () {
        //Update the state machine:
        this.updateCore();
        //End of iteration routine:
        if (this.cpu.ticks >= this.cpu.cyclesTotal) {
          this.iterationEndRoutine();
        }
      };
      GameBoyCore.prototype.initializeLCDController = function () {
        var _this2 = this;

        //Display on hanlding:
        var line = 0;
        while (line < 154) {
          if (line < 143) {
            //We're on a normal scan line:
            this.LINECONTROL[line] = function () {
              if (_this2.LCDTicks < 80) {
                _this2.scanLineMode2();
              } else if (_this2.LCDTicks < 252) {
                _this2.scanLineMode3();
              } else if (_this2.LCDTicks < 456) {
                _this2.scanLineMode0();
              } else {
                //We're on a new scan line:
                _this2.LCDTicks -= 456;
                if (_this2.STATTracker != 3) {
                  //Make sure the mode 0 handler was run at least once per scan line:
                  if (_this2.STATTracker != 2) {
                    if (_this2.STATTracker === 0 && _this2.mode2TriggerSTAT) {
                      _this2.interruptsRequested |= 0x2;
                    }
                    _this2.incrementScanLineQueue();
                  }
                  if (_this2.hdmaRunning) {
                    _this2.executeHDMA();
                  }
                  if (_this2.mode0TriggerSTAT) {
                    _this2.interruptsRequested |= 0x2;
                  }
                }

                //Update the scanline registers and assert the LYC counter:
                _this2.actualScanLine = ++_this2.memory[0xff44];

                //Perform a LYC counter assert:
                if (_this2.actualScanLine === _this2.memory[0xff45]) {
                  _this2.memory[0xff41] |= 0x04;
                  if (_this2.LYCMatchTriggerSTAT) {
                    _this2.interruptsRequested |= 0x2;
                  }
                } else {
                  _this2.memory[0xff41] &= 0x7b;
                }
                _this2.checkIRQMatching();
                //Reset our mode contingency variables:
                _this2.STATTracker = 0;
                _this2.modeSTAT = 2;
                _this2.LINECONTROL[_this2.actualScanLine].apply(_this2); //Scan Line and STAT Mode Control.
              }
            };
          } else if (line === 143) {
            //We're on the last visible scan line of the LCD screen:
            this.LINECONTROL[143] = function () {
              if (_this2.LCDTicks < 80) {
                _this2.scanLineMode2();
              } else if (_this2.LCDTicks < 252) {
                _this2.scanLineMode3();
              } else if (_this2.LCDTicks < 456) {
                _this2.scanLineMode0();
              } else {
                //Starting V-Blank:
                //Just finished the last visible scan line:
                _this2.LCDTicks -= 456;
                if (_this2.STATTracker != 3) {
                  //Make sure the mode 0 handler was run at least once per scan line:
                  if (_this2.STATTracker != 2) {
                    if (_this2.STATTracker === 0 && _this2.mode2TriggerSTAT) {
                      _this2.interruptsRequested |= 0x2;
                    }
                    _this2.incrementScanLineQueue();
                  }
                  if (_this2.hdmaRunning) {
                    _this2.executeHDMA();
                  }
                  if (_this2.mode0TriggerSTAT) {
                    _this2.interruptsRequested |= 0x2;
                  }
                }
                //Update the scanline registers and assert the LYC counter:
                _this2.actualScanLine = _this2.memory[0xff44] = 144;
                //Perform a LYC counter assert:
                if (_this2.memory[0xff45] === 144) {
                  _this2.memory[0xff41] |= 0x04;
                  if (_this2.LYCMatchTriggerSTAT) {
                    _this2.interruptsRequested |= 0x2;
                  }
                } else {
                  _this2.memory[0xff41] &= 0x7b;
                }
                //Reset our mode contingency variables:
                _this2.STATTracker = 0;
                //Update our state for v-blank:
                _this2.modeSTAT = 1;
                _this2.interruptsRequested |= _this2.mode1TriggerSTAT ? 0x3 : 0x1;
                _this2.checkIRQMatching();
                //Attempt to blit out to our canvas:
                if (_this2.drewBlank === 0) {
                  //Ensure JIT framing alignment:
                  if (_this2.cpu.totalLinesPassed < 144 || _this2.cpu.totalLinesPassed === 144 && _this2.midScanlineOffset > -1) {
                    //Make sure our gfx are up-to-date:
                    _this2.graphicsJITVBlank();
                    //Draw the frame:
                    _this2.lcd.prepareFrame();
                  }
                } else {
                  //LCD off takes at least 2 frames:
                  --_this2.drewBlank;
                }
                _this2.LINECONTROL[144].apply(_this2); //Scan Line and STAT Mode Control.
              }
            };
          } else if (line < 153) {
            //In VBlank
            this.LINECONTROL[line] = function () {
              if (_this2.LCDTicks >= 456) {
                //We're on a new scan line:
                _this2.LCDTicks -= 456;
                _this2.actualScanLine = ++_this2.memory[0xff44];
                //Perform a LYC counter assert:
                if (_this2.actualScanLine === _this2.memory[0xff45]) {
                  _this2.memory[0xff41] |= 0x04;
                  if (_this2.LYCMatchTriggerSTAT) {
                    _this2.interruptsRequested |= 0x2;
                    _this2.checkIRQMatching();
                  }
                } else {
                  _this2.memory[0xff41] &= 0x7b;
                }
                _this2.LINECONTROL[_this2.actualScanLine].apply(_this2); //Scan Line and STAT Mode Control.
              }
            };
          } else {
            //VBlank Ending (We're on the last actual scan line)
            this.LINECONTROL[153] = function () {
              if (_this2.LCDTicks >= 8) {
                if (_this2.STATTracker != 4 && _this2.memory[0xff44] === 153) {
                  _this2.memory[0xff44] = 0; //LY register resets to 0 early.
                  //Perform a LYC counter assert:
                  if (_this2.memory[0xff45] === 0) {
                    _this2.memory[0xff41] |= 0x04;
                    if (_this2.LYCMatchTriggerSTAT) {
                      _this2.interruptsRequested |= 0x2;
                      _this2.checkIRQMatching();
                    }
                  } else {
                    _this2.memory[0xff41] &= 0x7b;
                  }
                  _this2.STATTracker = 4;
                }
                if (_this2.LCDTicks >= 456) {
                  //We reset back to the beginning:
                  _this2.LCDTicks -= 456;
                  _this2.STATTracker = _this2.actualScanLine = 0;
                  _this2.LINECONTROL[0].apply(_this2); //Scan Line and STAT Mode Control.
                }
              }
            };
          }
          ++line;
        }
      };
      GameBoyCore.prototype.executeHDMA = function () {
        this.DMAWrite(1);
        if (this.halt) {
          if (this.LCDTicks - this.spriteCount < (4 >> this.doubleSpeedShifter | 0x20)) {
            //HALT clocking correction:
            this.CPUTicks = 4 + (0x20 + this.spriteCount << this.doubleSpeedShifter);
            this.LCDTicks = this.spriteCount + (4 >> this.doubleSpeedShifter | 0x20);
          }
        } else {
          this.LCDTicks += 4 >> this.doubleSpeedShifter | 0x20; //LCD Timing Update For HDMA.
        }
        if (this.memory[0xff55] === 0) {
          this.hdmaRunning = false;
          this.memory[0xff55] = 0xff; //Transfer completed ("Hidden last step," since some ROMs don't imply this, but most do).
        } else {
          --this.memory[0xff55];
        }
      };
      GameBoyCore.prototype.updateClock = function () {
        return this.cartridge.updateClock();
      };
      GameBoyCore.prototype.renderScanLine = function (scanlineToRender) {
        this.pixelStart = scanlineToRender * 160;
        if (this.bgEnabled) {
          this.pixelEnd = 160;
          this.BGLayerRender(scanlineToRender);
          this.WindowLayerRender(scanlineToRender);
        } else {
          var pixelLine = (scanlineToRender + 1) * 160;
          var defaultColor = this.cartridge.useGBCMode || this.colorizedGBPalettes ? 0xf8f8f8 : 0xefffde;
          for (var pixelPosition = scanlineToRender * 160 + this.currentX; pixelPosition < pixelLine; pixelPosition++) {
            this.frameBuffer[pixelPosition] = defaultColor;
          }
        }
        this.SpriteLayerRender(scanlineToRender);
        this.currentX = 0;
        this.midScanlineOffset = -1;
      };
      GameBoyCore.prototype.renderMidScanLine = function () {
        if (this.actualScanLine < 144 && this.modeSTAT === 3) {
          //TODO: Get this accurate:
          if (this.midScanlineOffset === -1) {
            this.midScanlineOffset = this.backgroundX & 0x7;
          }
          if (this.LCDTicks >= 82) {
            this.pixelEnd = this.LCDTicks - 74;
            this.pixelEnd = Math.min(this.pixelEnd - this.midScanlineOffset - this.pixelEnd % 0x8, 160);

            if (this.bgEnabled) {
              this.pixelStart = this.lastUnrenderedLine * 160;
              this.BGLayerRender(this.lastUnrenderedLine);
              this.WindowLayerRender(this.lastUnrenderedLine);
              //TODO: Do midscanline JIT for sprites...
            } else {
              var pixelLine = this.lastUnrenderedLine * 160 + this.pixelEnd;
              var defaultColor = this.cartridge.useGBCMode || this.colorizedGBPalettes ? 0xf8f8f8 : 0xefffde;
              for (var pixelPosition = this.lastUnrenderedLine * 160 + this.currentX; pixelPosition < pixelLine; pixelPosition++) {
                this.frameBuffer[pixelPosition] = defaultColor;
              }
            }
            this.currentX = this.pixelEnd;
          }
        }
      };
      GameBoyCore.prototype.initializeModeSpecificArrays = function () {
        this.LCDCONTROL = this.LCDisOn ? this.LINECONTROL : this.DISPLAYOFFCONTROL;
        if (this.cartridge.useGBCMode) {
          this.gbcOBJRawPalette = getTypedArray(0x40, 0, "uint8");
          this.gbcBGRawPalette = getTypedArray(0x40, 0, "uint8");
          this.gbcOBJPalette = getTypedArray(0x20, 0x1000000, "int32");
          this.gbcBGPalette = getTypedArray(0x40, 0, "int32");
          this.BGCHRBank2 = getTypedArray(0x800, 0, "uint8");
          this.BGCHRCurrentBank = this.currVRAMBank > 0 ? this.BGCHRBank2 : this.BGCHRBank1;
          this.tileCache = this.generateCacheArray(0xf80);
        } else {
          this.gbOBJPalette = getTypedArray(8, 0, "int32");
          this.gbBGPalette = getTypedArray(4, 0, "int32");
          this.BGPalette = this.gbBGPalette;
          this.OBJPalette = this.gbOBJPalette;
          this.tileCache = this.generateCacheArray(0x700);
          this.sortBuffer = getTypedArray(0x100, 0, "uint8");
          this.OAMAddressCache = getTypedArray(10, 0, "int32");
        }
        this.renderPathBuild();
      };
      GameBoyCore.prototype.adjustGBCtoGBMode = function () {
        console.log("Stepping down from GBC mode.");
        this.VRAM = this.GBCMemory = this.BGCHRCurrentBank = this.BGCHRBank2 = null;
        this.tileCache.length = 0x700;
        if (settings.colorizeGBMode) {
          this.gbBGColorizedPalette = getTypedArray(4, 0, "int32");
          this.gbOBJColorizedPalette = getTypedArray(8, 0, "int32");
          this.cachedBGPaletteConversion = getTypedArray(4, 0, "int32");
          this.cachedOBJPaletteConversion = getTypedArray(8, 0, "int32");
          this.BGPalette = this.gbBGColorizedPalette;
          this.OBJPalette = this.gbOBJColorizedPalette;
          this.gbOBJPalette = this.gbBGPalette = null;
          this.getGBCColor();
        } else {
          this.gbOBJPalette = getTypedArray(8, 0, "int32");
          this.gbBGPalette = getTypedArray(4, 0, "int32");
          this.BGPalette = this.gbBGPalette;
          this.OBJPalette = this.gbOBJPalette;
        }
        this.sortBuffer = getTypedArray(0x100, 0, "uint8");
        this.OAMAddressCache = getTypedArray(10, 0, "int32");
        this.renderPathBuild();
        this.memoryReadJumpCompile();
        this.memoryWriteJumpCompile();
      };
      GameBoyCore.prototype.renderPathBuild = function () {
        if (!this.cartridge.useGBCMode) {
          this.BGLayerRender = this.BGGBLayerRender;
          this.WindowLayerRender = this.WindowGBLayerRender;
          this.SpriteLayerRender = this.SpriteGBLayerRender;
        } else {
          this.priorityFlaggingPathRebuild();
          this.SpriteLayerRender = this.SpriteGBCLayerRender;
        }
      };
      GameBoyCore.prototype.priorityFlaggingPathRebuild = function () {
        if (this.BGPriorityEnabled) {
          this.BGLayerRender = this.BGGBCLayerRender;
          this.WindowLayerRender = this.WindowGBCLayerRender;
        } else {
          this.BGLayerRender = this.BGGBCLayerRenderNoPriorityFlagging;
          this.WindowLayerRender = this.WindowGBCLayerRenderNoPriorityFlagging;
        }
      };
      GameBoyCore.prototype.initializeReferencesFromSaveState = function () {
        this.LCDCONTROL = this.LCDisOn ? this.LINECONTROL : this.DISPLAYOFFCONTROL;
        var tileIndex = 0;
        if (!this.cartridge.useGBCMode) {
          if (this.colorizedGBPalettes) {
            this.BGPalette = this.gbBGColorizedPalette;
            this.OBJPalette = this.gbOBJColorizedPalette;
            this.updateGBBGPalette = this.updateGBColorizedBGPalette;
            this.updateGBOBJPalette = this.updateGBColorizedOBJPalette;
          } else {
            this.BGPalette = this.gbBGPalette;
            this.OBJPalette = this.gbOBJPalette;
          }
          this.tileCache = this.generateCacheArray(0x700);
          for (tileIndex = 0x8000; tileIndex < 0x9000; tileIndex += 2) {
            this.generateGBOAMTileLine(tileIndex);
          }
          for (tileIndex = 0x9000; tileIndex < 0x9800; tileIndex += 2) {
            this.generateGBTileLine(tileIndex);
          }
          this.sortBuffer = getTypedArray(0x100, 0, "uint8");
          this.OAMAddressCache = getTypedArray(10, 0, "int32");
        } else {
          this.BGCHRCurrentBank = this.currVRAMBank > 0 ? this.BGCHRBank2 : this.BGCHRBank1;
          this.tileCache = this.generateCacheArray(0xf80);
          for (; tileIndex < 0x1800; tileIndex += 0x10) {
            this.generateGBCTileBank1(tileIndex);
            this.generateGBCTileBank2(tileIndex);
          }
        }
        this.renderPathBuild();
      };
      GameBoyCore.prototype.adjustRGBTint = function (value) {
        //Adjustment for the GBC's tinting (According to Gambatte):
        var r = value & 0x1f;
        var g = value >> 5 & 0x1f;
        var b = value >> 10 & 0x1f;
        return r * 13 + g * 2 + b >> 1 << 16 | g * 3 + b << 9 | r * 3 + g * 2 + b * 11 >> 1;
      };
      GameBoyCore.prototype.getGBCColor = function () {
        //GBC Colorization of DMG ROMs:
        //BG
        for (var counter = 0; counter < 4; counter++) {
          var adjustedIndex = counter << 1;
          //BG
          this.cachedBGPaletteConversion[counter] = this.adjustRGBTint(this.gbcBGRawPalette[adjustedIndex | 1] << 8 | this.gbcBGRawPalette[adjustedIndex]);
          //OBJ 1
          this.cachedOBJPaletteConversion[counter] = this.adjustRGBTint(this.gbcOBJRawPalette[adjustedIndex | 1] << 8 | this.gbcOBJRawPalette[adjustedIndex]);
        }

        //OBJ 2
        for (var _counter = 4; _counter < 8; _counter++) {
          var _adjustedIndex = _counter << 1;
          this.cachedOBJPaletteConversion[_counter] = this.adjustRGBTint(this.gbcOBJRawPalette[_adjustedIndex | 1] << 8 | this.gbcOBJRawPalette[_adjustedIndex]);
        }

        //Update the palette entries:
        this.updateGBBGPalette = this.updateGBColorizedBGPalette;
        this.updateGBOBJPalette = this.updateGBColorizedOBJPalette;
        this.updateGBBGPalette(this.memory[0xff47]);
        this.updateGBOBJPalette(0, this.memory[0xff48]);
        this.updateGBOBJPalette(1, this.memory[0xff49]);
        this.colorizedGBPalettes = true;
      };
      GameBoyCore.prototype.updateGBRegularBGPalette = function (data) {
        this.gbBGPalette[0] = this.colors[data & 0x03] | 0x2000000;
        this.gbBGPalette[1] = this.colors[data >> 2 & 0x03];
        this.gbBGPalette[2] = this.colors[data >> 4 & 0x03];
        this.gbBGPalette[3] = this.colors[data >> 6];
      };
      GameBoyCore.prototype.updateGBColorizedBGPalette = function (data) {
        //GB colorization:
        this.gbBGColorizedPalette[0] = this.cachedBGPaletteConversion[data & 0x03] | 0x2000000;
        this.gbBGColorizedPalette[1] = this.cachedBGPaletteConversion[data >> 2 & 0x03];
        this.gbBGColorizedPalette[2] = this.cachedBGPaletteConversion[data >> 4 & 0x03];
        this.gbBGColorizedPalette[3] = this.cachedBGPaletteConversion[data >> 6];
      };
      GameBoyCore.prototype.updateGBRegularOBJPalette = function (index, data) {
        this.gbOBJPalette[index | 1] = this.colors[data >> 2 & 0x03];
        this.gbOBJPalette[index | 2] = this.colors[data >> 4 & 0x03];
        this.gbOBJPalette[index | 3] = this.colors[data >> 6];
      };
      GameBoyCore.prototype.updateGBColorizedOBJPalette = function (index, data) {
        //GB colorization:
        this.gbOBJColorizedPalette[index | 1] = this.cachedOBJPaletteConversion[index | data >> 2 & 0x03];
        this.gbOBJColorizedPalette[index | 2] = this.cachedOBJPaletteConversion[index | data >> 4 & 0x03];
        this.gbOBJColorizedPalette[index | 3] = this.cachedOBJPaletteConversion[index | data >> 6];
      };
      GameBoyCore.prototype.updateGBCBGPalette = function (index, data) {
        if (this.gbcBGRawPalette[index] != data) {
          this.midScanLineJIT();
          //Update the color palette for BG tiles since it changed:
          this.gbcBGRawPalette[index] = data;
          if ((index & 0x06) === 0) {
            //Palette 0 (Special tile Priority stuff)
            data = 0x2000000 | this.adjustRGBTint(this.gbcBGRawPalette[index | 1] << 8 | this.gbcBGRawPalette[index & 0x3e]);
            index >>= 1;
            this.gbcBGPalette[index] = data;
            this.gbcBGPalette[0x20 | index] = 0x1000000 | data;
          } else {
            //Regular Palettes (No special crap)
            data = this.adjustRGBTint(this.gbcBGRawPalette[index | 1] << 8 | this.gbcBGRawPalette[index & 0x3e]);
            index >>= 1;
            this.gbcBGPalette[index] = data;
            this.gbcBGPalette[0x20 | index] = 0x1000000 | data;
          }
        }
      };
      GameBoyCore.prototype.updateGBCOBJPalette = function (index, data) {
        if (this.gbcOBJRawPalette[index] !== data) {
          //Update the color palette for OBJ tiles since it changed:
          this.gbcOBJRawPalette[index] = data;
          if ((index & 0x06) > 0) {
            //Regular Palettes (No special crap)
            this.midScanLineJIT();
            this.gbcOBJPalette[index >> 1] = 0x1000000 | this.adjustRGBTint(this.gbcOBJRawPalette[index | 1] << 8 | this.gbcOBJRawPalette[index & 0x3e]);
          }
        }
      };
      GameBoyCore.prototype.BGGBLayerRender = function (scanlineToRender) {
        var scrollYAdjusted = this.backgroundY + scanlineToRender & 0xff; //The line of the BG we're at.
        var tileYLine = (scrollYAdjusted & 7) << 3;
        var tileYDown = this.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 0xf8) << 2; //The row of cached tiles we're fetching from.
        var scrollXAdjusted = this.backgroundX + this.currentX & 0xff; //The scroll amount of the BG.
        var pixelPosition = this.pixelStart + this.currentX; //Current pixel we're working on.
        var pixelPositionEnd = this.pixelStart + (this.gfxWindowDisplay && scanlineToRender - this.windowY >= 0 ? Math.min(Math.max(this.windowX, 0) + this.currentX, this.pixelEnd) : this.pixelEnd); //Make sure we do at most 160 pixels a scanline.
        var tileNumber = tileYDown + (scrollXAdjusted >> 3);
        var chrCode = this.BGCHRBank1[tileNumber];
        if (chrCode < this.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        var tile = this.tileCache[chrCode];
        for (var texel = scrollXAdjusted & 0x7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
          this.frameBuffer[pixelPosition++] = this.BGPalette[tile[tileYLine | texel++]];
        }
        var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 0x100 - scrollXAdjusted) >> 3;
        scrollXAdjusted += scrollXAdjustedAligned << 3;
        scrollXAdjustedAligned += tileNumber;
        while (tileNumber < scrollXAdjustedAligned) {
          chrCode = this.BGCHRBank1[++tileNumber];
          if (chrCode < this.gfxBackgroundBankOffset) {
            chrCode |= 0x100;
          }
          tile = this.tileCache[chrCode];
          texel = tileYLine;
          this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel]];
        }
        if (pixelPosition < pixelPositionEnd) {
          if (scrollXAdjusted < 0x100) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            tile = this.tileCache[chrCode];
            for (texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
              this.frameBuffer[pixelPosition++] = this.BGPalette[tile[++texel]];
            }
          }
          scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
          while (tileYDown < scrollXAdjustedAligned) {
            chrCode = this.BGCHRBank1[tileYDown++];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            tile = this.tileCache[chrCode];
            texel = tileYLine;
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel]];
          }
          if (pixelPosition < pixelPositionEnd) {
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            tile = this.tileCache[chrCode];
            switch (pixelPositionEnd - pixelPosition) {
              case 7:
                this.frameBuffer[pixelPosition + 6] = this.BGPalette[tile[tileYLine | 6]];
              case 6:
                this.frameBuffer[pixelPosition + 5] = this.BGPalette[tile[tileYLine | 5]];
              case 5:
                this.frameBuffer[pixelPosition + 4] = this.BGPalette[tile[tileYLine | 4]];
              case 4:
                this.frameBuffer[pixelPosition + 3] = this.BGPalette[tile[tileYLine | 3]];
              case 3:
                this.frameBuffer[pixelPosition + 2] = this.BGPalette[tile[tileYLine | 2]];
              case 2:
                this.frameBuffer[pixelPosition + 1] = this.BGPalette[tile[tileYLine | 1]];
              case 1:
                this.frameBuffer[pixelPosition] = this.BGPalette[tile[tileYLine]];
            }
          }
        }
      };
      GameBoyCore.prototype.BGGBCLayerRender = function (scanlineToRender) {
        var scrollYAdjusted = this.backgroundY + scanlineToRender & 0xff; //The line of the BG we're at.
        var tileYLine = (scrollYAdjusted & 7) << 3;
        var tileYDown = this.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 0xf8) << 2; //The row of cached tiles we're fetching from.
        var scrollXAdjusted = this.backgroundX + this.currentX & 0xff; //The scroll amount of the BG.
        var pixelPosition = this.pixelStart + this.currentX; //Current pixel we're working on.
        var pixelPositionEnd = this.pixelStart + (this.gfxWindowDisplay && scanlineToRender - this.windowY >= 0 ? Math.min(Math.max(this.windowX, 0) + this.currentX, this.pixelEnd) : this.pixelEnd); //Make sure we do at most 160 pixels a scanline.
        var tileNumber = tileYDown + (scrollXAdjusted >> 3);
        var chrCode = this.BGCHRBank1[tileNumber];
        if (chrCode < this.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        var attrCode = this.BGCHRBank2[tileNumber];
        var tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
        var palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
        for (var texel = scrollXAdjusted & 0x7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
        }
        var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 0x100 - scrollXAdjusted) >> 3;
        scrollXAdjusted += scrollXAdjustedAligned << 3;
        scrollXAdjustedAligned += tileNumber;
        while (tileNumber < scrollXAdjustedAligned) {
          chrCode = this.BGCHRBank1[++tileNumber];
          if (chrCode < this.gfxBackgroundBankOffset) {
            chrCode |= 0x100;
          }
          attrCode = this.BGCHRBank2[tileNumber];
          tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
          palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
          texel = tileYLine;
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
        }
        if (pixelPosition < pixelPositionEnd) {
          if (scrollXAdjusted < 0x100) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.BGCHRBank2[tileNumber];
            tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
            palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
            for (texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
              this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[++texel]];
            }
          }
          scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
          while (tileYDown < scrollXAdjustedAligned) {
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.BGCHRBank2[tileYDown++];
            tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
            palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
            texel = tileYLine;
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
          }
          if (pixelPosition < pixelPositionEnd) {
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.BGCHRBank2[tileYDown];
            tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
            palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
            switch (pixelPositionEnd - pixelPosition) {
              case 7:
                this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
              case 6:
                this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
              case 5:
                this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
              case 4:
                this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
              case 3:
                this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
              case 2:
                this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
              case 1:
                this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
            }
          }
        }
      };
      GameBoyCore.prototype.BGGBCLayerRenderNoPriorityFlagging = function (scanlineToRender) {
        var scrollYAdjusted = this.backgroundY + scanlineToRender & 0xff; //The line of the BG we're at.
        var tileYLine = (scrollYAdjusted & 7) << 3;
        var tileYDown = this.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 0xf8) << 2; //The row of cached tiles we're fetching from.
        var scrollXAdjusted = this.backgroundX + this.currentX & 0xff; //The scroll amount of the BG.
        var pixelPosition = this.pixelStart + this.currentX; //Current pixel we're working on.
        var pixelPositionEnd = this.pixelStart + (this.gfxWindowDisplay && scanlineToRender - this.windowY >= 0 ? Math.min(Math.max(this.windowX, 0) + this.currentX, this.pixelEnd) : this.pixelEnd); //Make sure we do at most 160 pixels a scanline.
        var tileNumber = tileYDown + (scrollXAdjusted >> 3);
        var chrCode = this.BGCHRBank1[tileNumber];
        if (chrCode < this.gfxBackgroundBankOffset) {
          chrCode |= 0x100;
        }
        var attrCode = this.BGCHRBank2[tileNumber];
        var tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
        var palette = (attrCode & 0x7) << 2;
        for (var texel = scrollXAdjusted & 0x7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
        }
        var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 0x100 - scrollXAdjusted) >> 3;
        scrollXAdjusted += scrollXAdjustedAligned << 3;
        scrollXAdjustedAligned += tileNumber;
        while (tileNumber < scrollXAdjustedAligned) {
          chrCode = this.BGCHRBank1[++tileNumber];
          if (chrCode < this.gfxBackgroundBankOffset) {
            chrCode |= 0x100;
          }
          attrCode = this.BGCHRBank2[tileNumber];
          tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
          palette = (attrCode & 0x7) << 2;
          texel = tileYLine;
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
          this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
        }
        if (pixelPosition < pixelPositionEnd) {
          if (scrollXAdjusted < 0x100) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.BGCHRBank2[tileNumber];
            tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
            palette = (attrCode & 0x7) << 2;
            for (texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 0x100; ++scrollXAdjusted) {
              this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[++texel]];
            }
          }
          scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
          while (tileYDown < scrollXAdjustedAligned) {
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.BGCHRBank2[tileYDown++];
            tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
            palette = (attrCode & 0x7) << 2;
            texel = tileYLine;
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
          }
          if (pixelPosition < pixelPositionEnd) {
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) {
              chrCode |= 0x100;
            }
            attrCode = this.BGCHRBank2[tileYDown];
            tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
            palette = (attrCode & 0x7) << 2;
            switch (pixelPositionEnd - pixelPosition) {
              case 7:
                this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
              case 6:
                this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
              case 5:
                this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
              case 4:
                this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
              case 3:
                this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
              case 2:
                this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
              case 1:
                this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
            }
          }
        }
      };
      GameBoyCore.prototype.WindowGBLayerRender = function (scanlineToRender) {
        if (this.gfxWindowDisplay) {
          //Is the window enabled?
          var scrollYAdjusted = scanlineToRender - this.windowY; //The line of the BG we're at.
          if (scrollYAdjusted >= 0) {
            var scrollXRangeAdjusted = this.windowX > 0 ? this.windowX + this.currentX : this.currentX;
            var pixelPosition = this.pixelStart + scrollXRangeAdjusted;
            var pixelPositionEnd = this.pixelStart + this.pixelEnd;
            if (pixelPosition < pixelPositionEnd) {
              var tileYLine = (scrollYAdjusted & 0x7) << 3;
              var tileNumber = (this.gfxWindowCHRBankPosition | (scrollYAdjusted & 0xf8) << 2) + (this.currentX >> 3);
              var chrCode = this.BGCHRBank1[tileNumber];
              if (chrCode < this.gfxBackgroundBankOffset) {
                chrCode |= 0x100;
              }
              var tile = this.tileCache[chrCode];
              var texel = scrollXRangeAdjusted - this.windowX & 0x7;
              scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
              while (texel < scrollXRangeAdjusted) {
                this.frameBuffer[pixelPosition++] = this.BGPalette[tile[tileYLine | texel++]];
              }
              scrollXRangeAdjusted = tileNumber + (pixelPositionEnd - pixelPosition >> 3);
              while (tileNumber < scrollXRangeAdjusted) {
                chrCode = this.BGCHRBank1[++tileNumber];
                if (chrCode < this.gfxBackgroundBankOffset) {
                  chrCode |= 0x100;
                }
                tile = this.tileCache[chrCode];
                texel = tileYLine;
                this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel]];
              }
              if (pixelPosition < pixelPositionEnd) {
                chrCode = this.BGCHRBank1[++tileNumber];
                if (chrCode < this.gfxBackgroundBankOffset) {
                  chrCode |= 0x100;
                }
                tile = this.tileCache[chrCode];
                switch (pixelPositionEnd - pixelPosition) {
                  case 7:
                    this.frameBuffer[pixelPosition + 6] = this.BGPalette[tile[tileYLine | 6]];
                  case 6:
                    this.frameBuffer[pixelPosition + 5] = this.BGPalette[tile[tileYLine | 5]];
                  case 5:
                    this.frameBuffer[pixelPosition + 4] = this.BGPalette[tile[tileYLine | 4]];
                  case 4:
                    this.frameBuffer[pixelPosition + 3] = this.BGPalette[tile[tileYLine | 3]];
                  case 3:
                    this.frameBuffer[pixelPosition + 2] = this.BGPalette[tile[tileYLine | 2]];
                  case 2:
                    this.frameBuffer[pixelPosition + 1] = this.BGPalette[tile[tileYLine | 1]];
                  case 1:
                    this.frameBuffer[pixelPosition] = this.BGPalette[tile[tileYLine]];
                }
              }
            }
          }
        }
      };
      GameBoyCore.prototype.WindowGBCLayerRender = function (scanlineToRender) {
        if (this.gfxWindowDisplay) {
          //Is the window enabled?
          var scrollYAdjusted = scanlineToRender - this.windowY; //The line of the BG we're at.
          if (scrollYAdjusted >= 0) {
            var scrollXRangeAdjusted = this.windowX > 0 ? this.windowX + this.currentX : this.currentX;
            var pixelPosition = this.pixelStart + scrollXRangeAdjusted;
            var pixelPositionEnd = this.pixelStart + this.pixelEnd;
            if (pixelPosition < pixelPositionEnd) {
              var tileYLine = (scrollYAdjusted & 0x7) << 3;
              var tileNumber = (this.gfxWindowCHRBankPosition | (scrollYAdjusted & 0xf8) << 2) + (this.currentX >> 3);
              var chrCode = this.BGCHRBank1[tileNumber];
              if (chrCode < this.gfxBackgroundBankOffset) {
                chrCode |= 0x100;
              }
              var attrCode = this.BGCHRBank2[tileNumber];
              var tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
              var palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
              var texel = scrollXRangeAdjusted - this.windowX & 0x7;
              scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
              while (texel < scrollXRangeAdjusted) {
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
              }
              scrollXRangeAdjusted = tileNumber + (pixelPositionEnd - pixelPosition >> 3);
              while (tileNumber < scrollXRangeAdjusted) {
                chrCode = this.BGCHRBank1[++tileNumber];
                if (chrCode < this.gfxBackgroundBankOffset) {
                  chrCode |= 0x100;
                }
                attrCode = this.BGCHRBank2[tileNumber];
                tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
                palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
                texel = tileYLine;
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
              }
              if (pixelPosition < pixelPositionEnd) {
                chrCode = this.BGCHRBank1[++tileNumber];
                if (chrCode < this.gfxBackgroundBankOffset) {
                  chrCode |= 0x100;
                }
                attrCode = this.BGCHRBank2[tileNumber];
                tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
                palette = (attrCode & 0x7) << 2 | (attrCode & 0x80) >> 2;
                switch (pixelPositionEnd - pixelPosition) {
                  case 7:
                    this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
                  case 6:
                    this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
                  case 5:
                    this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
                  case 4:
                    this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
                  case 3:
                    this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
                  case 2:
                    this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
                  case 1:
                    this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
                }
              }
            }
          }
        }
      };
      GameBoyCore.prototype.WindowGBCLayerRenderNoPriorityFlagging = function (scanlineToRender) {
        if (this.gfxWindowDisplay) {
          //Is the window enabled?
          var scrollYAdjusted = scanlineToRender - this.windowY; //The line of the BG we're at.
          if (scrollYAdjusted >= 0) {
            var scrollXRangeAdjusted = this.windowX > 0 ? this.windowX + this.currentX : this.currentX;
            var pixelPosition = this.pixelStart + scrollXRangeAdjusted;
            var pixelPositionEnd = this.pixelStart + this.pixelEnd;
            if (pixelPosition < pixelPositionEnd) {
              var tileYLine = (scrollYAdjusted & 0x7) << 3;
              var tileNumber = (this.gfxWindowCHRBankPosition | (scrollYAdjusted & 0xf8) << 2) + (this.currentX >> 3);
              var chrCode = this.BGCHRBank1[tileNumber];
              if (chrCode < this.gfxBackgroundBankOffset) {
                chrCode |= 0x100;
              }
              var attrCode = this.BGCHRBank2[tileNumber];
              var tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
              var palette = (attrCode & 0x7) << 2;
              var texel = scrollXRangeAdjusted - this.windowX & 0x7;
              scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
              while (texel < scrollXRangeAdjusted) {
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
              }
              scrollXRangeAdjusted = tileNumber + (pixelPositionEnd - pixelPosition >> 3);
              while (tileNumber < scrollXRangeAdjusted) {
                chrCode = this.BGCHRBank1[++tileNumber];
                if (chrCode < this.gfxBackgroundBankOffset) {
                  chrCode |= 0x100;
                }
                attrCode = this.BGCHRBank2[tileNumber];
                tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
                palette = (attrCode & 0x7) << 2;
                texel = tileYLine;
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
              }
              if (pixelPosition < pixelPositionEnd) {
                chrCode = this.BGCHRBank1[++tileNumber];
                if (chrCode < this.gfxBackgroundBankOffset) {
                  chrCode |= 0x100;
                }
                attrCode = this.BGCHRBank2[tileNumber];
                tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | chrCode];
                palette = (attrCode & 0x7) << 2;
                switch (pixelPositionEnd - pixelPosition) {
                  case 7:
                    this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
                  case 6:
                    this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
                  case 5:
                    this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
                  case 4:
                    this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
                  case 3:
                    this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
                  case 2:
                    this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
                  case 1:
                    this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
                }
              }
            }
          }
        }
      };
      GameBoyCore.prototype.SpriteGBLayerRender = function (scanlineToRender) {
        if (this.gfxSpriteShow) {
          //Are sprites enabled?
          var lineAdjusted = scanlineToRender + 0x10;
          var OAMAddress = 0xfe00;
          var yoffset = 0;
          var xcoord = 1;
          var xCoordStart = 0;
          var xCoordEnd = 0;
          var attrCode = 0;
          var palette = 0;
          var tile = null;
          var data = 0;
          var spriteCount = 0;
          var length = 0;
          var currentPixel = 0;
          var linePixel = 0;
          //Clear our x-coord sort buffer:
          while (xcoord < 168) {
            this.sortBuffer[xcoord++] = 0xff;
          }
          if (this.gfxSpriteNormalHeight) {
            //Draw the visible sprites:
            for (var _length = this.findLowestSpriteDrawable(lineAdjusted, 0x7); spriteCount < _length; ++spriteCount) {
              OAMAddress = this.OAMAddressCache[spriteCount];
              yoffset = lineAdjusted - this.memory[OAMAddress] << 3;
              attrCode = this.memory[OAMAddress | 3];
              palette = (attrCode & 0x10) >> 2;
              tile = this.tileCache[(attrCode & 0x60) << 4 | this.memory[OAMAddress | 0x2]];
              linePixel = xCoordStart = this.memory[OAMAddress | 1];
              xCoordEnd = Math.min(168 - linePixel, 8);
              xcoord = linePixel > 7 ? 0 : 8 - linePixel;
              for (currentPixel = this.pixelStart + (linePixel > 8 ? linePixel - 8 : 0); xcoord < xCoordEnd; ++xcoord, ++currentPixel, ++linePixel) {
                if (this.sortBuffer[linePixel] > xCoordStart) {
                  if (this.frameBuffer[currentPixel] >= 0x2000000) {
                    data = tile[yoffset | xcoord];
                    if (data > 0) {
                      this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                      this.sortBuffer[linePixel] = xCoordStart;
                    }
                  } else if (this.frameBuffer[currentPixel] < 0x1000000) {
                    data = tile[yoffset | xcoord];
                    if (data > 0 && attrCode < 0x80) {
                      this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                      this.sortBuffer[linePixel] = xCoordStart;
                    }
                  }
                }
              }
            }
          } else {
            //Draw the visible sprites:
            for (var _length2 = this.findLowestSpriteDrawable(lineAdjusted, 0xf); spriteCount < _length2; ++spriteCount) {
              OAMAddress = this.OAMAddressCache[spriteCount];
              yoffset = lineAdjusted - this.memory[OAMAddress] << 3;
              attrCode = this.memory[OAMAddress | 3];
              palette = (attrCode & 0x10) >> 2;
              if ((attrCode & 0x40) === (0x40 & yoffset)) {
                tile = this.tileCache[(attrCode & 0x60) << 4 | this.memory[OAMAddress | 0x2] & 0xfe];
              } else {
                tile = this.tileCache[(attrCode & 0x60) << 4 | this.memory[OAMAddress | 0x2] | 1];
              }
              yoffset &= 0x3f;
              linePixel = xCoordStart = this.memory[OAMAddress | 1];
              xCoordEnd = Math.min(168 - linePixel, 8);
              xcoord = linePixel > 7 ? 0 : 8 - linePixel;
              for (currentPixel = this.pixelStart + (linePixel > 8 ? linePixel - 8 : 0); xcoord < xCoordEnd; ++xcoord, ++currentPixel, ++linePixel) {
                if (this.sortBuffer[linePixel] > xCoordStart) {
                  if (this.frameBuffer[currentPixel] >= 0x2000000) {
                    data = tile[yoffset | xcoord];
                    if (data > 0) {
                      this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                      this.sortBuffer[linePixel] = xCoordStart;
                    }
                  } else if (this.frameBuffer[currentPixel] < 0x1000000) {
                    data = tile[yoffset | xcoord];
                    if (data > 0 && attrCode < 0x80) {
                      this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                      this.sortBuffer[linePixel] = xCoordStart;
                    }
                  }
                }
              }
            }
          }
        }
      };
      GameBoyCore.prototype.findLowestSpriteDrawable = function (scanlineToRender, drawableRange) {
        var address = 0xfe00;
        var spriteCount = 0;
        var diff = 0;
        while (address < 0xfea0 && spriteCount < 10) {
          diff = scanlineToRender - this.memory[address];
          if ((diff & drawableRange) === diff) {
            this.OAMAddressCache[spriteCount++] = address;
          }
          address += 4;
        }
        return spriteCount;
      };
      GameBoyCore.prototype.SpriteGBCLayerRender = function (scanlineToRender) {
        if (this.gfxSpriteShow) {
          //Are sprites enabled?
          var OAMAddress = 0xfe00;
          var lineAdjusted = scanlineToRender + 0x10;
          var yoffset = 0;
          var xcoord = 0;
          var endX = 0;
          var xCounter = 0;
          var attrCode = 0;
          var palette = 0;
          var tile = null;
          var data = 0;
          var currentPixel = 0;
          var spriteCount = 0;
          if (this.gfxSpriteNormalHeight) {
            for (; OAMAddress < 0xfea0 && spriteCount < 10; OAMAddress += 4) {
              yoffset = lineAdjusted - this.memory[OAMAddress];
              if ((yoffset & 0x7) === yoffset) {
                xcoord = this.memory[OAMAddress | 1] - 8;
                endX = Math.min(160, xcoord + 8);
                attrCode = this.memory[OAMAddress | 3];
                palette = (attrCode & 7) << 2;
                tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | this.memory[OAMAddress | 2]];
                xCounter = xcoord > 0 ? xcoord : 0;
                xcoord -= yoffset << 3;
                for (currentPixel = this.pixelStart + xCounter; xCounter < endX; ++xCounter, ++currentPixel) {
                  if (this.frameBuffer[currentPixel] >= 0x2000000) {
                    data = tile[xCounter - xcoord];
                    if (data > 0) {
                      this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                    }
                  } else if (this.frameBuffer[currentPixel] < 0x1000000) {
                    data = tile[xCounter - xcoord];
                    if (data > 0 && attrCode < 0x80) {
                      //Don't optimize for attrCode, as LICM-capable JITs should optimize its checks.
                      this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                    }
                  }
                }
                ++spriteCount;
              }
            }
          } else {
            for (; OAMAddress < 0xfea0 && spriteCount < 10; OAMAddress += 4) {
              yoffset = lineAdjusted - this.memory[OAMAddress];
              if ((yoffset & 0xf) === yoffset) {
                xcoord = this.memory[OAMAddress | 1] - 8;
                endX = Math.min(160, xcoord + 8);
                attrCode = this.memory[OAMAddress | 3];
                palette = (attrCode & 7) << 2;
                if ((attrCode & 0x40) === (0x40 & yoffset << 3)) {
                  tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | this.memory[OAMAddress | 0x2] & 0xfe];
                } else {
                  tile = this.tileCache[(attrCode & 0x08) << 8 | (attrCode & 0x60) << 4 | this.memory[OAMAddress | 0x2] | 1];
                }
                xCounter = xcoord > 0 ? xcoord : 0;
                xcoord -= (yoffset & 0x7) << 3;
                for (currentPixel = this.pixelStart + xCounter; xCounter < endX; ++xCounter, ++currentPixel) {
                  if (this.frameBuffer[currentPixel] >= 0x2000000) {
                    data = tile[xCounter - xcoord];
                    if (data > 0) {
                      this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                    }
                  } else if (this.frameBuffer[currentPixel] < 0x1000000) {
                    data = tile[xCounter - xcoord];
                    if (data > 0 && attrCode < 0x80) {
                      //Don't optimize for attrCode, as LICM-capable JITs should optimize its checks.
                      this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                    }
                  }
                }
                ++spriteCount;
              }
            }
          }
        }
      };
      //Generate only a single tile line for the GB tile cache mode:
      GameBoyCore.prototype.generateGBTileLine = function (address) {
        var lineCopy = this.memory[0x1 | address] << 8 | this.memory[0x9ffe & address];
        var tileBlock = this.tileCache[(address & 0x1ff0) >> 4];
        address = (address & 0xe) << 2;
        tileBlock[address | 7] = (lineCopy & 0x100) >> 7 | lineCopy & 0x1;
        tileBlock[address | 6] = (lineCopy & 0x200) >> 8 | (lineCopy & 0x2) >> 1;
        tileBlock[address | 5] = (lineCopy & 0x400) >> 9 | (lineCopy & 0x4) >> 2;
        tileBlock[address | 4] = (lineCopy & 0x800) >> 10 | (lineCopy & 0x8) >> 3;
        tileBlock[address | 3] = (lineCopy & 0x1000) >> 11 | (lineCopy & 0x10) >> 4;
        tileBlock[address | 2] = (lineCopy & 0x2000) >> 12 | (lineCopy & 0x20) >> 5;
        tileBlock[address | 1] = (lineCopy & 0x4000) >> 13 | (lineCopy & 0x40) >> 6;
        tileBlock[address] = (lineCopy & 0x8000) >> 14 | (lineCopy & 0x80) >> 7;
      };
      //Generate only a single tile line for the GBC tile cache mode (Bank 1):
      GameBoyCore.prototype.generateGBCTileLineBank1 = function (address) {
        var lineCopy = this.memory[0x1 | address] << 8 | this.memory[0x9ffe & address];
        address &= 0x1ffe;
        var tileBlock1 = this.tileCache[address >> 4];
        var tileBlock2 = this.tileCache[0x200 | address >> 4];
        var tileBlock3 = this.tileCache[0x400 | address >> 4];
        var tileBlock4 = this.tileCache[0x600 | address >> 4];
        address = (address & 0xe) << 2;
        var addressFlipped = 0x38 - address;
        tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 0x100) >> 7 | lineCopy & 0x1;
        tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 0x200) >> 8 | (lineCopy & 0x2) >> 1;
        tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 0x400) >> 9 | (lineCopy & 0x4) >> 2;
        tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 0x800) >> 10 | (lineCopy & 0x8) >> 3;
        tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 0x1000) >> 11 | (lineCopy & 0x10) >> 4;
        tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 0x2000) >> 12 | (lineCopy & 0x20) >> 5;
        tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 0x4000) >> 13 | (lineCopy & 0x40) >> 6;
        tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 0x8000) >> 14 | (lineCopy & 0x80) >> 7;
      };
      //Generate all the flip combinations for a full GBC VRAM bank 1 tile:
      GameBoyCore.prototype.generateGBCTileBank1 = function (vramAddress) {
        var address = vramAddress >> 4;
        var tileBlock1 = this.tileCache[address];
        var tileBlock2 = this.tileCache[0x200 | address];
        var tileBlock3 = this.tileCache[0x400 | address];
        var tileBlock4 = this.tileCache[0x600 | address];
        var lineCopy = 0;
        vramAddress |= 0x8000;
        address = 0;
        var addressFlipped = 56;
        do {
          lineCopy = this.memory[0x1 | vramAddress] << 8 | this.memory[vramAddress];
          tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 0x100) >> 7 | lineCopy & 0x1;
          tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 0x200) >> 8 | (lineCopy & 0x2) >> 1;
          tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 0x400) >> 9 | (lineCopy & 0x4) >> 2;
          tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 0x800) >> 10 | (lineCopy & 0x8) >> 3;
          tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 0x1000) >> 11 | (lineCopy & 0x10) >> 4;
          tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 0x2000) >> 12 | (lineCopy & 0x20) >> 5;
          tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 0x4000) >> 13 | (lineCopy & 0x40) >> 6;
          tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 0x8000) >> 14 | (lineCopy & 0x80) >> 7;
          address += 8;
          addressFlipped -= 8;
          vramAddress += 2;
        } while (addressFlipped > -1);
      };
      //Generate only a single tile line for the GBC tile cache mode (Bank 2):
      GameBoyCore.prototype.generateGBCTileLineBank2 = function (address) {
        var lineCopy = this.VRAM[0x1 | address] << 8 | this.VRAM[0x1ffe & address];
        var tileBlock1 = this.tileCache[0x800 | address >> 4];
        var tileBlock2 = this.tileCache[0xa00 | address >> 4];
        var tileBlock3 = this.tileCache[0xc00 | address >> 4];
        var tileBlock4 = this.tileCache[0xe00 | address >> 4];
        address = (address & 0xe) << 2;
        var addressFlipped = 0x38 - address;
        tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 0x100) >> 7 | lineCopy & 0x1;
        tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 0x200) >> 8 | (lineCopy & 0x2) >> 1;
        tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 0x400) >> 9 | (lineCopy & 0x4) >> 2;
        tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 0x800) >> 10 | (lineCopy & 0x8) >> 3;
        tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 0x1000) >> 11 | (lineCopy & 0x10) >> 4;
        tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 0x2000) >> 12 | (lineCopy & 0x20) >> 5;
        tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 0x4000) >> 13 | (lineCopy & 0x40) >> 6;
        tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 0x8000) >> 14 | (lineCopy & 0x80) >> 7;
      };
      //Generate all the flip combinations for a full GBC VRAM bank 2 tile:
      GameBoyCore.prototype.generateGBCTileBank2 = function (vramAddress) {
        var address = vramAddress >> 4;
        var tileBlock1 = this.tileCache[0x800 | address];
        var tileBlock2 = this.tileCache[0xa00 | address];
        var tileBlock3 = this.tileCache[0xc00 | address];
        var tileBlock4 = this.tileCache[0xe00 | address];
        var lineCopy = 0;
        address = 0;
        var addressFlipped = 56;
        do {
          lineCopy = this.VRAM[0x1 | vramAddress] << 8 | this.VRAM[vramAddress];
          tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 0x100) >> 7 | lineCopy & 0x1;
          tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 0x200) >> 8 | (lineCopy & 0x2) >> 1;
          tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 0x400) >> 9 | (lineCopy & 0x4) >> 2;
          tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 0x800) >> 10 | (lineCopy & 0x8) >> 3;
          tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 0x1000) >> 11 | (lineCopy & 0x10) >> 4;
          tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 0x2000) >> 12 | (lineCopy & 0x20) >> 5;
          tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 0x4000) >> 13 | (lineCopy & 0x40) >> 6;
          tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 0x8000) >> 14 | (lineCopy & 0x80) >> 7;
          address += 8;
          addressFlipped -= 8;
          vramAddress += 2;
        } while (addressFlipped > -1);
      };
      //Generate only a single tile line for the GB tile cache mode (OAM accessible range):
      GameBoyCore.prototype.generateGBOAMTileLine = function (address) {
        var lineCopy = this.memory[0x1 | address] << 8 | this.memory[0x9ffe & address];
        address &= 0x1ffe;
        var tileBlock1 = this.tileCache[address >> 4];
        var tileBlock2 = this.tileCache[0x200 | address >> 4];
        var tileBlock3 = this.tileCache[0x400 | address >> 4];
        var tileBlock4 = this.tileCache[0x600 | address >> 4];
        address = (address & 0xe) << 2;
        var addressFlipped = 0x38 - address;
        tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 0x100) >> 7 | lineCopy & 0x1;
        tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 0x200) >> 8 | (lineCopy & 0x2) >> 1;
        tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 0x400) >> 9 | (lineCopy & 0x4) >> 2;
        tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 0x800) >> 10 | (lineCopy & 0x8) >> 3;
        tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 0x1000) >> 11 | (lineCopy & 0x10) >> 4;
        tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 0x2000) >> 12 | (lineCopy & 0x20) >> 5;
        tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 0x4000) >> 13 | (lineCopy & 0x40) >> 6;
        tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 0x8000) >> 14 | (lineCopy & 0x80) >> 7;
      };
      GameBoyCore.prototype.graphicsJIT = function () {
        if (this.LCDisOn) {
          this.cpu.totalLinesPassed = 0; //Mark frame for ensuring a JIT pass for the next framebuffer output.
          this.graphicsJITScanlineGroup();
        }
      };
      GameBoyCore.prototype.graphicsJITVBlank = function () {
        //JIT the graphics to v-blank framing:
        this.cpu.totalLinesPassed += this.queuedScanLines;
        this.graphicsJITScanlineGroup();
      };
      GameBoyCore.prototype.graphicsJITScanlineGroup = function () {
        //Normal rendering JIT, where we try to do groups of scanlines at once:
        while (this.queuedScanLines > 0) {
          this.renderScanLine(this.lastUnrenderedLine);
          if (this.lastUnrenderedLine < 143) {
            ++this.lastUnrenderedLine;
          } else {
            this.lastUnrenderedLine = 0;
          }
          --this.queuedScanLines;
        }
      };
      GameBoyCore.prototype.incrementScanLineQueue = function () {
        if (this.queuedScanLines < 144) {
          ++this.queuedScanLines;
        } else {
          this.currentX = 0;
          this.midScanlineOffset = -1;
          if (this.lastUnrenderedLine < 143) {
            ++this.lastUnrenderedLine;
          } else {
            this.lastUnrenderedLine = 0;
          }
        }
      };
      GameBoyCore.prototype.midScanLineJIT = function () {
        this.graphicsJIT();
        this.renderMidScanLine();
      };
      //Check for the highest priority IRQ to fire:
      GameBoyCore.prototype.launchIRQ = function () {
        var bitShift = 0;
        var testbit = 1;
        do {
          //Check to see if an interrupt is enabled AND requested.
          if ((testbit & this.IRQLineMatched) === testbit) {
            this.IME = false; //Reset the interrupt enabling.
            this.interruptsRequested -= testbit; //Reset the interrupt request.
            this.IRQLineMatched = 0; //Reset the IRQ assertion.
            //Interrupts have a certain clock cycle length:
            this.CPUTicks = 20;
            //Set the stack pointer to the current program counter value:
            this.stackPointer = this.stackPointer - 1 & 0xffff;
            this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter >> 8]);
            this.stackPointer = this.stackPointer - 1 & 0xffff;
            this.memoryWriter[this.stackPointer].apply(this, [this.stackPointer, this.programCounter & 0xff]);
            //Set the program counter to the interrupt's address:
            this.programCounter = 0x40 | bitShift << 3;
            //Clock the core for mid-instruction updates:
            this.updateCore();
            return; //We only want the highest priority interrupt.
          }
          testbit = 1 << ++bitShift;
        } while (bitShift < 5);
      };
      /*
      	Check for IRQs to be fired while not in HALT:
      */
      GameBoyCore.prototype.checkIRQMatching = function () {
        if (this.IME) {
          this.IRQLineMatched = this.interruptsEnabled & this.interruptsRequested & 0x1f;
        }
      };
      /*
      	Handle the HALT opcode by predicting all IRQ cases correctly,
      	then selecting the next closest IRQ firing from the prediction to
      	clock up to. This prevents hacky looping that doesn't predict, but
      	instead just clocks through the core update procedure by one which
      	is very slow. Not many emulators do this because they have to cover
      	all the IRQ prediction cases and they usually get them wrong.
      */
      GameBoyCore.prototype.calculateHALTPeriod = function () {
        //Initialize our variables and start our prediction:
        if (!this.halt) {
          this.halt = true;
          var currentClocks = -1;
          var temp_var = 0;
          if (this.LCDisOn) {
            //If the LCD is enabled, then predict the LCD IRQs enabled:
            if ((this.interruptsEnabled & 0x1) === 0x1) {
              currentClocks = 456 * ((this.modeSTAT === 1 ? 298 : 144) - this.actualScanLine) - this.LCDTicks << this.doubleSpeedShifter;
            }
            if ((this.interruptsEnabled & 0x2) === 0x2) {
              if (this.mode0TriggerSTAT) {
                temp_var = this.clocksUntilMode0() - this.LCDTicks << this.doubleSpeedShifter;
                if (temp_var <= currentClocks || currentClocks === -1) {
                  currentClocks = temp_var;
                }
              }
              if (this.mode1TriggerSTAT && (this.interruptsEnabled & 0x1) === 0) {
                temp_var = 456 * ((this.modeSTAT === 1 ? 298 : 144) - this.actualScanLine) - this.LCDTicks << this.doubleSpeedShifter;
                if (temp_var <= currentClocks || currentClocks === -1) {
                  currentClocks = temp_var;
                }
              }
              if (this.mode2TriggerSTAT) {
                temp_var = (this.actualScanLine >= 143 ? 456 * (154 - this.actualScanLine) : 456) - this.LCDTicks << this.doubleSpeedShifter;
                if (temp_var <= currentClocks || currentClocks === -1) {
                  currentClocks = temp_var;
                }
              }
              if (this.LYCMatchTriggerSTAT && this.memory[0xff45] <= 153) {
                temp_var = this.clocksUntilLYCMatch() - this.LCDTicks << this.doubleSpeedShifter;
                if (temp_var <= currentClocks || currentClocks === -1) {
                  currentClocks = temp_var;
                }
              }
            }
          }
          if (this.TIMAEnabled && (this.interruptsEnabled & 0x4) === 0x4) {
            //CPU timer IRQ prediction:
            temp_var = (0x100 - this.memory[0xff05]) * this.TACClocker - this.timerTicks;
            if (temp_var <= currentClocks || currentClocks === -1) {
              currentClocks = temp_var;
            }
          }
          if (this.serialTimer > 0 && (this.interruptsEnabled & 0x8) === 0x8) {
            //Serial IRQ prediction:
            if (this.serialTimer <= currentClocks || currentClocks === -1) {
              currentClocks = this.serialTimer;
            }
          }
        } else {
          var currentClocks = this.remainingClocks;
        }
        var maxClocks = this.cpu.cyclesTotal - this.cpu.ticks << this.doubleSpeedShifter;
        if (currentClocks >= 0) {
          if (currentClocks <= maxClocks) {
            //Exit out of HALT normally:
            this.CPUTicks = Math.max(currentClocks, this.CPUTicks);
            this.updateCoreFull();
            this.halt = false;
            this.CPUTicks = 0;
          } else {
            //Still in HALT, clock only up to the clocks specified per iteration:
            this.CPUTicks = Math.max(maxClocks, this.CPUTicks);
            this.remainingClocks = currentClocks - this.CPUTicks;
          }
        } else {
          //Still in HALT, clock only up to the clocks specified per iteration:
          //Will stay in HALT forever (Stuck in HALT forever), but the APU and LCD are still clocked, so don't pause:
          this.CPUTicks += maxClocks;
        }
      };
      //Memory Reading:
      GameBoyCore.prototype.memoryRead = function (address) {
        //Act as a wrapper for reading the returns from the compiled jumps to memory.
        return this.memoryReader[address].apply(this, [address]); //This seems to be faster than the usual if/else.
      };
      GameBoyCore.prototype.memoryHighRead = function (address) {
        //Act as a wrapper for reading the returns from the compiled jumps to memory.
        return this.memoryHighReader[address].apply(this, [address]); //This seems to be faster than the usual if/else.
      };
      GameBoyCore.prototype.memoryReadJumpCompile = function () {
        var _this3 = this;

        //Faster in some browsers, since we are doing less conditionals overall by implementing them in advance.
        for (var index = 0x0000; index <= 0xffff; index++) {
          if (index < 0x4000) {
            this.memoryReader[index] = this.memoryReadNormal;
          } else if (index < 0x8000) {
            this.memoryReader[index] = this.memoryReadROM;
          } else if (index < 0x9800) {
            this.memoryReader[index] = this.cartridge.useGBCMode ? this.VRAMDATAReadCGBCPU : this.VRAMDATAReadDMGCPU;
          } else if (index < 0xa000) {
            this.memoryReader[index] = this.cartridge.useGBCMode ? this.VRAMCHRReadCGBCPU : this.VRAMCHRReadDMGCPU;
          } else if (index >= 0xa000 && index < 0xc000) {
            if (this.cartridge.ramSize !== 0) {
              if (this.cartridge.hasMBC7) {
                this.memoryReader[index] = this.memoryReadMBC7;
              } else if (!this.cartridge.hasMBC3) {
                this.memoryReader[index] = this.memoryReadMBC;
              } else {
                //MBC3 RTC + RAM:
                this.memoryReader[index] = this.memoryReadMBC3;
              }
            } else {
              this.memoryReader[index] = this.memoryReadBAD;
            }
          } else if (index >= 0xc000 && index < 0xe000) {
            if (!this.cartridge.useGBCMode || index < 0xd000) {
              this.memoryReader[index] = this.memoryReadNormal;
            } else {
              this.memoryReader[index] = this.memoryReadGBCMemory;
            }
          } else if (index >= 0xe000 && index < 0xfe00) {
            if (!this.cartridge.useGBCMode || index < 0xf000) {
              this.memoryReader[index] = this.memoryReadECHONormal;
            } else {
              this.memoryReader[index] = this.memoryReadECHOGBCMemory;
            }
          } else if (index < 0xfea0) {
            this.memoryReader[index] = this.memoryReadOAM;
          } else if (this.cartridge.useGBCMode && index >= 0xfea0 && index < 0xff00) {
            this.memoryReader[index] = this.memoryReadNormal;
          } else if (index >= 0xff00) {
            switch (index) {
              case 0xff00:
                //JOYPAD:
                this.memoryHighReader[0] = this.memoryReader[0xff00] = function (address) {
                  return 0xc0 | _this3.memory[0xff00]; // top nibble returns as set.
                };
                break;
              case 0xff01:
                //SB
                this.memoryHighReader[0x01] = this.memoryReader[0xff01] = function (address) {
                  return _this3.memory[0xff02] < 0x80 ? _this3.memory[0xff01] : 0xff;
                };
                break;
              case 0xff02:
                //SC
                if (this.cartridge.useGBCMode) {
                  this.memoryHighReader[0x02] = this.memoryReader[0xff02] = function (address) {
                    return (_this3.serialTimer <= 0 ? 0x7c : 0xfc) | _this3.memory[0xff02];
                  };
                } else {
                  this.memoryHighReader[0x02] = this.memoryReader[0xff02] = function (address) {
                    return (_this3.serialTimer <= 0 ? 0x7e : 0xfe) | _this3.memory[0xff02];
                  };
                }
                break;
              case 0xff03:
                this.memoryHighReader[0x03] = this.memoryReader[0xff03] = this.memoryReadBAD;
                break;
              case 0xff04:
                //DIV
                this.memoryHighReader[0x04] = this.memoryReader[0xff04] = function (address) {
                  _this3.memory[0xff04] = _this3.memory[0xff04] + (_this3.DIVTicks >> 8) & 0xff;
                  _this3.DIVTicks &= 0xff;
                  return _this3.memory[0xff04];
                };
                break;
              case 0xff05:
              case 0xff06:
                this.memoryHighReader[index & 0xff] = this.memoryHighReadNormal;
                this.memoryReader[index] = this.memoryReadNormal;
                break;
              case 0xff07:
                this.memoryHighReader[0x07] = this.memoryReader[0xff07] = function (address) {
                  return 0xf8 | _this3.memory[0xff07];
                };
                break;
              case 0xff08:
              case 0xff09:
              case 0xff0a:
              case 0xff0b:
              case 0xff0c:
              case 0xff0d:
              case 0xff0e:
                this.memoryHighReader[index & 0xff] = this.memoryReader[index] = this.memoryReadBAD;
                break;
              case 0xff0f:
                //IF
                this.memoryHighReader[0x0f] = this.memoryReader[0xff0f] = function (address) {
                  return 0xe0 | _this3.interruptsRequested;
                };
                break;
              case 0xff10:
                this.memoryHighReader[0x10] = this.memoryReader[0xff10] = function (address) {
                  return 0x80 | _this3.memory[0xff10];
                };
                break;
              case 0xff11:
                this.memoryHighReader[0x11] = this.memoryReader[0xff11] = function (address) {
                  return 0x3f | _this3.memory[0xff11];
                };
                break;
              case 0xff12:
                this.memoryHighReader[0x12] = this.memoryHighReadNormal;
                this.memoryReader[0xff12] = this.memoryReadNormal;
                break;
              case 0xff13:
                this.memoryHighReader[0x13] = this.memoryReader[0xff13] = this.memoryReadBAD;
                break;
              case 0xff14:
                this.memoryHighReader[0x14] = this.memoryReader[0xff14] = function (address) {
                  return 0xbf | _this3.memory[0xff14];
                };
                break;
              case 0xff15:
                this.memoryHighReader[0x15] = this.memoryReadBAD;
                this.memoryReader[0xff15] = this.memoryReadBAD;
                break;
              case 0xff16:
                this.memoryHighReader[0x16] = this.memoryReader[0xff16] = function (address) {
                  return 0x3f | _this3.memory[0xff16];
                };
                break;
              case 0xff17:
                this.memoryHighReader[0x17] = this.memoryHighReadNormal;
                this.memoryReader[0xff17] = this.memoryReadNormal;
                break;
              case 0xff18:
                this.memoryHighReader[0x18] = this.memoryReader[0xff18] = this.memoryReadBAD;
                break;
              case 0xff19:
                this.memoryHighReader[0x19] = this.memoryReader[0xff19] = function (address) {
                  return 0xbf | _this3.memory[0xff19];
                };
                break;
              case 0xff1a:
                this.memoryHighReader[0x1a] = this.memoryReader[0xff1a] = function (address) {
                  return 0x7f | _this3.memory[0xff1a];
                };
                break;
              case 0xff1b:
                this.memoryHighReader[0x1b] = this.memoryReader[0xff1b] = this.memoryReadBAD;
                break;
              case 0xff1c:
                this.memoryHighReader[0x1c] = this.memoryReader[0xff1c] = function (address) {
                  return 0x9f | _this3.memory[0xff1c];
                };
                break;
              case 0xff1d:
                this.memoryHighReader[0x1d] = this.memoryReader[0xff1d] = this.memoryReadBAD;
                break;
              case 0xff1e:
                this.memoryHighReader[0x1e] = this.memoryReader[0xff1e] = function (address) {
                  return 0xbf | _this3.memory[0xff1e];
                };
                break;
              case 0xff1f:
              case 0xff20:
                this.memoryHighReader[index & 0xff] = this.memoryReader[index] = this.memoryReadBAD;
                break;
              case 0xff21:
              case 0xff22:
                this.memoryHighReader[index & 0xff] = this.memoryHighReadNormal;
                this.memoryReader[index] = this.memoryReadNormal;
                break;
              case 0xff23:
                this.memoryHighReader[0x23] = this.memoryReader[0xff23] = function (address) {
                  return 0xbf | _this3.memory[0xff23];
                };
                break;
              case 0xff24:
              case 0xff25:
                this.memoryHighReader[index & 0xff] = this.memoryHighReadNormal;
                this.memoryReader[index] = this.memoryReadNormal;
                break;
              case 0xff26:
                this.memoryHighReader[0x26] = this.memoryReader[0xff26] = function (address) {
                  _this3.audioController.runJIT();
                  return 0x70 | _this3.memory[0xff26];
                };
                break;
              case 0xff27:
              case 0xff28:
              case 0xff29:
              case 0xff2a:
              case 0xff2b:
              case 0xff2c:
              case 0xff2d:
              case 0xff2e:
              case 0xff2f:
                this.memoryHighReader[index & 0xff] = this.memoryReader[index] = this.memoryReadBAD;
                break;
              case 0xff30:
              case 0xff31:
              case 0xff32:
              case 0xff33:
              case 0xff34:
              case 0xff35:
              case 0xff36:
              case 0xff37:
              case 0xff38:
              case 0xff39:
              case 0xff3a:
              case 0xff3b:
              case 0xff3c:
              case 0xff3d:
              case 0xff3e:
              case 0xff3f:
                this.memoryReader[index] = function (address) {
                  return _this3.audioController.channel3canPlay ? _this3.memory[0xff00 | _this3.audioController.channel3lastSampleLookup >> 1] : _this3.memory[address];
                };
                this.memoryHighReader[index & 0xff] = function (address) {
                  return _this3.audioController.channel3canPlay ? _this3.memory[0xff00 | _this3.audioController.channel3lastSampleLookup >> 1] : _this3.memory[0xff00 | address];
                };
                break;
              case 0xff40:
                this.memoryHighReader[0x40] = this.memoryHighReadNormal;
                this.memoryReader[0xff40] = this.memoryReadNormal;
                break;
              case 0xff41:
                this.memoryHighReader[0x41] = this.memoryReader[0xff41] = function (address) {
                  return 0x80 | _this3.memory[0xff41] | _this3.modeSTAT;
                };
                break;
              case 0xff42:
                this.memoryHighReader[0x42] = this.memoryReader[0xff42] = function (address) {
                  return _this3.backgroundY;
                };
                break;
              case 0xff43:
                this.memoryHighReader[0x43] = this.memoryReader[0xff43] = function (address) {
                  return _this3.backgroundX;
                };
                break;
              case 0xff44:
                this.memoryHighReader[0x44] = this.memoryReader[0xff44] = function (address) {
                  return _this3.LCDisOn ? _this3.memory[0xff44] : 0;
                };
                break;
              case 0xff45:
              case 0xff46:
              case 0xff47:
              case 0xff48:
              case 0xff49:
                this.memoryHighReader[index & 0xff] = this.memoryHighReadNormal;
                this.memoryReader[index] = this.memoryReadNormal;
                break;
              case 0xff4a:
                //WY
                this.memoryHighReader[0x4a] = this.memoryReader[0xff4a] = function (address) {
                  return _this3.windowY;
                };
                break;
              case 0xff4b:
                this.memoryHighReader[0x4b] = this.memoryHighReadNormal;
                this.memoryReader[0xff4b] = this.memoryReadNormal;
                break;
              case 0xff4c:
                this.memoryHighReader[0x4c] = this.memoryReader[0xff4c] = this.memoryReadBAD;
                break;
              case 0xff4d:
                this.memoryHighReader[0x4d] = this.memoryHighReadNormal;
                this.memoryReader[0xff4d] = this.memoryReadNormal;
                break;
              case 0xff4e:
                this.memoryHighReader[0x4e] = this.memoryReader[0xff4e] = this.memoryReadBAD;
                break;
              case 0xff4f:
                this.memoryHighReader[0x4f] = this.memoryReader[0xff4f] = function (address) {
                  return _this3.currVRAMBank;
                };
                break;
              case 0xff50:
              case 0xff51:
              case 0xff52:
              case 0xff53:
              case 0xff54:
                this.memoryHighReader[index & 0xff] = this.memoryHighReadNormal;
                this.memoryReader[index] = this.memoryReadNormal;
                break;
              case 0xff55:
                if (this.cartridge.useGBCMode) {
                  this.memoryHighReader[0x55] = this.memoryReader[0xff55] = function (address) {
                    if (!_this3.LCDisOn && _this3.hdmaRunning) {
                      //Undocumented behavior alert: HDMA becomes GDMA when LCD is off (Worms Armageddon Fix).
                      //DMA
                      _this3.DMAWrite((_this3.memory[0xff55] & 0x7f) + 1);
                      _this3.memory[0xff55] = 0xff; //Transfer completed.
                      _this3.hdmaRunning = false;
                    }
                    return _this3.memory[0xff55];
                  };
                } else {
                  this.memoryReader[0xff55] = this.memoryReadNormal;
                  this.memoryHighReader[0x55] = this.memoryHighReadNormal;
                }
                break;
              case 0xff56:
                if (this.cartridge.useGBCMode) {
                  this.memoryHighReader[0x56] = this.memoryReader[0xff56] = function (address) {
                    //Return IR "not connected" status:
                    return 0x3c | (_this3.memory[0xff56] >= 0xc0 ? 0x2 | _this3.memory[0xff56] & 0xc1 : _this3.memory[0xff56] & 0xc3);
                  };
                } else {
                  this.memoryReader[0xff56] = this.memoryReadNormal;
                  this.memoryHighReader[0x56] = this.memoryHighReadNormal;
                }
                break;
              case 0xff57:
              case 0xff58:
              case 0xff59:
              case 0xff5a:
              case 0xff5b:
              case 0xff5c:
              case 0xff5d:
              case 0xff5e:
              case 0xff5f:
              case 0xff60:
              case 0xff61:
              case 0xff62:
              case 0xff63:
              case 0xff64:
              case 0xff65:
              case 0xff66:
              case 0xff67:
                this.memoryHighReader[index & 0xff] = this.memoryReader[index] = this.memoryReadBAD;
                break;
              case 0xff68:
              case 0xff69:
              case 0xff6a:
              case 0xff6b:
                this.memoryHighReader[index & 0xff] = this.memoryHighReadNormal;
                this.memoryReader[index] = this.memoryReadNormal;
                break;
              case 0xff6c:
                if (this.cartridge.useGBCMode) {
                  this.memoryHighReader[0x6c] = this.memoryReader[0xff6c] = function (address) {
                    return 0xfe | _this3.memory[0xff6c];
                  };
                } else {
                  this.memoryHighReader[0x6c] = this.memoryReader[0xff6c] = this.memoryReadBAD;
                }
                break;
              case 0xff6d:
              case 0xff6e:
              case 0xff6f:
                this.memoryHighReader[index & 0xff] = this.memoryReader[index] = this.memoryReadBAD;
                break;
              case 0xff70:
                if (this.cartridge.useGBCMode) {
                  //SVBK
                  this.memoryHighReader[0x70] = this.memoryReader[0xff70] = function (address) {
                    return 0x40 | _this3.memory[0xff70];
                  };
                } else {
                  this.memoryHighReader[0x70] = this.memoryReader[0xff70] = this.memoryReadBAD;
                }
                break;
              case 0xff71:
                this.memoryHighReader[0x71] = this.memoryReader[0xff71] = this.memoryReadBAD;
                break;
              case 0xff72:
              case 0xff73:
                this.memoryHighReader[index & 0xff] = this.memoryReader[index] = this.memoryReadNormal;
                break;
              case 0xff74:
                if (this.cartridge.useGBCMode) {
                  this.memoryHighReader[0x74] = this.memoryReader[0xff74] = this.memoryReadNormal;
                } else {
                  this.memoryHighReader[0x74] = this.memoryReader[0xff74] = this.memoryReadBAD;
                }
                break;
              case 0xff75:
                this.memoryHighReader[0x75] = this.memoryReader[0xff75] = function (address) {
                  return 0x8f | _this3.memory[0xff75];
                };
                break;
              case 0xff76:
                //Undocumented realtime PCM amplitude readback:
                this.memoryHighReader[0x76] = this.memoryReader[0xff76] = function (address) {
                  _this3.audioController.runJIT();
                  return _this3.audioController.channel2envelopeVolume << 4 | _this3.audioController.channel1envelopeVolume;
                };
                break;
              case 0xff77:
                //Undocumented realtime PCM amplitude readback:
                this.memoryHighReader[0x77] = this.memoryReader[0xff77] = function (address) {
                  _this3.audioController.runJIT();
                  return _this3.audioController.channel4envelopeVolume << 4 | _this3.audioController.channel3envelopeVolume;
                };
                break;
              case 0xff78:
              case 0xff79:
              case 0xff7a:
              case 0xff7b:
              case 0xff7c:
              case 0xff7d:
              case 0xff7e:
              case 0xff7f:
                this.memoryHighReader[index & 0xff] = this.memoryReader[index] = this.memoryReadBAD;
                break;
              case 0xffff:
                //IE
                this.memoryHighReader[0xff] = this.memoryReader[0xffff] = function (address) {
                  return _this3.interruptsEnabled;
                };
                break;
              default:
                this.memoryReader[index] = this.memoryReadNormal;
                this.memoryHighReader[index & 0xff] = this.memoryHighReadNormal;
            }
          } else {
            this.memoryReader[index] = this.memoryReadBAD;
          }
        }
      };
      GameBoyCore.prototype.memoryReadNormal = function (address) {
        return this.memory[address];
      };
      GameBoyCore.prototype.memoryHighReadNormal = function (address) {
        return this.memory[0xff00 | address];
      };
      GameBoyCore.prototype.memoryReadROM = function (address) {
        return this.cartridge.rom.getByte(this.cartridge.mbc.currentROMBank + address);
      };
      GameBoyCore.prototype.memoryReadMBC = function (address) {
        return this.cartridge.mbc.readRAM(address);
      };
      GameBoyCore.prototype.memoryReadMBC7 = function (address) {
        return this.cartridge.mbc.readRAM(address);
      };
      GameBoyCore.prototype.memoryReadMBC3 = function (address) {
        return this.cartridge.mbc.readRAM(address);
      };
      GameBoyCore.prototype.memoryReadGBCMemory = function (address) {
        return this.GBCMemory[address + this.gbcRamBankPosition];
      };
      GameBoyCore.prototype.memoryReadOAM = function (address) {
        return this.modeSTAT > 1 ? 0xff : this.memory[address];
      };
      GameBoyCore.prototype.memoryReadECHOGBCMemory = function (address) {
        return this.GBCMemory[address + this.gbcRamBankPositionECHO];
      };
      GameBoyCore.prototype.memoryReadECHONormal = function (address) {
        return this.memory[address - 0x2000];
      };
      GameBoyCore.prototype.memoryReadBAD = function (address) {
        return 0xff;
      };
      GameBoyCore.prototype.VRAMDATAReadCGBCPU = function (address) {
        // CPU Side Reading The VRAM (Optimized for GameBoy Color)
        return this.modeSTAT > 2 ? 0xff : this.currVRAMBank === 0 ? this.memory[address] : this.VRAM[address & 0x1fff];
      };
      GameBoyCore.prototype.VRAMDATAReadDMGCPU = function (address) {
        // CPU Side Reading The VRAM (Optimized for classic GameBoy)
        return this.modeSTAT > 2 ? 0xff : this.memory[address];
      };
      GameBoyCore.prototype.VRAMCHRReadCGBCPU = function (address) {
        // CPU Side Reading the Character Data Map:
        return this.modeSTAT > 2 ? 0xff : this.BGCHRCurrentBank[address & 0x7ff];
      };
      GameBoyCore.prototype.VRAMCHRReadDMGCPU = function (address) {
        // CPU Side Reading the Character Data Map:
        return this.modeSTAT > 2 ? 0xff : this.BGCHRBank1[address & 0x7ff];
      };
      //Memory Writing:
      GameBoyCore.prototype.memoryWrite = function (address, data) {
        //Act as a wrapper for writing by compiled jumps to specific memory writing functions.
        this.memoryWriter[address].apply(this, [address, data]);
      };
      //0xFFXX fast path:
      GameBoyCore.prototype.memoryHighWrite = function (address, data) {
        //Act as a wrapper for writing by compiled jumps to specific memory writing functions.
        this.memoryHighWriter[address].apply(this, [address, data]);
      };
      GameBoyCore.prototype.memoryWriteJumpCompile = function () {
        //Faster in some browsers, since we are doing less conditionals overall by implementing them in advance.
        for (var index = 0x0000; index <= 0xffff; index++) {
          if (index < 0x8000) {
            if (this.cartridge.hasMBC1) {
              if (index < 0x2000) {
                this.memoryWriter[index] = this.MBCWriteEnable;
              } else if (index < 0x4000) {
                this.memoryWriter[index] = this.MBC1WriteROMBank;
              } else if (index < 0x6000) {
                this.memoryWriter[index] = this.MBC1WriteRAMBank;
              } else {
                this.memoryWriter[index] = this.MBC1WriteType;
              }
            } else if (this.cartridge.hasMBC2) {
              if (index < 0x1000) {
                this.memoryWriter[index] = this.MBCWriteEnable;
              } else if (index >= 0x2100 && index < 0x2200) {
                this.memoryWriter[index] = this.MBC2WriteROMBank;
              } else {
                this.memoryWriter[index] = this.cartIgnoreWrite;
              }
            } else if (this.cartridge.hasMBC3) {
              if (index < 0x2000) {
                this.memoryWriter[index] = this.MBCWriteEnable;
              } else if (index < 0x4000) {
                this.memoryWriter[index] = this.MBC3WriteROMBank;
              } else if (index < 0x6000) {
                this.memoryWriter[index] = this.MBC3WriteRAMBank;
              } else {
                this.memoryWriter[index] = this.MBC3WriteRTCLatch;
              }
            } else if (this.cartridge.hasMBC5 || this.cartridge.cRUMBLE || this.cartridge.hasMBC7) {
              if (index < 0x2000) {
                this.memoryWriter[index] = this.MBCWriteEnable;
              } else if (index < 0x3000) {
                this.memoryWriter[index] = this.MBC5WriteROMBankLow;
              } else if (index < 0x4000) {
                this.memoryWriter[index] = this.MBC5WriteROMBankHigh;
              } else if (index < 0x6000) {
                this.memoryWriter[index] = this.cartridge.cRUMBLE ? this.RUMBLEWriteRAMBank : this.MBC5WriteRAMBank;
              } else {
                this.memoryWriter[index] = this.cartIgnoreWrite;
              }
            } else if (this.cartridge.cHuC3) {
              if (index < 0x2000) {
                this.memoryWriter[index] = this.MBCWriteEnable;
              } else if (index < 0x4000) {
                this.memoryWriter[index] = this.MBC3WriteROMBank;
              } else if (index < 0x6000) {
                this.memoryWriter[index] = this.HuC3WriteRAMBank;
              } else {
                this.memoryWriter[index] = this.cartIgnoreWrite;
              }
            } else {
              this.memoryWriter[index] = this.cartIgnoreWrite;
            }
          } else if (index < 0x9000) {
            this.memoryWriter[index] = this.cartridge.useGBCMode ? this.VRAMGBCDATAWrite : this.VRAMGBDATAWrite;
          } else if (index < 0x9800) {
            this.memoryWriter[index] = this.cartridge.useGBCMode ? this.VRAMGBCDATAWrite : this.VRAMGBDATAUpperWrite;
          } else if (index < 0xa000) {
            this.memoryWriter[index] = this.cartridge.useGBCMode ? this.VRAMGBCCHRMAPWrite : this.VRAMGBCHRMAPWrite;
          } else if (index < 0xc000) {
            if (this.cartridge.ramSize !== 0) {
              if (!this.cartridge.hasMBC3) {
                this.memoryWriter[index] = this.memoryWriteMBCRAM;
              } else {
                //MBC3 RTC + RAM:
                this.memoryWriter[index] = this.memoryWriteMBC3RAM;
              }
            } else {
              this.memoryWriter[index] = this.cartIgnoreWrite;
            }
          } else if (index < 0xe000) {
            if (this.cartridge.useGBCMode && index >= 0xd000) {
              this.memoryWriter[index] = this.memoryWriteGBCRAM;
            } else {
              this.memoryWriter[index] = this.memoryWriteNormal;
            }
          } else if (index < 0xfe00) {
            if (this.cartridge.useGBCMode && index >= 0xf000) {
              this.memoryWriter[index] = this.memoryWriteECHOGBCRAM;
            } else {
              this.memoryWriter[index] = this.memoryWriteECHONormal;
            }
          } else if (index <= 0xfea0) {
            this.memoryWriter[index] = this.memoryWriteOAMRAM;
          } else if (index < 0xff00) {
            if (this.cartridge.useGBCMode) {
              // Only GBC has access to this RAM.
              this.memoryWriter[index] = this.memoryWriteNormal;
            } else {
              this.memoryWriter[index] = this.cartIgnoreWrite;
            }
          } else {
            //Start the I/O initialization by filling in the slots as normal memory:
            this.memoryWriter[index] = this.memoryWriteNormal;
            this.memoryHighWriter[index & 0xff] = this.memoryHighWriteNormal;
          }
        }
        this.registerWriteJumpCompile(); //Compile the I/O write functions separately...
      };
      GameBoyCore.prototype.MBCWriteEnable = function (address, data) {
        this.cartridge.mbc.writeEnable(address, data);
      };
      GameBoyCore.prototype.MBC1WriteROMBank = function (address, data) {
        this.cartridge.mbc.writeROMBank(address, data);
      };
      GameBoyCore.prototype.MBC1WriteRAMBank = function (address, data) {
        this.cartridge.mbc.writeRAMBank(address, data);
      };
      GameBoyCore.prototype.MBC1WriteType = function (address, data) {
        this.cartridge.mbc.writeType(address, data);
      };
      GameBoyCore.prototype.MBC2WriteROMBank = function (address, data) {
        this.cartridge.mbc.writeROMBank(address, data);
      };
      GameBoyCore.prototype.MBC3WriteROMBank = function (address, data) {
        return this.cartridge.mbc.writeROMBank(address, data);
      };
      GameBoyCore.prototype.MBC3WriteRAMBank = function (address, data) {
        return this.cartridge.mbc.writeRAMBank(address, data);
      };
      GameBoyCore.prototype.MBC3WriteRTCLatch = function (address, data) {
        return this.cartridge.mbc.rtc.writeLatch(address, data);
      };
      GameBoyCore.prototype.MBC5WriteROMBankLow = function (address, data) {
        return this.cartridge.mbc.writeROMBankLow(address, data);
      };
      GameBoyCore.prototype.MBC5WriteROMBankHigh = function (address, data) {
        return this.cartridge.mbc.writeROMBankHigh(address, data);
      };
      GameBoyCore.prototype.MBC5WriteRAMBank = function (address, data) {
        return this.cartridge.mbc.writeRAMBank(address, data);
      };
      GameBoyCore.prototype.RUMBLEWriteRAMBank = function (address, data) {
        //MBC5 RAM bank switching
        //Like MBC5, but bit 3 of the lower nibble is used for rumbling and bit 2 is ignored.
        this.cartridge.mbc.currentMBCRAMBank = data & 0x03;
        this.cartridge.mbc.currentRAMBankPosition = (this.cartridge.mbc.currentMBCRAMBank << 13) - 0xa000;
      };
      GameBoyCore.prototype.HuC3WriteRAMBank = function (address, data) {
        //HuC3 RAM bank switching
        this.cartridge.mbc.currentMBCRAMBank = data & 0x03;
        this.cartridge.mbc.currentRAMBankPosition = (this.cartridge.mbc.currentMBCRAMBank << 13) - 0xa000;
      };
      GameBoyCore.prototype.cartIgnoreWrite = function (address, data) {
        //We might have encountered illegal RAM writing or such, so just do nothing...
      };
      GameBoyCore.prototype.memoryWriteNormal = function (address, data) {
        this.memory[address] = data;
      };
      GameBoyCore.prototype.memoryHighWriteNormal = function (address, data) {
        this.memory[0xff00 | address] = data;
      };
      GameBoyCore.prototype.memoryWriteMBCRAM = function (address, data) {
        this.cartridge.mbc.writeRAM(address, data);
      };
      GameBoyCore.prototype.memoryWriteMBC3RAM = function (address, data) {
        return this.cartridge.mbc.writeRAM(address, data);
      };
      GameBoyCore.prototype.memoryWriteGBCRAM = function (address, data) {
        this.GBCMemory[address + this.gbcRamBankPosition] = data;
      };
      GameBoyCore.prototype.memoryWriteOAMRAM = function (address, data) {
        if (this.modeSTAT < 2) {
          //OAM RAM cannot be written to in mode 2 & 3
          if (this.memory[address] != data) {
            this.graphicsJIT();
            this.memory[address] = data;
          }
        }
      };
      GameBoyCore.prototype.memoryWriteECHOGBCRAM = function (address, data) {
        this.GBCMemory[address + this.gbcRamBankPositionECHO] = data;
      };
      GameBoyCore.prototype.memoryWriteECHONormal = function (address, data) {
        this.memory[address - 0x2000] = data;
      };
      GameBoyCore.prototype.VRAMGBDATAWrite = function (address, data) {
        if (this.modeSTAT < 3) {
          //VRAM cannot be written to during mode 3
          if (this.memory[address] != data) {
            //JIT the graphics render queue:
            this.graphicsJIT();
            this.memory[address] = data;
            this.generateGBOAMTileLine(address);
          }
        }
      };
      GameBoyCore.prototype.VRAMGBDATAUpperWrite = function (address, data) {
        if (this.modeSTAT < 3) {
          //VRAM cannot be written to during mode 3
          if (this.memory[address] != data) {
            //JIT the graphics render queue:
            this.graphicsJIT();
            this.memory[address] = data;
            this.generateGBTileLine(address);
          }
        }
      };
      GameBoyCore.prototype.VRAMGBCDATAWrite = function (address, data) {
        if (this.modeSTAT < 3) {
          //VRAM cannot be written to during mode 3
          if (this.currVRAMBank === 0) {
            if (this.memory[address] != data) {
              //JIT the graphics render queue:
              this.graphicsJIT();
              this.memory[address] = data;
              this.generateGBCTileLineBank1(address);
            }
          } else {
            address &= 0x1fff;
            if (this.VRAM[address] != data) {
              //JIT the graphics render queue:
              this.graphicsJIT();
              this.VRAM[address] = data;
              this.generateGBCTileLineBank2(address);
            }
          }
        }
      };
      GameBoyCore.prototype.VRAMGBCHRMAPWrite = function (address, data) {
        if (this.modeSTAT < 3) {
          //VRAM cannot be written to during mode 3
          address &= 0x7ff;
          if (this.BGCHRBank1[address] != data) {
            //JIT the graphics render queue:
            this.graphicsJIT();
            this.BGCHRBank1[address] = data;
          }
        }
      };
      GameBoyCore.prototype.VRAMGBCCHRMAPWrite = function (address, data) {
        if (this.modeSTAT < 3) {
          //VRAM cannot be written to during mode 3
          address &= 0x7ff;
          if (this.BGCHRCurrentBank[address] != data) {
            //JIT the graphics render queue:
            this.graphicsJIT();
            this.BGCHRCurrentBank[address] = data;
          }
        }
      };
      GameBoyCore.prototype.DMAWrite = function (tilesToTransfer) {
        if (!this.halt) {
          //Clock the CPU for the DMA transfer (CPU is halted during the transfer):
          this.CPUTicks += 4 | tilesToTransfer << 5 << this.doubleSpeedShifter;
        }
        //Source address of the transfer:
        var source = this.memory[0xff51] << 8 | this.memory[0xff52];
        //Destination address in the VRAM memory range:
        var destination = this.memory[0xff53] << 8 | this.memory[0xff54];
        //Creating some references:
        var memoryReader = this.memoryReader;
        //JIT the graphics render queue:
        this.graphicsJIT();
        var memory = this.memory;
        //Determining which bank we're working on so we can optimize:
        if (this.currVRAMBank === 0) {
          //DMA transfer for VRAM bank 0:
          do {
            if (destination < 0x1800) {
              memory[0x8000 | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x8001 | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x8002 | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x8003 | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x8004 | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x8005 | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x8006 | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x8007 | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x8008 | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x8009 | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x800a | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x800b | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x800c | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x800d | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x800e | destination] = memoryReader[source].apply(this, [source++]);
              memory[0x800f | destination] = memoryReader[source].apply(this, [source++]);
              this.generateGBCTileBank1(destination);
              destination += 0x10;
            } else {
              destination &= 0x7f0;
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank1[destination++] = memoryReader[source].apply(this, [source++]);
              destination = destination + 0x1800 & 0x1ff0;
            }
            source &= 0xfff0;
            --tilesToTransfer;
          } while (tilesToTransfer > 0);
        } else {
          var VRAM = this.VRAM;
          //DMA transfer for VRAM bank 1:
          do {
            if (destination < 0x1800) {
              VRAM[destination] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0x1] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0x2] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0x3] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0x4] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0x5] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0x6] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0x7] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0x8] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0x9] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0xa] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0xb] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0xc] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0xd] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0xe] = memoryReader[source].apply(this, [source++]);
              VRAM[destination | 0xf] = memoryReader[source].apply(this, [source++]);
              this.generateGBCTileBank2(destination);
              destination += 0x10;
            } else {
              destination &= 0x7f0;
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              this.BGCHRBank2[destination++] = memoryReader[source].apply(this, [source++]);
              destination = destination + 0x1800 & 0x1ff0;
            }
            source &= 0xfff0;
            --tilesToTransfer;
          } while (tilesToTransfer > 0);
        }
        // Update the HDMA registers to their next addresses:
        memory[0xff51] = source >> 8;
        memory[0xff52] = source & 0xf0;
        memory[0xff53] = destination >> 8;
        memory[0xff54] = destination & 0xf0;
      };
      GameBoyCore.prototype.registerWriteJumpCompile = function () {
        var _this4 = this;

        //I/O Registers (GB + GBC):
        //JoyPad
        this.memoryHighWriter[0] = this.memoryWriter[0xff00] = function (address, data) {
          _this4.memory[0xff00] = data & 0x30 | ((data & 0x20) === 0 ? _this4.joypad.value >> 4 : 0xf) & ((data & 0x10) === 0 ? _this4.joypad.value & 0xf : 0xf);
        };
        //SB (Serial Transfer Data)
        this.memoryHighWriter[0x1] = this.memoryWriter[0xff01] = function (address, data) {
          if (_this4.memory[0xff02] < 0x80) {
            //Cannot write while a serial transfer is active.
            _this4.memory[0xff01] = data;
          }
        };
        //SC (Serial Transfer Control):
        this.memoryHighWriter[0x2] = this.memoryHighWriteNormal;
        this.memoryWriter[0xff02] = this.memoryWriteNormal;
        //Unmapped I/O:
        this.memoryHighWriter[0x3] = this.memoryWriter[0xff03] = this.cartIgnoreWrite;
        //DIV
        this.memoryHighWriter[0x4] = this.memoryWriter[0xff04] = function (address, data) {
          _this4.DIVTicks &= 0xff; //Update DIV for realignment.
          _this4.memory[0xff04] = 0;
        };
        //TIMA
        this.memoryHighWriter[0x5] = this.memoryWriter[0xff05] = function (address, data) {
          _this4.memory[0xff05] = data;
        };
        //TMA
        this.memoryHighWriter[0x6] = this.memoryWriter[0xff06] = function (address, data) {
          _this4.memory[0xff06] = data;
        };
        //TAC
        this.memoryHighWriter[0x7] = this.memoryWriter[0xff07] = function (address, data) {
          _this4.memory[0xff07] = data & 0x07;
          _this4.TIMAEnabled = (data & 0x04) === 0x04;
          _this4.TACClocker = Math.pow(4, (data & 0x3) != 0 ? data & 0x3 : 4) << 2; //TODO: Find a way to not make a conditional in here...
        };
        //Unmapped I/O:
        this.memoryHighWriter[0x8] = this.memoryWriter[0xff08] = this.cartIgnoreWrite;
        this.memoryHighWriter[0x9] = this.memoryWriter[0xff09] = this.cartIgnoreWrite;
        this.memoryHighWriter[0xa] = this.memoryWriter[0xff0a] = this.cartIgnoreWrite;
        this.memoryHighWriter[0xb] = this.memoryWriter[0xff0b] = this.cartIgnoreWrite;
        this.memoryHighWriter[0xc] = this.memoryWriter[0xff0c] = this.cartIgnoreWrite;
        this.memoryHighWriter[0xd] = this.memoryWriter[0xff0d] = this.cartIgnoreWrite;
        this.memoryHighWriter[0xe] = this.memoryWriter[0xff0e] = this.cartIgnoreWrite;
        //IF (Interrupt Request)
        this.memoryHighWriter[0xf] = this.memoryWriter[0xff0f] = function (address, data) {
          _this4.interruptsRequested = data;
          _this4.checkIRQMatching();
        };
        //NR10:
        this.memoryHighWriter[0x10] = this.memoryWriter[0xff10] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            if (_this4.audioController.channel1decreaseSweep && (data & 0x08) === 0) {
              if (_this4.audioController.channel1Swept) {
                _this4.audioController.channel1SweepFault = true;
              }
            }
            _this4.audioController.channel1lastTimeSweep = (data & 0x70) >> 4;
            _this4.audioController.channel1frequencySweepDivider = data & 0x07;
            _this4.audioController.channel1decreaseSweep = (data & 0x08) === 0x08;
            _this4.memory[0xff10] = data;
            _this4.audioController.checkChannel1Enable();
          }
        };
        //NR11:
        this.memoryHighWriter[0x11] = this.memoryWriter[0xff11] = function (address, data) {
          if (_this4.soundMasterEnabled || !_this4.cartridge.useGBCMode) {
            if (_this4.soundMasterEnabled) {
              _this4.audioController.runJIT();
            } else {
              data &= 0x3f;
            }
            _this4.audioController.channel1CachedDuty = dutyLookup[data >> 6];
            _this4.audioController.channel1totalLength = 0x40 - (data & 0x3f);
            _this4.memory[0xff11] = data;
            _this4.audioController.checkChannel1Enable();
          }
        };
        //NR12:
        this.memoryHighWriter[0x12] = this.memoryWriter[0xff12] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            if (_this4.audioController.channel1Enabled && _this4.audioController.channel1envelopeSweeps === 0) {
              //Zombie Volume PAPU Bug:
              if (((_this4.memory[0xff12] ^ data) & 0x8) === 0x8) {
                if ((_this4.memory[0xff12] & 0x8) === 0) {
                  if ((_this4.memory[0xff12] & 0x7) === 0x7) {
                    _this4.audioController.channel1envelopeVolume += 2;
                  } else {
                    ++_this4.audioController.channel1envelopeVolume;
                  }
                }
                _this4.audioController.channel1envelopeVolume = 16 - _this4.audioController.channel1envelopeVolume & 0xf;
              } else if ((_this4.memory[0xff12] & 0xf) === 0x8) {
                _this4.audioController.channel1envelopeVolume = 1 + _this4.audioController.channel1envelopeVolume & 0xf;
              }
              _this4.audioController.cacheChannel1OutputLevel();
            }
            _this4.audioController.channel1envelopeType = (data & 0x08) === 0x08;
            _this4.memory[0xff12] = data;
            _this4.audioController.checkChannel1VolumeEnable();
          }
        };
        //NR13:
        this.memoryHighWriter[0x13] = this.memoryWriter[0xff13] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            _this4.audioController.channel1frequency = _this4.audioController.channel1frequency & 0x700 | data;
            _this4.audioController.channel1FrequencyTracker = 0x800 - _this4.audioController.channel1frequency << 2;
          }
        };
        //NR14:
        this.memoryHighWriter[0x14] = this.memoryWriter[0xff14] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            _this4.audioController.channel1consecutive = (data & 0x40) === 0x0;
            _this4.audioController.channel1frequency = (data & 0x7) << 8 | _this4.audioController.channel1frequency & 0xff;
            _this4.audioController.channel1FrequencyTracker = 0x800 - _this4.audioController.channel1frequency << 2;
            if (data > 0x7f) {
              //Reload 0xFF10:
              _this4.audioController.channel1timeSweep = _this4.audioController.channel1lastTimeSweep;
              _this4.audioController.channel1Swept = false;
              //Reload 0xFF12:
              var nr12 = _this4.memory[0xff12];
              _this4.audioController.channel1envelopeVolume = nr12 >> 4;
              _this4.audioController.cacheChannel1OutputLevel();
              _this4.audioController.channel1envelopeSweepsLast = (nr12 & 0x7) - 1;
              if (_this4.audioController.channel1totalLength === 0) {
                _this4.audioController.channel1totalLength = 0x40;
              }
              if (_this4.audioController.channel1lastTimeSweep > 0 || _this4.audioController.channel1frequencySweepDivider > 0) {
                _this4.memory[0xff26] |= 0x1;
              } else {
                _this4.memory[0xff26] &= 0xfe;
              }
              if ((data & 0x40) === 0x40) {
                _this4.memory[0xff26] |= 0x1;
              }
              _this4.audioController.channel1ShadowFrequency = _this4.audioController.channel1frequency;
              //Reset frequency overflow check + frequency sweep type check:
              _this4.audioController.channel1SweepFault = false;
              //Supposed to run immediately:
              _this4.audioController.performChannel1AudioSweepDummy();
            }
            _this4.audioController.checkChannel1Enable();
            _this4.memory[0xff14] = data;
          }
        };
        //NR20 (Unused I/O):
        this.memoryHighWriter[0x15] = this.memoryWriter[0xff15] = this.cartIgnoreWrite;
        //NR21:
        this.memoryHighWriter[0x16] = this.memoryWriter[0xff16] = function (address, data) {
          if (_this4.soundMasterEnabled || !_this4.cartridge.useGBCMode) {
            if (_this4.soundMasterEnabled) {
              _this4.audioController.runJIT();
            } else {
              data &= 0x3f;
            }
            _this4.audioController.channel2CachedDuty = dutyLookup[data >> 6];
            _this4.audioController.channel2totalLength = 0x40 - (data & 0x3f);
            _this4.memory[0xff16] = data;
            _this4.audioController.checkChannel2Enable();
          }
        };
        //NR22:
        this.memoryHighWriter[0x17] = this.memoryWriter[0xff17] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            if (_this4.audioController.channel2Enabled && _this4.audioController.channel2envelopeSweeps === 0) {
              //Zombie Volume PAPU Bug:
              if (((_this4.memory[0xff17] ^ data) & 0x8) === 0x8) {
                if ((_this4.memory[0xff17] & 0x8) === 0) {
                  if ((_this4.memory[0xff17] & 0x7) === 0x7) {
                    _this4.audioController.channel2envelopeVolume += 2;
                  } else {
                    ++_this4.audioController.channel2envelopeVolume;
                  }
                }
                _this4.audioController.channel2envelopeVolume = 16 - _this4.audioController.channel2envelopeVolume & 0xf;
              } else if ((_this4.memory[0xff17] & 0xf) === 0x8) {
                _this4.audioController.channel2envelopeVolume = 1 + _this4.audioController.channel2envelopeVolume & 0xf;
              }
              _this4.audioController.cacheChannel2OutputLevel();
            }
            _this4.audioController.channel2envelopeType = (data & 0x08) === 0x08;
            _this4.memory[0xff17] = data;
            _this4.audioController.checkChannel2VolumeEnable();
          }
        };
        //NR23:
        this.memoryHighWriter[0x18] = this.memoryWriter[0xff18] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            _this4.audioController.channel2frequency = _this4.audioController.channel2frequency & 0x700 | data;
            _this4.audioController.channel2FrequencyTracker = 0x800 - _this4.audioController.channel2frequency << 2;
          }
        };
        //NR24:
        this.memoryHighWriter[0x19] = this.memoryWriter[0xff19] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            if (data > 0x7f) {
              //Reload 0xFF17:
              var nr22 = _this4.memory[0xff17];
              _this4.audioController.channel2envelopeVolume = nr22 >> 4;
              _this4.audioController.cacheChannel2OutputLevel();
              _this4.audioController.channel2envelopeSweepsLast = (nr22 & 0x7) - 1;
              if (_this4.audioController.channel2totalLength === 0) {
                _this4.audioController.channel2totalLength = 0x40;
              }
              if ((data & 0x40) === 0x40) {
                _this4.memory[0xff26] |= 0x2;
              }
            }
            _this4.audioController.channel2consecutive = (data & 0x40) === 0x0;
            _this4.audioController.channel2frequency = (data & 0x7) << 8 | _this4.audioController.channel2frequency & 0xff;
            _this4.audioController.channel2FrequencyTracker = 0x800 - _this4.audioController.channel2frequency << 2;
            _this4.memory[0xff19] = data;
            _this4.audioController.checkChannel2Enable();
          }
        };
        //NR30:
        this.memoryHighWriter[0x1a] = this.memoryWriter[0xff1a] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            if (!_this4.audioController.channel3canPlay && data >= 0x80) {
              _this4.audioController.channel3lastSampleLookup = 0;
              _this4.audioController.cacheChannel3Update();
            }
            _this4.audioController.channel3canPlay = data > 0x7f;
            if (_this4.audioController.channel3canPlay && _this4.memory[0xff1a] > 0x7f && !_this4.audioController.channel3consecutive) {
              _this4.memory[0xff26] |= 0x4;
            }
            _this4.memory[0xff1a] = data;
            //this.audioController.checkChannel3Enable();
          }
        };
        //NR31:
        this.memoryHighWriter[0x1b] = this.memoryWriter[0xff1b] = function (address, data) {
          if (_this4.soundMasterEnabled || !_this4.cartridge.useGBCMode) {
            if (_this4.soundMasterEnabled) {
              _this4.audioController.runJIT();
            }
            _this4.audioController.channel3totalLength = 0x100 - data;
            _this4.audioController.checkChannel3Enable();
          }
        };
        //NR32:
        this.memoryHighWriter[0x1c] = this.memoryWriter[0xff1c] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            data &= 0x60;
            _this4.memory[0xff1c] = data;
            _this4.audioController.channel3patternType = data === 0 ? 4 : (data >> 5) - 1;
          }
        };
        //NR33:
        this.memoryHighWriter[0x1d] = this.memoryWriter[0xff1d] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            _this4.audioController.channel3frequency = _this4.audioController.channel3frequency & 0x700 | data;
            _this4.audioController.channel3FrequencyPeriod = 0x800 - _this4.audioController.channel3frequency << 1;
          }
        };
        //NR34:
        this.memoryHighWriter[0x1e] = this.memoryWriter[0xff1e] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            if (data > 0x7f) {
              if (_this4.audioController.channel3totalLength === 0) {
                _this4.audioController.channel3totalLength = 0x100;
              }
              _this4.audioController.channel3lastSampleLookup = 0;
              if ((data & 0x40) === 0x40) {
                _this4.memory[0xff26] |= 0x4;
              }
            }
            _this4.audioController.channel3consecutive = (data & 0x40) === 0x0;
            _this4.audioController.channel3frequency = (data & 0x7) << 8 | _this4.audioController.channel3frequency & 0xff;
            _this4.audioController.channel3FrequencyPeriod = 0x800 - _this4.audioController.channel3frequency << 1;
            _this4.memory[0xff1e] = data;
            _this4.audioController.checkChannel3Enable();
          }
        };
        //NR40 (Unused I/O):
        this.memoryHighWriter[0x1f] = this.memoryWriter[0xff1f] = this.cartIgnoreWrite;
        //NR41:
        this.memoryHighWriter[0x20] = this.memoryWriter[0xff20] = function (address, data) {
          if (_this4.soundMasterEnabled || !_this4.cartridge.useGBCMode) {
            if (_this4.soundMasterEnabled) {
              _this4.audioController.runJIT();
            }
            _this4.audioController.channel4totalLength = 0x40 - (data & 0x3f);
            _this4.audioController.checkChannel4Enable();
          }
        };
        //NR42:
        this.memoryHighWriter[0x21] = this.memoryWriter[0xff21] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            if (_this4.audioController.channel4Enabled && _this4.audioController.channel4envelopeSweeps === 0) {
              //Zombie Volume PAPU Bug:
              if (((_this4.memory[0xff21] ^ data) & 0x8) === 0x8) {
                if ((_this4.memory[0xff21] & 0x8) === 0) {
                  if ((_this4.memory[0xff21] & 0x7) === 0x7) {
                    _this4.audioController.channel4envelopeVolume += 2;
                  } else {
                    ++_this4.audioController.channel4envelopeVolume;
                  }
                }
                _this4.audioController.channel4envelopeVolume = 16 - _this4.audioController.channel4envelopeVolume & 0xf;
              } else if ((_this4.memory[0xff21] & 0xf) === 0x8) {
                _this4.audioController.channel4envelopeVolume = 1 + _this4.audioController.channel4envelopeVolume & 0xf;
              }
              _this4.audioController.channel4currentVolume = _this4.audioController.channel4envelopeVolume << _this4.audioController.channel4VolumeShifter;
            }
            _this4.audioController.channel4envelopeType = (data & 0x08) === 0x08;
            _this4.memory[0xff21] = data;
            _this4.audioController.cacheChannel4Update();
            _this4.audioController.checkChannel4VolumeEnable();
          }
        };
        //NR43:
        this.memoryHighWriter[0x22] = this.memoryWriter[0xff22] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            _this4.audioController.channel4FrequencyPeriod = Math.max((data & 0x7) << 4, 8) << (data >> 4);
            var bitWidth = data & 0x8;
            if (bitWidth === 0x8 && _this4.audioController.channel4BitRange === 0x7fff || bitWidth === 0 && _this4.audioController.channel4BitRange === 0x7f) {
              _this4.audioController.channel4lastSampleLookup = 0;
              _this4.audioController.channel4BitRange = bitWidth === 0x8 ? 0x7f : 0x7fff;
              _this4.audioController.channel4VolumeShifter = bitWidth === 0x8 ? 7 : 15;
              _this4.audioController.channel4currentVolume = _this4.audioController.channel4envelopeVolume << _this4.audioController.channel4VolumeShifter;
              _this4.audioController.noiseSampleTable = bitWidth === 0x8 ? _this4.audioController.LSFR7Table : _this4.audioController.LSFR15Table;
            }
            _this4.memory[0xff22] = data;
            _this4.audioController.cacheChannel4Update();
          }
        };
        //NR44:
        this.memoryHighWriter[0x23] = this.memoryWriter[0xff23] = function (address, data) {
          if (_this4.soundMasterEnabled) {
            _this4.audioController.runJIT();
            _this4.memory[0xff23] = data;
            _this4.audioController.channel4consecutive = (data & 0x40) === 0x0;
            if (data > 0x7f) {
              var nr42 = _this4.memory[0xff21];
              _this4.audioController.channel4envelopeVolume = nr42 >> 4;
              _this4.audioController.channel4currentVolume = _this4.audioController.channel4envelopeVolume << _this4.audioController.channel4VolumeShifter;
              _this4.audioController.channel4envelopeSweepsLast = (nr42 & 0x7) - 1;
              if (_this4.audioController.channel4totalLength === 0) {
                _this4.audioController.channel4totalLength = 0x40;
              }
              if ((data & 0x40) === 0x40) {
                _this4.memory[0xff26] |= 0x8;
              }
            }
            _this4.audioController.checkChannel4Enable();
          }
        };
        //NR50:
        this.memoryHighWriter[0x24] = this.memoryWriter[0xff24] = function (address, data) {
          if (_this4.soundMasterEnabled && _this4.memory[0xff24] != data) {
            _this4.audioController.runJIT();
            _this4.memory[0xff24] = data;
            _this4.audioController.VinLeftChannelMasterVolume = (data >> 4 & 0x07) + 1;
            _this4.audioController.VinRightChannelMasterVolume = (data & 0x07) + 1;
            _this4.audioController.cacheMixerOutputLevel();
          }
        };
        //NR51:
        this.memoryHighWriter[0x25] = this.memoryWriter[0xff25] = function (address, data) {
          if (_this4.soundMasterEnabled && _this4.memory[0xff25] != data) {
            _this4.audioController.runJIT();
            _this4.memory[0xff25] = data;
            _this4.audioController.rightChannel1 = (data & 0x01) === 0x01;
            _this4.audioController.rightChannel2 = (data & 0x02) === 0x02;
            _this4.audioController.rightChannel3 = (data & 0x04) === 0x04;
            _this4.audioController.rightChannel4 = (data & 0x08) === 0x08;
            _this4.audioController.leftChannel1 = (data & 0x10) === 0x10;
            _this4.audioController.leftChannel2 = (data & 0x20) === 0x20;
            _this4.audioController.leftChannel3 = (data & 0x40) === 0x40;
            _this4.audioController.leftChannel4 = data > 0x7f;
            _this4.audioController.cacheChannel1OutputLevel();
            _this4.audioController.cacheChannel2OutputLevel();
            _this4.audioController.cacheChannel3OutputLevel();
            _this4.audioController.cacheChannel4OutputLevel();
          }
        };
        //NR52:
        this.memoryHighWriter[0x26] = this.memoryWriter[0xff26] = function (address, data) {
          _this4.audioController.runJIT();
          if (!_this4.soundMasterEnabled && data > 0x7f) {
            _this4.memory[0xff26] = 0x80;
            _this4.soundMasterEnabled = true;
            _this4.audioController.initStartState();
          } else if (_this4.soundMasterEnabled && data < 0x80) {
            _this4.memory[0xff26] = 0;
            _this4.soundMasterEnabled = false;
            //GBDev wiki says the registers are written with zeros on audio off:
            for (var index = 0xff10; index < 0xff26; index++) {
              _this4.memoryWriter[index].apply(_this4, [index, 0]);
            }
          }
        };
        //0xFF27 to 0xFF2F don't do anything...
        this.memoryHighWriter[0x27] = this.memoryWriter[0xff27] = this.cartIgnoreWrite;
        this.memoryHighWriter[0x28] = this.memoryWriter[0xff28] = this.cartIgnoreWrite;
        this.memoryHighWriter[0x29] = this.memoryWriter[0xff29] = this.cartIgnoreWrite;
        this.memoryHighWriter[0x2a] = this.memoryWriter[0xff2a] = this.cartIgnoreWrite;
        this.memoryHighWriter[0x2b] = this.memoryWriter[0xff2b] = this.cartIgnoreWrite;
        this.memoryHighWriter[0x2c] = this.memoryWriter[0xff2c] = this.cartIgnoreWrite;
        this.memoryHighWriter[0x2d] = this.memoryWriter[0xff2d] = this.cartIgnoreWrite;
        this.memoryHighWriter[0x2e] = this.memoryWriter[0xff2e] = this.cartIgnoreWrite;
        this.memoryHighWriter[0x2f] = this.memoryWriter[0xff2f] = this.cartIgnoreWrite;
        //WAVE PCM RAM:
        this.memoryHighWriter[0x30] = this.memoryWriter[0xff30] = function (address, data) {
          _this4.writeChannel3RAM(0, data);
        };
        this.memoryHighWriter[0x31] = this.memoryWriter[0xff31] = function (address, data) {
          _this4.writeChannel3RAM(0x1, data);
        };
        this.memoryHighWriter[0x32] = this.memoryWriter[0xff32] = function (address, data) {
          _this4.writeChannel3RAM(0x2, data);
        };
        this.memoryHighWriter[0x33] = this.memoryWriter[0xff33] = function (address, data) {
          _this4.writeChannel3RAM(0x3, data);
        };
        this.memoryHighWriter[0x34] = this.memoryWriter[0xff34] = function (address, data) {
          _this4.writeChannel3RAM(0x4, data);
        };
        this.memoryHighWriter[0x35] = this.memoryWriter[0xff35] = function (address, data) {
          _this4.writeChannel3RAM(0x5, data);
        };
        this.memoryHighWriter[0x36] = this.memoryWriter[0xff36] = function (address, data) {
          _this4.writeChannel3RAM(0x6, data);
        };
        this.memoryHighWriter[0x37] = this.memoryWriter[0xff37] = function (address, data) {
          _this4.writeChannel3RAM(0x7, data);
        };
        this.memoryHighWriter[0x38] = this.memoryWriter[0xff38] = function (address, data) {
          _this4.writeChannel3RAM(0x8, data);
        };
        this.memoryHighWriter[0x39] = this.memoryWriter[0xff39] = function (address, data) {
          _this4.writeChannel3RAM(0x9, data);
        };
        this.memoryHighWriter[0x3a] = this.memoryWriter[0xff3a] = function (address, data) {
          _this4.writeChannel3RAM(0xa, data);
        };
        this.memoryHighWriter[0x3b] = this.memoryWriter[0xff3b] = function (address, data) {
          _this4.writeChannel3RAM(0xb, data);
        };
        this.memoryHighWriter[0x3c] = this.memoryWriter[0xff3c] = function (address, data) {
          _this4.writeChannel3RAM(0xc, data);
        };
        this.memoryHighWriter[0x3d] = this.memoryWriter[0xff3d] = function (address, data) {
          _this4.writeChannel3RAM(0xd, data);
        };
        this.memoryHighWriter[0x3e] = this.memoryWriter[0xff3e] = function (address, data) {
          _this4.writeChannel3RAM(0xe, data);
        };
        this.memoryHighWriter[0x3f] = this.memoryWriter[0xff3f] = function (address, data) {
          _this4.writeChannel3RAM(0xf, data);
        };
        //SCY
        this.memoryHighWriter[0x42] = this.memoryWriter[0xff42] = function (address, data) {
          if (_this4.backgroundY != data) {
            _this4.midScanLineJIT();
            _this4.backgroundY = data;
          }
        };
        //SCX
        this.memoryHighWriter[0x43] = this.memoryWriter[0xff43] = function (address, data) {
          if (_this4.backgroundX != data) {
            _this4.midScanLineJIT();
            _this4.backgroundX = data;
          }
        };
        //LY
        this.memoryHighWriter[0x44] = this.memoryWriter[0xff44] = function (address, data) {
          //Read Only:
          if (_this4.LCDisOn) {
            //Gambatte says to do this:
            _this4.modeSTAT = 2;
            _this4.midScanlineOffset = -1;
            _this4.cpu.totalLinesPassed = _this4.currentX = _this4.queuedScanLines = _this4.lastUnrenderedLine = _this4.LCDTicks = _this4.STATTracker = _this4.actualScanLine = _this4.memory[0xff44] = 0;
          }
        };
        //LYC
        this.memoryHighWriter[0x45] = this.memoryWriter[0xff45] = function (address, data) {
          if (_this4.memory[0xff45] != data) {
            _this4.memory[0xff45] = data;
            if (_this4.LCDisOn) {
              _this4.matchLYC(); //Get the compare of the first scan line.
            }
          }
        };
        //WY
        this.memoryHighWriter[0x4a] = this.memoryWriter[0xff4a] = function (address, data) {
          if (_this4.windowY != data) {
            _this4.midScanLineJIT();
            _this4.windowY = data;
          }
        };
        //WX
        this.memoryHighWriter[0x4b] = this.memoryWriter[0xff4b] = function (address, data) {
          if (_this4.memory[0xff4b] != data) {
            _this4.midScanLineJIT();
            _this4.memory[0xff4b] = data;
            _this4.windowX = data - 7;
          }
        };
        this.memoryHighWriter[0x72] = this.memoryWriter[0xff72] = function (address, data) {
          _this4.memory[0xff72] = data;
        };
        this.memoryHighWriter[0x73] = this.memoryWriter[0xff73] = function (address, data) {
          _this4.memory[0xff73] = data;
        };
        this.memoryHighWriter[0x75] = this.memoryWriter[0xff75] = function (address, data) {
          _this4.memory[0xff75] = data;
        };
        this.memoryHighWriter[0x76] = this.memoryWriter[0xff76] = this.cartIgnoreWrite;
        this.memoryHighWriter[0x77] = this.memoryWriter[0xff77] = this.cartIgnoreWrite;
        //IE (Interrupt Enable)
        this.memoryHighWriter[0xff] = this.memoryWriter[0xffff] = function (address, data) {
          _this4.interruptsEnabled = data;
          _this4.checkIRQMatching();
        };
        this.recompileModelSpecificIOWriteHandling();
        this.recompileBootIOWriteHandling();
      };
      GameBoyCore.prototype.recompileModelSpecificIOWriteHandling = function () {
        var _this5 = this;

        if (this.cartridge.useGBCMode) {
          //GameBoy Color Specific I/O:
          //SC (Serial Transfer Control Register)
          this.memoryHighWriter[0x2] = this.memoryWriter[0xff02] = function (address, data) {
            if ((data & 0x1) === 0x1) {
              //Internal clock:
              _this5.memory[0xff02] = data & 0x7f;
              _this5.serialTimer = (data & 0x2) === 0 ? 4096 : 128; //Set the Serial IRQ counter.
              _this5.serialShiftTimer = _this5.serialShiftTimerAllocated = (data & 0x2) === 0 ? 512 : 16; //Set the transfer data shift counter.
            } else {
              //External clock:
              _this5.memory[0xff02] = data;
              _this5.serialShiftTimer = _this5.serialShiftTimerAllocated = _this5.serialTimer = 0; //Zero the timers, since we're emulating as if nothing is connected.
            }
          };
          this.memoryHighWriter[0x40] = this.memoryWriter[0xff40] = function (address, data) {
            if (_this5.memory[0xff40] != data) {
              _this5.midScanLineJIT();
              var temp_var = data > 0x7f;
              if (temp_var != _this5.LCDisOn) {
                // When the display mode changes...
                _this5.LCDisOn = temp_var;
                _this5.memory[0xff41] &= 0x78;
                _this5.midScanlineOffset = -1;
                _this5.cpu.totalLinesPassed = _this5.currentX = _this5.queuedScanLines = _this5.lastUnrenderedLine = _this5.STATTracker = _this5.LCDTicks = _this5.actualScanLine = _this5.memory[0xff44] = 0;
                if (_this5.LCDisOn) {
                  _this5.modeSTAT = 2;
                  _this5.matchLYC(); //Get the compare of the first scan line.
                  _this5.LCDCONTROL = _this5.LINECONTROL;
                } else {
                  _this5.modeSTAT = 0;
                  _this5.LCDCONTROL = _this5.DISPLAYOFFCONTROL;
                  _this5.lcd.DisplayShowOff();
                }
                _this5.interruptsRequested &= 0xfd;
              }
              _this5.gfxWindowCHRBankPosition = (data & 0x40) === 0x40 ? 0x400 : 0;
              _this5.gfxWindowDisplay = (data & 0x20) === 0x20;
              _this5.gfxBackgroundBankOffset = (data & 0x10) === 0x10 ? 0 : 0x80;
              _this5.gfxBackgroundCHRBankPosition = (data & 0x08) === 0x08 ? 0x400 : 0;
              _this5.gfxSpriteNormalHeight = (data & 0x04) === 0;
              _this5.gfxSpriteShow = (data & 0x02) === 0x02;
              _this5.BGPriorityEnabled = (data & 0x01) === 0x01;
              _this5.priorityFlaggingPathRebuild(); //Special case the priority flagging as an optimization.
              _this5.memory[0xff40] = data;
            }
          };
          this.memoryHighWriter[0x41] = this.memoryWriter[0xff41] = function (address, data) {
            _this5.LYCMatchTriggerSTAT = (data & 0x40) === 0x40;
            _this5.mode2TriggerSTAT = (data & 0x20) === 0x20;
            _this5.mode1TriggerSTAT = (data & 0x10) === 0x10;
            _this5.mode0TriggerSTAT = (data & 0x08) === 0x08;
            _this5.memory[0xff41] = data & 0x78;
          };
          this.memoryHighWriter[0x46] = this.memoryWriter[0xff46] = function (address, data) {
            _this5.memory[0xff46] = data;
            if (data < 0xe0) {
              data <<= 8;
              address = 0xfe00;
              var stat = _this5.modeSTAT;
              _this5.modeSTAT = 0;
              var newData = 0;
              do {
                newData = _this5.memoryReader[data].apply(_this5, [data++]);
                if (newData != _this5.memory[address]) {
                  //JIT the graphics render queue:
                  _this5.modeSTAT = stat;
                  _this5.graphicsJIT();
                  _this5.modeSTAT = 0;
                  _this5.memory[address++] = newData;
                  break;
                }
              } while (++address < 0xfea0);
              if (address < 0xfea0) {
                do {
                  _this5.memory[address++] = _this5.memoryReader[data].apply(_this5, [data++]);
                  _this5.memory[address++] = _this5.memoryReader[data].apply(_this5, [data++]);
                  _this5.memory[address++] = _this5.memoryReader[data].apply(_this5, [data++]);
                  _this5.memory[address++] = _this5.memoryReader[data].apply(_this5, [data++]);
                } while (address < 0xfea0);
              }
              _this5.modeSTAT = stat;
            }
          };
          //KEY1
          this.memoryHighWriter[0x4d] = this.memoryWriter[0xff4d] = function (address, data) {
            _this5.memory[0xff4d] = data & 0x7f | _this5.memory[0xff4d] & 0x80;
          };
          this.memoryHighWriter[0x4f] = this.memoryWriter[0xff4f] = function (address, data) {
            _this5.currVRAMBank = data & 0x01;
            if (_this5.currVRAMBank > 0) {
              _this5.BGCHRCurrentBank = _this5.BGCHRBank2;
            } else {
              _this5.BGCHRCurrentBank = _this5.BGCHRBank1;
            }

            //Only writable by GBC.
          };
          this.memoryHighWriter[0x51] = this.memoryWriter[0xff51] = function (address, data) {
            if (!_this5.hdmaRunning) {
              _this5.memory[0xff51] = data;
            }
          };
          this.memoryHighWriter[0x52] = this.memoryWriter[0xff52] = function (address, data) {
            if (!_this5.hdmaRunning) {
              _this5.memory[0xff52] = data & 0xf0;
            }
          };
          this.memoryHighWriter[0x53] = this.memoryWriter[0xff53] = function (address, data) {
            if (!_this5.hdmaRunning) {
              _this5.memory[0xff53] = data & 0x1f;
            }
          };
          this.memoryHighWriter[0x54] = this.memoryWriter[0xff54] = function (address, data) {
            if (!_this5.hdmaRunning) {
              _this5.memory[0xff54] = data & 0xf0;
            }
          };
          this.memoryHighWriter[0x55] = this.memoryWriter[0xff55] = function (address, data) {
            if (!_this5.hdmaRunning) {
              if ((data & 0x80) === 0) {
                //DMA
                _this5.DMAWrite((data & 0x7f) + 1);
                _this5.memory[0xff55] = 0xff; //Transfer completed.
              } else {
                //H-Blank DMA
                _this5.hdmaRunning = true;
                _this5.memory[0xff55] = data & 0x7f;
              }
            } else if ((data & 0x80) === 0) {
              //Stop H-Blank DMA
              _this5.hdmaRunning = false;
              _this5.memory[0xff55] |= 0x80;
            } else {
              _this5.memory[0xff55] = data & 0x7f;
            }
          };
          this.memoryHighWriter[0x68] = this.memoryWriter[0xff68] = function (address, data) {
            _this5.memory[0xff69] = _this5.gbcBGRawPalette[data & 0x3f];
            _this5.memory[0xff68] = data;
          };
          this.memoryHighWriter[0x69] = this.memoryWriter[0xff69] = function (address, data) {
            _this5.updateGBCBGPalette(_this5.memory[0xff68] & 0x3f, data);
            if (_this5.memory[0xff68] > 0x7f) {
              // high bit = autoincrement
              var next = _this5.memory[0xff68] + 1 & 0x3f;
              _this5.memory[0xff68] = next | 0x80;
              _this5.memory[0xff69] = _this5.gbcBGRawPalette[next];
            } else {
              _this5.memory[0xff69] = data;
            }
          };
          this.memoryHighWriter[0x6a] = this.memoryWriter[0xff6a] = function (address, data) {
            _this5.memory[0xff6b] = _this5.gbcOBJRawPalette[data & 0x3f];
            _this5.memory[0xff6a] = data;
          };
          this.memoryHighWriter[0x6b] = this.memoryWriter[0xff6b] = function (address, data) {
            _this5.updateGBCOBJPalette(_this5.memory[0xff6a] & 0x3f, data);
            if (_this5.memory[0xff6a] > 0x7f) {
              // high bit = autoincrement
              var next = _this5.memory[0xff6a] + 1 & 0x3f;
              _this5.memory[0xff6a] = next | 0x80;
              _this5.memory[0xff6b] = _this5.gbcOBJRawPalette[next];
            } else {
              _this5.memory[0xff6b] = data;
            }
          };
          //SVBK
          this.memoryHighWriter[0x70] = this.memoryWriter[0xff70] = function (address, data) {
            var addressCheck = _this5.memory[0xff51] << 8 | _this5.memory[0xff52]; //Cannot change the RAM bank while WRAM is the source of a running HDMA.
            if (!_this5.hdmaRunning || addressCheck < 0xd000 || addressCheck >= 0xe000) {
              _this5.gbcRamBank = Math.max(data & 0x07, 1); //Bank range is from 1-7
              _this5.gbcRamBankPosition = (_this5.gbcRamBank - 1 << 12) - 0xd000;
              _this5.gbcRamBankPositionECHO = _this5.gbcRamBankPosition - 0x2000;
            }
            _this5.memory[0xff70] = data; //Bit 6 cannot be written to.
          };
          this.memoryHighWriter[0x74] = this.memoryWriter[0xff74] = function (address, data) {
            _this5.memory[0xff74] = data;
          };
        } else {
          //Fill in the GameBoy Color I/O registers as normal RAM for GameBoy compatibility:
          //SC (Serial Transfer Control Register)
          this.memoryHighWriter[0x2] = this.memoryWriter[0xff02] = function (address, data) {
            if ((data & 0x1) === 0x1) {
              //Internal clock:
              _this5.memory[0xff02] = data & 0x7f;
              _this5.serialTimer = 4096; //Set the Serial IRQ counter.
              _this5.serialShiftTimer = _this5.serialShiftTimerAllocated = 512; //Set the transfer data shift counter.
            } else {
              //External clock:
              _this5.memory[0xff02] = data;
              _this5.serialShiftTimer = _this5.serialShiftTimerAllocated = _this5.serialTimer = 0; //Zero the timers, since we're emulating as if nothing is connected.
            }
          };
          this.memoryHighWriter[0x40] = this.memoryWriter[0xff40] = function (address, data) {
            if (_this5.memory[0xff40] != data) {
              _this5.midScanLineJIT();
              var temp_var = data > 0x7f;
              if (temp_var != _this5.LCDisOn) {
                //When the display mode changes...
                _this5.LCDisOn = temp_var;
                _this5.memory[0xff41] &= 0x78;
                _this5.midScanlineOffset = -1;
                _this5.cpu.totalLinesPassed = _this5.currentX = _this5.queuedScanLines = _this5.lastUnrenderedLine = _this5.STATTracker = _this5.LCDTicks = _this5.actualScanLine = _this5.memory[0xff44] = 0;
                if (_this5.LCDisOn) {
                  _this5.modeSTAT = 2;
                  _this5.matchLYC(); //Get the compare of the first scan line.
                  _this5.LCDCONTROL = _this5.LINECONTROL;
                } else {
                  _this5.modeSTAT = 0;
                  _this5.LCDCONTROL = _this5.DISPLAYOFFCONTROL;
                  _this5.lcd.DisplayShowOff();
                }
                _this5.interruptsRequested &= 0xfd;
              }
              _this5.gfxWindowCHRBankPosition = (data & 0x40) === 0x40 ? 0x400 : 0;
              _this5.gfxWindowDisplay = (data & 0x20) === 0x20;
              _this5.gfxBackgroundBankOffset = (data & 0x10) === 0x10 ? 0 : 0x80;
              _this5.gfxBackgroundCHRBankPosition = (data & 0x08) === 0x08 ? 0x400 : 0;
              _this5.gfxSpriteNormalHeight = (data & 0x04) === 0;
              _this5.gfxSpriteShow = (data & 0x02) === 0x02;
              _this5.bgEnabled = (data & 0x01) === 0x01;
              _this5.memory[0xff40] = data;
            }
          };
          this.memoryHighWriter[0x41] = this.memoryWriter[0xff41] = function (address, data) {
            _this5.LYCMatchTriggerSTAT = (data & 0x40) === 0x40;
            _this5.mode2TriggerSTAT = (data & 0x20) === 0x20;
            _this5.mode1TriggerSTAT = (data & 0x10) === 0x10;
            _this5.mode0TriggerSTAT = (data & 0x08) === 0x08;
            _this5.memory[0xff41] = data & 0x78;
            if ((!_this5.usedBootROM || !_this5.usedGBCBootROM) && _this5.LCDisOn && _this5.modeSTAT < 2) {
              _this5.interruptsRequested |= 0x2;
              _this5.checkIRQMatching();
            }
          };
          this.memoryHighWriter[0x46] = this.memoryWriter[0xff46] = function (address, data) {
            _this5.memory[0xff46] = data;
            if (data > 0x7f && data < 0xe0) {
              //DMG cannot DMA from the ROM banks.
              data <<= 8;
              address = 0xfe00;
              var stat = _this5.modeSTAT;
              _this5.modeSTAT = 0;
              var newData = 0;
              do {
                newData = _this5.memoryReader[data].apply(_this5, [data++]);
                if (newData != _this5.memory[address]) {
                  //JIT the graphics render queue:
                  _this5.modeSTAT = stat;
                  _this5.graphicsJIT();
                  _this5.modeSTAT = 0;
                  _this5.memory[address++] = newData;
                  break;
                }
              } while (++address < 0xfea0);
              if (address < 0xfea0) {
                do {
                  _this5.memory[address++] = _this5.memoryReader[data].apply(_this5, [data++]);
                  _this5.memory[address++] = _this5.memoryReader[data].apply(_this5, [data++]);
                  _this5.memory[address++] = _this5.memoryReader[data].apply(_this5, [data++]);
                  _this5.memory[address++] = _this5.memoryReader[data].apply(_this5, [data++]);
                } while (address < 0xfea0);
              }
              _this5.modeSTAT = stat;
            }
          };
          this.memoryHighWriter[0x47] = this.memoryWriter[0xff47] = function (address, data) {
            if (_this5.memory[0xff47] != data) {
              _this5.midScanLineJIT();
              _this5.updateGBBGPalette(data);
              _this5.memory[0xff47] = data;
            }
          };
          this.memoryHighWriter[0x48] = this.memoryWriter[0xff48] = function (address, data) {
            if (_this5.memory[0xff48] != data) {
              _this5.midScanLineJIT();
              _this5.updateGBOBJPalette(0, data);
              _this5.memory[0xff48] = data;
            }
          };
          this.memoryHighWriter[0x49] = this.memoryWriter[0xff49] = function (address, data) {
            if (_this5.memory[0xff49] != data) {
              _this5.midScanLineJIT();
              _this5.updateGBOBJPalette(4, data);
              _this5.memory[0xff49] = data;
            }
          };
          this.memoryHighWriter[0x4d] = this.memoryWriter[0xff4d] = function (address, data) {
            _this5.memory[0xff4d] = data;
          };
          this.memoryHighWriter[0x4f] = this.memoryWriter[0xff4f] = this.cartIgnoreWrite; //Not writable in DMG mode.
          this.memoryHighWriter[0x55] = this.memoryWriter[0xff55] = this.cartIgnoreWrite;
          this.memoryHighWriter[0x68] = this.memoryWriter[0xff68] = this.cartIgnoreWrite;
          this.memoryHighWriter[0x69] = this.memoryWriter[0xff69] = this.cartIgnoreWrite;
          this.memoryHighWriter[0x6a] = this.memoryWriter[0xff6a] = this.cartIgnoreWrite;
          this.memoryHighWriter[0x6b] = this.memoryWriter[0xff6b] = this.cartIgnoreWrite;
          this.memoryHighWriter[0x6c] = this.memoryWriter[0xff6c] = this.cartIgnoreWrite;
          this.memoryHighWriter[0x70] = this.memoryWriter[0xff70] = this.cartIgnoreWrite;
          this.memoryHighWriter[0x74] = this.memoryWriter[0xff74] = this.cartIgnoreWrite;
        }
      };
      GameBoyCore.prototype.recompileBootIOWriteHandling = function () {
        var _this6 = this;

        //Boot I/O Registers:
        if (this.inBootstrap) {
          this.memoryHighWriter[0x50] = this.memoryWriter[0xff50] = function (address, data) {
            console.log("Boot ROM reads blocked: Bootstrap process has ended.", 0);
            _this6.inBootstrap = false;
            _this6.disableBootROM(); //Fill in the boot ROM ranges with ROM  bank 0 ROM ranges
            _this6.memory[0xff50] = data; //Bits are sustained in memory?
          };
          if (this.cartridge.useGBCMode) {
            this.memoryHighWriter[0x6c] = this.memoryWriter[0xff6c] = function (address, data) {
              if (_this6.inBootstrap) {
                _this6.cartridge.setGBCMode(data);
              }
              _this6.memory[0xff6c] = data;
            };
          }
        } else {
          //Lockout the ROMs from accessing the BOOT ROM control register:
          this.memoryHighWriter[0x50] = this.memoryWriter[0xff50] = this.cartIgnoreWrite;
        }
      };

      _export('LocalStorage', LocalStorage = function () {
        function LocalStorage() {
          _classCallCheck(this, LocalStorage);
        }

        _createClass(LocalStorage, [{
          key: "findState",
          value: function findState(name) {
            return this.find("state-" + name);
          }
        }, {
          key: "findSRAM",
          value: function findSRAM(name) {
            return this.find("sram-" + name);
          }
        }, {
          key: "findRTC",
          value: function findRTC(name) {
            return this.find("rtc-" + name);
          }
        }, {
          key: "setState",
          value: function () {
            var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(name, buffer) {
              return _regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return this.set("state-" + name, buffer);

                    case 2:
                      return _context.abrupt("return", _context.sent);

                    case 3:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, this);
            }));

            function setState(_x, _x2) {
              return _ref.apply(this, arguments);
            }

            return setState;
          }()
        }, {
          key: "setSRAM",
          value: function () {
            var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(name, buffer) {
              return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return this.set("sram-" + name, buffer);

                    case 2:
                      return _context2.abrupt("return", _context2.sent);

                    case 3:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2, this);
            }));

            function setSRAM(_x3, _x4) {
              return _ref2.apply(this, arguments);
            }

            return setSRAM;
          }()
        }, {
          key: "setRTC",
          value: function () {
            var _ref3 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(name, buffer) {
              return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return this.set("rtc-" + name, buffer);

                    case 2:
                      return _context3.abrupt("return", _context3.sent);

                    case 3:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3, this);
            }));

            function setRTC(_x5, _x6) {
              return _ref3.apply(this, arguments);
            }

            return setRTC;
          }()
        }, {
          key: "find",
          value: function find(name) {
            var data = window.localStorage.getItem(name);
            return base64ToArrayBuffer(data);
          }
        }, {
          key: "set",
          value: function set(name, buffer) {
            var data = arrayBufferToBase64(buffer);
            window.localStorage.setItem(name, data);
          }
        }]);

        return LocalStorage;
      }());

      ROM = function () {
        function ROM(data) {
          _classCallCheck(this, ROM);

          if (data instanceof ArrayBuffer) {
            this.data = new Uint8Array(data);
          } else if (typeof data === "string") {
            var dataLength = data.length;
            var buffer = new ArrayBuffer(dataLength);
            var view = new Uint8Array(buffer);
            for (var i = 0; i < dataLength; i++) {
              view[i] = data.charCodeAt(i);
            }
            this.data = view;
          } else {
            this.data = data;
          }
        }

        _createClass(ROM, [{
          key: "getByte",
          value: function getByte(index) {
            return this.data[index];
          }
        }, {
          key: "getChar",
          value: function getChar(index) {
            return String.fromCharCode(this.data[index]);
          }
        }, {
          key: "getString",
          value: function getString(from, to) {
            var text = "";
            for (var index = from; index <= to; index++) {
              if (this.getByte(index) > 0) {
                text += this.getChar(index);
              }
            }

            return text;
          }
        }, {
          key: "length",
          get: function get() {
            return this.data.length;
          }
        }]);

        return ROM;
      }();

      MBC = function (_EventEmitter) {
        _inherits(MBC, _EventEmitter);

        function MBC(cartridge) {
          _classCallCheck(this, MBC);

          var _this = _possibleConstructorReturn(this, (MBC.__proto__ || Object.getPrototypeOf(MBC)).call(this));

          _this.romSizes = [0x00008000, // 32K
          0x00010000, // 64K
          0x00020000, // 128K
          0x00040000, // 256K
          0x00080000, // 512K
          0x00100000, // 1024K
          0x00200000, // 2048K
          0x00400000, // 4096K
          0x00800000 // 8192K
          ];
          _this.ramSizes = [0x00000000, // 0K
          0x00002000, // 2K  // Changed to 2000 to avoid problems
          0x00002000, // 8K
          0x00008000, // 32K
          0x00020000, // 128K
          0x00010000 // 64K
          ];

          _this.cartridge = cartridge;
          _this.MBCRAMBanksEnabled = false; // MBC RAM Access Control.
          _this.currentRAMBankPosition = -0xa000; // MBC Position Adder;
          _this.currentMBCRAMBank = 0; // MBC Currently Indexed RAM Bank
          _this.ROMBankEdge = Math.floor(cartridge.rom.length / 0x4000);
          return _this;
        }

        _createClass(MBC, [{
          key: "setupROM",
          value: function setupROM() {
            this.romSize = this.romSizes[this.cartridge.romSizeType];
            console.log("ROM size 0x" + this.romSize.toString(16));
          }
        }, {
          key: "setupRAM",
          value: function setupRAM() {
            this.ramSize = this.ramSizes[this.cartridge.ramSizeType];
            console.log("RAM size 0x" + this.ramSize.toString(16));
            this.RAM = getTypedArray(this.ramSize, 0, "uint8"); // Switchable RAM (Used by games for more RAM) for the main memory range 0xA000 - 0xC000.
          }
        }, {
          key: "loadSRAM",
          value: function loadSRAM(data) {
            if (data.length !== this.ramSize) return;
            this.RAM = data.slice(0);
          }
        }, {
          key: "getSRAM",
          value: function getSRAM() {
            return new Uint8Array(this.RAM.buffer.slice(0, this.ramSize));
          }
        }, {
          key: "cutSRAMFromBatteryFileArray",
          value: function cutSRAMFromBatteryFileArray(data) {
            return new Uint8Array(data.buffer.slice(0, this.ramSize));
          }
        }, {
          key: "saveState",
          value: function saveState() {
            // TODO: remove after state refactor
            if (!this.cartridge.hasBattery || this.RAM.length === 0) return; // No battery backup...

            // return the MBC RAM for backup...
            return fromTypedArray(this.RAM);
          }
        }, {
          key: "readRAM",
          value: function readRAM(address) {
            // Switchable RAM
            if (this.MBCRAMBanksEnabled || settings.alwaysAllowRWtoBanks) {
              return this.RAM[address + this.currentRAMBankPosition];
            }
            //console.log("Reading from disabled RAM.");
            return 0xff;
          }
        }, {
          key: "writeRAM",
          value: function writeRAM(address, data) {
            if (this.MBCRAMBanksEnabled || settings.alwaysAllowRWtoBanks) {
              this.emit("ramWrite");
              this.RAM[address + this.currentRAMBankPosition] = data;
            }
          }

          // TODO: for MBC2 & MBC3, compare with other MBCx

        }, {
          key: "setCurrentROMBank",
          value: function setCurrentROMBank() {
            //Read the cartridge ROM data from RAM memory:
            //Only map bank 0 to bank 1 here (MBC2 is like MBC1, but can only do 16 banks, so only the bank 0 quirk appears for MBC2):
            this.currentROMBank = Math.max(this.ROMBank1Offset % this.ROMBankEdge - 1, 0) << 14;
          }
        }, {
          key: "writeEnable",
          value: function writeEnable(address, data) {
            // MBC RAM Bank Enable/Disable:
            this.MBCRAMBanksEnabled = (data & 0x0f) === 0x0a; // If lower nibble is 0x0A, then enable, otherwise disable.
          }
        }]);

        return MBC;
      }(EventEmitter);

      MBC1 = function (_MBC) {
        _inherits(MBC1, _MBC);

        function MBC1(cartridge) {
          _classCallCheck(this, MBC1);

          var _this = _possibleConstructorReturn(this, (MBC1.__proto__ || Object.getPrototypeOf(MBC1)).call(this, cartridge));

          _this.MBC1Mode = false; // MBC1 Type (4/32, 16/8)
          return _this;
        }

        _createClass(MBC1, [{
          key: "writeType",
          value: function writeType(address, data) {
            // MBC1 mode setting:
            this.MBC1Mode = (data & 0x1) === 0x1;
            if (this.MBC1Mode) {
              this.ROMBank1Offset &= 0x1f;
              this.setCurrentROMBank();
            } else {
              this.currentMBCRAMBank = 0;
              this.currentRAMBankPosition = -0xa000;
            }
          }
        }, {
          key: "writeROMBank",
          value: function writeROMBank(address, data) {
            // MBC1 ROM bank switching:
            this.ROMBank1Offset = this.ROMBank1Offset & 0x60 | data & 0x1f;
            this.setCurrentROMBank();
          }
        }, {
          key: "writeRAMBank",
          value: function writeRAMBank(address, data) {
            // MBC1 RAM bank switching
            if (this.MBC1Mode) {
              // 4/32 Mode
              this.currentMBCRAMBank = data & 0x03;
              this.currentRAMBankPosition = (this.currentMBCRAMBank << 13) - 0xa000;
            } else {
              // 16/8 Mode
              this.ROMBank1Offset = (data & 0x03) << 5 | this.ROMBank1Offset & 0x1f;
              this.setCurrentROMBank();
            }
          }
        }, {
          key: "setCurrentROMBank",
          value: function setCurrentROMBank() {
            // Read the cartridge ROM data from RAM memory:
            switch (this.ROMBank1Offset) {
              case 0x00:
              case 0x20:
              case 0x40:
              case 0x60:
                // Bank calls for 0x00, 0x20, 0x40, and 0x60 are really for 0x01, 0x21, 0x41, and 0x61.
                this.currentROMBank = this.ROMBank1Offset % this.ROMBankEdge << 14;
                break;
              default:
                this.currentROMBank = this.ROMBank1Offset % this.ROMBankEdge - 1 << 14;
            }
          }
        }]);

        return MBC1;
      }(MBC);

      MBC2 = function (_MBC) {
        _inherits(MBC2, _MBC);

        function MBC2() {
          _classCallCheck(this, MBC2);

          return _possibleConstructorReturn(this, (MBC2.__proto__ || Object.getPrototypeOf(MBC2)).apply(this, arguments));
        }

        _createClass(MBC2, [{
          key: "writeROMBank",
          value: function writeROMBank(address, data) {
            // MBC2 ROM bank switching:
            this.ROMBank1Offset = data & 0x0f;
            this.setCurrentROMBank();
          }
        }]);

        return MBC2;
      }(MBC);

      RTC = function () {
        function RTC(mbc) {
          _classCallCheck(this, RTC);

          this.mbc = mbc;
        }

        // TODO: rename RTC vars

        _createClass(RTC, [{
          key: "writeSeconds",
          value: function writeSeconds(data) {
            if (data < 60) {
              this.RTCSeconds = data;
            } else {
              console.log("(Bank #" + this.mbc.currentMBCRAMBank + ") RTC write out of range: " + data);
            }
          }
        }, {
          key: "writeMinutes",
          value: function writeMinutes(data) {
            if (data < 60) {
              this.RTCMinutes = data;
            } else {
              console.log("(Bank #" + this.mbc.currentMBCRAMBank + ") RTC write out of range: " + data);
            }
          }
        }, {
          key: "writeDaysLow",
          value: function writeDaysLow(data) {
            this.RTCDays = data & 0xff | this.RTCDays & 0x100;
          }
        }, {
          key: "writeDaysHigh",
          value: function writeDaysHigh(data) {
            this.RTCDayOverFlow = data > 0x7f;
            this.RTCHalt = (data & 0x40) === 0x40;
            this.RTCDays = (data & 0x1) << 8 | this.RTCDays & 0xff;
          }
        }, {
          key: "writeHours",
          value: function writeHours(data) {
            if (data < 24) {
              this.RTCHours = data;
            } else {
              console.log("(Bank #" + this.mbc.currentMBCRAMBank + ") RTC write out of range: " + data);
            }
          }
        }, {
          key: "readSeconds",
          value: function readSeconds() {
            return this.latchedSeconds;
          }
        }, {
          key: "readMinutes",
          value: function readMinutes() {
            return this.latchedMinutes;
          }
        }, {
          key: "readHours",
          value: function readHours() {
            return this.latchedHours;
          }
        }, {
          key: "readDaysLow",
          value: function readDaysLow() {
            return this.latchedLDays;
          }
        }, {
          key: "readDaysHigh",
          value: function readDaysHigh() {
            return (this.RTCDayOverFlow ? 0x80 : 0) + (this.RTCHALT ? 0x40 : 0) + this.latchedHDays;
          }
        }, {
          key: "writeLatch",
          value: function writeLatch(address, data) {
            if (data === 0) {
              this.RTCisLatched = false;
            } else if (!this.RTCisLatched) {
              // Copy over the current RTC time for reading.
              this.RTCisLatched = true;
              this.latchedSeconds = this.RTCSeconds | 0;
              this.latchedMinutes = this.RTCMinutes;
              this.latchedHours = this.RTCHours;
              this.latchedLDays = this.RTCDays & 0xff;
              this.latchedHDays = this.RTCDays >> 8;
            }
          }
        }, {
          key: "get",
          value: function get() {
            var lastTimeSeconds = Math.round(this.lastTime / 1000);
            var lastTimeLow = lastTimeSeconds >> 0 & 0xffff;
            var lastTimeHigh = lastTimeSeconds >> 16 & 0xffff;

            var data = new Uint32Array([this.RTCSeconds, this.RTCMinutes, this.RTCHours, this.RTCDays, this.RTCDayOverFlow, this.latchedSeconds, this.latchedMinutes, this.latchedHours, this.latchedLDays, this.latchedHDays, lastTimeLow, lastTimeHigh]);

            return data;
          }
        }, {
          key: "load",
          value: function load(array) {
            var options = this.extract(array);

            this.RTCSeconds = options.seconds;
            this.RTCMinutes = options.minutes;
            this.RTCHours = options.hours;
            this.RTCDays = options.daysLow;
            this.RTCDayOverFlow = options.daysHigh;

            this.latchedSeconds = options.latchedSeconds;
            this.latchedMinutes = options.latchedMinutes;
            this.latchedHours = options.latchedHours;
            this.latchedLDays = options.latchedDaysLow;
            this.latchedHDays = options.latchedDaysHigh;

            this.lastTime = options.lastTime;
          }
        }, {
          key: "cutBatteryFileArray",
          value: function cutBatteryFileArray(data) {
            return new Uint32Array(data.buffer.slice(this.mbc.ramSize, this.mbc.ramSize + 4 * 12));
          }
        }, {
          key: "extract",
          value: function extract(array) {
            var seconds = array[0];
            var minutes = array[1];
            var hours = array[2];
            var daysLow = array[3];
            var daysHigh = array[4];
            var latchedSeconds = array[5];
            var latchedMinutes = array[6];
            var latchedHours = array[7];
            var latchedDaysLow = array[8];
            var latchedDaysHigh = array[9];
            var lastTimeLow = array[10];
            var lastTimeHigh = array[11];

            var lastTimeSeconds = lastTimeLow;
            if (lastTimeLow && lastTimeHigh) {
              lastTimeSeconds = lastTimeHigh << 16 | lastTimeLow;
            }

            return {
              seconds: seconds,
              minutes: minutes,
              hours: hours,
              daysLow: daysLow,
              daysHigh: daysHigh,
              latchedSeconds: latchedSeconds,
              latchedMinutes: latchedMinutes,
              latchedHours: latchedHours,
              latchedDaysLow: latchedDaysLow,
              latchedDaysHigh: latchedDaysHigh,
              lastTime: lastTimeSeconds * 1000
            };
          }
        }, {
          key: "saveState",
          value: function saveState() {
            // TODO: remove after state refactor
            // return the MBC RAM for backup...
            return [this.lastTime, this.RTCisLatched, this.latchedSeconds, this.latchedMinutes, this.latchedHours, this.latchedLDays, this.latchedHDays, this.RTCSeconds, this.RTCMinutes, this.RTCHours, this.RTCDays, this.RTCDayOverFlow, this.RTCHALT];
          }
        }, {
          key: "loadState",
          value: function loadState(data) {
            var index = 0;
            this.lastTime = data[index++];
            this.RTCisLatched = data[index++];
            this.latchedSeconds = data[index++];
            this.latchedMinutes = data[index++];
            this.latchedHours = data[index++];
            this.latchedLDays = data[index++];
            this.latchedHDays = data[index++];
            this.RTCSeconds = data[index++];
            this.RTCMinutes = data[index++];
            this.RTCHours = data[index++];
            this.RTCDays = data[index++];
            this.RTCDayOverFlow = data[index++];
            this.RTCHALT = data[index];
          }
        }, {
          key: "updateClock",
          value: function updateClock() {
            var currentTime = new Date().getTime();
            var elapsedTime = currentTime - this.lastTime;
            this.lastTime = currentTime;

            if (!this.RTCHALT) {
              //Update the MBC3 RTC:
              this.RTCSeconds += elapsedTime / 1000;
              while (this.RTCSeconds >= 60) {
                // System can stutter, so the seconds difference can get large, thus the "while".
                this.RTCSeconds -= 60;
                ++this.RTCMinutes;
                if (this.RTCMinutes >= 60) {
                  this.RTCMinutes -= 60;
                  ++this.RTCHours;
                  if (this.RTCHours >= 24) {
                    this.RTCHours -= 24;
                    ++this.RTCDays;
                    if (this.RTCDays >= 512) {
                      this.RTCDays -= 512;
                      this.RTCDayOverFlow = true;
                    }
                  }
                }
              }
            }
          }
        }]);

        return RTC;
      }();

      MBC3 = function (_MBC) {
        _inherits(MBC3, _MBC);

        function MBC3(cartridge) {
          _classCallCheck(this, MBC3);

          var _this = _possibleConstructorReturn(this, (MBC3.__proto__ || Object.getPrototypeOf(MBC3)).call(this, cartridge));

          _this.rtc = new RTC(_this);
          return _this;
        }

        _createClass(MBC3, [{
          key: "writeROMBank",
          value: function writeROMBank(address, data) {
            // MBC3 ROM bank switching:
            this.ROMBank1Offset = data & 0x7f;
            this.setCurrentROMBank();
          }
        }, {
          key: "writeRAMBank",
          value: function writeRAMBank(address, data) {
            this.currentMBCRAMBank = data;
            if (data < 4) {
              // MBC3 RAM bank switching
              this.currentRAMBankPosition = (this.currentMBCRAMBank << 13) - 0xa000;
            }
          }
        }, {
          key: "writeRAM",
          value: function writeRAM(address, data) {
            if (this.MBCRAMBanksEnabled || settings.alwaysAllowRWtoBanks) {
              switch (this.currentMBCRAMBank) {
                case 0x00:
                case 0x01:
                case 0x02:
                case 0x03:
                  this.emit("ramWrite");
                  this.RAM[address + this.currentRAMBankPosition] = data;
                  break;
                case 0x08:
                  this.rtc && this.rtc.writeSeconds(data);
                  break;
                case 0x09:
                  this.rtc && this.rtc.writeMinutes(data);
                  break;
                case 0x0a:
                  this.rtc && this.rtc.writeHours(data);
                  break;
                case 0x0b:
                  this.rtc && this.rtc.writeDaysLow(data);
                  break;
                case 0x0c:
                  this.rtc && this.rtc.writeDaysHigh(data);
                  break;
                default:
                  console.log("Invalid MBC3 bank address selected: " + this.currentMBCRAMBank);
              }
            }
          }
        }, {
          key: "readRAM",
          value: function readRAM(address) {
            // Switchable RAM
            if (this.MBCRAMBanksEnabled || settings.alwaysAllowRWtoBanks) {
              switch (this.currentMBCRAMBank) {
                case 0x00:
                case 0x01:
                case 0x02:
                case 0x03:
                  return this.RAM[address + this.currentRAMBankPosition];
                  break;
                case 0x08:
                  return this.rtc && this.rtc.readSeconds();
                  break;
                case 0x09:
                  return this.rtc && this.rtc.readMinutes();
                  break;
                case 0x0a:
                  return this.rtc && this.rtc.readHours();
                  break;
                case 0x0b:
                  return this.rtc && this.rtc.readDaysLow();
                  break;
                case 0x0c:
                  return this.rtc && this.rtc.readDaysHigh();
              }
            }
            //console.log("Reading from invalid or disabled RAM.");
            return 0xff;
          }
        }]);

        return MBC3;
      }(MBC);

      MBC5 = function (_MBC) {
        _inherits(MBC5, _MBC);

        function MBC5() {
          _classCallCheck(this, MBC5);

          return _possibleConstructorReturn(this, (MBC5.__proto__ || Object.getPrototypeOf(MBC5)).apply(this, arguments));
        }

        _createClass(MBC5, [{
          key: "setCurrentROMBank",
          value: function setCurrentROMBank() {
            // Read the cartridge ROM data from RAM memory:
            this.currentROMBank = this.ROMBank1Offset % this.ROMBankEdge - 1 << 14;
          }
        }, {
          key: "writeROMBankLow",
          value: function writeROMBankLow(address, data) {
            // MBC5 ROM bank switching:
            this.ROMBank1Offset = this.ROMBank1Offset & 0x100 | data;
            this.setCurrentROMBank();
          }
        }, {
          key: "writeROMBankHigh",
          value: function writeROMBankHigh(address, data) {
            // MBC5 ROM bank switching (by least significant bit):
            this.ROMBank1Offset = (data & 0x01) << 8 | this.ROMBank1Offset & 0xff;
            this.setCurrentROMBank();
          }
        }, {
          key: "writeRAMBank",
          value: function writeRAMBank(address, data) {
            // MBC5 RAM bank switching
            this.currentMBCRAMBank = data & 0xf;
            this.currentRAMBankPosition = (this.currentMBCRAMBank << 13) - 0xa000;
          }
        }]);

        return MBC5;
      }(MBC);

      MBC7 = function (_MBC) {
        _inherits(MBC7, _MBC);

        function MBC7(cartridge) {
          _classCallCheck(this, MBC7);

          // Gyro
          var _this = _possibleConstructorReturn(this, (MBC7.__proto__ || Object.getPrototypeOf(MBC7)).call(this, cartridge));

          _this.highX = 127;
          _this.lowX = 127;
          _this.highY = 127;
          _this.lowY = 127;
          return _this;
        }

        _createClass(MBC7, [{
          key: "applyGyroEvent",
          value: function applyGyroEvent(x, y) {
            x *= -100;
            x += 2047;
            this.highX = x >> 8;
            this.lowX = x & 0xff;
            y *= -100;
            y += 2047;
            this.highY = y >> 8;
            this.lowY = y & 0xff;
          }
        }, {
          key: "read",
          value: function read(address) {
            // Switchable RAM
            if (this.MBCRAMBanksEnabled || settings.alwaysAllowRWtoBanks) {
              switch (address) {
                case 0xa000:
                case 0xa060:
                case 0xa070:
                  return 0;
                case 0xa080:
                  // TODO: Gyro Control Register
                  return 0;
                case 0xa050:
                  //Y High Byte
                  return this.highY;
                case 0xa040:
                  //Y Low Byte
                  return this.lowY;
                case 0xa030:
                  //X High Byte
                  return this.highX;
                case 0xa020:
                  //X Low Byte:
                  return this.lowX;
                default:
                  return this.RAM[address + this.currentRAMBankPosition];
              }
            }
            //console.log("Reading from disabled RAM.", 1);
            return 0xff;
          }
        }]);

        return MBC7;
      }(MBC);

      Cartridge = function () {
        function Cartridge(rom) {
          _classCallCheck(this, Cartridge);

          this.rom = new ROM(rom);

          this.hasMBC1 = false; // Does the cartridge use MBC1?
          this.hasMBC2 = false; // Does the cartridge use MBC2?
          this.hasMBC3 = false; // Does the cartridge use MBC3?
          this.hasMBC5 = false; // Does the cartridge use MBC5?
          this.hasMBC7 = false; // Does the cartridge use MBC7?
          this.hasSRAM = false; // Does the cartridge use save RAM?
          this.cMMMO1 = false; // ...
          this.hasBattery = false;
          this.cRUMBLE = false; // Does the cartridge use the RUMBLE addressing (modified MBC5)?
          this.cCamera = false; // Is the cartridge actually a GameBoy Camera?
          this.cTAMA5 = false; // Does the cartridge use TAMA5? (Tamagotchi Cartridge)
          this.cHuC3 = false; // Does the cartridge use HuC3 (Hudson Soft / modified MBC3)?
          this.cHuC1 = false; // Does the cartridge use HuC1 (Hudson Soft / modified MBC1)?
          this.hasRTC = false; // Does the cartridge have an RTC?
        }

        _createClass(Cartridge, [{
          key: "connect",
          value: function connect(gameboy) {
            this.gameboy = gameboy;
            this.parseROM();
          }
        }, {
          key: "parseROM",
          value: function parseROM() {
            // TODO: move to gameboy core
            // Load the first two ROM banks (0x0000 - 0x7FFF) into regular gameboy memory:
            this.gameboy.usedBootROM = settings.bootBootRomFirst && (!settings.forceGBBootRom && this.gameboy.GBCBOOTROM.length === 0x800 || settings.forceGBBootRom && this.gameboy.GBBOOTROM.length === 0x100);

            // http://www.enliten.force9.co.uk/gameboy/carthead.htm
            if (this.rom.length < 0x4000) throw new Error("ROM size too small.");

            var romIndex = 0;
            if (this.gameboy.usedBootROM) {
              if (!settings.forceGBBootRom) {
                // Patch in the GBC boot ROM into the memory map:
                while (romIndex < 0x100) {
                  this.memory[romIndex] = this.GBCBOOTROM[romIndex]; // Load in the GameBoy Color BOOT ROM.
                  this.ROM[romIndex] = this.rom.getByte(romIndex); // Decode the ROM binary for the switch out.
                  ++romIndex;
                }

                while (romIndex < 0x200) {
                  this.memory[romIndex] = this.ROM[romIndex] = this.rom.getByte(romIndex); // Load in the game ROM.
                  ++romIndex;
                }

                while (romIndex < 0x900) {
                  this.memory[romIndex] = this.GBCBOOTROM[romIndex - 0x100]; // Load in the GameBoy Color BOOT ROM.
                  this.ROM[romIndex] = this.rom.getByte(romIndex); // Decode the ROM binary for the switch out.
                  ++romIndex;
                }

                this.usedGBCBootROM = true;
              } else {
                // Patch in the GB boot ROM into the memory map:
                while (romIndex < 0x100) {
                  this.memory[romIndex] = this.GBBOOTROM[romIndex]; // Load in the GameBoy BOOT ROM.
                  this.ROM[romIndex] = this.rom.getByte(romIndex); // Decode the ROM binary for the switch out.
                  ++romIndex;
                }
              }

              while (romIndex < 0x4000) {
                this.memory[romIndex] = this.ROM[romIndex] = this.rom.getByte(romIndex); // Load in the game ROM.
                ++romIndex;
              }
            } else {
              // Don't load in the boot ROM:
              while (romIndex < 0x4000) {
                this.gameboy.memory[romIndex] = this.rom.getByte(romIndex) & 0xff;
                ++romIndex;
              }
            }
          }
        }, {
          key: "interpret",
          value: function interpret() {
            this.name = this.rom.getString(0x134, 0x13e);
            this.gameCode = this.rom.getString(0x13f, 0x142);
            this.colorCompatibilityByte = this.rom.getByte(0x143);
            this.type = this.rom.getByte(0x147);
            this.setTypeName();

            if (this.name) {
              console.log("Game Title: " + this.name);
            }
            if (this.gameCode) {
              console.log("Game Code: " + this.gameCode);
            }
            if (this.colorCompatibilityByte) {
              console.log("Color Compatibility Byte: " + this.colorCompatibilityByte);
            }
            if (this.type) {
              console.log("Cartridge Type: " + this.type);
            }
            if (this.typeName) {
              console.log("Cartridge Type Name: " + this.typeName);
            }

            this.romSizeType = this.rom.getByte(0x148);
            this.ramSizeType = this.rom.getByte(0x149);

            // Check the GB/GBC mode byte:
            if (!this.gameboy.usedBootROM) {
              switch (this.colorCompatibilityByte) {
                case 0x00:
                  // GB only
                  this.useGBCMode = false;
                  break;
                case 0x32:
                  // Exception to the GBC identifying code:
                  if (!settings.gbHasPriority && this.name + this.gameCode + this.colorCompatibilityByte === "Game and Watch 50") {
                    this.useGBCMode = true;
                    console.log("Created a boot exception for Game and Watch Gallery 2 (GBC ID byte is wrong on the cartridge).");
                  } else {
                    this.useGBCMode = false;
                  }
                  break;
                case 0x80:
                  //Both GB + GBC modes
                  this.useGBCMode = !settings.gbHasPriority;
                  break;
                case 0xc0:
                  //Only GBC mode
                  this.useGBCMode = true;
                  break;
                default:
                  this.useGBCMode = false;
                  console.warn("Unknown GameBoy game type code #" + this.colorCompatibilityByte + ", defaulting to GB mode (Old games don't have a type code).");
              }
            } else {
              console.log("used boot rom");
              this.useGBCMode = this.gameboy.usedGBCBootROM; // Allow the GBC boot ROM to run in GBC mode...
            }

            var oldLicenseCode = this.rom.getByte(0x14b);
            var newLicenseCode = this.rom.getByte(0x144) & 0xff00 | this.rom.getByte(0x145) & 0xff;
            if (oldLicenseCode !== 0x33) {
              this.isNewLicenseCode = false;
              this.licenseCode = oldLicenseCode;
            } else {
              this.isNewLicenseCode = true;
              this.licenseCode = newLicenseCode;
            }
          }
        }, {
          key: "setGBCMode",
          value: function setGBCMode(data) {
            this.useGBCMode = (data & 0x1) === 0;
            // Exception to the GBC identifying code:
            if (this.name + this.gameCode + this.colorCompatibilityByte === "Game and Watch 50") {
              this.useGBCMode = true;
              console.log("Created a boot exception for Game and Watch Gallery 2 (GBC ID byte is wrong on the cartridge).");
            }
            console.log("Booted to GBC Mode: " + this.useGBCMode);
          }
        }, {
          key: "setTypeName",
          value: function setTypeName() {
            switch (this.type) {
              case 0x00:
                this.typeName = "ROM";
                break;
              case 0x01:
                this.hasMBC1 = true;
                this.typeName = "MBC1";
                break;
              case 0x02:
                this.hasMBC1 = true;
                this.hasSRAM = true;
                this.typeName = "MBC1 + SRAM";
                break;
              case 0x03:
                this.hasMBC1 = true;
                this.hasSRAM = true;
                this.hasBattery = true;
                this.typeName = "MBC1 + SRAM + Battery";
                break;
              case 0x05:
                this.hasMBC2 = true;
                this.typeName = "MBC2";
                break;
              case 0x06:
                this.hasMBC2 = true;
                this.hasBattery = true;
                this.typeName = "MBC2 + Battery";
                break;
              case 0x08:
                this.hasSRAM = true;
                this.typeName = "ROM + SRAM";
                break;
              case 0x09:
                this.hasSRAM = true;
                this.hasBattery = true;
                this.typeName = "ROM + SRAM + Battery";
                break;
              case 0x0b:
                this.cMMMO1 = true;
                this.typeName = "MMMO1";
                break;
              case 0x0c:
                this.cMMMO1 = true;
                this.hasSRAM = true;
                this.typeName = "MMMO1 + SRAM";
                break;
              case 0x0d:
                this.cMMMO1 = true;
                this.hasSRAM = true;
                this.hasBattery = true;
                this.typeName = "MMMO1 + SRAM + Battery";
                break;
              case 0x0f:
                this.hasMBC3 = true;
                this.hasRTC = true;
                this.hasBattery = true;
                this.typeName = "MBC3 + RTC + Battery";
                break;
              case 0x10:
                this.hasMBC3 = true;
                this.hasRTC = true;
                this.hasBattery = true;
                this.hasSRAM = true;
                this.typeName = "MBC3 + RTC + Battery + SRAM";
                break;
              case 0x11:
                this.hasMBC3 = true;
                this.typeName = "MBC3";
                break;
              case 0x12:
                this.hasMBC3 = true;
                this.hasSRAM = true;
                this.typeName = "MBC3 + SRAM";
                break;
              case 0x13:
                this.hasMBC3 = true;
                this.hasSRAM = true;
                this.hasBattery = true;
                this.typeName = "MBC3 + SRAM + Battery";
                break;
              case 0x19:
                this.hasMBC5 = true;
                this.typeName = "MBC5";
                break;
              case 0x1a:
                this.hasMBC5 = true;
                this.hasSRAM = true;
                this.typeName = "MBC5 + SRAM";
                break;
              case 0x1b:
                this.hasMBC5 = true;
                this.hasSRAM = true;
                this.hasBattery = true;
                this.typeName = "MBC5 + SRAM + Battery";
                break;
              case 0x1c:
                this.cRUMBLE = true;
                this.typeName = "RUMBLE";
                break;
              case 0x1d:
                this.cRUMBLE = true;
                this.hasSRAM = true;
                this.typeName = "RUMBLE + SRAM";
                break;
              case 0x1e:
                this.cRUMBLE = true;
                this.hasSRAM = true;
                this.hasBattery = true;
                this.typeName = "RUMBLE + SRAM + Battery";
                break;
              case 0x1f:
                this.cCamera = true;
                this.typeName = "GameBoy Camera";
                break;
              case 0x22:
                this.hasMBC7 = true;
                this.hasSRAM = true;
                this.hasBattery = true;
                this.typeName = "MBC7 + SRAM + Battery";
                break;
              case 0xfd:
                this.cTAMA5 = true;
                this.typeName = "TAMA5";
                break;
              case 0xfe:
                this.cHuC3 = true;
                this.typeName = "HuC3";
                break;
              case 0xff:
                this.cHuC1 = true;
                this.typeName = "HuC1";
                break;
              default:
                throw new Error("Unknown Cartridge Type");
            }

            if (this.hasMBC1) this.mbc1 = new MBC1(this);
            if (this.hasMBC2) this.mbc2 = new MBC2(this);
            if (this.hasMBC3) this.mbc3 = new MBC3(this);
            if (this.hasMBC5) this.mbc5 = new MBC5(this);
            if (this.hasMBC7) this.mbc7 = new MBC7(this);

            this.mbc = this.mbc1 || this.mbc2 || this.mbc3 || this.mbc5 || this.mbc7 || null;
          }
        }, {
          key: "setupRAM",
          value: function setupRAM() {
            this.mbc.setupRAM();

            this.gameboy.api.loadSRAM();
            this.gameboy.api.loadRTC();
          }
        }]);

        return Cartridge;
      }();

      Actions = function (_EventEmitter) {
        _inherits(Actions, _EventEmitter);

        function Actions() {
          var _ref;

          var _temp, _this, _ret;

          _classCallCheck(this, Actions);

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Actions.__proto__ || Object.getPrototypeOf(Actions)).call.apply(_ref, [this].concat(args))), _this), _this.map = {}, _temp), _possibleConstructorReturn(_this, _ret);
        }

        _createClass(Actions, [{
          key: "register",
          value: function register(action) {
            this.map[action] = true;
            return this;
          }
        }, {
          key: "getAll",
          value: function getAll() {
            return Object.keys(this.map);
          }
        }, {
          key: "is",
          value: function is(action) {
            return !!this.map[action];
          }
        }, {
          key: "down",
          value: function down(action, options) {
            this.emit("down-" + action, options);
          }
        }, {
          key: "change",
          value: function change(action, options) {
            this.emit("change-" + action, options);
          }
        }, {
          key: "up",
          value: function up(action, options) {
            this.emit("up-" + action, options);
          }
        }]);

        return Actions;
      }(EventEmitter);

      _export('GameBoy', GameBoy$1 = function (_EventEmitter) {
        _inherits(GameBoy, _EventEmitter);

        function GameBoy() {
          var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              audio = _ref.audio,
              isPaused = _ref.isPaused,
              lcd = _ref.lcd,
              isSoundEnabled = _ref.isSoundEnabled;

          _classCallCheck(this, GameBoy);

          var _this = _possibleConstructorReturn(this, (GameBoy.__proto__ || Object.getPrototypeOf(GameBoy)).call(this));

          _this.buttons = ["right", "left", "up", "down", "a", "b", "select", "start"];

          if (typeof isSoundEnabled === "boolean") settings.soundOn = isSoundEnabled;
          if (isPaused) _this.isPaused = isPaused;

          _this.core = new GameBoyCore({
            audio: audio,
            api: _this,
            lcd: lcd
          });

          _this.debouncedAutoSave = debounce(_this.autoSave.bind(_this), 100);
          _this.core.events.on("sramWrite", function () {
            if (!_this.core.cartridge) return;
            _this.debouncedAutoSave();
          });

          _this.isOn = false;
          _this.actions = new Actions();
          _this.registerActions();
          if (typeof document !== "undefined") {
            _this.storage = new LocalStorage();
          }
          return _this;
        }

        _createClass(GameBoy, [{
          key: "isPaused",
          value: function isPaused() {
            return typeof document !== "undefined" && document.hidden;
          }
        }, {
          key: "setStorage",
          value: function setStorage(storage) {
            this.storage = storage;
          }
        }, {
          key: "registerActions",
          value: function registerActions() {
            var _this2 = this;

            this.buttons.forEach(function (button, index) {
              _this2.actions.register(button).on("down-" + button, function () {
                _this2.core.joypad.down(index);
              }).on("up-" + button, function () {
                _this2.core.joypad.up(index);
              });
            });

            this.actions.register("speed").on("down-speed", function (options) {
              return _this2.handleSpeed(options);
            }).on("change-speed", function (options) {
              return _this2.handleSpeed(options);
            }).on("up-speed", function () {
              _this2.setSpeed(1);
            });
          }
        }, {
          key: "handleSpeed",
          value: function handleSpeed(options) {
            var multiplier = 2;
            if (options && typeof options.value === "number") {
              multiplier = options.value * 2 + 1;
            }

            this.setSpeed(multiplier);
          }
        }, {
          key: "turnOn",
          value: function turnOn() {
            var _this3 = this;

            if (this.isOn) return;
            this.isOn = true;

            this.core.start(this.cartridge);
            this.core.stopEmulator &= 1;
            this.interval = setInterval(function () {
              // TODO: request animation frame & performance.now()
              if (_this3.isPaused()) return;
              _this3.core.run();
            }, settings.runInterval);
          }
        }, {
          key: "turnOff",
          value: function turnOff() {
            if (!this.isOn) return;
            this.isOn = false;

            if (this.interval) {
              clearInterval(this.interval);
              this.interval = null;
            }
          }
        }, {
          key: "restart",
          value: function restart() {
            this.turnOff();
            this.turnOn();
          }
        }, {
          key: "replaceCartridge",
          value: function replaceCartridge(cartridge) {
            this.turnOff();
            this.removeCartridge();
            this.insertCartridge(cartridge);
            this.turnOn();
          }
        }, {
          key: "removeCartridge",
          value: function removeCartridge() {
            this.cartridge = null;
          }
        }, {
          key: "insertCartridge",
          value: function insertCartridge(cartridge) {
            if (!(cartridge instanceof Cartridge)) {
              cartridge = new Cartridge(cartridge);
            }

            this.cartridge = cartridge;
          }
        }, {
          key: "actionDown",
          value: function actionDown(action, options) {
            this.actions.down(action, options);
          }
        }, {
          key: "actionChange",
          value: function actionChange(action, options) {
            this.actions.change(action, options);
          }
        }, {
          key: "actionUp",
          value: function actionUp(action, options) {
            this.actions.up(action, options);
          }
        }, {
          key: "setSpeed",
          value: function setSpeed(multiplier) {
            this.core.setSpeed(multiplier);
          }
        }, {
          key: "autoSave",
          value: function autoSave() {
            this.saveSRAM();
            this.saveRTC();
          }
        }, {
          key: "saveState",
          value: function () {
            var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(state) {
              var name;
              return _regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (this.storage) {
                        _context.next = 2;
                        break;
                      }

                      return _context.abrupt("return");

                    case 2:
                      if (this.core.cartridge) {
                        _context.next = 4;
                        break;
                      }

                      return _context.abrupt("return");

                    case 4:
                      name = this.core.cartridge.name;

                      if (state) {
                        _context.next = 9;
                        break;
                      }

                      state = this.core.stateManager.get();

                      if (state) {
                        _context.next = 9;
                        break;
                      }

                      return _context.abrupt("return", false);

                    case 9:
                      _context.next = 11;
                      return this.storage.setState(name, state);

                    case 11:
                      this.emit("stateSaved", { name: name, state: state });

                    case 12:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, this);
            }));

            function saveState(_x2) {
              return _ref2.apply(this, arguments);
            }

            return saveState;
          }()
        }, {
          key: "saveSRAM",
          value: function () {
            var _ref3 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(sram) {
              var name;
              return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (this.storage) {
                        _context2.next = 2;
                        break;
                      }

                      return _context2.abrupt("return");

                    case 2:
                      if (this.core.cartridge) {
                        _context2.next = 4;
                        break;
                      }

                      return _context2.abrupt("return");

                    case 4:
                      name = this.core.cartridge.name;

                      if (sram) {
                        _context2.next = 9;
                        break;
                      }

                      sram = this.core.cartridge.mbc.getSRAM();

                      if (sram) {
                        _context2.next = 9;
                        break;
                      }

                      return _context2.abrupt("return", false);

                    case 9:
                      _context2.next = 11;
                      return this.storage.setSRAM(name, sram.buffer);

                    case 11:
                      this.emit("sramSaved", { name: name, sram: sram });

                    case 12:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2, this);
            }));

            function saveSRAM(_x3) {
              return _ref3.apply(this, arguments);
            }

            return saveSRAM;
          }()
        }, {
          key: "saveRTC",
          value: function () {
            var _ref4 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(rtc) {
              var name;
              return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      if (this.storage) {
                        _context3.next = 2;
                        break;
                      }

                      return _context3.abrupt("return");

                    case 2:
                      if (this.core.cartridge) {
                        _context3.next = 4;
                        break;
                      }

                      return _context3.abrupt("return");

                    case 4:
                      if (this.core.cartridge.hasRTC) {
                        _context3.next = 6;
                        break;
                      }

                      return _context3.abrupt("return");

                    case 6:
                      name = this.core.cartridge.name;

                      if (rtc) {
                        _context3.next = 11;
                        break;
                      }

                      rtc = this.core.cartridge.mbc.rtc.get();

                      if (rtc) {
                        _context3.next = 11;
                        break;
                      }

                      return _context3.abrupt("return", false);

                    case 11:
                      _context3.next = 13;
                      return this.storage.setRTC(name, rtc.buffer);

                    case 13:
                      this.emit("rtcSaved", { name: name, rtc: rtc });

                    case 14:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3, this);
            }));

            function saveRTC(_x4) {
              return _ref4.apply(this, arguments);
            }

            return saveRTC;
          }()
        }, {
          key: "loadState",
          value: function loadState(state) {
            if (!this.storage) return;
            if (!this.core.cartridge) return;
            var name = this.core.cartridge.name;

            if (!state) {
              state = this.storage.findState(name);
              if (!state) return false;
            }

            this.core.loadState(state);
            this.emit("stateLoaded", { name: name, state: state });
          }
        }, {
          key: "loadSRAM",
          value: function loadSRAM(sram) {
            if (!this.storage) return;
            if (!this.core.cartridge) return;
            var name = this.core.cartridge.name;

            if (!sram) {
              sram = this.storage.findSRAM(name);
              if (!sram) return false;
              sram = new Uint8Array(sram);
            }

            this.core.cartridge.mbc.loadSRAM(sram);
            this.emit("sramLoaded", { name: name, sram: sram });
          }
        }, {
          key: "loadRTC",
          value: function loadRTC(rtc) {
            if (!this.storage) return;
            if (!this.core.cartridge) return;
            if (!this.core.cartridge.hasRTC) return;
            var name = this.core.cartridge.name;

            if (!rtc) {
              rtc = this.storage.findRTC(name);
              if (!rtc) return false;
              rtc = new Uint32Array(rtc);
            }

            this.core.cartridge.mbc.rtc.load(rtc);
            this.emit("rtcLoaded", { name: name, rtc: rtc });
          }
        }, {
          key: "getBatteryFileArrayBuffer",
          value: function getBatteryFileArrayBuffer() {
            if (!this.core.cartridge) return;

            var sram = this.core.cartridge.mbc.getSRAM();
            var rtc = null;
            if (this.core.cartridge.mbc.rtc) rtc = this.core.cartridge.mbc.rtc.get();

            return rtc ? concatArrayBuffers(sram.buffer, rtc.buffer) : sram.buffer;
          }
        }, {
          key: "loadBatteryFileArrayBuffer",
          value: function () {
            var _ref5 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(data) {
              var sram, rtc;
              return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      if (typeof data === "string") {
                        data = stringToArrayBuffer(data);
                      }

                      sram = this.core.cartridge.mbc.cutSRAMFromBatteryFileArray(data);
                      rtc = null;

                      if (this.core.cartridge.hasRTC) {
                        rtc = this.core.cartridge.mbc.rtc.cutBatteryFileArray(data);
                      }

                      this.core.cartridge.mbc.loadSRAM(sram);
                      if (rtc) this.core.cartridge.mbc.rtc.load(rtc);

                      _context4.next = 8;
                      return this.saveSRAM(sram);

                    case 8:
                      if (!rtc) {
                        _context4.next = 11;
                        break;
                      }

                      _context4.next = 11;
                      return this.saveRTC(rtc);

                    case 11:

                      this.restart();

                    case 12:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4, this);
            }));

            function loadBatteryFileArrayBuffer(_x5) {
              return _ref5.apply(this, arguments);
            }

            return loadBatteryFileArrayBuffer;
          }()

          // getStateFileArrayBuffer() {
          //   let array = this.core.stateManager.save();
          //   array = new Uint8Array(array);
          //   return array;
          // }

        }]);

        return GameBoy;
      }(EventEmitter));

      _export('GameBoy', GameBoy$1);

      _export('LocalStorage', LocalStorage);

      _export('util', util);

      _export('default', GameBoy$1);
    }
  };
});
})
(function(factory) {
  if (typeof define == 'function' && define.amd)
    define([], factory);
  else if (typeof module == 'object' && module.exports && typeof require == 'function')
    module.exports = factory();
  else
    jsGBC = factory();
});
//# sourceMappingURL=jsgbc-core.js.map