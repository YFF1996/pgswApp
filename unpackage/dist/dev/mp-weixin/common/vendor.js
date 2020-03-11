(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


function addSafeAreaInsets(result) {
  if (result.safeArea) {
    var safeArea = result.safeArea;
    result.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: result.windowWidth - safeArea.right,
      bottom: result.windowHeight - safeArea.bottom };

  }
}
var protocols = {
  previewImage: previewImage,
  getSystemInfo: {
    returnValue: addSafeAreaInsets },

  getSystemInfoSync: {
    returnValue: addSafeAreaInsets } };


var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm && this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 12:
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),

/***/ 15:
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 16:
/*!************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/store/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 12));

var _state = _interopRequireDefault(__webpack_require__(/*! ./state */ 17));
var _mutations = _interopRequireDefault(__webpack_require__(/*! ./mutations */ 18));
var _actions = _interopRequireDefault(__webpack_require__(/*! ./actions */ 20));

var _logger = _interopRequireDefault(__webpack_require__(/*! vuex/dist/logger */ 40));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} // import getters from './getters'

_vue.default.use(_vuex.default);

// 生产环境
var debug = "development" === 'production';var _default =

new _vuex.default.Store({
  state: _state.default,
  mutations: _mutations.default,
  actions: _actions.default,
  // getters,
  strict: debug,
  plugins: debug ? [(0, _logger.default)()] : [] });exports.default = _default;

/***/ }),

/***/ 17:
/*!************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/store/state.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var state = {
  isLoginStatus: false, // 登录弹窗status
  userInfo: '', // 用户信息
  popUpWindowsObj: '', // 版本提交不通过提示信息
  unionid: '', // unionid
  shareid: '', // 用户id - 讲师id 记录谁邀请谁进来的
  channel: '', // 用户来源渠道
  isIos: false, // 用户设备是否是ios
  isReview: false, // 后台控制部分设置状态是否显示
  indexTypeLabelList: [], // 首页分类标签lists
  navigationVertical: false, // navigation滚动方向
  navigationIndex: 0, // navigationIndex
  navigationScrollLeft: 0, // navigation滑动的位置
  navigationItemWidth: 0, // navigation列表item宽度
  musicList: [], // 首页音频列表lists
  allMusicList: [], // 全局播放列表lists
  currentIndex: 0, // 首页切换歌曲index
  indexLoadingMusicStatus: false, // 首页正在加载音频状态
  duration: 200, // 首页滑动幅度
  currentMusicItem: '', // 当前播放歌曲item信息
  allCurrentMusicItem: '', // 全局当前播放歌曲item信息
  indexCurrentVideoItem: '', // 首页选择视频item信息
  playing: false, // 音频播放状态
  allPlaying: false, // 全局音频播放状态
  miniShowCloseStatus: true, // mini播放(显示-关闭)状态
  miniShowHideStatus: false, // mini播放(显示-隐藏)状态
  miniPlayListStatus: false, // mini播放列表(显示-隐藏)状态
  isSwitchMusic: true, // 是否是滑动切换音频
  scrollWithAnimation: false, // 首页音频列表item动画状态
  currentTime: 0, // 当前音频时长
  totalTime: 0, // 音频总时长
  isSpeedState: false, // 快进状态
  currentSchedule: 0, // 当前音频进度
  totalSchedule: 0, // 音频总进度
  allTypeList: [], // 类型列表lists
  hotColumnList: [], // 热门栏目列表
  allSearchLists: [], // 全部搜索音频列表lists
  subjectSearchLists: [], // 搜索专题列表lists
  collectSubjectList: [], // 个人收藏专题列表lists
  collectMusicList: [], // 个人收藏音频列表lists
  addRemarkStatus: false, // 收藏备注状态
  playHistoryList: [], // 个人播放音频记录lists
  loadingState: false, // 分类音频加载更多loading状态
  isDataState: false, // 分类音频是否有数据
  isNewsDataState: false, // news是否有数据
  recommendLabelList: [], // 分享推荐标签列表lists
  shareThumbnail: '', // 分享缩略图
  seekRecommendLabelList: [], // 搜索推荐标签列表lists
  days: 0, // 坚持签到天数
  checkInList: [], // 坚持签到列表
  checkInDateList: [], // 坚持签到日期列表
  newsList: [], // 每日头条列表
  collectArticleList: [], // 个人收藏文章列表lists
  shareLatestRankList: [], // 分享记录最新排行榜列表lists
  shareRankingObj: [], // 分享记录总数排行榜对象obj
  checkRankingObj: '', // 排行榜信息
  shareEnergyObj: '', // 分享我的能量信息
  shareInfo: [], // 分享我的info
  feedbackHistoryList: [], // 反馈历史列表lists
  feedbackDetails: '', // 反馈详情
  giveThumbsMusicList: [], // 个人点赞音频列表lists
  contentWordList: [], // 内容定制关键词列表lists
  subjectDetailList: [], // 专题音频列表lists
  similarityCourseList: [], // 专题相似课程列表lists
  commentList: [], // 评论列表
  conversionBookList: [], // 兑换书和物品lists
  robBookList: [], // 抢书列表lists
  bingPhoneInfo: '', // 绑定手机号信息
  levelOneJobList: '', // 一级岗位分类
  selectedJobInfo: '', // 是否选择岗位
  addressList: [], // 选择地址列表
  AffirmSiteInfo: '', // 默认收货地址
  screenBottleStatus: false, // 筛选瓶盖区间状态
  orderList: [], // 订单列表
  bottleRecordList: [], // 赚瓶盖收支记录
  taskCaseList: [], // 每日任务完成状况列表
  growhtRecordList: [], // 成长记录列表lists
  inTheBookList: [], // 中书记录lists
  missionPopupStatus: false, // 任务弹窗状态
  checkStatus: true, // 复选框选中状态
  sharePopupState: false, // 首页分享引导状态
  rulePopupStatus: false, // 抢学费规则弹窗
  tuitionMeListStatus: false, // 我获得学费记录状态
  consumeList: [], // 收入支出明细列表
  allGrabList: [], // 全部抢学费用户Lists
  grabTuitionList: [], // 疯狂抢学费列表Lists
  conductGrabTuitionList: [], // 我的抢学费进行中列表Lists
  accomplishGrabTuitionList: [], // 我的完成抢学费列表Lists
  extractCashList: [], // 提现记录列表
  lectureSubjectList: [], // 讲师专题
  lectureMusicList: [], // 讲师音频Lists
  myAttentionList: [], // 我的关注列表
  mySubscriptionList: [], // 我的订阅列表
  myCourseList: [], // 我的课程列表
  returnMoneyPopUpState: false, // 返现弹窗state
  excellentCourseIndex: 0, // 精品课程navIndex
  excellentCourseScrollLeft: 0, // excellentCourse滑动的位置
  excellentCourseItemWidth: 0, // 精品课程导航宽度
  musicDetails: '', // 音频详情
  exchangeInviteState: false, // 专题展示兑换邀请状态
  setTitleState: false, // 动态设置page标题状态
  messageFromUserList: [], // 发送人私信列表lists
  messageReadList: [], // 私信列表lists
  getCoursePopUpState: false, // 领取课程弹窗状态
  authorWindowGoodsList: [], // 讲师橱窗商品列表lists
  authorSearchGoodsList: [], // 讲师搜索商品列表lists
  indexVideoList: [], // 首页视频列表
  workInfo: '', // 获取工作经历
  educationInfo: '', // 获取教育经历
  subjectGoodsLabelList: [], // 获取精品课分类
  occupationList: '' // 获取一级职业分类
};var _default =

state;exports.default = _default;

/***/ }),

/***/ 18:
/*!****************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/store/mutations.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var types = _interopRequireWildcard(__webpack_require__(/*! ./mutation-types */ 19));var _mutations;function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj.default = obj;return newObj;}}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

var mutations = (_mutations = {}, _defineProperty(_mutations,
types.SET_IS_LOGIN_STATUS, function (state, data) {
  state.isLoginStatus = data;
}), _defineProperty(_mutations,
types.SET_USERINFO, function (state, data) {
  state.userInfo = data;
}), _defineProperty(_mutations,
types.SET_POP_UP_WINDOWS_OBJ, function (state, data) {
  state.popUpWindowsObj = data;
}), _defineProperty(_mutations,
types.SET_UNIONID, function (state, data) {
  state.unionid = data;
}), _defineProperty(_mutations,
types.SET_SHARE_ID, function (state, data) {
  state.shareid = data;
}), _defineProperty(_mutations,
types.SET_CHANNEL, function (state, data) {
  state.channel = data;
}), _defineProperty(_mutations,
types.SET_IS_IOS, function (state, data) {
  state.isIos = data;
}), _defineProperty(_mutations,
types.SET_IS_REVIEW, function (state, data) {
  state.isReview = data;
}), _defineProperty(_mutations,
types.SET_INDEX_TYPE_LABEL_LIST, function (state, data) {
  state.indexTypeLabelList = data;
}), _defineProperty(_mutations,
types.SET_NAVIGATION_VERTICAL, function (state, data) {
  state.navigationVertical = data;
}), _defineProperty(_mutations,
types.SET_NAVIGATION_INDEX, function (state, data) {
  state.navigationIndex = data;
}), _defineProperty(_mutations,
types.SET_NAVIGATION_SCROLL_LEFT, function (state, data) {
  state.navigationScrollLeft = data;
}), _defineProperty(_mutations,
types.SET_NAVIGATION_ITEM_WIDTH, function (state, data) {
  state.navigationItemWidth = data;
}), _defineProperty(_mutations,
types.SET_MUSIC_LIST, function (state, data) {
  state.musicList = data;
}), _defineProperty(_mutations,
types.SET_ALL_MUSIC_LIST, function (state, data) {
  state.allMusicList = data;
}), _defineProperty(_mutations,
types.SET_CURRENT_INDEX, function (state, data) {
  state.currentIndex = data;
}), _defineProperty(_mutations,
types.SET_INDEX_LOADING_MUSIC_STATUS, function (state, data) {
  state.indexLoadingMusicStatus = data;
}), _defineProperty(_mutations,
types.SET_DURATION, function (state, data) {
  state.duration = data;
}), _defineProperty(_mutations,
types.CURRENT_MUSIC_ITEM, function (state, data) {
  state.currentMusicItem = data;
}), _defineProperty(_mutations,
types.ALL_CURRENT_MUSIC_ITEM, function (state, data) {
  state.allCurrentMusicItem = data;
}), _defineProperty(_mutations,
types.INDEX_CURRENT_VIDEO_ITEM, function (state, data) {
  state.indexCurrentVideoItem = data;
}), _defineProperty(_mutations,
types.SET_PLAYING_STATE, function (state, data) {
  state.playing = data;
}), _defineProperty(_mutations,
types.SET_ALL_PLAYING_STATE, function (state, data) {
  state.allPlaying = data;
}), _defineProperty(_mutations,
types.SET_MIMI_SHOW_CLOSE_STATUS, function (state, data) {
  state.miniShowCloseStatus = data;
}), _defineProperty(_mutations,
types.SET_MIMI_SHOW_HIDE_STATUS, function (state, data) {
  state.miniShowHideStatus = data;
}), _defineProperty(_mutations,
types.SET_MINI_PLAY_LIST_STATUS, function (state, data) {
  state.miniPlayListStatus = data;
}), _defineProperty(_mutations,
types.SET_IS_SWITCH_MUSIC_STATE, function (state, data) {
  state.isSwitchMusic = data;
}), _defineProperty(_mutations,
types.SET_SCROLL_WIDTH_ANIMATION, function (state, data) {
  state.scrollWithAnimation = data;
}), _defineProperty(_mutations,
types.SET_CURRENT_TIME, function (state, data) {
  state.currentTime = data;
}), _defineProperty(_mutations,
types.SET_TOTAL_TIME, function (state, data) {
  state.totalTime = data;
}), _defineProperty(_mutations,
types.SET_IS_SPEED_STATE, function (state, data) {
  state.isSpeedState = data;
}), _defineProperty(_mutations,
types.SET_ALLTYPE_LIST, function (state, data) {
  state.allTypeList = data;
}), _defineProperty(_mutations,
types.SET_HOT_COLUMN_LIST, function (state, data) {
  state.hotColumnList = data;
}), _defineProperty(_mutations,
types.SET_CHECKBOX_CURRENT_PLAY_STATUS, function (state, data) {
  state.checkBoxCurrentPlayStatus = data;
}), _defineProperty(_mutations,
types.SET_ALL_SEARCH_LISTS, function (state, data) {
  state.allSearchLists = data;
}), _defineProperty(_mutations,
types.SET_SUBJECT_SEARCH_LISTS, function (state, data) {
  state.subjectSearchLists = data;
}), _defineProperty(_mutations,
types.SET_COLLECT_SUBJECT_LIST, function (state, data) {
  state.collectSubjectList = data;
}), _defineProperty(_mutations,
types.SET_COLLECT_MUSIC_LIST, function (state, data) {
  state.collectMusicList = data;
}), _defineProperty(_mutations,
types.SET_ADD_REMARK_STATUS, function (state, data) {
  state.addRemarkStatus = data;
}), _defineProperty(_mutations,
types.SET_PLAY_HISTORY_LIST, function (state, data) {
  state.playHistoryList = data;
}), _defineProperty(_mutations,
types.SET_LOADING_STATE, function (state, data) {
  state.loadingState = data;
}), _defineProperty(_mutations,
types.SET_IS_DATA_STATE, function (state, data) {
  state.isDataState = data;
}), _defineProperty(_mutations,
types.SET_IS_NEWS_DATA_STATE, function (state, data) {
  state.isNewsDataState = data;
}), _defineProperty(_mutations,
types.SET_RECOMMEND_LABEL_LIST, function (state, data) {
  state.recommendLabelList = data;
}), _defineProperty(_mutations,
types.SET_SHARE_THUMBNAIL, function (state, data) {
  state.shareThumbnail = data;
}), _defineProperty(_mutations,
types.SET_SEEK_RECOMMEND_LABEL_LIST, function (state, data) {
  state.seekRecommendLabelList = data;
}), _defineProperty(_mutations,
types.SET_DAYS, function (state, data) {
  state.days = data;
}), _defineProperty(_mutations,
types.SET_CHECK_IN_LIST, function (state, data) {
  state.checkInList = data;
}), _defineProperty(_mutations,
types.SET_CHECK_IN_DATE_LIST, function (state, data) {
  state.checkInDateList = data;
}), _defineProperty(_mutations,
types.SET_NEWS_LIST, function (state, data) {
  state.newsList = data;
}), _defineProperty(_mutations,
types.SET_COLLECT_ARTICLE_LIST, function (state, data) {
  state.collectArticleList = data;
}), _defineProperty(_mutations,
types.SET_SHARE_LATEST_RANK_LIST, function (state, data) {
  state.shareLatestRankList = data;
}), _defineProperty(_mutations,
types.SET_SHARE_RANKING_OBJ, function (state, data) {
  state.shareRankingObj = data;
}), _defineProperty(_mutations,
types.SET_CHECK_RANKING_OBJ, function (state, data) {
  state.checkRankingObj = data;
}), _defineProperty(_mutations,
types.SET_SHARE_ENERGY_OBJ, function (state, data) {
  state.shareEnergyObj = data;
}), _defineProperty(_mutations,
types.SET_SHARE_INFO, function (state, data) {
  state.shareInfo = data;
}), _defineProperty(_mutations,
types.SET_FEEDBACK_HISTORY_LIST, function (state, data) {
  state.feedbackHistoryList = data;
}), _defineProperty(_mutations,
types.SET_FEEDBACK_DATAIL, function (state, data) {
  state.feedbackDetails = data;
}), _defineProperty(_mutations,
types.SET_GIVE_THUMBS_MUSIC_LIST, function (state, data) {
  state.giveThumbsMusicList = data;
}), _defineProperty(_mutations,
types.SET_CONTENT_WORD_LIST, function (state, data) {
  state.contentWordList = data;
}), _defineProperty(_mutations,
types.SET_SUBJECT_DETAIL_LIST, function (state, data) {
  state.subjectDetailList = data;
}), _defineProperty(_mutations,
types.SET_SIMILARITY_COURSE_LIST, function (state, data) {
  state.similarityCourseList = data;
}), _defineProperty(_mutations,
types.SET_COMMENT_LIST, function (state, data) {
  state.commentList = data;
}), _defineProperty(_mutations,
types.SET_CONVERSION_BOOK_LIST, function (state, data) {
  state.conversionBookList = data;
}), _defineProperty(_mutations,
types.SET_ROB_BOOK_LIST, function (state, data) {
  state.robBookList = data;
}), _defineProperty(_mutations,
types.SET_BING_PHONE_INFO, function (state, data) {
  state.bingPhoneInfo = data;
}), _defineProperty(_mutations,
types.SET_LEVEL_ONE_JOB_LIST, function (state, data) {
  state.levelOneJobList = data;
}), _defineProperty(_mutations,
types.SET_SELECTED_JOB_INFO, function (state, data) {
  state.selectedJobInfo = data;
}), _defineProperty(_mutations,
types.SET_ADDRESS_LIST, function (state, data) {
  state.addressList = data;
}), _defineProperty(_mutations,
types.SET_AFFIRM_SITE_INFO, function (state, data) {
  state.AffirmSiteInfo = data;
}), _defineProperty(_mutations,
types.SET_SCREEN_BOTTLE_STATUS, function (state, data) {
  state.screenBottleStatus = data;
}), _defineProperty(_mutations,
types.SET_ORDER_LIST, function (state, data) {
  state.orderList = data;
}), _defineProperty(_mutations,
types.SET_BOTTLE_RECORD_LIST, function (state, data) {
  state.bottleRecordList = data;
}), _defineProperty(_mutations,
types.SET_TASK_CASE_LIST, function (state, data) {
  state.taskCaseList = data;
}), _defineProperty(_mutations,
types.SET_GROWHT_RECORD_LIST, function (state, data) {
  state.growhtRecordList = data;
}), _defineProperty(_mutations,
types.SET_IN_THE_BOOK_LIST, function (state, data) {
  state.inTheBookList = data;
}), _defineProperty(_mutations,
types.SET_MISSION_POPUP_STATUS, function (state, data) {
  state.missionPopupStatus = data;
}), _defineProperty(_mutations,
types.SET_CHECK_STATUS, function (state, data) {
  state.checkStatus = data;
}), _defineProperty(_mutations,
types.SET_SHARE_POPUP_STATE, function (state, data) {
  state.sharePopupState = data;
}), _defineProperty(_mutations,
types.SET_RULE_POPUP_STATUS, function (state, data) {
  state.rulePopupStatus = data;
}), _defineProperty(_mutations,
types.SET_TUITION_ME_LIST_STATUS, function (state, data) {
  state.tuitionMeListStatus = data;
}), _defineProperty(_mutations,
types.SET_ALL_GRAB_LIST, function (state, data) {
  state.allGrabList = data;
}), _defineProperty(_mutations,
types.SET_GRAB_TUITION_LIST, function (state, data) {
  state.grabTuitionList = data;
}), _defineProperty(_mutations,
types.SET_CONDUCT_GRAB_TUITION_LIST, function (state, data) {
  state.conductGrabTuitionList = data;
}), _defineProperty(_mutations,
types.SET_ACCOMPLISH_GRAB_TUITION_LIST, function (state, data) {
  state.accomplishGrabTuitionList = data;
}), _defineProperty(_mutations,
types.SET_CONSUME_LIST, function (state, data) {
  state.consumeList = data;
}), _defineProperty(_mutations,
types.SET_EXTRACT_CASH_LIST, function (state, data) {
  state.extractCashList = data;
}), _defineProperty(_mutations,
types.SET_LECTURE_SUBJECT_LIST, function (state, data) {
  state.lectureSubjectList = data;
}), _defineProperty(_mutations,
types.SET_LECTURE_MUSIC_LIST, function (state, data) {
  state.lectureMusicList = data;
}), _defineProperty(_mutations,
types.SET_MY_ATTENTION_LIST, function (state, data) {
  state.myAttentionList = data;
}), _defineProperty(_mutations,
types.SET_MY_SUBSCRIPTION_LIST, function (state, data) {
  state.mySubscriptionList = data;
}), _defineProperty(_mutations,
types.SET_MY_COURSE_LIST, function (state, data) {
  state.myCourseList = data;
}), _defineProperty(_mutations,
types.SET_RETURN_MONEY_POP_UP_STATE, function (state, data) {
  state.returnMoneyPopUpState = data;
}), _defineProperty(_mutations,
types.SET_EXCELLENT_COURSE_INDEX, function (state, data) {
  state.excellentCourseIndex = data;
}), _defineProperty(_mutations,
types.SET_EXCELLENT_COURSE_SCROLL_LEFT, function (state, data) {
  state.excellentCourseScrollLeft = data;
}), _defineProperty(_mutations,
types.SET_EXCELLENT_COURSE_ITEM_WIDTH, function (state, data) {
  state.excellentCourseItemWidth = data;
}), _defineProperty(_mutations,
types.MUSIC_DETAILS, function (state, data) {
  state.musicDetails = data;
}), _defineProperty(_mutations,
types.SET_EXCHANGE_INVITE_STATE, function (state, data) {
  state.exchangeInviteState = data;
}), _defineProperty(_mutations,
types.SET_TITLE_STATE, function (state, data) {
  state.setTitleState = data;
}), _defineProperty(_mutations,
types.SET_MESSAGE_FROM_USER_LIST, function (state, data) {
  state.messageFromUserList = data;
}), _defineProperty(_mutations,
types.SET_MESSAGE_READ_LIST, function (state, data) {
  state.messageReadList = data;
}), _defineProperty(_mutations,
types.SET_GET_COURSE_POPUP_STATE, function (state, data) {
  state.getCoursePopUpState = data;
}), _defineProperty(_mutations,
types.SET_AUTHOR_WINDOW_GOODS_LIST, function (state, data) {
  state.authorWindowGoodsList = data;
}), _defineProperty(_mutations,
types.SET_AUTHOR_SEARCH_GOODS_LIST, function (state, data) {
  state.authorSearchGoodsList = data;
}), _defineProperty(_mutations,
types.SET_INDEX_VIDEO_LIST, function (state, data) {
  state.indexVideoList = data;
}), _defineProperty(_mutations,
types.SET_WORK_INFO, function (state, data) {
  state.workInfo = data;
}), _defineProperty(_mutations,
types.SET_EDUCATION_INFO, function (state, data) {
  state.educationInfo = data;
}), _defineProperty(_mutations,
types.SET_SUBJECT_GOODS_LABEL_LIST, function (state, data) {
  state.subjectGoodsLabelList = data;
}), _defineProperty(_mutations,
types.SET_ONE_TYPE_OCCUPATION_LIST, function (state, data) {
  state.occupationList = data;
}), _mutations);var _default =


mutations;exports.default = _default;

/***/ }),

/***/ 19:
/*!*********************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/store/mutation-types.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.SET_MESSAGE_FROM_USER_LIST = exports.SET_TITLE_STATE = exports.SET_EXCHANGE_INVITE_STATE = exports.MUSIC_DETAILS = exports.SET_EXCELLENT_COURSE_ITEM_WIDTH = exports.SET_EXCELLENT_COURSE_SCROLL_LEFT = exports.SET_EXCELLENT_COURSE_INDEX = exports.SET_RETURN_MONEY_POP_UP_STATE = exports.SET_MY_COURSE_LIST = exports.SET_MY_SUBSCRIPTION_LIST = exports.SET_MY_ATTENTION_LIST = exports.SET_LECTURE_MUSIC_LIST = exports.SET_LECTURE_SUBJECT_LIST = exports.SET_EXTRACT_CASH_LIST = exports.SET_GRAB_TUITION_LIST = exports.SET_ALL_GRAB_LIST = exports.SET_ACCOMPLISH_GRAB_TUITION_LIST = exports.SET_CONDUCT_GRAB_TUITION_LIST = exports.SET_CONSUME_LIST = exports.SET_TUITION_ME_LIST_STATUS = exports.SET_RULE_POPUP_STATUS = exports.SET_SHARE_POPUP_STATE = exports.SET_CHECK_STATUS = exports.SET_MISSION_POPUP_STATUS = exports.SET_IN_THE_BOOK_LIST = exports.SET_GROWHT_RECORD_LIST = exports.SET_TASK_CASE_LIST = exports.SET_BOTTLE_RECORD_LIST = exports.SET_ORDER_LIST = exports.SET_SCREEN_BOTTLE_STATUS = exports.SET_AFFIRM_SITE_INFO = exports.SET_ADDRESS_LIST = exports.SET_SELECTED_JOB_INFO = exports.SET_LEVEL_ONE_JOB_LIST = exports.SET_BING_PHONE_INFO = exports.SET_ROB_BOOK_LIST = exports.SET_CONVERSION_BOOK_LIST = exports.SET_COMMENT_LIST = exports.SET_SIMILARITY_COURSE_LIST = exports.SET_SUBJECT_DETAIL_LIST = exports.SET_CONTENT_WORD_LIST = exports.SET_GIVE_THUMBS_MUSIC_LIST = exports.SET_FEEDBACK_DATAIL = exports.SET_FEEDBACK_HISTORY_LIST = exports.SET_SHARE_INFO = exports.SET_SHARE_ENERGY_OBJ = exports.SET_CHECK_RANKING_OBJ = exports.SET_SHARE_RANKING_OBJ = exports.SET_SHARE_LATEST_RANK_LIST = exports.SET_COLLECT_ARTICLE_LIST = exports.SET_NEWS_LIST = exports.SET_CHECK_IN_DATE_LIST = exports.SET_CHECK_IN_LIST = exports.SET_DAYS = exports.SET_SEEK_RECOMMEND_LABEL_LIST = exports.SET_SHARE_THUMBNAIL = exports.SET_RECOMMEND_LABEL_LIST = exports.SET_IS_NEWS_DATA_STATE = exports.SET_IS_DATA_STATE = exports.SET_LOADING_STATE = exports.SET_PLAY_HISTORY_LIST = exports.SET_ADD_REMARK_STATUS = exports.SET_COLLECT_MUSIC_LIST = exports.SET_COLLECT_SUBJECT_LIST = exports.SET_SUBJECT_SEARCH_LISTS = exports.SET_ALL_SEARCH_LISTS = exports.SET_CHECKBOX_CURRENT_PLAY_STATUS = exports.SET_HOT_COLUMN_LIST = exports.SET_ALLTYPE_LIST = exports.SET_IS_SPEED_STATE = exports.SET_TOTAL_TIME = exports.SET_CURRENT_TIME = exports.SET_SCROLL_WIDTH_ANIMATION = exports.SET_IS_SWITCH_MUSIC_STATE = exports.SET_MINI_PLAY_LIST_STATUS = exports.SET_MIMI_SHOW_HIDE_STATUS = exports.SET_MIMI_SHOW_CLOSE_STATUS = exports.SET_ALL_PLAYING_STATE = exports.SET_PLAYING_STATE = exports.INDEX_CURRENT_VIDEO_ITEM = exports.ALL_CURRENT_MUSIC_ITEM = exports.CURRENT_MUSIC_ITEM = exports.SET_DURATION = exports.SET_INDEX_LOADING_MUSIC_STATUS = exports.SET_CURRENT_INDEX = exports.SET_ALL_MUSIC_LIST = exports.SET_MUSIC_LIST = exports.SET_NAVIGATION_ITEM_WIDTH = exports.SET_NAVIGATION_SCROLL_LEFT = exports.SET_NAVIGATION_INDEX = exports.SET_NAVIGATION_VERTICAL = exports.SET_INDEX_TYPE_LABEL_LIST = exports.SET_IS_REVIEW = exports.SET_IS_IOS = exports.SET_CHANNEL = exports.SET_SHARE_ID = exports.SET_UNIONID = exports.SET_POP_UP_WINDOWS_OBJ = exports.SET_USERINFO = exports.SET_IS_LOGIN_STATUS = void 0;exports.SET_ONE_TYPE_OCCUPATION_LIST = exports.SET_SUBJECT_GOODS_LABEL_LIST = exports.SET_EDUCATION_INFO = exports.SET_WORK_INFO = exports.SET_INDEX_VIDEO_LIST = exports.SET_AUTHOR_SEARCH_GOODS_LIST = exports.SET_AUTHOR_WINDOW_GOODS_LIST = exports.SET_GET_COURSE_POPUP_STATE = exports.SET_MESSAGE_READ_LIST = void 0;var SET_IS_LOGIN_STATUS = 'SET_IS_LOGIN_STATUS';exports.SET_IS_LOGIN_STATUS = SET_IS_LOGIN_STATUS;
var SET_USERINFO = 'SET_USERINFO';exports.SET_USERINFO = SET_USERINFO;
var SET_POP_UP_WINDOWS_OBJ = 'SET_POP_UP_WINDOWS_OBJ';exports.SET_POP_UP_WINDOWS_OBJ = SET_POP_UP_WINDOWS_OBJ;
var SET_UNIONID = 'SET_UNIONID';exports.SET_UNIONID = SET_UNIONID;
var SET_SHARE_ID = 'SET_SHARE_ID';exports.SET_SHARE_ID = SET_SHARE_ID;
var SET_CHANNEL = 'SET_CHANNEL';exports.SET_CHANNEL = SET_CHANNEL;
var SET_IS_IOS = 'SET_IS_IOS';exports.SET_IS_IOS = SET_IS_IOS;
var SET_IS_REVIEW = 'SET_IS_REVIEW';exports.SET_IS_REVIEW = SET_IS_REVIEW;
var SET_INDEX_TYPE_LABEL_LIST = 'SET_INDEX_TYPE_LABEL_LIST';exports.SET_INDEX_TYPE_LABEL_LIST = SET_INDEX_TYPE_LABEL_LIST;
var SET_NAVIGATION_VERTICAL = 'SET_NAVIGATION_VERTICAL';exports.SET_NAVIGATION_VERTICAL = SET_NAVIGATION_VERTICAL;
var SET_NAVIGATION_INDEX = 'SET_NAVIGATION_INDEX';exports.SET_NAVIGATION_INDEX = SET_NAVIGATION_INDEX;
var SET_NAVIGATION_SCROLL_LEFT = 'SET_NAVIGATION_SCROLL_LEFT';exports.SET_NAVIGATION_SCROLL_LEFT = SET_NAVIGATION_SCROLL_LEFT;
var SET_NAVIGATION_ITEM_WIDTH = 'SET_NAVIGATION_ITEM_WIDTH';exports.SET_NAVIGATION_ITEM_WIDTH = SET_NAVIGATION_ITEM_WIDTH;
var SET_MUSIC_LIST = 'SET_MUSIC_LIST';exports.SET_MUSIC_LIST = SET_MUSIC_LIST;
var SET_ALL_MUSIC_LIST = 'SET_ALL_MUSIC_LIST';exports.SET_ALL_MUSIC_LIST = SET_ALL_MUSIC_LIST;
var SET_CURRENT_INDEX = 'SET_CURRENT_INDEX';exports.SET_CURRENT_INDEX = SET_CURRENT_INDEX;
var SET_INDEX_LOADING_MUSIC_STATUS = 'SET_INDEX_LOADING_MUSIC_STATUS';exports.SET_INDEX_LOADING_MUSIC_STATUS = SET_INDEX_LOADING_MUSIC_STATUS;
var SET_DURATION = 'SET_DURATION';exports.SET_DURATION = SET_DURATION;
var CURRENT_MUSIC_ITEM = 'CURRENT_MUSIC_ITEM';exports.CURRENT_MUSIC_ITEM = CURRENT_MUSIC_ITEM;
var ALL_CURRENT_MUSIC_ITEM = 'ALL_CURRENT_MUSIC_ITEM';exports.ALL_CURRENT_MUSIC_ITEM = ALL_CURRENT_MUSIC_ITEM;
var INDEX_CURRENT_VIDEO_ITEM = 'INDEX_CURRENT_VIDEO_ITEM';exports.INDEX_CURRENT_VIDEO_ITEM = INDEX_CURRENT_VIDEO_ITEM;
var SET_PLAYING_STATE = 'SET_PLAYING_STATE';exports.SET_PLAYING_STATE = SET_PLAYING_STATE;
var SET_ALL_PLAYING_STATE = 'SET_ALL_PLAYING_STATE';exports.SET_ALL_PLAYING_STATE = SET_ALL_PLAYING_STATE;
var SET_MIMI_SHOW_CLOSE_STATUS = 'SET_MIMI_SHOW_CLOSE_STATUS';exports.SET_MIMI_SHOW_CLOSE_STATUS = SET_MIMI_SHOW_CLOSE_STATUS;
var SET_MIMI_SHOW_HIDE_STATUS = 'SET_MIMI_SHOW_HIDE_STATUS';exports.SET_MIMI_SHOW_HIDE_STATUS = SET_MIMI_SHOW_HIDE_STATUS;
var SET_MINI_PLAY_LIST_STATUS = 'SET_MINI_PLAY_LIST_STATUS';exports.SET_MINI_PLAY_LIST_STATUS = SET_MINI_PLAY_LIST_STATUS;
var SET_IS_SWITCH_MUSIC_STATE = 'SET_IS_SWITCH_MUSIC_STATE';exports.SET_IS_SWITCH_MUSIC_STATE = SET_IS_SWITCH_MUSIC_STATE;
var SET_SCROLL_WIDTH_ANIMATION = 'SET_SCROLL_WIDTH_ANIMATION';exports.SET_SCROLL_WIDTH_ANIMATION = SET_SCROLL_WIDTH_ANIMATION;
var SET_CURRENT_TIME = 'SET_CURRENT_TIME';exports.SET_CURRENT_TIME = SET_CURRENT_TIME;
var SET_TOTAL_TIME = 'SET_TOTAL_TIME';exports.SET_TOTAL_TIME = SET_TOTAL_TIME;
var SET_IS_SPEED_STATE = 'SET_IS_SPEED_STATE';exports.SET_IS_SPEED_STATE = SET_IS_SPEED_STATE;
var SET_ALLTYPE_LIST = 'SET_ALLTYPE_LIST';exports.SET_ALLTYPE_LIST = SET_ALLTYPE_LIST;
var SET_HOT_COLUMN_LIST = 'SET_HOT_COLUMN_LIST';exports.SET_HOT_COLUMN_LIST = SET_HOT_COLUMN_LIST;
var SET_CHECKBOX_CURRENT_PLAY_STATUS = 'SET_CHECKBOX_CURRENT_PLAY_STATUS';exports.SET_CHECKBOX_CURRENT_PLAY_STATUS = SET_CHECKBOX_CURRENT_PLAY_STATUS;
var SET_ALL_SEARCH_LISTS = 'SET_ALL_SEARCH_LISTS';exports.SET_ALL_SEARCH_LISTS = SET_ALL_SEARCH_LISTS;
var SET_SUBJECT_SEARCH_LISTS = 'SET_SUBJECT_SEARCH_LISTS';exports.SET_SUBJECT_SEARCH_LISTS = SET_SUBJECT_SEARCH_LISTS;
var SET_COLLECT_SUBJECT_LIST = 'SET_COLLECT_SUBJECT_LIST';exports.SET_COLLECT_SUBJECT_LIST = SET_COLLECT_SUBJECT_LIST;
var SET_COLLECT_MUSIC_LIST = 'SET_COLLECT_MUSIC_LIST';exports.SET_COLLECT_MUSIC_LIST = SET_COLLECT_MUSIC_LIST;
var SET_ADD_REMARK_STATUS = 'SET_ADD_REMARK_STATUS';exports.SET_ADD_REMARK_STATUS = SET_ADD_REMARK_STATUS;
var SET_PLAY_HISTORY_LIST = 'SET_PLAY_HISTORY_LIST';exports.SET_PLAY_HISTORY_LIST = SET_PLAY_HISTORY_LIST;
var SET_LOADING_STATE = 'SET_LOADING_STATE';exports.SET_LOADING_STATE = SET_LOADING_STATE;
var SET_IS_DATA_STATE = 'SET_IS_DATA_STATE';exports.SET_IS_DATA_STATE = SET_IS_DATA_STATE;
var SET_IS_NEWS_DATA_STATE = 'SET_IS_NEWS_DATA_STATE';exports.SET_IS_NEWS_DATA_STATE = SET_IS_NEWS_DATA_STATE;
var SET_RECOMMEND_LABEL_LIST = 'SET_RECOMMEND_LABEL_LIST';exports.SET_RECOMMEND_LABEL_LIST = SET_RECOMMEND_LABEL_LIST;
var SET_SHARE_THUMBNAIL = 'SET_SHARE_THUMBNAIL';exports.SET_SHARE_THUMBNAIL = SET_SHARE_THUMBNAIL;
var SET_SEEK_RECOMMEND_LABEL_LIST = 'SET_SEEK_RECOMMEND_LABEL_LIST';exports.SET_SEEK_RECOMMEND_LABEL_LIST = SET_SEEK_RECOMMEND_LABEL_LIST;
var SET_DAYS = 'SET_DAYS';exports.SET_DAYS = SET_DAYS;
var SET_CHECK_IN_LIST = 'SET_CHECK_IN_LIST';exports.SET_CHECK_IN_LIST = SET_CHECK_IN_LIST;
var SET_CHECK_IN_DATE_LIST = 'SET_CHECK_IN_DATE_LIST';exports.SET_CHECK_IN_DATE_LIST = SET_CHECK_IN_DATE_LIST;
var SET_NEWS_LIST = 'SET_NEWS_LIST';exports.SET_NEWS_LIST = SET_NEWS_LIST;
var SET_COLLECT_ARTICLE_LIST = 'SET_COLLECT_ARTICLE_LIST';exports.SET_COLLECT_ARTICLE_LIST = SET_COLLECT_ARTICLE_LIST;
var SET_SHARE_LATEST_RANK_LIST = 'SET_SHARE_LATEST_RANK_LIST';exports.SET_SHARE_LATEST_RANK_LIST = SET_SHARE_LATEST_RANK_LIST;
var SET_SHARE_RANKING_OBJ = 'SET_SHARE_RANKING_OBJ';exports.SET_SHARE_RANKING_OBJ = SET_SHARE_RANKING_OBJ;
var SET_CHECK_RANKING_OBJ = 'SET_CHECK_RANKING_OBJ';exports.SET_CHECK_RANKING_OBJ = SET_CHECK_RANKING_OBJ;
var SET_SHARE_ENERGY_OBJ = 'SET_SHARE_ENERGY_OBJ';exports.SET_SHARE_ENERGY_OBJ = SET_SHARE_ENERGY_OBJ;
var SET_SHARE_INFO = 'SET_SHARE_INFO';exports.SET_SHARE_INFO = SET_SHARE_INFO;
var SET_FEEDBACK_HISTORY_LIST = 'SET_FEEDBACK_HISTORY_LIST';exports.SET_FEEDBACK_HISTORY_LIST = SET_FEEDBACK_HISTORY_LIST;
var SET_FEEDBACK_DATAIL = 'SET_FEEDBACK_DATAIL';exports.SET_FEEDBACK_DATAIL = SET_FEEDBACK_DATAIL;
var SET_GIVE_THUMBS_MUSIC_LIST = 'SET_GIVE_THUMBS_MUSIC_LIST';exports.SET_GIVE_THUMBS_MUSIC_LIST = SET_GIVE_THUMBS_MUSIC_LIST;
var SET_CONTENT_WORD_LIST = 'SET_CONTENT_WORD_LIST';exports.SET_CONTENT_WORD_LIST = SET_CONTENT_WORD_LIST;
var SET_SUBJECT_DETAIL_LIST = 'SET_SUBJECT_DETAIL_LIST';exports.SET_SUBJECT_DETAIL_LIST = SET_SUBJECT_DETAIL_LIST;
var SET_SIMILARITY_COURSE_LIST = 'SET_SIMILARITY_COURSE_LIST';exports.SET_SIMILARITY_COURSE_LIST = SET_SIMILARITY_COURSE_LIST;
var SET_COMMENT_LIST = 'SET_COMMENT_LIST';exports.SET_COMMENT_LIST = SET_COMMENT_LIST;
var SET_CONVERSION_BOOK_LIST = 'SET_CONVERSION_BOOK_LIST';exports.SET_CONVERSION_BOOK_LIST = SET_CONVERSION_BOOK_LIST;
var SET_ROB_BOOK_LIST = 'SET_ROB_BOOK_LIST';exports.SET_ROB_BOOK_LIST = SET_ROB_BOOK_LIST;
var SET_BING_PHONE_INFO = 'SET_BING_PHONE_INFO';exports.SET_BING_PHONE_INFO = SET_BING_PHONE_INFO;
var SET_LEVEL_ONE_JOB_LIST = 'SET_LEVEL_ONE_JOB_LIST';exports.SET_LEVEL_ONE_JOB_LIST = SET_LEVEL_ONE_JOB_LIST;
var SET_SELECTED_JOB_INFO = 'SET_SELECTED_JOB_INFO';exports.SET_SELECTED_JOB_INFO = SET_SELECTED_JOB_INFO;
var SET_ADDRESS_LIST = 'SET_ADDRESS_LIST';exports.SET_ADDRESS_LIST = SET_ADDRESS_LIST;
var SET_AFFIRM_SITE_INFO = 'SET_AFFIRM_SITE_INFO';exports.SET_AFFIRM_SITE_INFO = SET_AFFIRM_SITE_INFO;
var SET_SCREEN_BOTTLE_STATUS = 'SET_SCREEN_BOTTLE_STATUS';exports.SET_SCREEN_BOTTLE_STATUS = SET_SCREEN_BOTTLE_STATUS;
var SET_ORDER_LIST = 'SET_ORDER_LIST';exports.SET_ORDER_LIST = SET_ORDER_LIST;
var SET_BOTTLE_RECORD_LIST = 'SET_BOTTLE_RECORD_LIST';exports.SET_BOTTLE_RECORD_LIST = SET_BOTTLE_RECORD_LIST;
var SET_TASK_CASE_LIST = 'SET_TASK_CASE_LIST';exports.SET_TASK_CASE_LIST = SET_TASK_CASE_LIST;
var SET_GROWHT_RECORD_LIST = 'SET_GROWHT_RECORD_LIST';exports.SET_GROWHT_RECORD_LIST = SET_GROWHT_RECORD_LIST;
var SET_IN_THE_BOOK_LIST = 'SET_IN_THE_BOOK_LIST';exports.SET_IN_THE_BOOK_LIST = SET_IN_THE_BOOK_LIST;
var SET_MISSION_POPUP_STATUS = 'SET_MISSION_POPUP_STATUS';exports.SET_MISSION_POPUP_STATUS = SET_MISSION_POPUP_STATUS;
var SET_CHECK_STATUS = 'SET_CHECK_STATUS';exports.SET_CHECK_STATUS = SET_CHECK_STATUS;
var SET_SHARE_POPUP_STATE = 'SET_SHARE_POPUP_STATE';exports.SET_SHARE_POPUP_STATE = SET_SHARE_POPUP_STATE;
var SET_RULE_POPUP_STATUS = 'SET_RULE_POPUP_STATUS';exports.SET_RULE_POPUP_STATUS = SET_RULE_POPUP_STATUS;
var SET_TUITION_ME_LIST_STATUS = 'SET_TUITION_ME_LIST_STATUS';exports.SET_TUITION_ME_LIST_STATUS = SET_TUITION_ME_LIST_STATUS;
var SET_CONSUME_LIST = 'SET_CONSUME_LIST';exports.SET_CONSUME_LIST = SET_CONSUME_LIST;
var SET_CONDUCT_GRAB_TUITION_LIST = 'SET_CONDUCT_GRAB_TUITION_LIST';exports.SET_CONDUCT_GRAB_TUITION_LIST = SET_CONDUCT_GRAB_TUITION_LIST;
var SET_ACCOMPLISH_GRAB_TUITION_LIST = 'SET_ACCOMPLISH_GRAB_TUITION_LIST';exports.SET_ACCOMPLISH_GRAB_TUITION_LIST = SET_ACCOMPLISH_GRAB_TUITION_LIST;
var SET_ALL_GRAB_LIST = 'SET_ALL_GRAB_LIST';exports.SET_ALL_GRAB_LIST = SET_ALL_GRAB_LIST;
var SET_GRAB_TUITION_LIST = 'SET_GRAB_TUITION_LIST';exports.SET_GRAB_TUITION_LIST = SET_GRAB_TUITION_LIST;
var SET_EXTRACT_CASH_LIST = 'SET_EXTRACT_CASH_LIST';exports.SET_EXTRACT_CASH_LIST = SET_EXTRACT_CASH_LIST;
var SET_LECTURE_SUBJECT_LIST = 'SET_LECTURE_SUBJECT_LIST';exports.SET_LECTURE_SUBJECT_LIST = SET_LECTURE_SUBJECT_LIST;
var SET_LECTURE_MUSIC_LIST = 'SET_LECTURE_MUSIC_LIST';exports.SET_LECTURE_MUSIC_LIST = SET_LECTURE_MUSIC_LIST;
var SET_MY_ATTENTION_LIST = 'SET_MY_ATTENTION_LIST';exports.SET_MY_ATTENTION_LIST = SET_MY_ATTENTION_LIST;
var SET_MY_SUBSCRIPTION_LIST = 'SET_MY_SUBSCRIPTION_LIST';exports.SET_MY_SUBSCRIPTION_LIST = SET_MY_SUBSCRIPTION_LIST;
var SET_MY_COURSE_LIST = 'SET_MY_COURSE_LIST';exports.SET_MY_COURSE_LIST = SET_MY_COURSE_LIST;
var SET_RETURN_MONEY_POP_UP_STATE = 'SET_RETURN_MONEY_POP_UP_STATE';exports.SET_RETURN_MONEY_POP_UP_STATE = SET_RETURN_MONEY_POP_UP_STATE;
var SET_EXCELLENT_COURSE_INDEX = 'SET_EXCELLENT_COURSE_INDEX';exports.SET_EXCELLENT_COURSE_INDEX = SET_EXCELLENT_COURSE_INDEX;
var SET_EXCELLENT_COURSE_SCROLL_LEFT = 'SET_EXCELLENT_COURSE_SCROLL_LEFT';exports.SET_EXCELLENT_COURSE_SCROLL_LEFT = SET_EXCELLENT_COURSE_SCROLL_LEFT;
var SET_EXCELLENT_COURSE_ITEM_WIDTH = 'SET_EXCELLENT_COURSE_ITEM_WIDTH';exports.SET_EXCELLENT_COURSE_ITEM_WIDTH = SET_EXCELLENT_COURSE_ITEM_WIDTH;
var MUSIC_DETAILS = 'MUSIC_DETAILS';exports.MUSIC_DETAILS = MUSIC_DETAILS;
var SET_EXCHANGE_INVITE_STATE = 'SET_EXCHANGE_INVITE_STATE';exports.SET_EXCHANGE_INVITE_STATE = SET_EXCHANGE_INVITE_STATE;
var SET_TITLE_STATE = 'SET_TITLE_STATE';exports.SET_TITLE_STATE = SET_TITLE_STATE;
var SET_MESSAGE_FROM_USER_LIST = 'SET_MESSAGE_FROM_USER_LIST';exports.SET_MESSAGE_FROM_USER_LIST = SET_MESSAGE_FROM_USER_LIST;
var SET_MESSAGE_READ_LIST = 'SET_MESSAGE_READ_LIST';exports.SET_MESSAGE_READ_LIST = SET_MESSAGE_READ_LIST;
var SET_GET_COURSE_POPUP_STATE = 'SET_GET_COURSE_POPUP_STATE';exports.SET_GET_COURSE_POPUP_STATE = SET_GET_COURSE_POPUP_STATE;
var SET_AUTHOR_WINDOW_GOODS_LIST = 'SET_AUTHOR_WINDOW_GOODS_LIST';exports.SET_AUTHOR_WINDOW_GOODS_LIST = SET_AUTHOR_WINDOW_GOODS_LIST;
var SET_AUTHOR_SEARCH_GOODS_LIST = 'SET_AUTHOR_SEARCH_GOODS_LIST';exports.SET_AUTHOR_SEARCH_GOODS_LIST = SET_AUTHOR_SEARCH_GOODS_LIST;
var SET_INDEX_VIDEO_LIST = 'SET_INDEX_VIDEO_LIST';exports.SET_INDEX_VIDEO_LIST = SET_INDEX_VIDEO_LIST;
var SET_WORK_INFO = 'SET_WORK_INFO';exports.SET_WORK_INFO = SET_WORK_INFO;
var SET_EDUCATION_INFO = 'SET_EDUCATION_INFO';exports.SET_EDUCATION_INFO = SET_EDUCATION_INFO;
var SET_SUBJECT_GOODS_LABEL_LIST = 'SET_SUBJECT_GOODS_LABEL_LIST';exports.SET_SUBJECT_GOODS_LABEL_LIST = SET_SUBJECT_GOODS_LABEL_LIST;
var SET_ONE_TYPE_OCCUPATION_LIST = 'SET_ONE_TYPE_OCCUPATION_LIST';exports.SET_ONE_TYPE_OCCUPATION_LIST = SET_ONE_TYPE_OCCUPATION_LIST;

/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 20:
/*!**************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/store/actions.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _store = _interopRequireDefault(__webpack_require__(/*! ../store */ 16));
var types = _interopRequireWildcard(__webpack_require__(/*! ./mutation-types */ 19));
var _config = __webpack_require__(/*! ../api/config */ 21);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}











var currentTime = 0;
var stopTime = null;
var firstEnter = true;

var myAudio = uni.getBackgroundAudioManager();
var WXBizDataCrypt = __webpack_require__(/*! ../utils/WXBizDataCrypt */ 22);var _default =

{
  // 获取授权微信信息
  setUserInfo: function setUserInfo(_ref, data) {var dispatch = _ref.dispatch,commit = _ref.commit;
    var msg = '';
    if (_config.deviceType === 'mini') {// 小程序
      msg = data.mp.detail.errMsg.split(':');
    } else {
      msg = data.errMsg.split(':');
    }
    if (msg[1] === 'ok') {
      var userInfo = _config.deviceType === 'mini' ? data.mp.detail : data.authResult;
      uni.showLoading({ title: 'Loading' });
      if (_config.deviceType === 'mini') {
        uni.login({
          success: function success(res) {
            userInfo['code'] = res.code;
            dispatch('logIn', userInfo);
          } });

      } else {
        dispatch('logIn', userInfo);
      }
    }
  },
  logIn: function logIn(_ref2, data) {var dispatch = _ref2.dispatch,commit = _ref2.commit,state = _ref2.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.deviceType === 'mini' ? _config.newApiUrl + '/wx/user_auth/wechatLogin' : _config.newApiUrl + '/wx/user_auth/appLoginByWechat',
        header: {
          fromClient: _config.deviceType },

        data: {
          encryptedData: data.encryptedData || '',
          access_token: data.access_token || '',
          unionid: data.unionid || '',
          openid: data.openid || '',
          code: data.code || '',
          iv: data.iv || '' },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var openid = res.data.data.openid;
            uni.setStorageSync('openid', openid);
            dispatch('getUserInfo', { openid: openid, isRegister: true }).then(function (res) {
              resolve(res);
            });
          } else {
            showToastFn('授权登录失败!');
          }
        } });

    });
  },
  // 获取用户信息
  getUserInfo: function getUserInfo(_ref3, data) {var dispatch = _ref3.dispatch,commit = _ref3.commit,state = _ref3.state;
    var openid = data ? data.openid : state.userInfo.openid;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/user/getinfo',
        header: {
          fromClient: _config.deviceType },

        data: { openid: openid },
        success: function success(res) {
          if (res.data.code === _config.code) {
            var oJson = res.data.data;
            oJson['openid'] = openid;
            oJson['sub_total'] = oJson.sub_total >= 10000 ? Math.round(oJson.res.sub_total / 10000 * 100) / 100 + '万' : oJson.sub_total;
            oJson['play_total'] = oJson.play_total >= 10000 ? Math.round(oJson.play_total / 10000 * 100) / 100 + '万' : oJson.play_total;
            oJson['like_total'] = oJson.like_total >= 10000 ? Math.round(oJson.like_total / 10000 * 100) / 100 + '万' : oJson.like_total;
            oJson['attention_total'] = oJson.attention_total >= 10000 ? Math.round(oJson.attention_total / 10000 * 100) / 100 + '万' : oJson.attention_total;
            oJson['collection_total'] = oJson.collection_total >= 10000 ? Math.round(oJson.collection_total / 10000 * 100) / 100 + '万' : oJson.collection_total;
            if (data && data.isRegister) {
              // dispatch('setUnionidRecord', data)
              showToastFn('授权登录成功');
              setTimeout(function () {
                uni.navigateBack();
              }, 2000);
              if (state.shareid) dispatch('motivateOther');
              if (state.shareid || state.channel) dispatch('setActivityInviteRecord');
            }
            commit(types.SET_USERINFO, oJson);
            resolve(oJson);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 保存unionid
  setUnionidRecord: function setUnionidRecord(_ref4, data) {var dispatch = _ref4.dispatch,commit = _ref4.commit,state = _ref4.state;
    uni.login({
      success: function success(res) {
        var oJson = { code: res.code };
        data.that.getWxlogin(oJson).then(function (res) {
          var pc = new WXBizDataCrypt(_config.appId, res.session_key);
          uni.getUserInfo({
            success: function success(res) {
              var decryptData = pc.decryptData(res.encryptedData, res.iv);
              uni.request({
                method: 'GET',
                url: _config.apiUrl + '/activity/unionid_record.php',
                header: {
                  fromClient: _config.deviceType },

                data: {
                  openid: state.userInfo.openid || '',
                  unionid: decryptData.unionId },

                success: function success(res) {
                  commit(types.SET_UNIONID, res.data.unionid);
                } });

            } });

        });
      } });

  },
  // 邀请 - 渠道记录
  setActivityInviteRecord: function setActivityInviteRecord(_ref5) {var dispatch = _ref5.dispatch,commit = _ref5.commit,state = _ref5.state;
    uni.request({
      method: 'POST',
      url: _config.newApiUrl + '/wx/user/inviteRecord',
      header: {
        fromClient: _config.deviceType },

      data: {
        openid: state.userInfo.openid || '',
        shareid: state.shareid,
        channel: state.channel } });


  },
  // 统计用户浏览记录
  setActivityViewRecord: function setActivityViewRecord(_ref6) {var dispatch = _ref6.dispatch,commit = _ref6.commit,state = _ref6.state;
    var uuid = uni.getStorageSync('uuid');
    if (!uuid) {
      uuid = guid(8, 16); // "098F4D35"
      uni.setStorageSync('uuid', guid(8, 16));
    }
    uni.request({
      method: 'POST',
      url: _config.newApiUrl + '/wx/user/viewRecord',
      header: {
        fromClient: _config.deviceType },

      data: {
        shareid: state.shareid,
        channel: state.channel,
        uuid: uuid } });


  },
  // 后台控制部分设置状态是否显示
  getIsReview: function getIsReview(_ref7) {var dispatch = _ref7.dispatch,commit = _ref7.commit,state = _ref7.state;
    uni.request({
      method: 'POST',
      url: _config.newApiUrl + '/wx/simple/getIsReview',
      header: {
        fromClient: _config.deviceType },

      data: { version: _config.versions },
      success: function success(res) {
        commit(types.SET_IS_REVIEW, res.data.data.is_review);
      } });

  },
  // 活动弹窗
  getActivityUpWindows: function getActivityUpWindows(_ref8) {var dispatch = _ref8.dispatch,commit = _ref8.commit,state = _ref8.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/get_author_popup.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          shareid: state.shareid || '' },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 激发它人
  motivateOther: function motivateOther(_ref9) {var dispatch = _ref9.dispatch,commit = _ref9.commit,state = _ref9.state;
    uni.request({
      method: 'GET',
      url: _config.apiUrl + '/api/wx_jf.php',
      header: {
        fromClient: _config.deviceType },

      data: {
        s_user_id: state.userInfo.user_id,
        other_user_id: state.shareid } });


  },
  // 获取首页分类标签
  getTypeLabel: function getTypeLabel(_ref10) {var dispatch = _ref10.dispatch,commit = _ref10.commit,state = _ref10.state;
    uni.request({
      method: 'POST',
      url: _config.newApiUrl + '/wx/home/getHomeTab',
      header: {
        fromClient: _config.deviceType },

      success: function success(res) {
        if (res.data.code === _config.code) {
          commit(types.SET_INDEX_TYPE_LABEL_LIST, res.data.data);
        } else {
          if (res.data.code === _config.staleCode) signOut();
          showToastFn(res.data.message);
        }
      } });

  },
  // 获取分类轮播
  getClassifyBanner: function getClassifyBanner(_ref11, data) {var dispatch = _ref11.dispatch,commit = _ref11.commit,state = _ref11.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/special/wx_banner_catid.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          catid: data.catid,
          type: 2 },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取二级分类标签
  getSecondTypeLabel: function getSecondTypeLabel(_ref12, data) {var dispatch = _ref12.dispatch,commit = _ref12.commit,state = _ref12.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/special/wx_catlist_by_top_catid.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          catid: data.catid },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            var lists = [];

            if (res.data.data.lists.length) lists = [{ catid: 0, catname: '全部', parentid: res.data.data.lists[0].parentid }];

            lists = lists.concat(res.data.data.lists);
            resolve(lists);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取热门栏目
  getHotColumnList: function getHotColumnList(_ref13, data) {var dispatch = _ref13.dispatch,commit = _ref13.commit,state = _ref13.state;
    var allItem = state.allCurrentMusicItem;

    commit(types.SET_LOADING_STATE, true);
    commit(types.SET_IS_DATA_STATE, false);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/simple/getHotVoiceList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          catid: data.catid || 0,
          page: data.page },

        success: function success(res) {
          if (data.more) {
            var lists = JSON.parse(JSON.stringify(state.hotColumnList));

            res.data.data.forEach(function (item) {
              allItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false;
              item['listType'] = 'hotColumnType';
              item['catid'] = data.catid;
              item['page'] = data.page;
              lists.push(item);
            });

            commit(types.SET_LOADING_STATE, false);
            commit(types.SET_HOT_COLUMN_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.length);
            if (allItem.listType === 'hotColumnType' && allItem.catid === data.catid) commit(types.SET_ALL_MUSIC_LIST, lists);
          }
          resolve(res.data);
        } });

    });
  },
  // 获取二级分类content
  getClassifycontent: function getClassifycontent(_ref14, data) {var dispatch = _ref14.dispatch,commit = _ref14.commit,state = _ref14.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/special/wx_special_catid.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          catid: data.catid,
          page: data.page },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            commit(types.SET_IS_DATA_STATE, !res.data.data.lists.length);
            commit(types.SET_LOADING_STATE, false);
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取音乐列表
  getMusicList: function getMusicList(_ref15, data) {var dispatch = _ref15.dispatch,commit = _ref15.commit,state = _ref15.state;
    uni.showLoading({ title: 'Loading' });
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/home/index',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page },

        success: function success(res) {
          firstEnter = true;

          if (res.data.code === _config.code) {
            var lists = res.data.data;

            lists.forEach(function (item) {
              state.allCurrentMusicItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false;
              item['inputtime'] = getLocalTime(item.inputtime * 1000);
              if (item.window) item.window['state'] = true;
              item['listType'] = 'indexMusic';
              item['page'] = data.page;
            });

            commit(types.SET_MUSIC_LIST, lists);
            commit(types.SET_ALL_MUSIC_LIST, lists);
            commit(types.CURRENT_MUSIC_ITEM, lists[0]);
            commit(types.ALL_CURRENT_MUSIC_ITEM, lists[0]);

            if (!data.first) {
              commit(types.SET_CURRENT_INDEX, 0);
              commit(types.SET_INDEX_LOADING_MUSIC_STATUS, false);
              dispatch('setMusicStatus', { that: data.that, item: lists[0], list: lists });
            }
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }

          uni.hideLoading();
          resolve(res);
        } });

    });
  },
  // 获取音频详情
  getMusicDetails: function getMusicDetails(_ref16, data) {var dispatch = _ref16.dispatch,commit = _ref16.commit,state = _ref16.state;
    uni.showLoading({ title: 'Loading' });
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/getVoiceInfo',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            if (state.setTitleState) {
              uni.setNavigationBarTitle({
                title: res.data.data.title });

            }

            res.data.data['id'] = data.id;
            res.data.data['page'] = data.page;
            res.data.data['keywords'] = data.keywords;
            res.data.data['listType'] = data.listType;
            res.data.data['authorId'] = data.authorId;

            if (res.data.data.url) {
              commit(types.SET_IS_SWITCH_MUSIC_STATE, false);
              dispatch('setMusicStatus', { that: data.that, item: res.data.data, list: state.allMusicList });
            } else {
              myAudio.stop();
              firstEnter = true;
              commit(types.SET_TOTAL_TIME, 0);
              commit(types.SET_CURRENT_TIME, 0);
              dispatch('pauseStop', { item: data });

              uni.showModal({
                title: '温馨提示',
                content: '购买后才能播放!',
                confirmColor: '#e1564f' });

            }

            commit('MUSIC_DETAILS', res.data.data);
            uni.hideLoading();
            resolve(res.data);
          } else {
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 全局搜索
  getAllSearch: function getAllSearch(_ref17, data) {var dispatch = _ref17.dispatch,commit = _ref17.commit,state = _ref17.state;
    var allItem = state.allCurrentMusicItem;

    commit(types.SET_LOADING_STATE, true);
    commit(types.SET_IS_DATA_STATE, false);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/voice/search',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          keywords: data.keywords,
          page: data.page },

        success: function success(res) {
          var lists = JSON.parse(JSON.stringify(state.allSearchLists));

          res.data.data.data.forEach(function (item) {
            allItem.id === item.id && state.allPlaying ? item['playing'] = true : item['playing'] = false;
            item['inputtime'] = getLocalTime(item.inputtime * 1000);
            item['listType'] = 'allSearchType';
            item['keywords'] = data.keywords;
            item['page'] = data.page;
            lists.push(item);
          });

          commit(types.SET_LOADING_STATE, false);
          commit(types.SET_ALL_SEARCH_LISTS, lists);
          commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
          if (allItem.listType === 'allSearchType' && allItem.keywords === data.keywords) commit(types.SET_ALL_MUSIC_LIST, lists);

          uni.hideLoading();
          resolve();
        } });

    });
  },
  // 搜索专题
  getSubjectSearch: function getSubjectSearch(_ref18, data) {var dispatch = _ref18.dispatch,commit = _ref18.commit,state = _ref18.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/search',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          keywords: data.keywords,
          page: data.page },

        success: function success(res) {
          var lists = JSON.parse(JSON.stringify(state.subjectSearchLists));

          res.data.data.data.forEach(function (item) {
            item['keyWord'] = data.keyWord;
            item['page'] = data.page;
            lists.push(item);
          });

          commit(types.SET_SUBJECT_SEARCH_LISTS, lists);
          commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
          commit(types.SET_LOADING_STATE, false);

          resolve();
        } });

    });
  },
  // 监听首页播放音频状态
  setMusicStatus: function setMusicStatus(_ref19, data) {var dispatch = _ref19.dispatch,commit = _ref19.commit,state = _ref19.state;
    var allMusicList = [];

    if (data.item.listType === 'indexMusic') allMusicList = state.musicList;
    if (data.item.listType === 'allSearchType') allMusicList = state.allSearchLists;
    if (data.item.listType === 'collectType') allMusicList = state.collectMusicList;
    if (data.item.listType === 'giveThumbsType') allMusicList = state.giveThumbsMusicList;
    if (data.item.listType === 'historyType') allMusicList = state.playHistoryList;
    if (data.item.listType === 'newsMusic') allMusicList = state.newsList;
    if (data.item.listType === 'subjectType') allMusicList = state.subjectDetailList;
    if (data.item.listType === 'hotColumnType') allMusicList = state.hotColumnList;
    if (data.item.listType === 'shareMusic') allMusicList = state.shareInfo;
    if (data.item.listType === 'lectureType') allMusicList = state.lectureMusicList;

    data.item = JSON.parse(JSON.stringify(data.item).replace(/vid/g, 'id'));
    data.list.forEach(function (item) {if (item.vid) item['id'] = item.vid;});

    if (firstEnter || state.allCurrentMusicItem.id !== data.item.id) {
      if (currentTime) dispatch('setActivityActRecord', data);

      myAudio.title = data.item.title || '瓶盖思维';
      myAudio.opname = data.item.title || '瓶盖思维';
      myAudio.singer = '瓶盖思维';
      myAudio.coverImgUrl = data.item.thumb || data.item.cover;
      myAudio.src = data.item.url;
      firstEnter = false;
    }
    // 播放
    myAudio.onPlay(function () {
      // indexMusic
      if (data.item.listType === 'indexMusic') commit(types.SET_PLAYING_STATE, true);
      commit(types.SET_ALL_PLAYING_STATE, true);
      dispatch('setMusicListPlayStatusFn', { item: data.item });
    });
    // 暂停
    myAudio.onPause(function () {
      dispatch('pauseStop', data);
    });
    // 关闭播放
    myAudio.onStop(function () {
      firstEnter = true;
      dispatch('pauseStop', data);
    });
    // 播放错误
    myAudio.onError(function () {
      myAudio.pause();
      dispatch('recordMusicPlayError', data);
      commit(types.SET_ALL_PLAYING_STATE, false);
      if (data.item.listType === 'indexMusic') commit(types.SET_PLAYING_STATE, false);
      uni.showModal({ content: '播放错误!' });
    });
    // 后台运行切换下一曲
    myAudio.onNext(function () {dispatch('setSwitchMusic', { that: data.that, status: 'next' });});
    // 后台运行切换上一曲
    myAudio.onPrev(function () {dispatch('setSwitchMusic', { that: data.that, status: 'prev' });});
    // 如果当前播放id和再次传入的id相同时
    if (!state.isSwitchMusic && state.allCurrentMusicItem.id === data.item.id) {
      if (state.allPlaying) {
        myAudio.pause();
        // indexMusic
        if (data.item.listType === 'indexMusic') commit(types.SET_PLAYING_STATE, false);
        commit(types.SET_ALL_PLAYING_STATE, false);
      } else {
        dispatch('musicPlayFn', data);
      }
    } else {
      dispatch('musicPlayFn', data);
    }
    // indexMusic
    if (data.item.listType === 'indexMusic') commit(types.CURRENT_MUSIC_ITEM, data.item);

    commit(types.ALL_CURRENT_MUSIC_ITEM, data.item);
  },
  // 播放音频错误-记录
  recordMusicPlayError: function recordMusicPlayError(_ref20, data) {var dispatch = _ref20.dispatch,commit = _ref20.commit,state = _ref20.state;
    var uuid = uni.getStorageSync('uuid');

    if (!uuid) {
      uuid = guid(8, 16); // "098F4D35"
      uni.setStorageSync('uuid', guid(8, 16));
    }

    uni.request({
      method: 'POST',
      url: _config.newApiUrl + '/wx/simple/errorRecord',
      header: {
        fromClient: _config.deviceType },

      data: {
        openid: state.userInfo.openid || '',
        remark: JSON.stringify(data.item),
        c_id: data.item.id,
        type: 0,
        uuid: uuid } });


  },
  // 暂停-关闭播放
  pauseStop: function pauseStop(_ref21, data) {var dispatch = _ref21.dispatch,commit = _ref21.commit,state = _ref21.state;
    // indexMusic
    if (data.item.listType === 'indexMusic') commit(types.SET_PLAYING_STATE, false);
    commit(types.SET_ALL_PLAYING_STATE, false);
    dispatch('setMusicListPlayStatusFn', { item: data.item });
  },
  // 播放音乐和监听音频进度及结束
  musicPlayFn: function musicPlayFn(_ref22, data) {var dispatch = _ref22.dispatch,commit = _ref22.commit,state = _ref22.state;
    myAudio.play();

    state.allMusicList.forEach(function (item, i) {
      if (item.id === data.item.id || item.vid === data.item.id) {
        if (i === state.allMusicList.length - 1) {
          // 获取搜索音频列表
          if (data.item.listType === 'allSearchType') {
            var oJson = {
              keywords: data.item.keywords,
              page: data.item.page + 1,
              that: data.that };

            dispatch('getAllSearch', oJson);
          }
          // 获取收藏音频列表
          if (data.item.listType === 'collectType') {
            var _oJson = {
              keywords: data.item.keywords,
              page: data.item.page + 1,
              that: data.that,
              type: 0 };

            dispatch('getCollectList', _oJson);
          }
          // 获取点赞音频列表
          if (data.item.listType === 'giveThumbsType') {
            var _oJson2 = {
              page: data.item.page + 1,
              that: data.that };

            dispatch('getGiveThumbsMusicList', _oJson2);
          }
          // 获取播放历史音频列表
          if (data.item.listType === 'historyType') {
            var _oJson3 = {
              page: data.item.page + 1,
              that: data.that };

            dispatch('getPlayAnnalList', _oJson3);
          }
          // 获取新闻音频列表
          if (data.item.listType === 'newsMusic') {
            var _oJson4 = {
              page: data.item.page + 1,
              that: data.that };

            dispatch('getNewsList', _oJson4);
          }
          // 获取专题音频列表
          if (data.item.listType === 'subjectType') {
            var _oJson5 = {
              page: data.item.page + 1,
              id: data.item.special_id,
              that: data.that };

            dispatch('getSubjectList', _oJson5);
          }
          // 获取热门列表音频列表
          if (data.item.listType === 'hotColumnType') {
            var _oJson6 = {
              page: data.item.page + 1,
              catid: data.item.catid,
              that: data.that,
              more: true };

            dispatch('getHotColumnList', _oJson6);
          }
          // 获取讲师音频列表
          if (data.item.listType === 'lectureType') {
            var _oJson7 = {
              page: data.item.page + 1,
              authorId: data.item.authorId,
              that: data.that };

            dispatch('getLectureMusicList', _oJson7);
          }
        }
      }
    });
    // indexMusic
    if (data.item.listType === 'indexMusic') {
      commit(types.SET_PLAYING_STATE, true);
    } else {
      commit(types.SET_PLAYING_STATE, false);
    }

    commit(types.SET_MIMI_SHOW_CLOSE_STATUS, true);
    commit(types.SET_ALL_PLAYING_STATE, true);

    // dispatch('recordingPlayMusic', { item: state.allCurrentMusicItem, that: data.that })

    // 当前进度时间和总时间
    myAudio.onTimeUpdate(function () {
      currentTime = myAudio.currentTime;
      dispatch('setCurrentTimeDuration', { currentTime: myAudio.currentTime, duration: myAudio.duration });
    });
    // 音频播放结束时
    myAudio.onEnded(function () {
      data['isFinish'] = 1;
      // 记录播放音频
      dispatch('recordingPlayMusic', { item: state.allCurrentMusicItem, that: data.that });
      // 自动切换下一首
      dispatch('setSwitchMusic', { that: data.that, status: 'next' });
      // 记录播放完成的音频
      dispatch('setActivityActRecord', data);
    });
  },
  // 设置音频进度状态和结束状态
  setCurrentTimeDuration: function setCurrentTimeDuration(_ref23) {var dispatch = _ref23.dispatch,commit = _ref23.commit,state = _ref23.state;
    commit(types.SET_CURRENT_TIME, myAudio.currentTime);
    commit(types.SET_TOTAL_TIME, myAudio.duration);
  },
  // 音频进度条拖拽
  setSliderChange: function setSliderChange(_ref24, data) {var dispatch = _ref24.dispatch,commit = _ref24.commit,state = _ref24.state;
    var num = data.status ? getPercent(data.num, data.total) : data.num;
    myAudio.seek(state.totalTime * (num / 100));
  },
  // 播放音频
  myAudioPlay: function myAudioPlay(_ref25) {var dispatch = _ref25.dispatch,commit = _ref25.commit,state = _ref25.state;
    myAudio.play();
  },
  // 暂停音频
  myAudioPause: function myAudioPause(_ref26, data) {var dispatch = _ref26.dispatch,commit = _ref26.commit,state = _ref26.state;
    myAudio.pause();
  },
  // 设置切换音频
  setSwitchMusic: function setSwitchMusic(_ref27, data) {var dispatch = _ref27.dispatch,commit = _ref27.commit,state = _ref27.state;
    var currentIndex = 0;
    var lists = state.allMusicList;
    var allItem = state.allCurrentMusicItem;

    for (var i = 0; i < lists.length; i++) {
      if (allItem.id === lists[i].id || allItem.id === lists[i].vid) {
        data.status === 'next' ? currentIndex = i + 1 : currentIndex = i - 1;
        if (currentIndex < lists.length) {
          if (lists[currentIndex].listType === 'indexMusic') {
            setTimeout(function () {
              dispatch('setMusicStatus', { that: data.that, item: lists[currentIndex], list: lists });
              commit(types.SET_CURRENT_INDEX, currentIndex);
            }, 500);
          } else if (lists[currentIndex].listType === 'newsMusic') {
            setTimeout(function () {
              dispatch('setMusicStatus', { that: data.that, item: lists[currentIndex], list: lists });
            }, 500);
          } else {
            var oJson = {
              that: data.that,
              id: lists[currentIndex].vid || lists[currentIndex].id,
              keywords: lists[currentIndex].keywords || '',
              listType: lists[currentIndex].listType,
              authorId: lists[currentIndex].authorId,
              page: lists[currentIndex].page };

            dispatch('getMusicDetails', oJson);
          }
        } else {
          firstEnter = true;
          // indexMusic
          if (lists[0].listType === 'indexMusic') {
            var _oJson8 = {
              page: state.musicList[0].page + 1,
              that: data.that,
              type: 'index',
              first: false };

            dispatch('getMusicList', _oJson8);
          }
          commit(types.SET_PLAYING_STATE, false);
          commit(types.SET_ALL_PLAYING_STATE, false);
          dispatch('setMusicListPlayStatusFn', { item: lists[currentIndex - 1] });
        }
      }
    }
  },
  // 改变list播放列表状态
  setMusicListPlayStatusFn: function setMusicListPlayStatusFn(_ref28, data) {var dispatch = _ref28.dispatch,commit = _ref28.commit,state = _ref28.state;
    var newMusicList = [];
    switch (data.item.listType) {
      case 'indexMusic':
        newMusicList = state.musicList;
        break;
      case 'allSearchType':
        newMusicList = state.allSearchLists;
        break;
      case 'newsMusic':
        newMusicList = state.newsList;
        break;
      case 'collectType':
        newMusicList = state.collectMusicList;
        break;
      case 'historyType':
        newMusicList = state.playHistoryList;
        break;
      case 'giveThumbsType':
        newMusicList = state.giveThumbsMusicList;
        break;
      case 'subjectType':
        newMusicList = state.subjectDetailList;
        break;
      case 'hotColumnType':
        newMusicList = state.hotColumnList;
        break;
      case 'shareMusic':
        newMusicList = state.shareInfo;
        break;
      case 'lectureType':
        newMusicList = state.lectureMusicList;
        break;
      default:
        return false;}

    state.allMusicList.forEach(function (item) {
      item.vid === data.item.id && state.allPlaying ? item['playing'] = true : item['playing'] = false;
    });
    newMusicList.forEach(function (item) {
      (item.id === data.item.id || item.vid === data.item.id) && state.allPlaying ? item['playing'] = true : item['playing'] = false;
    });
  },
  // 音频点赞和收藏
  likeCollectFn: function likeCollectFn(_ref29, data) {var dispatch = _ref29.dispatch,commit = _ref29.commit,state = _ref29.state;
    var lists = [];
    switch (data.type) {
      case 'allMusicType':
        data.state === 1 ? state.allCurrentMusicItem[data.operateType] = 0 : state.allCurrentMusicItem[data.operateType] = 1;
        break;
      case 'indexType':
        data.state === 1 ? state.currentMusicItem[data.operateType] = 0 : state.currentMusicItem[data.operateType] = 1;
        break;
      case 'allSearchType':
        lists = state.allSearchLists;
        break;
      case 'collectType':
        lists = state.collectMusicList;
        break;
      case 'historyType':
        lists = state.playHistoryList;
        break;
      case 'giveThumbsType':
        lists = state.giveThumbsMusicList;
        break;
      case 'subjectType':
        lists = state.subjectDetailList;
        break;
      case 'hotColumnType':
        lists = state.hotColumnList;
        break;
      case 'lectureType':
        lists = state.lectureMusicList;
        break;
      default:
        return false;}

    lists.forEach(function (item) {
      if (item.id === data.id || item.vid === data.id) {
        data.state === 1 ? item[data.operateType] = 0 : item[data.operateType] = 1;
        if (data.operateType === 'is_like') data.state === 1 ? item.like_hits = item.like_hits - 1 : item.like_hits = item.like_hits + 1;
        if (data.operateType === 'is_collection') data.state === 1 ? item.collection_hits = item.collection_hits - 1 : item.collection_hits = item.collection_hits + 1;
      }
    });
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: data.operateType === 'is_like' ? _config.newApiUrl + '/wx/simple/thumbsUp' : _config.newApiUrl + '/wx/simple/collection',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id,
          type: 0 },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 全部点赞
  allThumbsUp: function allThumbsUp(_ref30, data) {var dispatch = _ref30.dispatch,commit = _ref30.commit,state = _ref30.state;
    // 0 音频 1 专题 2 文章 3 评论
    var oJson = '';
    var lists = [];
    switch (data.likeType) {
      case 'commentType':
        oJson = state.commentList[data.index];
        oJson['is_like'] = data.status === 0 ? 1 : 0;
        oJson['like_total'] = data.status === 0 ? oJson.like_total + 1 : oJson.like_total - 1;
        JSON.parse(JSON.stringify(state.commentList));
        break;
      case 'replyType':
        oJson = state.commentList[data.index].replay_list[data.i];
        oJson['is_like'] = data.status === 0 ? 1 : 0;
        oJson['like_total'] = data.status === 0 ? oJson.like_total + 1 : oJson.like_total - 1;
        JSON.parse(JSON.stringify(state.commentList));
        break;
      case 'indexMusic':
        lists = state.musicList;
        state.currentMusicItem['is_like'] = data.status === 0 ? 1 : 0;
        break;
      case 'allMusicType':
        data.state === 1 ? state.allCurrentMusicItem[data.operateType] = 0 : state.allCurrentMusicItem[data.operateType] = 1;
        break;
      case 'allSearchType':
        lists = state.allSearchLists;
        break;
      case 'collectType':
        lists = state.collectMusicList;
        break;
      case 'historyType':
        lists = state.playHistoryList;
        break;
      case 'giveThumbsType':
        lists = state.giveThumbsMusicList;
        break;
      case 'subjectType':
        lists = state.subjectDetailList;
        break;
      case 'hotColumnType':
        lists = state.hotColumnList;
        break;
      case 'lectureType':
        lists = state.lectureMusicList;
        break;}

    lists.forEach(function (item) {
      if (item.id === data.id || item.vid === data.id) {
        data.status === 1 ? item['is_like'] = 0 : item['is_like'] = 1;
        data.status === 1 ? item['like_hits'] = item.like_hits - 1 : item['like_hits'] = item.like_hits + 1;
      }
    });
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/simple/thumbsUp',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          type: data.type,
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 全部收藏
  allCollection: function allCollection(_ref31, data) {var dispatch = _ref31.dispatch,commit = _ref31.commit,state = _ref31.state;
    // 0 音频 1 专题 2 文章
    var lists = [];
    switch (data.collectionType) {
      case 'indexMusic':
        lists = state.musicList;
        state.currentMusicItem['is_collection'] = data.status === 0 ? 1 : 0;
        break;
      case 'allMusicType':
        data.state === 1 ? state.allCurrentMusicItem[data.operateType] = 0 : state.allCurrentMusicItem[data.operateType] = 1;
        break;
      case 'musicDetailsType':
        state.musicDetails['is_collection'] = data.status === 0 ? 1 : 0;
        break;
      case 'allSearchType':
        lists = state.allSearchLists;
        break;
      case 'collectType':
        lists = state.collectMusicList;
        break;
      case 'historyType':
        lists = state.playHistoryList;
        break;
      case 'giveThumbsType':
        lists = state.giveThumbsMusicList;
        break;
      case 'subjectType':
        lists = state.subjectDetailList;
        break;
      case 'hotColumnType':
        lists = state.hotColumnList;
        break;
      case 'lectureType':
        lists = state.lectureMusicList;
        break;}

    lists.forEach(function (item) {
      if (item.id === data.id || item.vid === data.id) {
        data.status === 1 ? item['is_collection'] = 0 : item['is_collection'] = 1;
        data.status === 1 ? item['collection_hits'] = item.collection_hits - 1 : item['collection_hits'] = item.collection_hits + 1;
      }
    });
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/simple/collection',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          type: data.type,
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 关注-取消讲师
  concernAuthor: function concernAuthor(_ref32, data) {var dispatch = _ref32.dispatch,commit = _ref32.commit,state = _ref32.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/simple/attention',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.au_id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 订阅专题
  subscriptionSubject: function subscriptionSubject(_ref33, data) {var dispatch = _ref33.dispatch,commit = _ref33.commit,state = _ref33.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/subSpecial',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 收藏添加备注
  collectRemark: function collectRemark(_ref34, data) {var dispatch = _ref34.dispatch,commit = _ref34.commit,state = _ref34.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/simple/saveCollectionRemark',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          remark: data.remark,
          id: data.id },

        success: function success(res) {
          resolve(res.data);
        } });

    });
  },
  // 获取分类列表
  getAllTypeList: function getAllTypeList(_ref35, data) {var dispatch = _ref35.dispatch,commit = _ref35.commit,state = _ref35.state;
    uni.showLoading({ title: 'Loading' });
    uni.request({
      method: 'GET',
      url: _config.apiUrl + '/category/wx_categorys.php',
      header: {
        fromClient: _config.deviceType },

      data: {
        openid: state.userInfo.openid || '',
        keyWords: data.keyWord },

      success: function success(res) {
        if (res.data.ret === _config.ret) {
          commit(types.SET_ALLTYPE_LIST, res.data.data);
        } else {
          if (res.data.ret === _config.staleCode) signOut();
          showToastFn(res.data.message);
        }
        uni.hideLoading();
      } });

  },
  // 获取分享推荐标签列表
  getRecommendLabe: function getRecommendLabe(_ref36, data) {var dispatch = _ref36.dispatch,commit = _ref36.commit,state = _ref36.state;
    uni.request({
      method: 'GET',
      url: _config.apiUrl + '/category/wx_get_catname_lists.php',
      header: {
        fromClient: _config.deviceType },

      data: {
        catid: data.catid },

      success: function success(res) {
        if (res.data.ret === _config.ret) {
          commit(types.SET_RECOMMEND_LABEL_LIST, res.data.data);
        } else {
          if (res.data.ret === _config.staleCode) signOut();
          showToastFn(res.data.message);
        }
      } });

  },
  // 获取分享缩略图
  getShareThumbnail: function getShareThumbnail(_ref37, data) {var dispatch = _ref37.dispatch,commit = _ref37.commit,state = _ref37.state;
    uni.request({
      method: 'GET',
      url: _config.apiUrl + '/share/wx_rand_pic.php',
      header: {
        fromClient: _config.deviceType },

      data: {
        openid: state.userInfo.openid || '',
        catid: data.catid },

      success: function success(res) {
        if (res.data.ret === _config.ret) {
          commit(types.SET_SHARE_THUMBNAIL, res.data.data.thumb);
        } else {
          if (res.data.ret === _config.staleCode) signOut();
          showToastFn(res.data.message);
        }
      } });

  },
  // 记录分享的用户
  addShareRecord: function addShareRecord(_ref38, data) {var dispatch = _ref38.dispatch,commit = _ref38.commit,state = _ref38.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/share/wx_add_share.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          user_id: state.userInfo.user_id,
          labellist: data.labellist || [],
          vid: data.vid },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 添加分享积分
  addShareJifen: function addShareJifen(_ref39) {var dispatch = _ref39.dispatch,commit = _ref39.commit,state = _ref39.state;
    if (state.shareid) {
      return new Promise(function (resolve) {
        uni.request({
          method: 'GET',
          url: _config.apiUrl + '/share/wx_add_share_jifen.php',
          header: {
            fromClient: _config.deviceType },

          data: {
            openid: state.userInfo.openid || '',
            user_id: state.shareid },

          success: function success(res) {
            if (res.data.ret === _config.ret) {
              resolve(res.data);
            } else {
              if (res.data.ret === _config.staleCode) signOut();
              showToastFn(res.data.message);
            }
          } });

      });
    }
  },
  // 获取搜索推荐标签列表
  getSeekRecommendLabe: function getSeekRecommendLabe(_ref40) {var dispatch = _ref40.dispatch,commit = _ref40.commit,state = _ref40.state;
    uni.request({
      method: 'GET',
      url: _config.apiUrl + '/keyword/wx_hot_keywords.php',
      header: {
        fromClient: _config.deviceType },

      success: function success(res) {
        if (res.data.ret === _config.ret) {
          commit(types.SET_SEEK_RECOMMEND_LABEL_LIST, res.data.data);
        } else {
          if (res.data.ret === _config.staleCode) signOut();
          showToastFn(res.data.message);
        }
      } });

  },
  // 用户账号余额
  getUserAccountInfo: function getUserAccountInfo(_ref41) {var dispatch = _ref41.dispatch,commit = _ref41.commit,state = _ref41.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/user/getUserAccount',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 提现
  carryCash: function carryCash(_ref42, data) {var dispatch = _ref42.dispatch,commit = _ref42.commit,state = _ref42.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/user_withdrawal/createUserWithdrawal',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid,
          amount: data.amount },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取音频 - 文章 - 专题，收藏列表
  getCollectList: function getCollectList(_ref43, data) {var dispatch = _ref43.dispatch,commit = _ref43.commit,state = _ref43.state;
    var allItem = state.allCurrentMusicItem;

    commit(types.SET_LOADING_STATE, true);
    commit(types.SET_IS_DATA_STATE, false);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/simple/collectionList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          keywords: data.keywords,
          page: data.page,
          type: data.type },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = [];

            if (data.type === 0) {
              lists = JSON.parse(JSON.stringify(state.collectMusicList));

              res.data.data.forEach(function (item) {
                allItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false;
                item['inputtime'] = getLocalTime(item.inputtime * 1000);
                item['keywords'] = data.keywords;
                item['listType'] = 'collectType';
                item['page'] = data.page;
                lists.push(item);
              });

              commit(types.SET_COLLECT_MUSIC_LIST, lists);
              if (allItem.listType === 'collectType' && allItem.keywords === data.keywords) commit(types.SET_ALL_MUSIC_LIST, lists);
            } else if (data.type === 1) {
              lists = JSON.parse(JSON.stringify(state.collectSubjectList));

              res.data.data.forEach(function (item) {
                item['page'] = data.page;
                lists.push(item);
              });

              commit(types.SET_COLLECT_SUBJECT_LIST, lists);
            } else if (data.type === 2) {
              lists = JSON.parse(JSON.stringify(state.collectArticleList));

              res.data.data.forEach(function (item) {
                item['inputtime'] = getLocalTime(item.inputtime * 1000);
                lists.push(item);
              });

              commit(types.SET_COLLECT_ARTICLE_LIST, lists);
            }

            commit(types.SET_LOADING_STATE, false);
            commit(types.SET_IS_DATA_STATE, !res.data.data.length);

            resolve(lists);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取播放历史列表
  getPlayAnnalList: function getPlayAnnalList(_ref44, data) {var dispatch = _ref44.dispatch,commit = _ref44.commit,state = _ref44.state;
    var allItem = state.allCurrentMusicItem;

    commit(types.SET_LOADING_STATE, true);
    commit(types.SET_IS_DATA_STATE, false);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/voice/playRecord',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.playHistoryList));

            res.data.data.data.forEach(function (item) {
              item.inputtime = getLocalTime(item.inputtime * 1000);
              allItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false;
              item['listType'] = 'historyType';
              item['page'] = data.page;
              lists.push(item);
            });

            commit(types.SET_LOADING_STATE, false);
            commit(types.SET_PLAY_HISTORY_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
            if (allItem.listType === 'historyType') commit(types.SET_ALL_MUSIC_LIST, lists);
            resolve();
          } else {
            if (res.data.data.code === _config.staleCode) signOut();
            showToastFn(res.data.data.message);
          }
        } });

    });
  },
  // 记录上一次预览(文章-音频)
  setActivityActRecord: function setActivityActRecord(_ref45, data) {var dispatch = _ref45.dispatch,commit = _ref45.commit,state = _ref45.state;
    var type = 0;
    var contentId = 0;
    var uuid = uni.getStorageSync('uuid');

    if (!uuid) {
      uuid = guid(8, 16); // "098F4D35"
      uni.setStorageSync('uuid', guid(8, 16));
    }

    if (data.item) {
      // indexMusic newsMusic 等...
      contentId = data.item.id;
      data.item.listType !== 'newsMusic' ? type = 0 : type = 1;
    } else {
      // subjectType 2
      // articleType 3
      contentId = data.type === 4 ? data.oJson.au_id : data.oJson.id;
      type = data.type;
    }

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/user/actRecord',
        header: {
          fromClient: _config.deviceType },

        data: {
          info: type === 0 || type === 1 ? currentTime : 0,
          openid: state.userInfo.openid || '',
          is_finish: data.isFinish || '',
          content_id: contentId,
          uuid: uuid,
          type: type },

        success: function success(res) {
          resolve(res.data);
        } });

    });
  },
  // 记录播放过的音频
  recordingPlayMusic: function recordingPlayMusic(_ref46, data) {var dispatch = _ref46.dispatch,commit = _ref46.commit,state = _ref46.state;
    if (state.userInfo) {
      return new Promise(function (resolve) {
        uni.request({
          method: 'GET',
          url: data.item.listType === 'newsMusic' ? _config.apiUrl + '/played/wx_add_headline.php' : _config.apiUrl + '/played/wx_add_played.php',
          header: {
            fromClient: _config.deviceType },

          data: {
            special_id: data.item.special_id || '',
            openid: state.userInfo.openid || '',
            vid: data.item.id || data.item.vid,
            catid: data.item.catid || '',
            title: data.item.title || '',
            thumb: data.item.thumb || '',
            url: data.item.url || '',
            is_played: 1 || false },

          success: function success(res) {
            if (res.data.ret === _config.ret) {
              resolve(res.data);
            } else {
              if (res.data.ret === _config.staleCode) signOut();
              showToastFn(res.data.message);
            }
          } });

      });
    }
  },
  // 获取坚持签到的天数
  getCheckInDays: function getCheckInDays(_ref47) {var dispatch = _ref47.dispatch,commit = _ref47.commit,state = _ref47.state;
    uni.request({
      method: 'GET',
      url: _config.apiUrl + '/sign/wx_sign_days.php',
      header: {
        fromClient: _config.deviceType },

      data: {
        openid: state.userInfo.openid || '' },

      success: function success(res) {
        if (res.data.ret === _config.ret) {
          commit(types.SET_DAYS, res.data.data.days);
        } else {
          if (res.data.ret === _config.staleCode) signOut();
          showToastFn(res.data.message);
        }
      } });

  },
  // 获取签到如期列表
  getCheckInDateList: function getCheckInDateList(_ref48) {var dispatch = _ref48.dispatch,commit = _ref48.commit,state = _ref48.state;
    uni.request({
      method: 'GET',
      url: _config.apiUrl + '/sign/wx_year_moths.php',
      header: {
        fromClient: _config.deviceType },

      data: {
        openid: state.userInfo.openid || '' },

      success: function success(res) {
        if (res.data.ret === _config.ret) {
          commit(types.SET_CHECK_IN_LIST, res.data.data);
        } else {
          if (res.data.ret === _config.staleCode) signOut();
          showToastFn(res.data.message);
        }
      } });

  },
  // 获取签到日期
  getCheckInDate: function getCheckInDate(_ref49, data) {var dispatch = _ref49.dispatch,commit = _ref49.commit,state = _ref49.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/sign/wx_calendar.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          month: data.month,
          year: data.year,
          mark: data.mark },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            var list = [];
            var lists = [];

            res.data.data.forEach(function (item, index) {
              list.push(item);
              if (index === 14 || index + 1 === res.data.data.length) {
                lists.push(list);
                list = [];
              }
            });

            commit(types.SET_CHECK_IN_DATE_LIST, lists);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取每日头条列表
  getNewsList: function getNewsList(_ref50, data) {var dispatch = _ref50.dispatch,commit = _ref50.commit,state = _ref50.state;
    commit(types.SET_LOADING_STATE, true);
    commit(types.SET_IS_DATA_STATE, false);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/home/getHeadline',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.newsList));

            res.data.data.forEach(function (item) {
              state.allCurrentMusicItem.id === item.id && state.allPlaying ? item['playing'] = true : item['playing'] = false;
              item['thumb'] = _config.upyunUrl + '/wxXcxImg/images/news-cover.png';
              item['listType'] = 'newsMusic';
              item['page'] = data.page;
              lists.push(item);
            });

            commit(types.SET_NEWS_LIST, lists);
            commit(types.SET_LOADING_STATE, false);
            commit(types.SET_IS_DATA_STATE, !res.data.data.length);
          } else {
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取文章详情
  getArticleDetail: function getArticleDetail(_ref51, data) {var dispatch = _ref51.dispatch,commit = _ref51.commit,state = _ref51.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/news/wx_readstory.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          nid: data.id },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            if (state.setTitleState) {
              uni.setNavigationBarTitle({
                title: res.data.data.title });

            }

            res.data.data['listType'] = 'articleType';
            res.data.data['inputtime'] = getLocalTime(res.data.data.inputtime * 1000);

            dispatch('setActivityActRecord', { oJson: res.data.data, type: 3 });
            resolve(res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取上进心列表
  getShareLatestRank: function getShareLatestRank(_ref52, data) {var dispatch = _ref52.dispatch,commit = _ref52.commit,state = _ref52.state;
    uni.request({
      method: 'GET',
      url: _config.apiUrl + '/share/wx_latest_rank.php',
      header: {
        fromClient: _config.deviceType },

      data: {
        openid: state.userInfo.openid || '',
        page: data.page },

      success: function success(res) {
        if (res.data.ret === _config.ret) {
          res.data.data.forEach(function (item) {
            item['inputtime'] = getLocalTime(item.inputtime * 1000);
          });
          commit(types.SET_SHARE_LATEST_RANK_LIST, res.data.data);
        } else {
          if (res.data.ret === _config.staleCode) signOut();
          showToastFn(res.data.message);
        }
      } });

  },
  // 获取心榜列表
  getShareRanking: function getShareRanking(_ref53, data) {var dispatch = _ref53.dispatch,commit = _ref53.commit,state = _ref53.state;
    uni.request({
      method: 'GET',
      url: _config.apiUrl + '/share/wx_share_ranking.php',
      header: {
        fromClient: _config.deviceType },

      data: {
        openid: state.userInfo.openid || '',
        page: data.page },

      success: function success(res) {
        if (res.data.ret === _config.ret) {
          commit(types.SET_SHARE_RANKING_OBJ, res.data.data);
        } else {
          if (res.data.ret === _config.staleCode) signOut();
          showToastFn(res.data.message);
        }
      } });

  },
  // 获取排行榜信息
  getCheckRankingData: function getCheckRankingData(_ref54, that) {var dispatch = _ref54.dispatch,commit = _ref54.commit,state = _ref54.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/sign/wx_sign_days_listorder.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            // 调整userList上有当前用户时，放在第一位
            res.data.data.lists.forEach(function (item) {
              if (item.user_lists) {
                item.user_lists.forEach(function (obj, i) {
                  if (obj.user_id === state.userInfo.user_id) {
                    item.user_lists.splice(i, 1);
                    item.user_lists.unshift(obj);
                  }
                });
              }
            });
            commit(types.SET_CHECK_RANKING_OBJ, res.data.data);
            resolve(res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取分享落地页我的能量
  getShareEnergyData: function getShareEnergyData(_ref55) {var dispatch = _ref55.dispatch,commit = _ref55.commit,state = _ref55.state;
    uni.request({
      method: 'GET',
      url: _config.apiUrl + '/sign/wx_cj.php',
      header: {
        fromClient: _config.deviceType },

      data: {
        user_id: state.shareid },

      success: function success(res) {
        if (res.data.ret === _config.ret) {
          commit(types.SET_SHARE_ENERGY_OBJ, res.data.data);
        } else {
          if (res.data.ret === _config.staleCode) signOut();
          showToastFn(res.data.message);
        }
      } });

  },
  // 获取分享落地info
  getShareInfo: function getShareInfo(_ref56, data) {var dispatch = _ref56.dispatch,commit = _ref56.commit,state = _ref56.state;
    var allItem = state.allCurrentMusicItem;
    uni.request({
      method: 'GET',
      url: _config.apiUrl + '/share/wx_get_share.php',
      header: {
        fromClient: _config.deviceType },

      data: {
        user_id: state.shareid,
        tid: data.tid },

      success: function success(res) {
        if (res.data.ret === _config.ret) {
          var lists = [];

          allItem.id === res.data.vid && state.allPlaying ? res.data['playing'] = true : res.data['playing'] = false;
          res.data.data['listType'] = 'shareMusic';

          lists.push(res.data.data);
          commit(types.SET_SHARE_INFO, lists);
          if (allItem.listType === 'shareMusic') commit(types.SET_ALL_MUSIC_LIST, lists);
        } else {
          if (res.data.ret === _config.staleCode) signOut();
          showToastFn(res.data.message);
        }
      } });

  },
  // 添加意见反馈
  addFeedback: function addFeedback(_ref57, data) {var dispatch = _ref57.dispatch,commit = _ref57.commit,state = _ref57.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/msg/save_msg.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          content: data.textareaVal,
          pic_url: data.picUrl,
          tel: data.telVal },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取反馈历史列表
  getFeedbackHistoryList: function getFeedbackHistoryList(_ref58, data) {var dispatch = _ref58.dispatch,commit = _ref58.commit,state = _ref58.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/msg/get_msg_list.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            var lists = JSON.parse(JSON.stringify(state.feedbackHistoryList));

            res.data.data.forEach(function (item) {
              item['ctime'] = getLocalTime(item.ctime * 1000);
              lists.push(item);
            });

            commit(types.SET_IS_DATA_STATE, !res.data.data.length);
            commit(types.SET_FEEDBACK_HISTORY_LIST, lists);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取反馈详情
  getFeedbackDetails: function getFeedbackDetails(_ref59, data) {var dispatch = _ref59.dispatch,commit = _ref59.commit,state = _ref59.state;
    uni.showLoading({ title: 'Loading' });
    uni.request({
      method: 'GET',
      url: _config.apiUrl + '/msg/get_msg_detial.php',
      header: {
        fromClient: _config.deviceType },

      data: {
        openid: state.userInfo.openid || '',
        id: data.id },

      success: function success(res) {
        if (res.data.ret === _config.ret) {
          var oJson = res.data.data;
          oJson['ctime'] = getLocalTime(oJson.ctime * 1000);
          commit(types.SET_FEEDBACK_DATAIL, oJson);
        } else {
          if (res.data.ret === _config.staleCode) signOut();
          showToastFn(res.data.message);
        }
        uni.hideLoading();
      } });

  },
  // 添加意见反馈到聊天列表
  addFeedbackReply: function addFeedbackReply(_ref60, data) {var dispatch = _ref60.dispatch,commit = _ref60.commit,state = _ref60.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/msg/save_msg_repy.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          content: data.inputVal,
          msgId: data.id },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 我的音频点赞列表
  getGiveThumbsMusicList: function getGiveThumbsMusicList(_ref61, data) {var dispatch = _ref61.dispatch,commit = _ref61.commit,state = _ref61.state;
    var allItem = state.allCurrentMusicItem;

    commit(types.SET_LOADING_STATE, true);
    commit(types.SET_IS_DATA_STATE, false);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/simple/thumbsUpList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page,
          type: 0 },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.giveThumbsMusicList));

            res.data.data.forEach(function (item) {
              allItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false;
              item['inputtime'] = getLocalTime(item.inputtime * 1000);
              item['listType'] = 'giveThumbsType';
              item['page'] = data.page;
              lists.push(item);
            });

            commit(types.SET_LOADING_STATE, false);
            commit(types.SET_GIVE_THUMBS_MUSIC_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.length);
            if (allItem.listType === 'giveThumbsType') commit(types.SET_ALL_MUSIC_LIST, lists);
            resolve();
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 添加内容定制
  addContentWord: function addContentWord(_ref62, data) {var dispatch = _ref62.dispatch,commit = _ref62.commit,state = _ref62.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/custom/wx_add_custom.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          keywords: data.wordVal },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取内容定制关键词列表
  getContentWordList: function getContentWordList(_ref63, data) {var dispatch = _ref63.dispatch,commit = _ref63.commit,state = _ref63.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/custom/wx_lists.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            var lists = JSON.parse(JSON.stringify(state.contentWordList));

            res.data.data.lists.forEach(function (item) {
              item['inputtime'] = getLocalTime(item.inputtime * 1000);
              lists.push(item);
            });

            commit(types.SET_CONTENT_WORD_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.lists.length);
            commit(types.SET_LOADING_STATE, false);
            resolve(res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取专题详情
  getSubjectInfo: function getSubjectInfo(_ref64, data) {var dispatch = _ref64.dispatch,commit = _ref64.commit,state = _ref64.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/getInfo',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          order_id: data.orderid || '',
          id: data.special_id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            if (state.setTitleState) {
              uni.setNavigationBarTitle({
                title: res.data.data.title });

            }
            dispatch('setActivityActRecord', { oJson: res.data.data, type: 2 });
            resolve(res.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取专题列表
  getSubjectList: function getSubjectList(_ref65, data) {var dispatch = _ref65.dispatch,commit = _ref65.commit,state = _ref65.state;
    var allItem = state.allCurrentMusicItem;

    commit(types.SET_LOADING_STATE, true);
    commit(types.SET_IS_DATA_STATE, false);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/getList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page,
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.subjectDetailList));

            res.data.data.data.forEach(function (item) {
              item['comment_total'] = item.comment_total > 10000 ? Math.round(item.comment_total / 10000 * 100) / 100 + '万' : item.comment_total;
              item['play_hits'] = item.play_hits >= 10000 ? Math.round(item.play_hits / 10000 * 100) / 100 + '万' : item.play_hits;
              allItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false;
              item['duration'] = timeToMinute(item.duration);
              item['listType'] = 'subjectType';
              item['special_id'] = data.id;
              item['page'] = data.page;
              lists.push(item);
            });

            commit(types.SET_SUBJECT_DETAIL_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
            if (allItem.listType === 'subjectType' && allItem.id === data.id) commit(types.SET_ALL_MUSIC_LIST, lists);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          commit(types.SET_LOADING_STATE, false);
          resolve();
        } });

    });
  },
  // 获取相似课程
  getSimilarityCourseList: function getSimilarityCourseList(_ref66, data) {var dispatch = _ref66.dispatch,commit = _ref66.commit,state = _ref66.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/getSimilarList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page,
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.similarityCourseList));

            res.data.data.data.forEach(function (item) {
              item['paly'] = item.paly >= 10000 ? Math.round(item.paly / 10000 * 100) / 100 + '万' : item.paly;
              lists.push(item);
            });

            commit(types.SET_SIMILARITY_COURSE_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          commit(types.SET_LOADING_STATE, false);
          resolve();
        } });

    });
  },
  // 获取评论list
  getCommentList: function getCommentList(_ref67, data) {var dispatch = _ref67.dispatch,commit = _ref67.commit,state = _ref67.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/comment/getCommentList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          c_id: data.c_id || '',
          type: data.type,
          page: data.page },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.commentList));

            res.data.data.data.forEach(function (item) {
              item['ctime'] = getLocalTime(item.ctime * 1000);
              item.replay_list.forEach(function (obj) {
                obj['ctime'] = getLocalTime(obj.ctime * 1000);
              });
              lists.push(item);
            });

            commit(types.SET_COMMENT_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve(res.data.data);
        } });

    });
  },
  // 创建评论
  creationComment: function creationComment(_ref68, data) {var dispatch = _ref68.dispatch,commit = _ref68.commit,state = _ref68.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/comment/create',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          content: data.content,
          replay_id: data.replay_id,
          tag_id: data.tag_id,
          c_id: data.c_id || '',
          type: data.type },

        success: function success(res) {
          if (res.data.code === _config.code) {
            res.data.data['ctime'] = getLocalTime(res.data.data.ctime * 1000);
            res.data.data['replay_list'] = [];
            data.replay_id ? state.commentList[data.index].replay_list.unshift(res.data.data) : state.commentList.unshift(res.data.data);
            showToastFn('发送成功');
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve(res.data);
        } });

    });
  },
  // 删除评论 - 回复
  commentDelete: function commentDelete(_ref69, data) {var dispatch = _ref69.dispatch,commit = _ref69.commit,state = _ref69.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/comment/delete',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            showToastFn('移除成功!');
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve(res.data);
        } });

    });
  },
  // 查看更多用户回复评论
  getMoreReplyComment: function getMoreReplyComment(_ref70, data) {var dispatch = _ref70.dispatch,commit = _ref70.commit,state = _ref70.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/comment/getReplayList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          pageSize: 50,
          id: data.id,
          page: 1 },

        success: function success(res) {
          if (res.data.code === _config.code) {
            res.data.data.data.forEach(function (item) {
              item['ctime'] = getLocalTime(item.ctime * 1000);
            });
            state.commentList[data.index].replay_list = res.data.data.data;
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve(res.data);
        } });

    });
  },
  // 参与邀请人活动
  exchangeJoinInvite: function exchangeJoinInvite(_ref71, data) {var dispatch = _ref71.dispatch,commit = _ref71.commit,state = _ref71.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: data.type === 'exchange' ? _config.newApiUrl + '/wx/special/exchangeAct' : _config.newApiUrl + '/wx/special/joinInvite',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.code === _config.code) {
          } else {
            if (res.code === _config.staleCode) signOut();
            showToastFn(res);
          }
        } });

    });
  },
  // 获取专题咨询支付信息
  getWXPaySubjectConsultInfo: function getWXPaySubjectConsultInfo(_ref72, data) {var dispatch = _ref72.dispatch,commit = _ref72.commit,state = _ref72.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: data.buy_type === 'consulting' ? _config.apiUrl + '/wxpay/consult_order.php' : _config.apiUrl + '/wxpay/app_special_order.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          pay_password: data.pay_password,
          is_balance: data.is_balance,
          id: data.id },

        success: function success(res) {
          console.log(res);
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取全部抢学费用户列表
  getAllGrabList: function getAllGrabList(_ref73) {var dispatch = _ref73.dispatch,commit = _ref73.commit,state = _ref73.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/allGrabList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          pageSize: 100,
          page: 1 },

        success: function success(res) {
          if (res.data.code === _config.code) {
            res.data.data.forEach(function (item) {
              item['ctime'] = getLocalTime(item.ctime * 1000);
            });
            commit(types.SET_ALL_GRAB_LIST, res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取邀请记录信息
  getSpecialOrdersInfo: function getSpecialOrdersInfo(_ref74, data) {var dispatch = _ref74.dispatch,commit = _ref74.commit,state = _ref74.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/getOrdersInfo',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取专题邀请记录列表
  getJoinSubjectList: function getJoinSubjectList(_ref75, data) {var dispatch = _ref75.dispatch,commit = _ref75.commit,state = _ref75.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/inviteList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          order_id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            res.data.data.forEach(function (item) {
              item['ctime'] = getLocalTime(item.ctime * 1000);
            });
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取疯狂抢学费列表
  getGrabTuitionList: function getGrabTuitionList(_ref76, data) {var dispatch = _ref76.dispatch,commit = _ref76.commit,state = _ref76.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/homeGrabList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.grabTuitionList));

            res.data.data.forEach(function (item) {
              lists.push(item);
            });

            commit(types.SET_GRAB_TUITION_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.length);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          commit(types.SET_LOADING_STATE, false);
          resolve();
        } });

    });
  },
  // 获取我的抢学费进行中列表
  getConductGrabTuitionList: function getConductGrabTuitionList(_ref77, data) {var dispatch = _ref77.dispatch,commit = _ref77.commit,state = _ref77.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    clearInterval(stopTime);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/myGrabingList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.conductGrabTuitionList));

            res.data.data.forEach(function (item) {
              item['date'] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
              lists.push(item);
            });

            stopTime = setInterval(function () {
              lists.forEach(function (item) {
                if (item.date) {
                  item['date'] = timeDown(timestampToTime(item.time_limit));
                } else {
                  clearInterval(stopTime);
                }
              });
              commit(types.SET_CONDUCT_GRAB_TUITION_LIST, lists);
            }, 1000);

            commit(types.SET_CONDUCT_GRAB_TUITION_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.length);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          commit(types.SET_LOADING_STATE, false);
          resolve();
        } });

    });
  },
  // 获取我的完成抢学费列表
  getAccomplishGrabTuitionList: function getAccomplishGrabTuitionList(_ref78, data) {var dispatch = _ref78.dispatch,commit = _ref78.commit,state = _ref78.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/myGrabDoneList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          pageSize: data.pageSize,
          page: data.page },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.accomplishGrabTuitionList));

            res.data.data.forEach(function (item) {
              lists.push(item);
            });

            commit(types.SET_ACCOMPLISH_GRAB_TUITION_LIST, lists);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 学费晒单
  getTuitionSDList: function getTuitionSDList(_ref79, data) {var dispatch = _ref79.dispatch,commit = _ref79.commit,state = _ref79.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/SdList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          order_id: data.order_id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            res.data.data['grab_time_limit'] = timestampToTime(res.data.data.grab_time_limit);
            res.data.data.list.forEach(function (item) {
              item['settle_time'] = getLocalTime(item.settle_time * 1000);
            });
            if (res.data.data.is_grab) {
              res.data.data.my_play_list.forEach(function (item) {
                item['ctime'] = getLocalTime(item.ctime * 1000);
                item['play_hits'] = item.play_hits >= 10000 ? Math.round(item.play_hits / 10000 * 100) / 100 + '万' : item.play_hits;
              });
              res.data.data.my_inv_list.forEach(function (item) {
                item['ctime'] = getLocalTime(item.ctime * 1000);
              });
            }
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 抢学费
  getTuition: function getTuition(_ref80, data) {var dispatch = _ref80.dispatch,commit = _ref80.commit,state = _ref80.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/grabMoney',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          share_id: state.shareid,
          order_id: data.order_id },

        success: function success(res) {
          if (res.data.code === _config.code || res.data.code === 360) {
            resolve(res.data.data);
          } else if (res.data.code === _config.staleCode) signOut();
          showToastFn(res.data.message);
        } });

    });
  },
  // 助力返学费
  getOrderGrabList: function getOrderGrabList(_ref81, data) {var dispatch = _ref81.dispatch,commit = _ref81.commit,state = _ref81.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/orderGrabList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          order_id: data.order_id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            res.data.data['back_time_limit'] = timestampToTime(res.data.data.back_time_limit);
            res.data.data.invite_list.forEach(function (item) {
              item['ctime'] = getLocalTime(item.ctime * 1000);
            });
            res.data.data.grab_list.forEach(function (item) {
              item['ctime'] = getLocalTime(item.ctime * 1000);
            });
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 用户它人用户信息
  getOtherUserInfo: function getOtherUserInfo(_ref82, data) {var dispatch = _ref82.dispatch,commit = _ref82.commit,state = _ref82.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/simple/getUserInfo',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          order_id: data.order_id,
          id: state.shareid },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取每日坚持状态
  daysMissionStatus: function daysMissionStatus(_ref83) {var dispatch = _ref83.dispatch,commit = _ref83.commit,state = _ref83.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/userinfo/task/wx_action_task.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取星期签到状态
  weekMissionStatus: function weekMissionStatus(_ref84, data) {var dispatch = _ref84.dispatch,commit = _ref84.commit,state = _ref84.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/sign/wx_weeks.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取兑换书和物品详情列表
  getConversionBookList: function getConversionBookList(_ref85, data) {var dispatch = _ref85.dispatch,commit = _ref85.commit,state = _ref85.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/get_exchange_list.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          can_exc: data.can_exc,
          lower: data.lower,
          upper: data.upper,
          type: data.type,
          page: data.page },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            var lists = JSON.parse(JSON.stringify(state.conversionBookList));

            res.data.data.forEach(function (item) {
              lists.push(item);
            });

            commit(types.SET_CONVERSION_BOOK_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.length);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取兑换书和物品详情info
  getConversionBookDetail: function getConversionBookDetail(_ref86, data) {var dispatch = _ref86.dispatch,commit = _ref86.commit,state = _ref86.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/get_exchange_detail.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            if (state.setTitleState) {
              uni.setNavigationBarTitle({
                title: res.data.data.title });

            }
            resolve(res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 瓶盖兑换书本
  exchangeBook: function exchangeBook(_ref87, data) {var dispatch = _ref87.dispatch,commit = _ref87.commit,state = _ref87.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/exchange_act.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          address: data.address,
          phone: data.phone,
          name: data.name,
          id: data.id },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取支付信息
  getWXPayInfo: function getWXPayInfo(_ref88, data) {var dispatch = _ref88.dispatch,commit = _ref88.commit,state = _ref88.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/wxpay/create_order.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          address: data.address,
          phone: data.phone,
          name: data.name,
          id: data.id },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 领取已抽中奖品 - 领取抢书中奖品
  getWinningGoods: function getWinningGoods(_ref89, data) {var dispatch = _ref89.dispatch,commit = _ref89.commit,state = _ref89.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: data.orderType === 'grab' ? _config.apiUrl + 'activity/give_updata_address.php' : _config.apiUrl + '/lottery/lottery_updata_address.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          address: data.address,
          phone: data.phone,
          name: data.name,
          id: data.id },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取抢书配置信息
  getRobBookInfo: function getRobBookInfo(_ref90) {var dispatch = _ref90.dispatch,commit = _ref90.commit,state = _ref90.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/give_conf.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            var num = 0;
            var data = res.data.data;
            var timeState = data.time_state;
            var itemLength = data.give_book_time_set.length;
            if (itemLength - 1 === timeState) {
              num = 0;
              itemLength -= 1;
            } else if (data.give_book_time_set.length === 3) {
              num = 12;
            } else {
              num = 10;
            }
            data['schedule'] = timeState ? getPercent(timeState, itemLength) + num : 0;
            resolve(data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取抢书列表
  getRobBookList: function getRobBookList(_ref91, data) {var dispatch = _ref91.dispatch,commit = _ref91.commit,state = _ref91.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/get_give_list.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            var lists = JSON.parse(JSON.stringify(state.robBookList));

            res.data.data.forEach(function (item) {
              lists.push(item);
            });

            commit(types.SET_ROB_BOOK_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.length);
            commit(types.SET_LOADING_STATE, false);
            resolve();
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取抢书详情
  getRobBookDetail: function getRobBookDetail(_ref92, data) {var dispatch = _ref92.dispatch,commit = _ref92.commit,state = _ref92.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/give_book_detail.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 抢-想要书操作
  robWantBook: function robWantBook(_ref93, data) {var dispatch = _ref93.dispatch,commit = _ref93.commit,state = _ref93.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + data.status ? '/activity/give_grab.php' : '/activity/give_want.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取中书记录
  getInTheBookList: function getInTheBookList(_ref94, data) {var dispatch = _ref94.dispatch,commit = _ref94.commit,state = _ref94.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/get_give.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page,
          page_size: data.pageSize },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            res.data.data.forEach(function (item) {
              item['grab_set_time'] = timestampToTime(item.grab_set_time);
            });
            commit(types.SET_IN_THE_BOOK_LIST, res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve(res.data);
        } });

    });
  },
  // 获取用户的openID和sessionKey
  getWxlogin: function getWxlogin(_ref95, data) {var dispatch = _ref95.dispatch,commit = _ref95.commit,state = _ref95.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/wx_session_key.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          code: data.code },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 解密手机号
  wxaes: function wxaes(_ref96, data) {var dispatch = _ref96.dispatch,commit = _ref96.commit,state = _ref96.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/wxaes.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          iv: data.iv,
          sessionKey: data.sessionKey,
          encryptedData: data.encryptedData },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取短信code
  getCode: function getCode(_ref97, data) {var dispatch = _ref97.dispatch,commit = _ref97.commit,state = _ref97.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/api/sms.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          mobile: data.telVal },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 绑定手机号码
  bindingMobile: function bindingMobile(_ref98, data) {var dispatch = _ref98.dispatch,commit = _ref98.commit,state = _ref98.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/userinfo/wx_bdmoible.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          mobile: data.telVal,
          code: data.codeVal,
          type: data.type },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 更新头像
  updateAvatar: function updateAvatar(_ref99, data) {var dispatch = _ref99.dispatch,commit = _ref99.commit,state = _ref99.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/update_avatarurl.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          avatarurl: data.url },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 是否绑定手机号码
  isBindingMobile: function isBindingMobile(_ref100) {var dispatch = _ref100.dispatch,commit = _ref100.commit,state = _ref100.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/userinfo/wx_is_bdmoible.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            commit(types.SET_BING_PHONE_INFO, res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取是否设置了支付密码
  isSetPayPassword: function isSetPayPassword(_ref101, data) {var dispatch = _ref101.dispatch,commit = _ref101.commit,state = _ref101.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/User/checkPayPassword',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 设置支付 - 修改密码
  onSetEditPayPassword: function onSetEditPayPassword(_ref102, data) {var dispatch = _ref102.dispatch,commit = _ref102.commit,state = _ref102.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: data.type === 'edit' ? _config.newApiUrl + '/wx/User/updatePayPassword' : _config.newApiUrl + '/wx/User/setPayPassword',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          password: data.password,
          new_password: data.confirm_password,
          old_password: data.old_password,
          confirm_password: data.new_password },

        success: function success(res) {
          if (res.data.code === _config.code) {
            data.type === 'edit' ? showToastFn('修改成功!') : showToastFn('设置密码成功!');
            resolve();
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取修改密码短信code
  getPsdCode: function getPsdCode(_ref103, data) {var dispatch = _ref103.dispatch,commit = _ref103.commit,state = _ref103.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/User/getVerifyPayPhoneCode',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          phone: data.telVal },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve();
          } else {
            if (res.data.code === _config.staleCode) signOut();
          }
          showToastFn(res.data.message);
        } });

    });
  },
  // 获取修改密码短信验证code
  getPsdCodeVerify: function getPsdCodeVerify(_ref104, data) {var dispatch = _ref104.dispatch,commit = _ref104.commit,state = _ref104.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/User/checkVerifyPayPhoneCode',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          phone: data.telVal,
          code: data.codeVal,
          new_password: data.newPasswordVal },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve();
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 一级岗位分类
  getLevelOneJobList: function getLevelOneJobList(_ref105) {var dispatch = _ref105.dispatch,commit = _ref105.commit,state = _ref105.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/job/wx_top_type.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            commit(types.SET_LEVEL_ONE_JOB_LIST, res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 二级岗位分类
  getLevelTwoJobList: function getLevelTwoJobList(_ref106, data) {var dispatch = _ref106.dispatch,commit = _ref106.commit,state = _ref106.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/job/wx_two_type.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          catid: data.catid },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 添加岗位
  addJobInfo: function addJobInfo(_ref107, data) {var dispatch = _ref107.dispatch,commit = _ref107.commit,state = _ref107.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/userinfo/wx_update_info.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          job: data.job },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 是否选择岗位
  getSelectedJobInfo: function getSelectedJobInfo(_ref108) {var dispatch = _ref108.dispatch,commit = _ref108.commit,state = _ref108.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/job/wx_is_hasjob.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            commit(types.SET_SELECTED_JOB_INFO, res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 添加-更新地址
  addUpdateAddress: function addUpdateAddress(_ref109, data) {var dispatch = _ref109.dispatch,commit = _ref109.commit,state = _ref109.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/userinfo/wx_update_address.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          province: data.regionLists[0],
          city: data.regionLists[1],
          area: data.regionLists[2],
          receiver: data.goodsVal,
          address: data.siteVal,
          mobile: data.telVal,
          id: data.id,
          page: 1 },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 设置默认地址
  selectAddress: function selectAddress(_ref110, data) {var dispatch = _ref110.dispatch,commit = _ref110.commit,state = _ref110.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/set_address_default.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取默认地址
  getDefaultAddress: function getDefaultAddress(_ref111) {var dispatch = _ref111.dispatch,commit = _ref111.commit,state = _ref111.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/get_address_default.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            commit(types.SET_AFFIRM_SITE_INFO, res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 删除地址
  deletedAddressInfo: function deletedAddressInfo(_ref112, data) {var dispatch = _ref112.dispatch,commit = _ref112.commit,state = _ref112.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/userinfo/wx_del_address.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取地址列表
  getAddressList: function getAddressList(_ref113, data) {var dispatch = _ref113.dispatch,commit = _ref113.commit,state = _ref113.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/userinfo/wx_address.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid,
          page: data.page },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            var lists = JSON.parse(JSON.stringify(state.addressList));

            res.data.data.lists.forEach(function (item) {
              lists.push(item);
            });

            commit(types.SET_ADDRESS_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.lists.length);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取订单列表
  getOrderList: function getOrderList(_ref114, data) {var dispatch = _ref114.dispatch,commit = _ref114.commit,state = _ref114.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/get_orders_list.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page,
          type: data.type,
          page_size: 10 },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            var lists = JSON.parse(JSON.stringify(state.orderList));
            res.data.data.forEach(function (item) {
              lists.push(item);
            });
            commit(types.SET_ORDER_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.length);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取订单详情
  getOrderDetail: function getOrderDetail(_ref115, data) {var dispatch = _ref115.dispatch,commit = _ref115.commit,state = _ref115.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/get_orders_detial.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            res.data.data['ctime'] = getLocalTime(res.data.data.ctime * 1000);
            res.data.data['fh_time'] = res.data.data.fh_time ? getLocalTime(res.data.data.fh_time * 1000) : '待发货';
            resolve(res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取瓶盖的收入和支出记录
  getBottleRecordList: function getBottleRecordList(_ref116, data) {var dispatch = _ref116.dispatch,commit = _ref116.commit,state = _ref116.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/get_account_history.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          type: data.type,
          page: data.page,
          page_size: 10 },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            var lists = JSON.parse(JSON.stringify(state.bottleRecordList));
            res.data.data.forEach(function (item) {
              lists.push(item);
            });
            commit(types.SET_BOTTLE_RECORD_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.length);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 每日任务完成状况列表
  getTaskCaseList: function getTaskCaseList(_ref117) {var dispatch = _ref117.dispatch,commit = _ref117.commit,state = _ref117.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/userinfo/wx_day_tsak.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            var lists = JSON.parse(JSON.stringify(state.taskCaseList));
            res.data.data.lists.forEach(function (item) {
              lists.push(item);
            });
            commit(types.SET_TASK_CASE_LIST, lists);
            resolve(res.data.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取连续新增瓶盖
  getBottleNum: function getBottleNum(_ref118) {var dispatch = _ref118.dispatch,commit = _ref118.commit,state = _ref118.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/get_account_add.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 成长记录
  getGrowthRecord: function getGrowthRecord(_ref119, data) {var dispatch = _ref119.dispatch,commit = _ref119.commit,state = _ref119.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/get_grow_list.php',
        header: {
          fromClient: _config.deviceType },

        data: {
          page: data.page,
          page_size: 10 },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            var lists = JSON.parse(JSON.stringify(state.growhtRecordList));
            res.data.data.forEach(function (item) {
              var items = getLocalTime(item.set_time * 1000).split('-');
              item['year'] = items[0];
              item['month'] = items[1];
              item['day'] = items[2];
              if (strlen(item.content) >= 82) {
                item['isLine'] = true;
                item['lineState'] = true;
              } else {
                item['isLine'] = false;
                item['lineState'] = false;
              }
              lists.push(item);
            });
            commit(types.SET_GROWHT_RECORD_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.length);
            commit(types.SET_LOADING_STATE, false);
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取推荐音频
  getRecommendMusic: function getRecommendMusic(_ref120) {var dispatch = _ref120.dispatch,commit = _ref120.commit,state = _ref120.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'GET',
        url: _config.apiUrl + '/activity/get_recommend_list.php',
        header: {
          fromClient: _config.deviceType },

        success: function success(res) {
          if (res.data.ret === _config.ret) {
            resolve(res.data);
          } else {
            if (res.data.ret === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取收入支出明细
  getConsumeList: function getConsumeList(_ref121, data) {var dispatch = _ref121.dispatch,commit = _ref121.commit,state = _ref121.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/User/getUserConsume',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid,
          type: data.type,
          page: data.page },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.consumeList));

            res.data.data.data.forEach(function (item) {
              item['ctime'] = timestampToTime(item.ctime);
              item['pay_time'] = timestampToTime(item.pay_time);
              item['wx_price'] = (item.order_price - item.use_balance).toFixed(2);
              lists.push(item);
            });

            commit(types.SET_CONSUME_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取提现记录
  getExtractCashList: function getExtractCashList(_ref122, data) {var dispatch = _ref122.dispatch,commit = _ref122.commit,state = _ref122.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/user_withdrawal/getUserWithdrawalList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid,
          page: data.page },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.extractCashList));

            res.data.data.data.forEach(function (item) {
              item['ctime'] = timestampToTime(item.ctime);
              lists.push(item);
            });

            commit(types.SET_EXTRACT_CASH_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取讲师主页基本信息
  getLectureInfo: function getLectureInfo(_ref123, data) {var dispatch = _ref123.dispatch,commit = _ref123.commit,state = _ref123.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/Activity_Author/authorIndex',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          uid: data.uid,
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取讲师专题
  getLectureSubjectList: function getLectureSubjectList(_ref124, data) {var dispatch = _ref124.dispatch,commit = _ref124.commit,state = _ref124.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/Activity_Author/authorSpecial',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page,
          uid: data.uid,
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.lectureSubjectList));

            res.data.data.data.forEach(function (item) {
              item['play'] = item.play >= 10000 ? Math.round(item.play / 10000 * 100) / 100 + '万' : item.play;
              lists.push(item);
            });

            commit(types.SET_LECTURE_SUBJECT_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve(res.data);
        } });

    });
  },
  // 获取讲师音频
  getLectureMusicList: function getLectureMusicList(_ref125, data) {var dispatch = _ref125.dispatch,commit = _ref125.commit,state = _ref125.state;
    var allItem = state.allCurrentMusicItem;

    commit(types.SET_LOADING_STATE, true);
    commit(types.SET_IS_DATA_STATE, false);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/Activity_Author/authorVoice',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.authorId,
          page: data.page,
          uid: data.uid },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.lectureMusicList));

            res.data.data.forEach(function (item) {
              allItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false;
              item['listType'] = 'lectureType';
              item['authorId'] = data.authorId;
              item['page'] = data.page;
              lists.push(item);
            });

            commit(types.SET_LOADING_STATE, false);
            commit(types.SET_LECTURE_MUSIC_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.length);
            if (allItem.listType === 'lectureType' && allItem.authorId === data.authorId) commit(types.SET_ALL_MUSIC_LIST, lists);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取我的关注列表
  getMyAttentionList: function getMyAttentionList(_ref126, data) {var dispatch = _ref126.dispatch,commit = _ref126.commit,state = _ref126.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/Attention/myAttention',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid,
          page: data.page },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.myAttentionList));

            res.data.data.data.forEach(function (item) {
              lists.push(item);
            });

            commit(types.SET_MY_ATTENTION_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取我的订阅列表
  getMySubscriptionList: function getMySubscriptionList(_ref127, data) {var dispatch = _ref127.dispatch,commit = _ref127.commit,state = _ref127.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/Special_Sub/mySub',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid,
          page: data.page },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.mySubscriptionList));

            res.data.data.data.forEach(function (item) {
              item['ctime'] = getLocalTime(item.ctime * 1000);
              lists.push(item);
            });

            commit(types.SET_MY_SUBSCRIPTION_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取我的课程列表
  getMyCourseList: function getMyCourseList(_ref128, data) {var dispatch = _ref128.dispatch,commit = _ref128.commit,state = _ref128.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special_order/getMySpecialList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid,
          keywords: data.keywords,
          page: data.page },

        success: function success(res) {
          if (res.data.code === _config.code) {
            var lists = JSON.parse(JSON.stringify(state.myCourseList));

            res.data.data.data.forEach(function (item) {
              item['learn_progress'] = parseInt(item.learn_progress);
              item['exchange_price'] = parseInt(item.exchange_price);
              lists.push(item);
            });

            commit(types.SET_MY_COURSE_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取课程详情
  getCourseInfo: function getCourseInfo(_ref129, data) {var dispatch = _ref129.dispatch,commit = _ref129.commit,state = _ref129.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special_order/getMySpecialDetail',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid,
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            res.data.data['pay_time'] = timestampToTime(res.data.data.pay_time);
            res.data.data['ctime'] = timestampToTime(res.data.data.ctime);
            res.data.data['exchange_price'] = parseInt(res.data.data.exchange_price);
            res.data.data['wx_price'] = (res.data.data.price - res.data.data.use_balance).toFixed(2);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve(res.data.data);
        } });

    });
  },
  // 我的课程-放弃邀请任务
  concernCourseTask: function concernCourseTask(_ref130, data) {var dispatch = _ref130.dispatch,commit = _ref130.commit,state = _ref130.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special_order/giveUpMyTask',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve();
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取规则信息
  getRuleInfo: function getRuleInfo(_ref131) {var dispatch = _ref131.dispatch,commit = _ref131.commit,state = _ref131.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/simple/getRule',
        header: {
          fromClient: _config.deviceType },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取抢学费分享标题title
  getShareText: function getShareText(_ref132) {var dispatch = _ref132.dispatch,commit = _ref132.commit,state = _ref132.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/simple/getShareText',
        header: {
          fromClient: _config.deviceType },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 显示免费领取课程弹窗
  getFreeSubject: function getFreeSubject(_ref133) {var dispatch = _ref133.dispatch,commit = _ref133.commit,state = _ref133.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/job_collection_free/getOne',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          status: 0 },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 取消免费领取课程
  cancelFreeSubject: function cancelFreeSubject(_ref134, data) {var dispatch = _ref134.dispatch,commit = _ref134.commit,state = _ref134.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/job_collection_free/delete',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取首页分类精品课列表
  getClassifySubjectGoodsList: function getClassifySubjectGoodsList(_ref135, data) {var dispatch = _ref135.dispatch,commit = _ref135.commit,state = _ref135.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/job_collection/recommend',
        header: {
          fromClient: _config.deviceType },

        data: {
          catid: data.catid,
          all: data.type },

        success: function success(res) {
          if (res.data.code !== _config.code) showToastFn(res.data.message);
          resolve(res.data.data);
        } });

    });
  },
  // 获取精品课分类标签
  getSubjectGoodsLabel: function getSubjectGoodsLabel(_ref136) {var dispatch = _ref136.dispatch,commit = _ref136.commit,state = _ref136.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/job_category/getList',
        header: {
          fromClient: _config.deviceType },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取精品课合集列表
  getSubjectGoodsList: function getSubjectGoodsList(_ref137, data) {var dispatch = _ref137.dispatch,commit = _ref137.commit,state = _ref137.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/job_collection/getList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          collection_id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            res.data.data.forEach(function (item) {
              item['secondLevelIndex'] = 0;
            });
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 免费领取课程
  freeOfChargeGetCourse: function freeOfChargeGetCourse(_ref138, data) {var dispatch = _ref138.dispatch,commit = _ref138.commit,state = _ref138.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/job_collection_free/create',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          job_collection_id: data.job_collection_id,
          special_id: data.special_id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve();
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取私信未读总数
  getNoReadCount: function getNoReadCount(_ref139) {var dispatch = _ref139.dispatch,commit = _ref139.commit,state = _ref139.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/message/noReadCount',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取发送人私信列表
  getFromUserLis: function getFromUserLis(_ref140, data) {var dispatch = _ref140.dispatch,commit = _ref140.commit,state = _ref140.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/message/getFromUserList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page },

        success: function success(res) {
          var lists = JSON.parse(JSON.stringify(state.messageFromUserList));

          if (res.data.code === _config.code) {
            res.data.data.data.forEach(function (item) {
              item['ctime'] = getLocalTime(item.ctime * 1000);
              item['operateState'] = false;
              if (state.userInfo.user_id === item.from_uid) item['status'] = 1;
              lists.push(item);
            });

            commit(types.SET_MESSAGE_FROM_USER_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
            commit(types.SET_LOADING_STATE, false);
            resolve();
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 标记私信全部成已读
  setReadMessage: function setReadMessage(_ref141) {var dispatch = _ref141.dispatch,commit = _ref141.commit,state = _ref141.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/message/setRead',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve();
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 清除聊天记录 - 移除会话
  removeFromUser: function removeFromUser(_ref142, data) {var dispatch = _ref142.dispatch,commit = _ref142.commit,state = _ref142.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: data.state ? _config.newApiUrl + '/wx/message/deleteBatchRecord' : _config.newApiUrl + '/wx/message/removeFromUser',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          from_uid: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve();
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取私信列表
  getMessageReadList: function getMessageReadList(_ref143, data) {var dispatch = _ref143.dispatch,commit = _ref143.commit,state = _ref143.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/message/readList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          from_uid: data.id,
          page: data.page },

        success: function success(res) {
          var lists = JSON.parse(JSON.stringify(state.messageReadList));

          if (res.data.code === _config.code) {
            res.data.data.data.forEach(function (item) {
              item['ctime'] = timestampToTime(item.ctime);
              item['operateState'] = false;
              lists.unshift(item);
            });

            commit(types.SET_MESSAGE_READ_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
            commit(types.SET_LOADING_STATE, false);
            resolve();
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 批量标记已读私信
  markerMessageRead: function markerMessageRead(_ref144, data) {var dispatch = _ref144.dispatch,commit = _ref144.commit,state = _ref144.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/message/batchRead',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          from_uid: data.id },

        success: function success(res) {
          resolve(res.data);
        } });

    });
  },
  // 删除私信
  deleteOneRecord: function deleteOneRecord(_ref145, data) {var dispatch = _ref145.dispatch,commit = _ref145.commit,state = _ref145.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/message/deleteOneRecord',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          type: data.item.type,
          id: data.item.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve();
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 发送私信
  onSendMessage: function onSendMessage(_ref146, data) {var dispatch = _ref146.dispatch,commit = _ref146.commit,state = _ref146.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/message/send',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          content: data.content,
          to_uid: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            res.data.data.forEach(function (item) {
              item['ctime'] = timestampToTime(item.ctime);
              item['operateState'] = false;
            });
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve(res.data);
        } });

    });
  },
  // 获取讲师橱窗商品列表
  getAuthorWindowGoodsList: function getAuthorWindowGoodsList(_ref147, data) {var dispatch = _ref147.dispatch,commit = _ref147.commit,state = _ref147.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/window/authorWindow',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          au_id: data.id,
          page: data.page,
          sort: data.sort },

        success: function success(res) {
          var lists = JSON.parse(JSON.stringify(state.authorWindowGoodsList));

          if (res.data.code === _config.code) {
            res.data.data.data.forEach(function (item) {
              lists.push(item);
            });

            commit(types.SET_AUTHOR_WINDOW_GOODS_LIST, lists);
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve(res.data.data);
        } });

    });
  },
  // 获取讲师搜索商品列表
  getAuthorSearchGoodsList: function getAuthorSearchGoodsList(_ref148, data) {var dispatch = _ref148.dispatch,commit = _ref148.commit,state = _ref148.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/window/searchWindow',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          keyword: data.keyword,
          page: data.page },

        success: function success(res) {
          var lists = JSON.parse(JSON.stringify(state.authorSearchGoodsList));

          if (res.data.code === _config.code) {
            if (res.data.data) {
              res.data.data.data.forEach(function (item) {
                lists.push(item);
              });
            }

            commit(types.SET_AUTHOR_SEARCH_GOODS_LIST, lists);
            commit(types.SET_IS_DATA_STATE, res.data.data ? !res.data.data.data.length : true);
            commit(types.SET_LOADING_STATE, false);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve();
        } });

    });
  },
  // 获取讲师橱窗商品详情
  getAuthorWindowGoodsDetails: function getAuthorWindowGoodsDetails(_ref149, data) {var dispatch = _ref149.dispatch,commit = _ref149.commit,state = _ref149.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/window/detail',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取咨询信息
  getConsultInfo: function getConsultInfo(_ref150, data) {var dispatch = _ref150.dispatch,commit = _ref150.commit,state = _ref150.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/consult/getInfo',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          au_id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            dispatch('setActivityActRecord', { oJson: res.data.data, type: 4 });
            if (res.data.data.order_info) res.data.data.order_info['pay_time'] = timestampToTime(res.data.data.order_info.pay_time);
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取首页视频列表
  getIndexVideoList: function getIndexVideoList(_ref151, data) {var dispatch = _ref151.dispatch,commit = _ref151.commit,state = _ref151.state;
    commit(types.SET_IS_DATA_STATE, false);
    commit(types.SET_LOADING_STATE, true);

    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/home/getVideo',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          page: data.page },

        success: function success(res) {
          var lists = JSON.parse(JSON.stringify(state.indexVideoList));

          if (res.data.code === _config.code) {
            res.data.data.forEach(function (item) {
              item['playState'] = false;
              item['duration'] = timeToMinute(item.duration);
              lists.push(item);
            });
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }

          commit(types.SET_INDEX_VIDEO_LIST, lists);
          commit(types.SET_IS_DATA_STATE, !res.data.data.length);
          commit(types.SET_LOADING_STATE, false);
          resolve();
        } });

    });
  },
  // 获取首页视频详情
  getVideoDetails: function getVideoDetails(_ref152, data) {var dispatch = _ref152.dispatch,commit = _ref152.commit,state = _ref152.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/video/getInfo',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            res.data.data['id'] = data.id;
            res.data.data['mark'] = false;
            res.data.data['duration'] = timeToMinute(res.data.data.duration);

            if (state.setTitleState) {
              uni.setNavigationBarTitle({
                title: res.data.data.title });

            }
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取专题内容视频列表
  getSpecialVideoList: function getSpecialVideoList(_ref153, data) {var dispatch = _ref153.dispatch,commit = _ref153.commit,state = _ref153.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/getList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            res.data.data.data.forEach(function (item) {
              item['duration'] = timeToMinute(item.duration);
            });
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取专题为你推荐列表
  getSimilarList: function getSimilarList(_ref154, data) {var dispatch = _ref154.dispatch,commit = _ref154.commit,state = _ref154.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/special/getSimilarList',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          id: data.id },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取讲师中心和专题详情页广告
  getAdvertisingInfo: function getAdvertisingInfo(_ref155, data) {var dispatch = _ref155.dispatch,commit = _ref155.commit,state = _ref155.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/advertising/systemUserAd',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          au_id: data.au_id,
          special_id: data.id || '',
          location: data.location },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 保存个人资料的介绍/昵称等
  isMyDataInfo: function isMyDataInfo(_ref156, data) {var dispatch = _ref156.dispatch,commit = _ref156.commit,state = _ref156.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/user/setByParam',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid,
          field: data.field,
          value: data.field === 'address' || data.field === 'auto_play' ? JSON.stringify(data.infoVal) : data.infoVal },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 一级职业分类
  getOneTypeOccupationList: function getOneTypeOccupationList(_ref157) {var dispatch = _ref157.dispatch,commit = _ref157.commit,state = _ref157.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/occupation/getTopType',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '' },

        success: function success(res) {
          if (res.data.code === _config.code) {
            commit(types.SET_ONE_TYPE_OCCUPATION_LIST, res.data.data);
            resolve();
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 二级职业分类
  getTwoTypeOccupationList: function getTwoTypeOccupationList(_ref158, data) {var dispatch = _ref158.dispatch,commit = _ref158.commit,state = _ref158.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/occupation/getTwoType',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid || '',
          catid: data.catid },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 添加工作经历
  isWorkInfo: function isWorkInfo(_ref159, data) {var dispatch = _ref159.dispatch,commit = _ref159.commit,state = _ref159.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/experience/add',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid,
          company: data.companyVal,
          office: data.officeVal,
          word_des: data.postVal,
          start_time: data.dateStart,
          end_time: data.dateEnd },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取工作经历
  getWorkInfo: function getWorkInfo(_ref160) {var dispatch = _ref160.dispatch,commit = _ref160.commit,state = _ref160.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/experience/index',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid },

        success: function success(res) {
          if (res.data.code === _config.code) {
            if (res.data.data) {
              res.data.data['start_time'] = getLocalTime(res.data.data.start_time * 1000);
              res.data.data['end_time'] = getLocalTime(res.data.data.end_time * 1000);
              commit(types.SET_WORK_INFO, res.data.data);
            }
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve(res.data.data);
        } });

    });
  },
  // 添加教育经历
  isEducationInfo: function isEducationInfo(_ref161, data) {var dispatch = _ref161.dispatch,commit = _ref161.commit,state = _ref161.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/education/add',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid,
          school: data.schoolVal,
          specialty: data.specialtyVal,
          culture: data.cultureVal,
          start_time: data.dateStart,
          end_time: data.dateEnd },

        success: function success(res) {
          if (res.data.code === _config.code) {
            resolve(res.data.data);
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
        } });

    });
  },
  // 获取教育经历
  getEducationInfo: function getEducationInfo(_ref162) {var dispatch = _ref162.dispatch,commit = _ref162.commit,state = _ref162.state;
    return new Promise(function (resolve) {
      uni.request({
        method: 'POST',
        url: _config.newApiUrl + '/wx/education/index',
        header: {
          fromClient: _config.deviceType },

        data: {
          openid: state.userInfo.openid },

        success: function success(res) {
          if (res.data.code === _config.code) {
            if (res.data.data) {
              res.data.data['start_time'] = getLocalTime(res.data.data.start_time * 1000);
              res.data.data['end_time'] = getLocalTime(res.data.data.end_time * 1000);
              commit(types.SET_EDUCATION_INFO, res.data.data);
            }
          } else {
            if (res.data.code === _config.staleCode) signOut();
            showToastFn(res.data.message);
          }
          resolve(res.data.data);
        } });

    });
  } };

// 时间戳转常规时间
exports.default = _default;function getLocalTime(time) {
  var date = new Date(parseInt(time));
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return Y + M + D;
}
// 时间戳转常规时间到(时分秒)
function timestampToTime(time) {
  var date = new Date(time * 1000);
  var Y = date.getFullYear() + '-';
  var M = padding(date.getMonth() + 1, 2) + '-';
  var D = padding(date.getDate(), 2) + ' ';
  var h = padding(date.getHours(), 2) + ':';
  var m = padding(date.getMinutes(), 2) + ':';
  var s = padding(date.getSeconds(), 2);
  return Y + M + D + h + m + s;
}
// 填充截取法
function padding(num, length) {
  // 这里用slice和substr均可
  return (Array(length).join('0') + num).slice(-length);
}
// 计算字符串的长度
function strlen(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007e || c >= 0xff60 && c <= 0xff9f) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
}
// 百分比计算
function getPercent(num, total) {
  if (num && total) {
    num = parseFloat(num);
    total = parseFloat(total);
    return Math.round(num / total * 10000) / 100.00;
  }
}
// 秒转分钟
function timeToMinute(times) {
  var t;
  if (times > -1) {
    var min = Math.floor(times / 60) % 60;
    var sec = times % 60;
    if (min < 10) {
      t = '0';
    }
    t += min + ':';
    if (sec < 10) {
      t += '0';
    }
    t += sec.toFixed(2);
  }
  t = t.substring(0, t.length - 3);
  return t;
}
// 时间倒计时
function timeDown(endDateStr) {
  endDateStr = endDateStr.replace(/-/g, '/');
  // 结束时间
  var endDate = new Date(endDateStr);
  // 当前时间
  var nowDate = new Date();
  // 相差的总秒数
  var totalSeconds = parseInt((endDate - nowDate) / 1000);
  // 天数
  var days = Math.floor(totalSeconds / (60 * 60 * 24));
  // 取模（余数）
  var modulo = totalSeconds % (60 * 60 * 24);
  // 小时数
  var hours = Math.floor(modulo / (60 * 60));
  modulo = modulo % (60 * 60);
  // 分钟
  var minutes = Math.floor(modulo / 60);
  // 秒
  var seconds = modulo % 60;

  return days >= 0 ? { days: days, hours: hours, minutes: minutes, seconds: seconds } : { days: 0, hours: 0, minutes: 0, seconds: 0 };
}
// 生成uuid
/* eslint-disable */
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
/* eslint-disable */

function signOut() {
  _store.default.commit('SET_USERINFO', '');
  uni.removeStorageSync('openid');
  uni.navigateTo({
    url: "/pages/login/index" });

}

function showToastFn(title) {
  uni.showToast({
    title: title,
    icon: 'none',
    duration: 2000 });

}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 21:
/*!***********************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/api/config.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.ret = exports.code = exports.staleCode = exports.versions = exports.deviceType = exports.ghId = exports.appId = exports.upyunUrl = exports.newApiUrl = exports.apiUrl = void 0; // export const apiUrl = 'https://miniprogram.czlks.com' // 旧正式服
var apiUrl = 'http://newminiprogram.czlks.com'; // 旧测试服
// export const newApiUrl = 'https://api.czlks.com' // 新正试服
exports.apiUrl = apiUrl;var newApiUrl = 'http://apitest.czlks.com'; // 新测试服
exports.newApiUrl = newApiUrl;
var upyunUrl = 'https://flow.czlks.com';exports.upyunUrl = upyunUrl;
var appId = 'wxa4e6507b398793d4';exports.appId = appId;
var ghId = 'gh_2348f52be27c';exports.ghId = ghId;
var deviceType = 'app'; // mini app
exports.deviceType = deviceType;var versions = '2.2.4';exports.versions = versions;
var staleCode = 201;exports.staleCode = staleCode;
var code = 200;exports.code = code;
var ret = 1;exports.ret = ret;

/***/ }),

/***/ 22:
/*!*********************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/WXBizDataCrypt.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-disable */
var Crypto = __webpack_require__(/*! ./cryptojs/cryptojs.js */ 23).Crypto;
var app = getApp({ allowDefault: true });

function RdWXBizDataCrypt(appId, sessionKey) {
  this.appId = appId;
  this.sessionKey = sessionKey;
}

RdWXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode ：使用 CryptoJS 中 Crypto.util.base64ToBytes()进行 base64解码
  var encryptedData = Crypto.util.base64ToBytes(encryptedData);
  var key = Crypto.util.base64ToBytes(this.sessionKey);
  var iv = Crypto.util.base64ToBytes(iv);

  // 对称解密使用的算法为 AES-128-CBC，数据采用PKCS#7填充
  var mode = new Crypto.mode.CBC(Crypto.pad.pkcs7);

  try {
    // 解密
    var bytes = Crypto.AES.decrypt(encryptedData, key, {
      asBpytes: true,
      iv: iv,
      mode: mode });


    var decryptResult = JSON.parse(bytes);

  } catch (err) {
    console.log(err);
  }

  if (decryptResult.watermark.appid !== this.appId) {
    console.log(err);
  }

  return decryptResult;
};

module.exports = RdWXBizDataCrypt;
/* eslint-enable */

/***/ }),

/***/ 23:
/*!************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/cryptojs.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-disable */
exports.Crypto = __webpack_require__(/*! ./lib/Crypto */ 24).Crypto;

['CryptoMath',
'BlockModes',
'DES',
'AES',
'HMAC',
'MARC4',
'MD5',
'PBKDF2',
'PBKDF2Async',
'Rabbit',
'SHA1',
'SHA256'].
forEach(function (path) {
  __webpack_require__(25)("./" + path);
});
/* eslint-disable */

/***/ }),

/***/ 24:
/*!**************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib/Crypto.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-disable */
if (typeof Crypto == "undefined" || !Crypto.util)
{
  (function () {

    var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    // Global Crypto object
    // with browser window or with node module
    var Crypto = typeof window === 'undefined' ? exports.Crypto = {} : window.Crypto = {};

    // Crypto utilities
    var util = Crypto.util = {

      // Bit-wise rotate left
      rotl: function rotl(n, b) {
        return n << b | n >>> 32 - b;
      },

      // Bit-wise rotate right
      rotr: function rotr(n, b) {
        return n << 32 - b | n >>> b;
      },

      // Swap big-endian to little-endian and vice versa
      endian: function endian(n) {

        // If number given, swap endian
        if (n.constructor == Number) {
          return util.rotl(n, 8) & 0x00FF00FF |
          util.rotl(n, 24) & 0xFF00FF00;
        }

        // Else, assume array and swap all items
        for (var i = 0; i < n.length; i++) {
          n[i] = util.endian(n[i]);}
        return n;

      },

      // Generate an array of any length of random bytes
      randomBytes: function randomBytes(n) {
        for (var bytes = []; n > 0; n--) {
          bytes.push(Math.floor(Math.random() * 256));}
        return bytes;
      },

      // Convert a byte array to big-endian 32-bit words
      bytesToWords: function bytesToWords(bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8) {
          words[b >>> 5] |= (bytes[i] & 0xFF) << 24 - b % 32;}
        return words;
      },

      // Convert big-endian 32-bit words to a byte array
      wordsToBytes: function wordsToBytes(words) {
        for (var bytes = [], b = 0; b < words.length * 32; b += 8) {
          bytes.push(words[b >>> 5] >>> 24 - b % 32 & 0xFF);}
        return bytes;
      },

      // Convert a byte array to a hex string
      bytesToHex: function bytesToHex(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
          hex.push((bytes[i] >>> 4).toString(16));
          hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join("");
      },

      // Convert a hex string to a byte array
      hexToBytes: function hexToBytes(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2) {
          bytes.push(parseInt(hex.substr(c, 2), 16));}
        return bytes;
      },

      // Convert a byte array to a base-64 string
      bytesToBase64: function bytesToBase64(bytes) {

        // Use browser-native function if it exists
        if (typeof btoa == "function") return btoa(Binary.bytesToString(bytes));

        for (var base64 = [], i = 0; i < bytes.length; i += 3) {
          var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
          for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 0x3F));else
            base64.push("=");
          }
        }

        return base64.join("");

      },

      // Convert a base-64 string to a byte array
      base64ToBytes: function base64ToBytes(base64) {

        // Use browser-native function if it exists
        if (typeof atob == "function") return Binary.stringToBytes(atob(base64));

        // Remove non-base-64 characters
        base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

        for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
          if (imod4 == 0) continue;
          bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 |
          base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
        }

        return bytes;

      } };



    // Crypto character encodings
    var charenc = Crypto.charenc = {};

    // UTF-8 encoding
    var UTF8 = charenc.UTF8 = {

      // Convert a string to a byte array
      stringToBytes: function stringToBytes(str) {
        return Binary.stringToBytes(unescape(encodeURIComponent(str)));
      },

      // Convert a byte array to a string
      bytesToString: function bytesToString(bytes) {
        return decodeURIComponent(escape(Binary.bytesToString(bytes)));
      } };



    // Binary encoding
    var Binary = charenc.Binary = {

      // Convert a string to a byte array
      stringToBytes: function stringToBytes(str) {
        for (var bytes = [], i = 0; i < str.length; i++) {
          bytes.push(str.charCodeAt(i) & 0xFF);}
        return bytes;
      },

      // Convert a byte array to a string
      bytesToString: function bytesToString(bytes) {
        for (var str = [], i = 0; i < bytes.length; i++) {
          str.push(String.fromCharCode(bytes[i]));}
        return str.join("");
      } };



  })();
}
/* eslint-disable */

/***/ }),

/***/ 25:
/*!******************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib sync ^\.\/.*$ ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./AES": 26,
	"./AES.js": 26,
	"./BlockModes": 27,
	"./BlockModes.js": 27,
	"./Crypto": 24,
	"./Crypto.js": 24,
	"./CryptoMath": 28,
	"./CryptoMath.js": 28,
	"./DES": 29,
	"./DES.js": 29,
	"./HMAC": 30,
	"./HMAC.js": 30,
	"./MARC4": 31,
	"./MARC4.js": 31,
	"./MD5": 32,
	"./MD5.js": 32,
	"./PBKDF2": 33,
	"./PBKDF2.js": 33,
	"./PBKDF2Async": 34,
	"./PBKDF2Async.js": 34,
	"./Rabbit": 37,
	"./Rabbit.js": 37,
	"./SHA1": 38,
	"./SHA1.js": 38,
	"./SHA256": 39,
	"./SHA256.js": 39
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 25;

/***/ }),

/***/ 251:
/*!**********************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/upyun-wxapp-sdk.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function Upyun(options) {
  this.bucket = options.bucket;
  this.operator = options.operator;
  this.getSignatureUrl = options.getSignatureUrl;
}

Upyun.prototype.upload = function (options) {
  var self = this;
  if (!options.remotePath) {
    options.remotePath = options.localPath.split('//')[1];
  }
  var date = new Date().toGMTString();
  var opts = {
    'save-key': options.remotePath,
    bucket: self.bucket,
    expiration: Math.round(new Date().getTime() / 1000) + 3600,
    date: date };

  var policy = Base64.encode(JSON.stringify(opts));
  var data = ['POST', '/' + self.bucket, date, policy].join('&');
  self.getSignature(data, function (err, signature) {
    if (err) {
      options.fail && options.fail(err);
      options.complete && options.complete(err);
      return;
    }
    wx.uploadFile({
      url: "https://v0.api.upyun.com/".concat(self.bucket),
      filePath: options.localPath,
      name: 'file',
      formData: {
        authorization: "UPYUN ".concat(self.operator, ":").concat(signature),
        policy: policy },

      success: options.success,
      fail: options.fail,
      complete: options.complete });

  });
};

Upyun.prototype.getSignature = function (data, cb) {
  wx.request({
    url: this.getSignatureUrl,
    data: {
      data: data },

    success: function success(res) {
      cb(null, res.data.signature);
    },
    fail: function fail(err) {
      cb(err);
    } });

};

/* eslint-disable */
var Base64 = {
  // private property
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  // public method for encoding
  encode: function encode(input) {
    var output = '';
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = Base64._utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = (chr1 & 3) << 4 | chr2 >> 4;
      enc3 = (chr2 & 15) << 2 | chr3 >> 6;
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
      this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
      this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    }
    return output;
  },
  // public method for decoding
  decode: function decode(input) {
    var output = '';
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));
      chr1 = enc1 << 2 | enc2 >> 4;
      chr2 = (enc2 & 15) << 4 | enc3 >> 2;
      chr3 = (enc3 & 3) << 6 | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = Base64._utf8_decode(output);
    return output;
  },
  // private method for UTF-8 encoding
  _utf8_encode: function _utf8_encode(string) {
    string = string.replace(/\r\n/g, '\n');
    var utftext = '';
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode(c >> 6 | 192);
        utftext += String.fromCharCode(c & 63 | 128);
      } else {
        utftext += String.fromCharCode(c >> 12 | 224);
        utftext += String.fromCharCode(c >> 6 & 63 | 128);
        utftext += String.fromCharCode(c & 63 | 128);
      }
    }
    return utftext;
  },
  // private method for UTF-8 decoding
  _utf8_decode: function _utf8_decode(utftext) {
    var string = '';
    var i = 0;
    var c = c1 = c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode((c & 31) << 6 | c2 & 63);
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        i += 3;
      }
    }
    return string;
  }

  /* eslint-enable */ };var _default =

Upyun;exports.default = _default;

/***/ }),

/***/ 26:
/*!***********************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib/AES.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-disable */
(function () {

  var C = typeof window === 'undefined' ? __webpack_require__(/*! ./Crypto */ 24).Crypto : window.Crypto;

  // Shortcuts
  var util = C.util,
  charenc = C.charenc,
  UTF8 = charenc.UTF8;

  // Precomputed SBOX
  var SBOX = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
  0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
  0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc,
  0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a,
  0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
  0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b,
  0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85,
  0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
  0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17,
  0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88,
  0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
  0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9,
  0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6,
  0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
  0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94,
  0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68,
  0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];

  // Compute inverse SBOX lookup table
  for (var INVSBOX = [], i = 0; i < 256; i++) {INVSBOX[SBOX[i]] = i;}

  // Compute mulitplication in GF(2^8) lookup tables
  var MULT2 = [],
  MULT3 = [],
  MULT9 = [],
  MULTB = [],
  MULTD = [],
  MULTE = [];

  function xtime(a, b) {
    for (var result = 0, i = 0; i < 8; i++) {
      if (b & 1) result ^= a;
      var hiBitSet = a & 0x80;
      a = a << 1 & 0xFF;
      if (hiBitSet) a ^= 0x1b;
      b >>>= 1;
    }
    return result;
  }

  for (var i = 0; i < 256; i++) {
    MULT2[i] = xtime(i, 2);
    MULT3[i] = xtime(i, 3);
    MULT9[i] = xtime(i, 9);
    MULTB[i] = xtime(i, 0xB);
    MULTD[i] = xtime(i, 0xD);
    MULTE[i] = xtime(i, 0xE);
  }

  // Precomputed RCon lookup
  var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

  // Inner state
  var state = [[], [], [], []],
  keylength,
  nrounds,
  keyschedule;

  var AES = C.AES = {

    /**
                       * Public API
                       */

    encrypt: function encrypt(message, password, options) {

      options = options || {};

      // Determine mode
      var mode = options.mode || new C.mode.OFB();

      // Allow mode to override options
      if (mode.fixOptions) mode.fixOptions(options);

      var

      // Convert to bytes if message is a string
      m =
      message.constructor == String ?
      UTF8.stringToBytes(message) :
      message,


      // Generate random IV
      iv = options.iv || util.randomBytes(AES._blocksize * 4),

      // Generate key
      k =
      password.constructor == String ?
      // Derive key from passphrase
      C.PBKDF2(password, iv, 32, { asBytes: true }) :
      // else, assume byte array representing cryptographic key
      password;


      // Encrypt
      AES._init(k);
      mode.encrypt(AES, m, iv);

      // Return ciphertext
      m = options.iv ? m : iv.concat(m);
      return options && options.asBytes ? m : util.bytesToBase64(m);

    },

    decrypt: function decrypt(ciphertext, password, options) {

      options = options || {};

      // Determine mode
      var mode = options.mode || new C.mode.OFB();

      // Allow mode to override options
      if (mode.fixOptions) mode.fixOptions(options);

      var

      // Convert to bytes if ciphertext is a string
      c =
      ciphertext.constructor == String ?
      util.base64ToBytes(ciphertext) :
      ciphertext,


      // Separate IV and message
      iv = options.iv || c.splice(0, AES._blocksize * 4),

      // Generate key
      k =
      password.constructor == String ?
      // Derive key from passphrase
      C.PBKDF2(password, iv, 32, { asBytes: true }) :
      // else, assume byte array representing cryptographic key
      password;


      // Decrypt
      AES._init(k);
      mode.decrypt(AES, c, iv);

      // Return plaintext
      return options && options.asBytes ? c : UTF8.bytesToString(c);

    },


    /**
        * Package private methods and properties
        */

    _blocksize: 4,

    _encryptblock: function _encryptblock(m, offset) {

      // Set input
      for (var row = 0; row < AES._blocksize; row++) {
        for (var col = 0; col < 4; col++) {
          state[row][col] = m[offset + col * 4 + row];}
      }

      // Add round key
      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
          state[row][col] ^= keyschedule[col][row];}
      }

      for (var round = 1; round < nrounds; round++) {

        // Sub bytes
        for (var row = 0; row < 4; row++) {
          for (var col = 0; col < 4; col++) {
            state[row][col] = SBOX[state[row][col]];}
        }

        // Shift rows
        state[1].push(state[1].shift());
        state[2].push(state[2].shift());
        state[2].push(state[2].shift());
        state[3].unshift(state[3].pop());

        // Mix columns
        for (var col = 0; col < 4; col++) {

          var s0 = state[0][col],
          s1 = state[1][col],
          s2 = state[2][col],
          s3 = state[3][col];

          state[0][col] = MULT2[s0] ^ MULT3[s1] ^ s2 ^ s3;
          state[1][col] = s0 ^ MULT2[s1] ^ MULT3[s2] ^ s3;
          state[2][col] = s0 ^ s1 ^ MULT2[s2] ^ MULT3[s3];
          state[3][col] = MULT3[s0] ^ s1 ^ s2 ^ MULT2[s3];

        }

        // Add round key
        for (var row = 0; row < 4; row++) {
          for (var col = 0; col < 4; col++) {
            state[row][col] ^= keyschedule[round * 4 + col][row];}
        }

      }

      // Sub bytes
      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
          state[row][col] = SBOX[state[row][col]];}
      }

      // Shift rows
      state[1].push(state[1].shift());
      state[2].push(state[2].shift());
      state[2].push(state[2].shift());
      state[3].unshift(state[3].pop());

      // Add round key
      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
          state[row][col] ^= keyschedule[nrounds * 4 + col][row];}
      }

      // Set output
      for (var row = 0; row < AES._blocksize; row++) {
        for (var col = 0; col < 4; col++) {
          m[offset + col * 4 + row] = state[row][col];}
      }

    },

    _decryptblock: function _decryptblock(c, offset) {

      // Set input
      for (var row = 0; row < AES._blocksize; row++) {
        for (var col = 0; col < 4; col++) {
          state[row][col] = c[offset + col * 4 + row];}
      }

      // Add round key
      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
          state[row][col] ^= keyschedule[nrounds * 4 + col][row];}
      }

      for (var round = 1; round < nrounds; round++) {

        // Inv shift rows
        state[1].unshift(state[1].pop());
        state[2].push(state[2].shift());
        state[2].push(state[2].shift());
        state[3].push(state[3].shift());

        // Inv sub bytes
        for (var row = 0; row < 4; row++) {
          for (var col = 0; col < 4; col++) {
            state[row][col] = INVSBOX[state[row][col]];}
        }

        // Add round key
        for (var row = 0; row < 4; row++) {
          for (var col = 0; col < 4; col++) {
            state[row][col] ^= keyschedule[(nrounds - round) * 4 + col][row];}
        }

        // Inv mix columns
        for (var col = 0; col < 4; col++) {

          var s0 = state[0][col],
          s1 = state[1][col],
          s2 = state[2][col],
          s3 = state[3][col];

          state[0][col] = MULTE[s0] ^ MULTB[s1] ^ MULTD[s2] ^ MULT9[s3];
          state[1][col] = MULT9[s0] ^ MULTE[s1] ^ MULTB[s2] ^ MULTD[s3];
          state[2][col] = MULTD[s0] ^ MULT9[s1] ^ MULTE[s2] ^ MULTB[s3];
          state[3][col] = MULTB[s0] ^ MULTD[s1] ^ MULT9[s2] ^ MULTE[s3];

        }

      }

      // Inv shift rows
      state[1].unshift(state[1].pop());
      state[2].push(state[2].shift());
      state[2].push(state[2].shift());
      state[3].push(state[3].shift());

      // Inv sub bytes
      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
          state[row][col] = INVSBOX[state[row][col]];}
      }

      // Add round key
      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
          state[row][col] ^= keyschedule[col][row];}
      }

      // Set output
      for (var row = 0; row < AES._blocksize; row++) {
        for (var col = 0; col < 4; col++) {
          c[offset + col * 4 + row] = state[row][col];}
      }

    },


    /**
        * Private methods
        */

    _init: function _init(k) {
      keylength = k.length / 4;
      nrounds = keylength + 6;
      AES._keyexpansion(k);
    },

    // Generate a key schedule
    _keyexpansion: function _keyexpansion(k) {

      keyschedule = [];

      for (var row = 0; row < keylength; row++) {
        keyschedule[row] = [
        k[row * 4],
        k[row * 4 + 1],
        k[row * 4 + 2],
        k[row * 4 + 3]];

      }

      for (var row = keylength; row < AES._blocksize * (nrounds + 1); row++) {

        var temp = [
        keyschedule[row - 1][0],
        keyschedule[row - 1][1],
        keyschedule[row - 1][2],
        keyschedule[row - 1][3]];


        if (row % keylength == 0) {

          // Rot word
          temp.push(temp.shift());

          // Sub word
          temp[0] = SBOX[temp[0]];
          temp[1] = SBOX[temp[1]];
          temp[2] = SBOX[temp[2]];
          temp[3] = SBOX[temp[3]];

          temp[0] ^= RCON[row / keylength];

        } else if (keylength > 6 && row % keylength == 4) {

          // Sub word
          temp[0] = SBOX[temp[0]];
          temp[1] = SBOX[temp[1]];
          temp[2] = SBOX[temp[2]];
          temp[3] = SBOX[temp[3]];

        }

        keyschedule[row] = [
        keyschedule[row - keylength][0] ^ temp[0],
        keyschedule[row - keylength][1] ^ temp[1],
        keyschedule[row - keylength][2] ^ temp[2],
        keyschedule[row - keylength][3] ^ temp[3]];


      }

    } };



})();
/* eslint-disable */

/***/ }),

/***/ 27:
/*!******************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib/BlockModes.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-disable */
(function () {

  var C = typeof window === 'undefined' ? __webpack_require__(/*! ./Crypto */ 24).Crypto : window.Crypto;

  // Create pad namespace
  var C_pad = C.pad = {};

  // Calculate the number of padding bytes required.
  function _requiredPadding(cipher, message) {
    var blockSizeInBytes = cipher._blocksize * 4;
    var reqd = blockSizeInBytes - message.length % blockSizeInBytes;
    return reqd;
  };

  // Remove padding when the final byte gives the number of padding bytes.
  var _unpadLength = function _unpadLength(message) {
    var pad = message.pop();
    for (var i = 1; i < pad; i++) {
      message.pop();
    }
  };

  // No-operation padding, used for stream ciphers
  C_pad.NoPadding = {
    pad: function pad(cipher, message) {},
    unpad: function unpad(message) {} };


  // Zero Padding.
  //
  // If the message is not an exact number of blocks, the final block is
  // completed with 0x00 bytes. There is no unpadding.
  C_pad.ZeroPadding = {
    pad: function pad(cipher, message) {
      var blockSizeInBytes = cipher._blocksize * 4;
      var reqd = message.length % blockSizeInBytes;
      if (reqd != 0) {
        for (reqd = blockSizeInBytes - reqd; reqd > 0; reqd--) {
          message.push(0x00);
        }
      }
    },

    unpad: function unpad(message) {} };


  // ISO/IEC 7816-4 padding.
  //
  // Pads the plain text with an 0x80 byte followed by as many 0x00
  // bytes are required to complete the block.
  C_pad.iso7816 = {
    pad: function pad(cipher, message) {
      var reqd = _requiredPadding(cipher, message);
      message.push(0x80);
      for (; reqd > 1; reqd--) {
        message.push(0x00);
      }
    },

    unpad: function unpad(message) {
      while (message.pop() != 0x80) {}
    } };


  // ANSI X.923 padding
  //
  // The final block is padded with zeros except for the last byte of the
  // last block which contains the number of padding bytes.
  C_pad.ansix923 = {
    pad: function pad(cipher, message) {
      var reqd = _requiredPadding(cipher, message);
      for (var i = 1; i < reqd; i++) {
        message.push(0x00);
      }
      message.push(reqd);
    },

    unpad: _unpadLength };


  // ISO 10126
  //
  // The final block is padded with random bytes except for the last
  // byte of the last block which contains the number of padding bytes.
  C_pad.iso10126 = {
    pad: function pad(cipher, message) {
      var reqd = _requiredPadding(cipher, message);
      for (var i = 1; i < reqd; i++) {
        message.push(Math.floor(Math.random() * 256));
      }
      message.push(reqd);
    },

    unpad: _unpadLength };


  // PKCS7 padding
  //
  // PKCS7 is described in RFC 5652. Padding is in whole bytes. The
  // value of each added byte is the number of bytes that are added,
  // i.e. N bytes, each of value N are added.
  C_pad.pkcs7 = {
    pad: function pad(cipher, message) {
      var reqd = _requiredPadding(cipher, message);
      for (var i = 0; i < reqd; i++) {
        message.push(reqd);
      }
    },

    unpad: _unpadLength };


  // Create mode namespace
  var C_mode = C.mode = {};

  /**
                             * Mode base "class".
                             */
  var Mode = C_mode.Mode = function (padding) {
    if (padding) {
      this._padding = padding;
    }
  };

  Mode.prototype = {
    encrypt: function encrypt(cipher, m, iv) {
      this._padding.pad(cipher, m);
      this._doEncrypt(cipher, m, iv);
    },

    decrypt: function decrypt(cipher, m, iv) {
      this._doDecrypt(cipher, m, iv);
      this._padding.unpad(m);
    },

    // Default padding
    _padding: C_pad.iso7816 };



  /**
                                * Electronic Code Book mode.
                                *
                                * ECB applies the cipher directly against each block of the input.
                                *
                                * ECB does not require an initialization vector.
                                */
  var ECB = C_mode.ECB = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
  };

  // Inherit from Mode
  var ECB_prototype = ECB.prototype = new Mode();

  // Concrete steps for Mode template
  ECB_prototype._doEncrypt = function (cipher, m, iv) {
    var blockSizeInBytes = cipher._blocksize * 4;
    // Encrypt each block
    for (var offset = 0; offset < m.length; offset += blockSizeInBytes) {
      cipher._encryptblock(m, offset);
    }
  };
  ECB_prototype._doDecrypt = function (cipher, c, iv) {
    var blockSizeInBytes = cipher._blocksize * 4;
    // Decrypt each block
    for (var offset = 0; offset < c.length; offset += blockSizeInBytes) {
      cipher._decryptblock(c, offset);
    }
  };

  // ECB never uses an IV
  ECB_prototype.fixOptions = function (options) {
    options.iv = [];
  };


  /**
      * Cipher block chaining
      *
      * The first block is XORed with the IV. Subsequent blocks are XOR with the
      * previous cipher output.
      */
  var CBC = C_mode.CBC = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
  };

  // Inherit from Mode
  var CBC_prototype = CBC.prototype = new Mode();

  // Concrete steps for Mode template
  CBC_prototype._doEncrypt = function (cipher, m, iv) {
    var blockSizeInBytes = cipher._blocksize * 4;

    // Encrypt each block
    for (var offset = 0; offset < m.length; offset += blockSizeInBytes) {
      if (offset == 0) {
        // XOR first block using IV
        for (var i = 0; i < blockSizeInBytes; i++) {
          m[i] ^= iv[i];}
      } else {
        // XOR this block using previous crypted block
        for (var i = 0; i < blockSizeInBytes; i++) {
          m[offset + i] ^= m[offset + i - blockSizeInBytes];}
      }
      // Encrypt block
      cipher._encryptblock(m, offset);
    }
  };
  CBC_prototype._doDecrypt = function (cipher, c, iv) {
    var blockSizeInBytes = cipher._blocksize * 4;

    // At the start, the previously crypted block is the IV
    var prevCryptedBlock = iv;

    // Decrypt each block
    for (var offset = 0; offset < c.length; offset += blockSizeInBytes) {
      // Save this crypted block
      var thisCryptedBlock = c.slice(offset, offset + blockSizeInBytes);
      // Decrypt block
      cipher._decryptblock(c, offset);
      // XOR decrypted block using previous crypted block
      for (var i = 0; i < blockSizeInBytes; i++) {
        c[offset + i] ^= prevCryptedBlock[i];
      }
      prevCryptedBlock = thisCryptedBlock;
    }
  };


  /**
      * Cipher feed back
      *
      * The cipher output is XORed with the plain text to produce the cipher output,
      * which is then fed back into the cipher to produce a bit pattern to XOR the
      * next block with.
      *
      * This is a stream cipher mode and does not require padding.
      */
  var CFB = C_mode.CFB = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
  };

  // Inherit from Mode
  var CFB_prototype = CFB.prototype = new Mode();

  // Override padding
  CFB_prototype._padding = C_pad.NoPadding;

  // Concrete steps for Mode template
  CFB_prototype._doEncrypt = function (cipher, m, iv) {
    var blockSizeInBytes = cipher._blocksize * 4,
    keystream = iv.slice(0);

    // Encrypt each byte
    for (var i = 0; i < m.length; i++) {

      var j = i % blockSizeInBytes;
      if (j == 0) cipher._encryptblock(keystream, 0);

      m[i] ^= keystream[j];
      keystream[j] = m[i];
    }
  };
  CFB_prototype._doDecrypt = function (cipher, c, iv) {
    var blockSizeInBytes = cipher._blocksize * 4,
    keystream = iv.slice(0);

    // Encrypt each byte
    for (var i = 0; i < c.length; i++) {

      var j = i % blockSizeInBytes;
      if (j == 0) cipher._encryptblock(keystream, 0);

      var b = c[i];
      c[i] ^= keystream[j];
      keystream[j] = b;
    }
  };


  /**
      * Output feed back
      *
      * The cipher repeatedly encrypts its own output. The output is XORed with the
      * plain text to produce the cipher text.
      *
      * This is a stream cipher mode and does not require padding.
      */
  var OFB = C_mode.OFB = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
  };

  // Inherit from Mode
  var OFB_prototype = OFB.prototype = new Mode();

  // Override padding
  OFB_prototype._padding = C_pad.NoPadding;

  // Concrete steps for Mode template
  OFB_prototype._doEncrypt = function (cipher, m, iv) {

    var blockSizeInBytes = cipher._blocksize * 4,
    keystream = iv.slice(0);

    // Encrypt each byte
    for (var i = 0; i < m.length; i++) {

      // Generate keystream
      if (i % blockSizeInBytes == 0)
      cipher._encryptblock(keystream, 0);

      // Encrypt byte
      m[i] ^= keystream[i % blockSizeInBytes];

    }
  };
  OFB_prototype._doDecrypt = OFB_prototype._doEncrypt;

  /**
                                                        * Counter
                                                        * @author Gergely Risko
                                                        *
                                                        * After every block the last 4 bytes of the IV is increased by one
                                                        * with carry and that IV is used for the next block.
                                                        *
                                                        * This is a stream cipher mode and does not require padding.
                                                        */
  var CTR = C_mode.CTR = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
  };

  // Inherit from Mode
  var CTR_prototype = CTR.prototype = new Mode();

  // Override padding
  CTR_prototype._padding = C_pad.NoPadding;

  CTR_prototype._doEncrypt = function (cipher, m, iv) {
    var blockSizeInBytes = cipher._blocksize * 4;
    var counter = iv.slice(0);

    for (var i = 0; i < m.length;) {
      // do not lose iv
      var keystream = counter.slice(0);

      // Generate keystream for next block
      cipher._encryptblock(keystream, 0);

      // XOR keystream with block
      for (var j = 0; i < m.length && j < blockSizeInBytes; j++, i++) {
        m[i] ^= keystream[j];
      }

      // Increase counter
      if (++counter[blockSizeInBytes - 1] == 256) {
        counter[blockSizeInBytes - 1] = 0;
        if (++counter[blockSizeInBytes - 2] == 256) {
          counter[blockSizeInBytes - 2] = 0;
          if (++counter[blockSizeInBytes - 3] == 256) {
            counter[blockSizeInBytes - 3] = 0;
            ++counter[blockSizeInBytes - 4];
          }
        }
      }
    }
  };
  CTR_prototype._doDecrypt = CTR_prototype._doEncrypt;

})();
/* eslint-disable */

/***/ }),

/***/ 28:
/*!******************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib/CryptoMath.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-disable */
(function () {

  var C = typeof window === 'undefined' ? __webpack_require__(/*! ./Crypto */ 24).Crypto : window.Crypto;

  // Shortcut
  var util = C.util;

  // Convert n to unsigned 32-bit integer
  util.u32 = function (n) {
    return n >>> 0;
  };

  // Unsigned 32-bit addition
  util.add = function () {
    var result = this.u32(arguments[0]);
    for (var i = 1; i < arguments.length; i++) {
      result = this.u32(result + this.u32(arguments[i]));}
    return result;
  };

  // Unsigned 32-bit multiplication
  util.mult = function (m, n) {
    return this.add((n & 0xFFFF0000) * m,
    (n & 0x0000FFFF) * m);
  };

  // Unsigned 32-bit greater than (>) comparison
  util.gt = function (m, n) {
    return this.u32(m) > this.u32(n);
  };

  // Unsigned 32-bit less than (<) comparison
  util.lt = function (m, n) {
    return this.u32(m) < this.u32(n);
  };

})();
/* eslint-disable */

/***/ }),

/***/ 29:
/*!***********************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib/DES.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /**
               * Definition of Data Encryption Standard (DES) taken from:
               * http://www.itl.nist.gov/fipspubs/fip46-2.htm
               */
/* eslint-disable */
(function () {

  var C = typeof window === 'undefined' ? __webpack_require__(/*! ./Crypto */ 24).Crypto : window.Crypto;

  // Shortcuts
  var util = C.util,charenc = C.charenc,UTF8 = charenc.UTF8;

  /***************************************************************************
                                                              *
                                                              * DES Key Schedule.
                                                              *
                                                              * The Key consists of 16 sub-keys of 48 bits each. As each sub-key is
                                                              * applied to an expanded 32-bit value where each 4 bits of input is
                                                              * expanded into 6 bits of output the sub-key can be broken down into 8
                                                              * 32-bit values which allows the key to be used without expansion.
                                                              *
                                                              * To create the 16 sub-keys, 56 bits are selected from the input 64 bit key
                                                              * according to <i>PC1</i>. Each sub-key is generated by left rotating the
                                                              * bits a different amount and then selecting 48 bits according to <i>PC2</i>.
                                                              *
                                                              **************************************************************************/

  var KeySchedule;

  /**
                    * Representation of a DES key schedule.
                    *
                    * @param {Array
                    *            of 8 bytes} key The cipher key
                    *
                    * @constructor
                    */
  KeySchedule = function KeySchedule(key) {
    /**
                                            * The schedule of 16 keys
                                            */
    this.keys = new Array(16);
    this._initialiseKeys(key);
  };

  /**
      * Permuted Choice 1 (PC1) byte offsets into the key. Each of the 56 entries
      * selects one bit of DES's 56 bit key.
      * <p>
      *
      * <pre>
      * The PC1 is defined as:
      *
      * 57,   49,    41,   33,    25,    17,    9,
      *  1,   58,    50,   42,    34,    26,   18,
      * 10,    2,    59,   51,    43,    35,   27,
      * 19,   11,     3,   60,    52,    44,   36,
      * 63,   55,    47,   39,    31,    23,   15,
      *  7,   62,    54,   46,    38,    30,   22,
      * 14,    6,    61,   53,    45,    37,   29,
      * 21,   13,     5,   28,    20,    12,    4
      * </pre>
      *
      * We represent this as an offset into an 8-byte array and a bit mask upon
      * that byte. For example 57=(7*8)+1 so is the first (MSB) of the 7th byte.
      *
      * @constant
      */
  KeySchedule.PC1_offsets = [7, 6, 5, 4, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1, 0,
  7, 6, 5, 4, 3, 2, 1, 0, 7, 6, 5, 4, 7, 6, 5, 4, 3, 2, 1, 0, 7, 6,
  5, 4, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1, 0, 3, 2, 1, 0];

  /**
                                                          * Permuted Choice 1 (PC1) bit masks. Each of the 56 entries selects one bit
                                                          * of DES's 56 bit key.
                                                          *
                                                          * @constant
                                                          */
  KeySchedule.PC1_masks = [128, 128, 128, 128, 128, 128, 128, 128, 64, 64,
  64, 64, 64, 64, 64, 64, 32, 32, 32, 32, 32, 32, 32, 32, 16, 16, 16,
  16, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 8, 8, 8,
  8, 8, 8, 16, 16, 16, 16];

  /**
                             * Permuted Choice 2 (PC2) selects the active 48 bits from the 56 bits of
                             * the key.
                             * <p>
                             *
                             * <pre>
                             * The PC2 is defined as:
                             *
                             * 14,   17,   11,   24,    1,    5,
                             *  3,   28,   15,    6,   21,   10,
                             * 23,   19,   12,    4,   26,    8,
                             * 16,    7,   27,   20,   13,    2,
                             * 41,   52,   31,   37,   47,   55,
                             * 30,   40,   51,   45,   33,   48,
                             * 44,   49,   39,   56,   34,   53,
                             * 46,   42,   50,   36,   29,   32
                             * </pre>
                             *
                             * We invert the choice to specify what each bit adds to each 6-bit value of
                             * the key. For example, bit 1 is the 5th bit selected so this add 2 to the
                             * first 6-bit value.
                             *
                             * @constant
                             */
  KeySchedule.PC2_offsets1 = [0, 3, 1, 2, 0, 1, 3, 2, 0, 1, 0, 2, 3, 0, 1,
  3, 0, 0, 2, 3, 1, 0, 2, 0, 0, 2, 3, 1];

  /**
                                           * PC2 offsets for 2nd block.
                                           *
                                           * @constant
                                           */
  KeySchedule.PC2_offsets2 = [7, 5, 4, 7, 5, 6, 0, 7, 4, 0, 6, 5, 4, 7, 0,
  6, 5, 7, 4, 5, 6, 7, 5, 4, 6, 0, 4, 6];

  /**
                                           * Permuted Choice 2 (PC2) masks for 1st block.
                                           *
                                           * @constant
                                           */
  KeySchedule.PC2_masks1 = [2, 1, 32, 4, 1, 4, 16, 1, 0, 1, 8, 8, 2, 32, 8,
  32, 16, 0, 16, 4, 2, 0, 32, 4, 0, 2, 8, 16];

  /**
                                                * PC2 masks for 2nd block.
                                                *
                                                * @constant
                                                */
  KeySchedule.PC2_masks2 = [2, 32, 8, 1, 2, 2, 0, 4, 4, 0, 8, 16, 32, 16, 0,
  32, 4, 32, 2, 1, 16, 8, 8, 16, 1, 0, 1, 4];

  /**
                                               * Cumulative key shifts.
                                               *
                                               * @constant
                                               */
  KeySchedule.keyShifts = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23,
  25, 27, 28];

  KeySchedule.prototype._initialiseKeys = function (key) {
    var i;

    // extract 56 key bits in order determined by PC1
    var bits = new Array(56);
    for (i = 0; i < 56; i++) {
      bits[i] = (key[KeySchedule.PC1_offsets[i]] & KeySchedule.PC1_masks[i]) != 0;
    }

    // split 56 bits into two 28-bit chunks
    var bits1 = bits.slice(0, 28);
    var bits2 = bits.slice(28, 56);

    // duplicate each half to allow for easy bit shifts
    bits1 = bits1.concat(bits1);
    bits2 = bits2.concat(bits2);

    // assemble the 16 keys
    for (i = 0; i < 16; i++) {
      var k = [0, 0, 0, 0, 0, 0, 0, 0];

      // select the bits of the key according to PC2
      var s = KeySchedule.keyShifts[i];
      for (var j = 0; j < 28; j++) {
        if (bits1[j + s]) {
          k[KeySchedule.PC2_offsets1[j]] += KeySchedule.PC2_masks1[j];
        }
        if (bits2[j + s]) {
          k[KeySchedule.PC2_offsets2[j]] += KeySchedule.PC2_masks2[j];
        }
      }

      // Scale each of the 8 blocks to a 32-bit mask.
      k[0] = ((k[0] & 0x1f) << 27) + ((k[0] & 0x20) >> 5);
      for (var j = 1; j <= 6; j++) {
        k[j] = k[j] << 27 - 4 * j;
      }
      k[7] = ((k[7] & 0x3e) >> 1) + ((k[7] & 0x1) << 31);
      this.keys[i] = k;
    }
  };

  /**
      * Retrieve the key for a specified round
      *
      * @param i
      *            the round
      * @returns the key
      */
  KeySchedule.prototype.getKey = function (i) {
    return this.keys[i];
  };

  /***************************************************************************
      *
      * DES Engine State
      *
      **************************************************************************/

  var State;

  /**
              * The algorithm's state. DES operates on two sets of 32-bits, with each
              * block of 32-bits treated as a single number.
              *
              * @class
              */
  State = function State() {
    /** The LHS of the Feistel scheme */
    this.lhs = 0;
    /** The RHS of the Feistel scheme */
    this.rhs = 0;
  };

  /**
      * The masks that select the SBOX input. Each SBOX accepts 6 bits from the
      * input.
      *
      * @constant
      */
  State.SBOX_MASK = [0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
  0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f];

  /**
                                                    * The SBOXes. The 8 SBOXes each map 6 bit masked bit of the input to 4 bits
                                                    * of output. These SBOXes include the post SBOX permutation and benefit
                                                    * from JavaScript's sparse arrays to make specifying the input match
                                                    * simple.
                                                    *
                                                    * @constant
                                                    */
  State.SBOX = new Array(8);

  var SBOX = State.SBOX;

  SBOX[0] = new Array();
  SBOX[0][0] = 0x808200; // 0 (0, 0) = 14
  SBOX[0][268435456] = 0x8000; // 10000000 (0, 1) = 4
  SBOX[0][536870912] = 0x808002; // 20000000 (0, 2) = 13
  SBOX[0][805306368] = 0x2; // 30000000 (0, 3) = 1
  SBOX[0][1073741824] = 0x200; // 40000000 (0, 4) = 2
  SBOX[0][1342177280] = 0x808202; // 50000000 (0, 5) = 15
  SBOX[0][1610612736] = 0x800202; // 60000000 (0, 6) = 11
  SBOX[0][1879048192] = 0x800000; // 70000000 (0, 7) = 8
  SBOX[0][-2147483648] = 0x202; // 80000000 (0, 8) = 3
  SBOX[0][-1879048192] = 0x800200; // 90000000 (0, 9) = 10
  SBOX[0][-1610612736] = 0x8200; // a0000000 (0, 10) = 6
  SBOX[0][-1342177280] = 0x808000; // b0000000 (0, 11) = 12
  SBOX[0][-1073741824] = 0x8002; // c0000000 (0, 12) = 5
  SBOX[0][-805306368] = 0x800002; // d0000000 (0, 13) = 9
  SBOX[0][-536870912] = 0x0; // e0000000 (0, 14) = 0
  SBOX[0][-268435456] = 0x8202; // f0000000 (0, 15) = 7
  SBOX[0][134217728] = 0x0; // 8000000 (1, 0) = 0
  SBOX[0][402653184] = 0x808202; // 18000000 (1, 1) = 15
  SBOX[0][671088640] = 0x8202; // 28000000 (1, 2) = 7
  SBOX[0][939524096] = 0x8000; // 38000000 (1, 3) = 4
  SBOX[0][1207959552] = 0x808200; // 48000000 (1, 4) = 14
  SBOX[0][1476395008] = 0x200; // 58000000 (1, 5) = 2
  SBOX[0][1744830464] = 0x808002; // 68000000 (1, 6) = 13
  SBOX[0][2013265920] = 0x2; // 78000000 (1, 7) = 1
  SBOX[0][-2013265920] = 0x800200; // 88000000 (1, 8) = 10
  SBOX[0][-1744830464] = 0x8200; // 98000000 (1, 9) = 6
  SBOX[0][-1476395008] = 0x808000; // a8000000 (1, 10) = 12
  SBOX[0][-1207959552] = 0x800202; // b8000000 (1, 11) = 11
  SBOX[0][-939524096] = 0x800002; // c8000000 (1, 12) = 9
  SBOX[0][-671088640] = 0x8002; // d8000000 (1, 13) = 5
  SBOX[0][-402653184] = 0x202; // e8000000 (1, 14) = 3
  SBOX[0][-134217728] = 0x800000; // f8000000 (1, 15) = 8
  SBOX[0][1] = 0x8000; // 1 (2, 0) = 4
  SBOX[0][268435457] = 0x2; // 10000001 (2, 1) = 1
  SBOX[0][536870913] = 0x808200; // 20000001 (2, 2) = 14
  SBOX[0][805306369] = 0x800000; // 30000001 (2, 3) = 8
  SBOX[0][1073741825] = 0x808002; // 40000001 (2, 4) = 13
  SBOX[0][1342177281] = 0x8200; // 50000001 (2, 5) = 6
  SBOX[0][1610612737] = 0x200; // 60000001 (2, 6) = 2
  SBOX[0][1879048193] = 0x800202; // 70000001 (2, 7) = 11
  SBOX[0][-2147483647] = 0x808202; // 80000001 (2, 8) = 15
  SBOX[0][-1879048191] = 0x808000; // 90000001 (2, 9) = 12
  SBOX[0][-1610612735] = 0x800002; // a0000001 (2, 10) = 9
  SBOX[0][-1342177279] = 0x8202; // b0000001 (2, 11) = 7
  SBOX[0][-1073741823] = 0x202; // c0000001 (2, 12) = 3
  SBOX[0][-805306367] = 0x800200; // d0000001 (2, 13) = 10
  SBOX[0][-536870911] = 0x8002; // e0000001 (2, 14) = 5
  SBOX[0][-268435455] = 0x0; // f0000001 (2, 15) = 0
  SBOX[0][134217729] = 0x808202; // 8000001 (3, 0) = 15
  SBOX[0][402653185] = 0x808000; // 18000001 (3, 1) = 12
  SBOX[0][671088641] = 0x800000; // 28000001 (3, 2) = 8
  SBOX[0][939524097] = 0x200; // 38000001 (3, 3) = 2
  SBOX[0][1207959553] = 0x8000; // 48000001 (3, 4) = 4
  SBOX[0][1476395009] = 0x800002; // 58000001 (3, 5) = 9
  SBOX[0][1744830465] = 0x2; // 68000001 (3, 6) = 1
  SBOX[0][2013265921] = 0x8202; // 78000001 (3, 7) = 7
  SBOX[0][-2013265919] = 0x8002; // 88000001 (3, 8) = 5
  SBOX[0][-1744830463] = 0x800202; // 98000001 (3, 9) = 11
  SBOX[0][-1476395007] = 0x202; // a8000001 (3, 10) = 3
  SBOX[0][-1207959551] = 0x808200; // b8000001 (3, 11) = 14
  SBOX[0][-939524095] = 0x800200; // c8000001 (3, 12) = 10
  SBOX[0][-671088639] = 0x0; // d8000001 (3, 13) = 0
  SBOX[0][-402653183] = 0x8200; // e8000001 (3, 14) = 6
  SBOX[0][-134217727] = 0x808002; // f8000001 (3, 15) = 13

  SBOX[1] = new Array();
  SBOX[1][0] = 0x40084010; // 0 (0, 0) = 15
  SBOX[1][16777216] = 0x4000; // 1000000 (0, 1) = 1
  SBOX[1][33554432] = 0x80000; // 2000000 (0, 2) = 8
  SBOX[1][50331648] = 0x40080010; // 3000000 (0, 3) = 14
  SBOX[1][67108864] = 0x40000010; // 4000000 (0, 4) = 6
  SBOX[1][83886080] = 0x40084000; // 5000000 (0, 5) = 11
  SBOX[1][100663296] = 0x40004000; // 6000000 (0, 6) = 3
  SBOX[1][117440512] = 0x10; // 7000000 (0, 7) = 4
  SBOX[1][134217728] = 0x84000; // 8000000 (0, 8) = 9
  SBOX[1][150994944] = 0x40004010; // 9000000 (0, 9) = 7
  SBOX[1][167772160] = 0x40000000; // a000000 (0, 10) = 2
  SBOX[1][184549376] = 0x84010; // b000000 (0, 11) = 13
  SBOX[1][201326592] = 0x80010; // c000000 (0, 12) = 12
  SBOX[1][218103808] = 0x0; // d000000 (0, 13) = 0
  SBOX[1][234881024] = 0x4010; // e000000 (0, 14) = 5
  SBOX[1][251658240] = 0x40080000; // f000000 (0, 15) = 10
  SBOX[1][8388608] = 0x40004000; // 800000 (1, 0) = 3
  SBOX[1][25165824] = 0x84010; // 1800000 (1, 1) = 13
  SBOX[1][41943040] = 0x10; // 2800000 (1, 2) = 4
  SBOX[1][58720256] = 0x40004010; // 3800000 (1, 3) = 7
  SBOX[1][75497472] = 0x40084010; // 4800000 (1, 4) = 15
  SBOX[1][92274688] = 0x40000000; // 5800000 (1, 5) = 2
  SBOX[1][109051904] = 0x80000; // 6800000 (1, 6) = 8
  SBOX[1][125829120] = 0x40080010; // 7800000 (1, 7) = 14
  SBOX[1][142606336] = 0x80010; // 8800000 (1, 8) = 12
  SBOX[1][159383552] = 0x0; // 9800000 (1, 9) = 0
  SBOX[1][176160768] = 0x4000; // a800000 (1, 10) = 1
  SBOX[1][192937984] = 0x40080000; // b800000 (1, 11) = 10
  SBOX[1][209715200] = 0x40000010; // c800000 (1, 12) = 6
  SBOX[1][226492416] = 0x84000; // d800000 (1, 13) = 9
  SBOX[1][243269632] = 0x40084000; // e800000 (1, 14) = 11
  SBOX[1][260046848] = 0x4010; // f800000 (1, 15) = 5
  SBOX[1][268435456] = 0x0; // 10000000 (2, 0) = 0
  SBOX[1][285212672] = 0x40080010; // 11000000 (2, 1) = 14
  SBOX[1][301989888] = 0x40004010; // 12000000 (2, 2) = 7
  SBOX[1][318767104] = 0x40084000; // 13000000 (2, 3) = 11
  SBOX[1][335544320] = 0x40080000; // 14000000 (2, 4) = 10
  SBOX[1][352321536] = 0x10; // 15000000 (2, 5) = 4
  SBOX[1][369098752] = 0x84010; // 16000000 (2, 6) = 13
  SBOX[1][385875968] = 0x4000; // 17000000 (2, 7) = 1
  SBOX[1][402653184] = 0x4010; // 18000000 (2, 8) = 5
  SBOX[1][419430400] = 0x80000; // 19000000 (2, 9) = 8
  SBOX[1][436207616] = 0x80010; // 1a000000 (2, 10) = 12
  SBOX[1][452984832] = 0x40000010; // 1b000000 (2, 11) = 6
  SBOX[1][469762048] = 0x84000; // 1c000000 (2, 12) = 9
  SBOX[1][486539264] = 0x40004000; // 1d000000 (2, 13) = 3
  SBOX[1][503316480] = 0x40000000; // 1e000000 (2, 14) = 2
  SBOX[1][520093696] = 0x40084010; // 1f000000 (2, 15) = 15
  SBOX[1][276824064] = 0x84010; // 10800000 (3, 0) = 13
  SBOX[1][293601280] = 0x80000; // 11800000 (3, 1) = 8
  SBOX[1][310378496] = 0x40080000; // 12800000 (3, 2) = 10
  SBOX[1][327155712] = 0x4000; // 13800000 (3, 3) = 1
  SBOX[1][343932928] = 0x40004000; // 14800000 (3, 4) = 3
  SBOX[1][360710144] = 0x40084010; // 15800000 (3, 5) = 15
  SBOX[1][377487360] = 0x10; // 16800000 (3, 6) = 4
  SBOX[1][394264576] = 0x40000000; // 17800000 (3, 7) = 2
  SBOX[1][411041792] = 0x40084000; // 18800000 (3, 8) = 11
  SBOX[1][427819008] = 0x40000010; // 19800000 (3, 9) = 6
  SBOX[1][444596224] = 0x40004010; // 1a800000 (3, 10) = 7
  SBOX[1][461373440] = 0x80010; // 1b800000 (3, 11) = 12
  SBOX[1][478150656] = 0x0; // 1c800000 (3, 12) = 0
  SBOX[1][494927872] = 0x4010; // 1d800000 (3, 13) = 5
  SBOX[1][511705088] = 0x40080010; // 1e800000 (3, 14) = 14
  SBOX[1][528482304] = 0x84000; // 1f800000 (3, 15) = 9

  SBOX[2] = new Array();
  SBOX[2][0] = 0x104; // 0 (0, 0) = 10
  SBOX[2][1048576] = 0x0; // 100000 (0, 1) = 0
  SBOX[2][2097152] = 0x4000100; // 200000 (0, 2) = 9
  SBOX[2][3145728] = 0x10104; // 300000 (0, 3) = 14
  SBOX[2][4194304] = 0x10004; // 400000 (0, 4) = 6
  SBOX[2][5242880] = 0x4000004; // 500000 (0, 5) = 3
  SBOX[2][6291456] = 0x4010104; // 600000 (0, 6) = 15
  SBOX[2][7340032] = 0x4010000; // 700000 (0, 7) = 5
  SBOX[2][8388608] = 0x4000000; // 800000 (0, 8) = 1
  SBOX[2][9437184] = 0x4010100; // 900000 (0, 9) = 13
  SBOX[2][10485760] = 0x10100; // a00000 (0, 10) = 12
  SBOX[2][11534336] = 0x4010004; // b00000 (0, 11) = 7
  SBOX[2][12582912] = 0x4000104; // c00000 (0, 12) = 11
  SBOX[2][13631488] = 0x10000; // d00000 (0, 13) = 4
  SBOX[2][14680064] = 0x4; // e00000 (0, 14) = 2
  SBOX[2][15728640] = 0x100; // f00000 (0, 15) = 8
  SBOX[2][524288] = 0x4010100; // 80000 (1, 0) = 13
  SBOX[2][1572864] = 0x4010004; // 180000 (1, 1) = 7
  SBOX[2][2621440] = 0x0; // 280000 (1, 2) = 0
  SBOX[2][3670016] = 0x4000100; // 380000 (1, 3) = 9
  SBOX[2][4718592] = 0x4000004; // 480000 (1, 4) = 3
  SBOX[2][5767168] = 0x10000; // 580000 (1, 5) = 4
  SBOX[2][6815744] = 0x10004; // 680000 (1, 6) = 6
  SBOX[2][7864320] = 0x104; // 780000 (1, 7) = 10
  SBOX[2][8912896] = 0x4; // 880000 (1, 8) = 2
  SBOX[2][9961472] = 0x100; // 980000 (1, 9) = 8
  SBOX[2][11010048] = 0x4010000; // a80000 (1, 10) = 5
  SBOX[2][12058624] = 0x10104; // b80000 (1, 11) = 14
  SBOX[2][13107200] = 0x10100; // c80000 (1, 12) = 12
  SBOX[2][14155776] = 0x4000104; // d80000 (1, 13) = 11
  SBOX[2][15204352] = 0x4010104; // e80000 (1, 14) = 15
  SBOX[2][16252928] = 0x4000000; // f80000 (1, 15) = 1
  SBOX[2][16777216] = 0x4010100; // 1000000 (2, 0) = 13
  SBOX[2][17825792] = 0x10004; // 1100000 (2, 1) = 6
  SBOX[2][18874368] = 0x10000; // 1200000 (2, 2) = 4
  SBOX[2][19922944] = 0x4000100; // 1300000 (2, 3) = 9
  SBOX[2][20971520] = 0x100; // 1400000 (2, 4) = 8
  SBOX[2][22020096] = 0x4010104; // 1500000 (2, 5) = 15
  SBOX[2][23068672] = 0x4000004; // 1600000 (2, 6) = 3
  SBOX[2][24117248] = 0x0; // 1700000 (2, 7) = 0
  SBOX[2][25165824] = 0x4000104; // 1800000 (2, 8) = 11
  SBOX[2][26214400] = 0x4000000; // 1900000 (2, 9) = 1
  SBOX[2][27262976] = 0x4; // 1a00000 (2, 10) = 2
  SBOX[2][28311552] = 0x10100; // 1b00000 (2, 11) = 12
  SBOX[2][29360128] = 0x4010000; // 1c00000 (2, 12) = 5
  SBOX[2][30408704] = 0x104; // 1d00000 (2, 13) = 10
  SBOX[2][31457280] = 0x10104; // 1e00000 (2, 14) = 14
  SBOX[2][32505856] = 0x4010004; // 1f00000 (2, 15) = 7
  SBOX[2][17301504] = 0x4000000; // 1080000 (3, 0) = 1
  SBOX[2][18350080] = 0x104; // 1180000 (3, 1) = 10
  SBOX[2][19398656] = 0x4010100; // 1280000 (3, 2) = 13
  SBOX[2][20447232] = 0x0; // 1380000 (3, 3) = 0
  SBOX[2][21495808] = 0x10004; // 1480000 (3, 4) = 6
  SBOX[2][22544384] = 0x4000100; // 1580000 (3, 5) = 9
  SBOX[2][23592960] = 0x100; // 1680000 (3, 6) = 8
  SBOX[2][24641536] = 0x4010004; // 1780000 (3, 7) = 7
  SBOX[2][25690112] = 0x10000; // 1880000 (3, 8) = 4
  SBOX[2][26738688] = 0x4010104; // 1980000 (3, 9) = 15
  SBOX[2][27787264] = 0x10104; // 1a80000 (3, 10) = 14
  SBOX[2][28835840] = 0x4000004; // 1b80000 (3, 11) = 3
  SBOX[2][29884416] = 0x4000104; // 1c80000 (3, 12) = 11
  SBOX[2][30932992] = 0x4010000; // 1d80000 (3, 13) = 5
  SBOX[2][31981568] = 0x4; // 1e80000 (3, 14) = 2
  SBOX[2][33030144] = 0x10100; // 1f80000 (3, 15) = 12

  SBOX[3] = new Array();
  SBOX[3][0] = 0x80401000; // 0 (0, 0) = 7
  SBOX[3][65536] = 0x80001040; // 10000 (0, 1) = 13
  SBOX[3][131072] = 0x401040; // 20000 (0, 2) = 14
  SBOX[3][196608] = 0x80400000; // 30000 (0, 3) = 3
  SBOX[3][262144] = 0x0; // 40000 (0, 4) = 0
  SBOX[3][327680] = 0x401000; // 50000 (0, 5) = 6
  SBOX[3][393216] = 0x80000040; // 60000 (0, 6) = 9
  SBOX[3][458752] = 0x400040; // 70000 (0, 7) = 10
  SBOX[3][524288] = 0x80000000; // 80000 (0, 8) = 1
  SBOX[3][589824] = 0x400000; // 90000 (0, 9) = 2
  SBOX[3][655360] = 0x40; // a0000 (0, 10) = 8
  SBOX[3][720896] = 0x80001000; // b0000 (0, 11) = 5
  SBOX[3][786432] = 0x80400040; // c0000 (0, 12) = 11
  SBOX[3][851968] = 0x1040; // d0000 (0, 13) = 12
  SBOX[3][917504] = 0x1000; // e0000 (0, 14) = 4
  SBOX[3][983040] = 0x80401040; // f0000 (0, 15) = 15
  SBOX[3][32768] = 0x80001040; // 8000 (1, 0) = 13
  SBOX[3][98304] = 0x40; // 18000 (1, 1) = 8
  SBOX[3][163840] = 0x80400040; // 28000 (1, 2) = 11
  SBOX[3][229376] = 0x80001000; // 38000 (1, 3) = 5
  SBOX[3][294912] = 0x401000; // 48000 (1, 4) = 6
  SBOX[3][360448] = 0x80401040; // 58000 (1, 5) = 15
  SBOX[3][425984] = 0x0; // 68000 (1, 6) = 0
  SBOX[3][491520] = 0x80400000; // 78000 (1, 7) = 3
  SBOX[3][557056] = 0x1000; // 88000 (1, 8) = 4
  SBOX[3][622592] = 0x80401000; // 98000 (1, 9) = 7
  SBOX[3][688128] = 0x400000; // a8000 (1, 10) = 2
  SBOX[3][753664] = 0x1040; // b8000 (1, 11) = 12
  SBOX[3][819200] = 0x80000000; // c8000 (1, 12) = 1
  SBOX[3][884736] = 0x400040; // d8000 (1, 13) = 10
  SBOX[3][950272] = 0x401040; // e8000 (1, 14) = 14
  SBOX[3][1015808] = 0x80000040; // f8000 (1, 15) = 9
  SBOX[3][1048576] = 0x400040; // 100000 (2, 0) = 10
  SBOX[3][1114112] = 0x401000; // 110000 (2, 1) = 6
  SBOX[3][1179648] = 0x80000040; // 120000 (2, 2) = 9
  SBOX[3][1245184] = 0x0; // 130000 (2, 3) = 0
  SBOX[3][1310720] = 0x1040; // 140000 (2, 4) = 12
  SBOX[3][1376256] = 0x80400040; // 150000 (2, 5) = 11
  SBOX[3][1441792] = 0x80401000; // 160000 (2, 6) = 7
  SBOX[3][1507328] = 0x80001040; // 170000 (2, 7) = 13
  SBOX[3][1572864] = 0x80401040; // 180000 (2, 8) = 15
  SBOX[3][1638400] = 0x80000000; // 190000 (2, 9) = 1
  SBOX[3][1703936] = 0x80400000; // 1a0000 (2, 10) = 3
  SBOX[3][1769472] = 0x401040; // 1b0000 (2, 11) = 14
  SBOX[3][1835008] = 0x80001000; // 1c0000 (2, 12) = 5
  SBOX[3][1900544] = 0x400000; // 1d0000 (2, 13) = 2
  SBOX[3][1966080] = 0x40; // 1e0000 (2, 14) = 8
  SBOX[3][2031616] = 0x1000; // 1f0000 (2, 15) = 4
  SBOX[3][1081344] = 0x80400000; // 108000 (3, 0) = 3
  SBOX[3][1146880] = 0x80401040; // 118000 (3, 1) = 15
  SBOX[3][1212416] = 0x0; // 128000 (3, 2) = 0
  SBOX[3][1277952] = 0x401000; // 138000 (3, 3) = 6
  SBOX[3][1343488] = 0x400040; // 148000 (3, 4) = 10
  SBOX[3][1409024] = 0x80000000; // 158000 (3, 5) = 1
  SBOX[3][1474560] = 0x80001040; // 168000 (3, 6) = 13
  SBOX[3][1540096] = 0x40; // 178000 (3, 7) = 8
  SBOX[3][1605632] = 0x80000040; // 188000 (3, 8) = 9
  SBOX[3][1671168] = 0x1000; // 198000 (3, 9) = 4
  SBOX[3][1736704] = 0x80001000; // 1a8000 (3, 10) = 5
  SBOX[3][1802240] = 0x80400040; // 1b8000 (3, 11) = 11
  SBOX[3][1867776] = 0x1040; // 1c8000 (3, 12) = 12
  SBOX[3][1933312] = 0x80401000; // 1d8000 (3, 13) = 7
  SBOX[3][1998848] = 0x400000; // 1e8000 (3, 14) = 2
  SBOX[3][2064384] = 0x401040; // 1f8000 (3, 15) = 14

  SBOX[4] = new Array();
  SBOX[4][0] = 0x80; // 0 (0, 0) = 2
  SBOX[4][4096] = 0x1040000; // 1000 (0, 1) = 12
  SBOX[4][8192] = 0x40000; // 2000 (0, 2) = 4
  SBOX[4][12288] = 0x20000000; // 3000 (0, 3) = 1
  SBOX[4][16384] = 0x20040080; // 4000 (0, 4) = 7
  SBOX[4][20480] = 0x1000080; // 5000 (0, 5) = 10
  SBOX[4][24576] = 0x21000080; // 6000 (0, 6) = 11
  SBOX[4][28672] = 0x40080; // 7000 (0, 7) = 6
  SBOX[4][32768] = 0x1000000; // 8000 (0, 8) = 8
  SBOX[4][36864] = 0x20040000; // 9000 (0, 9) = 5
  SBOX[4][40960] = 0x20000080; // a000 (0, 10) = 3
  SBOX[4][45056] = 0x21040080; // b000 (0, 11) = 15
  SBOX[4][49152] = 0x21040000; // c000 (0, 12) = 13
  SBOX[4][53248] = 0x0; // d000 (0, 13) = 0
  SBOX[4][57344] = 0x1040080; // e000 (0, 14) = 14
  SBOX[4][61440] = 0x21000000; // f000 (0, 15) = 9
  SBOX[4][2048] = 0x1040080; // 800 (1, 0) = 14
  SBOX[4][6144] = 0x21000080; // 1800 (1, 1) = 11
  SBOX[4][10240] = 0x80; // 2800 (1, 2) = 2
  SBOX[4][14336] = 0x1040000; // 3800 (1, 3) = 12
  SBOX[4][18432] = 0x40000; // 4800 (1, 4) = 4
  SBOX[4][22528] = 0x20040080; // 5800 (1, 5) = 7
  SBOX[4][26624] = 0x21040000; // 6800 (1, 6) = 13
  SBOX[4][30720] = 0x20000000; // 7800 (1, 7) = 1
  SBOX[4][34816] = 0x20040000; // 8800 (1, 8) = 5
  SBOX[4][38912] = 0x0; // 9800 (1, 9) = 0
  SBOX[4][43008] = 0x21040080; // a800 (1, 10) = 15
  SBOX[4][47104] = 0x1000080; // b800 (1, 11) = 10
  SBOX[4][51200] = 0x20000080; // c800 (1, 12) = 3
  SBOX[4][55296] = 0x21000000; // d800 (1, 13) = 9
  SBOX[4][59392] = 0x1000000; // e800 (1, 14) = 8
  SBOX[4][63488] = 0x40080; // f800 (1, 15) = 6
  SBOX[4][65536] = 0x40000; // 10000 (2, 0) = 4
  SBOX[4][69632] = 0x80; // 11000 (2, 1) = 2
  SBOX[4][73728] = 0x20000000; // 12000 (2, 2) = 1
  SBOX[4][77824] = 0x21000080; // 13000 (2, 3) = 11
  SBOX[4][81920] = 0x1000080; // 14000 (2, 4) = 10
  SBOX[4][86016] = 0x21040000; // 15000 (2, 5) = 13
  SBOX[4][90112] = 0x20040080; // 16000 (2, 6) = 7
  SBOX[4][94208] = 0x1000000; // 17000 (2, 7) = 8
  SBOX[4][98304] = 0x21040080; // 18000 (2, 8) = 15
  SBOX[4][102400] = 0x21000000; // 19000 (2, 9) = 9
  SBOX[4][106496] = 0x1040000; // 1a000 (2, 10) = 12
  SBOX[4][110592] = 0x20040000; // 1b000 (2, 11) = 5
  SBOX[4][114688] = 0x40080; // 1c000 (2, 12) = 6
  SBOX[4][118784] = 0x20000080; // 1d000 (2, 13) = 3
  SBOX[4][122880] = 0x0; // 1e000 (2, 14) = 0
  SBOX[4][126976] = 0x1040080; // 1f000 (2, 15) = 14
  SBOX[4][67584] = 0x21000080; // 10800 (3, 0) = 11
  SBOX[4][71680] = 0x1000000; // 11800 (3, 1) = 8
  SBOX[4][75776] = 0x1040000; // 12800 (3, 2) = 12
  SBOX[4][79872] = 0x20040080; // 13800 (3, 3) = 7
  SBOX[4][83968] = 0x20000000; // 14800 (3, 4) = 1
  SBOX[4][88064] = 0x1040080; // 15800 (3, 5) = 14
  SBOX[4][92160] = 0x80; // 16800 (3, 6) = 2
  SBOX[4][96256] = 0x21040000; // 17800 (3, 7) = 13
  SBOX[4][100352] = 0x40080; // 18800 (3, 8) = 6
  SBOX[4][104448] = 0x21040080; // 19800 (3, 9) = 15
  SBOX[4][108544] = 0x0; // 1a800 (3, 10) = 0
  SBOX[4][112640] = 0x21000000; // 1b800 (3, 11) = 9
  SBOX[4][116736] = 0x1000080; // 1c800 (3, 12) = 10
  SBOX[4][120832] = 0x40000; // 1d800 (3, 13) = 4
  SBOX[4][124928] = 0x20040000; // 1e800 (3, 14) = 5
  SBOX[4][129024] = 0x20000080; // 1f800 (3, 15) = 3

  SBOX[5] = new Array();
  SBOX[5][0] = 0x10000008; // 0 (0, 0) = 12
  SBOX[5][256] = 0x2000; // 100 (0, 1) = 1
  SBOX[5][512] = 0x10200000; // 200 (0, 2) = 10
  SBOX[5][768] = 0x10202008; // 300 (0, 3) = 15
  SBOX[5][1024] = 0x10002000; // 400 (0, 4) = 9
  SBOX[5][1280] = 0x200000; // 500 (0, 5) = 2
  SBOX[5][1536] = 0x200008; // 600 (0, 6) = 6
  SBOX[5][1792] = 0x10000000; // 700 (0, 7) = 8
  SBOX[5][2048] = 0x0; // 800 (0, 8) = 0
  SBOX[5][2304] = 0x10002008; // 900 (0, 9) = 13
  SBOX[5][2560] = 0x202000; // a00 (0, 10) = 3
  SBOX[5][2816] = 0x8; // b00 (0, 11) = 4
  SBOX[5][3072] = 0x10200008; // c00 (0, 12) = 14
  SBOX[5][3328] = 0x202008; // d00 (0, 13) = 7
  SBOX[5][3584] = 0x2008; // e00 (0, 14) = 5
  SBOX[5][3840] = 0x10202000; // f00 (0, 15) = 11
  SBOX[5][128] = 0x10200000; // 80 (1, 0) = 10
  SBOX[5][384] = 0x10202008; // 180 (1, 1) = 15
  SBOX[5][640] = 0x8; // 280 (1, 2) = 4
  SBOX[5][896] = 0x200000; // 380 (1, 3) = 2
  SBOX[5][1152] = 0x202008; // 480 (1, 4) = 7
  SBOX[5][1408] = 0x10000008; // 580 (1, 5) = 12
  SBOX[5][1664] = 0x10002000; // 680 (1, 6) = 9
  SBOX[5][1920] = 0x2008; // 780 (1, 7) = 5
  SBOX[5][2176] = 0x200008; // 880 (1, 8) = 6
  SBOX[5][2432] = 0x2000; // 980 (1, 9) = 1
  SBOX[5][2688] = 0x10002008; // a80 (1, 10) = 13
  SBOX[5][2944] = 0x10200008; // b80 (1, 11) = 14
  SBOX[5][3200] = 0x0; // c80 (1, 12) = 0
  SBOX[5][3456] = 0x10202000; // d80 (1, 13) = 11
  SBOX[5][3712] = 0x202000; // e80 (1, 14) = 3
  SBOX[5][3968] = 0x10000000; // f80 (1, 15) = 8
  SBOX[5][4096] = 0x10002000; // 1000 (2, 0) = 9
  SBOX[5][4352] = 0x10200008; // 1100 (2, 1) = 14
  SBOX[5][4608] = 0x10202008; // 1200 (2, 2) = 15
  SBOX[5][4864] = 0x2008; // 1300 (2, 3) = 5
  SBOX[5][5120] = 0x200000; // 1400 (2, 4) = 2
  SBOX[5][5376] = 0x10000000; // 1500 (2, 5) = 8
  SBOX[5][5632] = 0x10000008; // 1600 (2, 6) = 12
  SBOX[5][5888] = 0x202000; // 1700 (2, 7) = 3
  SBOX[5][6144] = 0x202008; // 1800 (2, 8) = 7
  SBOX[5][6400] = 0x0; // 1900 (2, 9) = 0
  SBOX[5][6656] = 0x8; // 1a00 (2, 10) = 4
  SBOX[5][6912] = 0x10200000; // 1b00 (2, 11) = 10
  SBOX[5][7168] = 0x2000; // 1c00 (2, 12) = 1
  SBOX[5][7424] = 0x10002008; // 1d00 (2, 13) = 13
  SBOX[5][7680] = 0x10202000; // 1e00 (2, 14) = 11
  SBOX[5][7936] = 0x200008; // 1f00 (2, 15) = 6
  SBOX[5][4224] = 0x8; // 1080 (3, 0) = 4
  SBOX[5][4480] = 0x202000; // 1180 (3, 1) = 3
  SBOX[5][4736] = 0x200000; // 1280 (3, 2) = 2
  SBOX[5][4992] = 0x10000008; // 1380 (3, 3) = 12
  SBOX[5][5248] = 0x10002000; // 1480 (3, 4) = 9
  SBOX[5][5504] = 0x2008; // 1580 (3, 5) = 5
  SBOX[5][5760] = 0x10202008; // 1680 (3, 6) = 15
  SBOX[5][6016] = 0x10200000; // 1780 (3, 7) = 10
  SBOX[5][6272] = 0x10202000; // 1880 (3, 8) = 11
  SBOX[5][6528] = 0x10200008; // 1980 (3, 9) = 14
  SBOX[5][6784] = 0x2000; // 1a80 (3, 10) = 1
  SBOX[5][7040] = 0x202008; // 1b80 (3, 11) = 7
  SBOX[5][7296] = 0x200008; // 1c80 (3, 12) = 6
  SBOX[5][7552] = 0x0; // 1d80 (3, 13) = 0
  SBOX[5][7808] = 0x10000000; // 1e80 (3, 14) = 8
  SBOX[5][8064] = 0x10002008; // 1f80 (3, 15) = 13

  SBOX[6] = new Array();
  SBOX[6][0] = 0x100000; // 0 (0, 0) = 4
  SBOX[6][16] = 0x2000401; // 10 (0, 1) = 11
  SBOX[6][32] = 0x400; // 20 (0, 2) = 2
  SBOX[6][48] = 0x100401; // 30 (0, 3) = 14
  SBOX[6][64] = 0x2100401; // 40 (0, 4) = 15
  SBOX[6][80] = 0x0; // 50 (0, 5) = 0
  SBOX[6][96] = 0x1; // 60 (0, 6) = 8
  SBOX[6][112] = 0x2100001; // 70 (0, 7) = 13
  SBOX[6][128] = 0x2000400; // 80 (0, 8) = 3
  SBOX[6][144] = 0x100001; // 90 (0, 9) = 12
  SBOX[6][160] = 0x2000001; // a0 (0, 10) = 9
  SBOX[6][176] = 0x2100400; // b0 (0, 11) = 7
  SBOX[6][192] = 0x2100000; // c0 (0, 12) = 5
  SBOX[6][208] = 0x401; // d0 (0, 13) = 10
  SBOX[6][224] = 0x100400; // e0 (0, 14) = 6
  SBOX[6][240] = 0x2000000; // f0 (0, 15) = 1
  SBOX[6][8] = 0x2100001; // 8 (1, 0) = 13
  SBOX[6][24] = 0x0; // 18 (1, 1) = 0
  SBOX[6][40] = 0x2000401; // 28 (1, 2) = 11
  SBOX[6][56] = 0x2100400; // 38 (1, 3) = 7
  SBOX[6][72] = 0x100000; // 48 (1, 4) = 4
  SBOX[6][88] = 0x2000001; // 58 (1, 5) = 9
  SBOX[6][104] = 0x2000000; // 68 (1, 6) = 1
  SBOX[6][120] = 0x401; // 78 (1, 7) = 10
  SBOX[6][136] = 0x100401; // 88 (1, 8) = 14
  SBOX[6][152] = 0x2000400; // 98 (1, 9) = 3
  SBOX[6][168] = 0x2100000; // a8 (1, 10) = 5
  SBOX[6][184] = 0x100001; // b8 (1, 11) = 12
  SBOX[6][200] = 0x400; // c8 (1, 12) = 2
  SBOX[6][216] = 0x2100401; // d8 (1, 13) = 15
  SBOX[6][232] = 0x1; // e8 (1, 14) = 8
  SBOX[6][248] = 0x100400; // f8 (1, 15) = 6
  SBOX[6][256] = 0x2000000; // 100 (2, 0) = 1
  SBOX[6][272] = 0x100000; // 110 (2, 1) = 4
  SBOX[6][288] = 0x2000401; // 120 (2, 2) = 11
  SBOX[6][304] = 0x2100001; // 130 (2, 3) = 13
  SBOX[6][320] = 0x100001; // 140 (2, 4) = 12
  SBOX[6][336] = 0x2000400; // 150 (2, 5) = 3
  SBOX[6][352] = 0x2100400; // 160 (2, 6) = 7
  SBOX[6][368] = 0x100401; // 170 (2, 7) = 14
  SBOX[6][384] = 0x401; // 180 (2, 8) = 10
  SBOX[6][400] = 0x2100401; // 190 (2, 9) = 15
  SBOX[6][416] = 0x100400; // 1a0 (2, 10) = 6
  SBOX[6][432] = 0x1; // 1b0 (2, 11) = 8
  SBOX[6][448] = 0x0; // 1c0 (2, 12) = 0
  SBOX[6][464] = 0x2100000; // 1d0 (2, 13) = 5
  SBOX[6][480] = 0x2000001; // 1e0 (2, 14) = 9
  SBOX[6][496] = 0x400; // 1f0 (2, 15) = 2
  SBOX[6][264] = 0x100400; // 108 (3, 0) = 6
  SBOX[6][280] = 0x2000401; // 118 (3, 1) = 11
  SBOX[6][296] = 0x2100001; // 128 (3, 2) = 13
  SBOX[6][312] = 0x1; // 138 (3, 3) = 8
  SBOX[6][328] = 0x2000000; // 148 (3, 4) = 1
  SBOX[6][344] = 0x100000; // 158 (3, 5) = 4
  SBOX[6][360] = 0x401; // 168 (3, 6) = 10
  SBOX[6][376] = 0x2100400; // 178 (3, 7) = 7
  SBOX[6][392] = 0x2000001; // 188 (3, 8) = 9
  SBOX[6][408] = 0x2100000; // 198 (3, 9) = 5
  SBOX[6][424] = 0x0; // 1a8 (3, 10) = 0
  SBOX[6][440] = 0x2100401; // 1b8 (3, 11) = 15
  SBOX[6][456] = 0x100401; // 1c8 (3, 12) = 14
  SBOX[6][472] = 0x400; // 1d8 (3, 13) = 2
  SBOX[6][488] = 0x2000400; // 1e8 (3, 14) = 3
  SBOX[6][504] = 0x100001; // 1f8 (3, 15) = 12

  SBOX[7] = new Array();
  SBOX[7][0] = 0x8000820; // 0 (0, 0) = 13
  SBOX[7][1] = 0x20000; // 1 (0, 1) = 2
  SBOX[7][2] = 0x8000000; // 2 (0, 2) = 8
  SBOX[7][3] = 0x20; // 3 (0, 3) = 4
  SBOX[7][4] = 0x20020; // 4 (0, 4) = 6
  SBOX[7][5] = 0x8020820; // 5 (0, 5) = 15
  SBOX[7][6] = 0x8020800; // 6 (0, 6) = 11
  SBOX[7][7] = 0x800; // 7 (0, 7) = 1
  SBOX[7][8] = 0x8020000; // 8 (0, 8) = 10
  SBOX[7][9] = 0x8000800; // 9 (0, 9) = 9
  SBOX[7][10] = 0x20800; // a (0, 10) = 3
  SBOX[7][11] = 0x8020020; // b (0, 11) = 14
  SBOX[7][12] = 0x820; // c (0, 12) = 5
  SBOX[7][13] = 0x0; // d (0, 13) = 0
  SBOX[7][14] = 0x8000020; // e (0, 14) = 12
  SBOX[7][15] = 0x20820; // f (0, 15) = 7
  SBOX[7][-2147483648] = 0x800; // 80000000 (1, 0) = 1
  SBOX[7][-2147483647] = 0x8020820; // 80000001 (1, 1) = 15
  SBOX[7][-2147483646] = 0x8000820; // 80000002 (1, 2) = 13
  SBOX[7][-2147483645] = 0x8000000; // 80000003 (1, 3) = 8
  SBOX[7][-2147483644] = 0x8020000; // 80000004 (1, 4) = 10
  SBOX[7][-2147483643] = 0x20800; // 80000005 (1, 5) = 3
  SBOX[7][-2147483642] = 0x20820; // 80000006 (1, 6) = 7
  SBOX[7][-2147483641] = 0x20; // 80000007 (1, 7) = 4
  SBOX[7][-2147483640] = 0x8000020; // 80000008 (1, 8) = 12
  SBOX[7][-2147483639] = 0x820; // 80000009 (1, 9) = 5
  SBOX[7][-2147483638] = 0x20020; // 8000000a (1, 10) = 6
  SBOX[7][-2147483637] = 0x8020800; // 8000000b (1, 11) = 11
  SBOX[7][-2147483636] = 0x0; // 8000000c (1, 12) = 0
  SBOX[7][-2147483635] = 0x8020020; // 8000000d (1, 13) = 14
  SBOX[7][-2147483634] = 0x8000800; // 8000000e (1, 14) = 9
  SBOX[7][-2147483633] = 0x20000; // 8000000f (1, 15) = 2
  SBOX[7][16] = 0x20820; // 10 (2, 0) = 7
  SBOX[7][17] = 0x8020800; // 11 (2, 1) = 11
  SBOX[7][18] = 0x20; // 12 (2, 2) = 4
  SBOX[7][19] = 0x800; // 13 (2, 3) = 1
  SBOX[7][20] = 0x8000800; // 14 (2, 4) = 9
  SBOX[7][21] = 0x8000020; // 15 (2, 5) = 12
  SBOX[7][22] = 0x8020020; // 16 (2, 6) = 14
  SBOX[7][23] = 0x20000; // 17 (2, 7) = 2
  SBOX[7][24] = 0x0; // 18 (2, 8) = 0
  SBOX[7][25] = 0x20020; // 19 (2, 9) = 6
  SBOX[7][26] = 0x8020000; // 1a (2, 10) = 10
  SBOX[7][27] = 0x8000820; // 1b (2, 11) = 13
  SBOX[7][28] = 0x8020820; // 1c (2, 12) = 15
  SBOX[7][29] = 0x20800; // 1d (2, 13) = 3
  SBOX[7][30] = 0x820; // 1e (2, 14) = 5
  SBOX[7][31] = 0x8000000; // 1f (2, 15) = 8
  SBOX[7][-2147483632] = 0x20000; // 80000010 (3, 0) = 2
  SBOX[7][-2147483631] = 0x800; // 80000011 (3, 1) = 1
  SBOX[7][-2147483630] = 0x8020020; // 80000012 (3, 2) = 14
  SBOX[7][-2147483629] = 0x20820; // 80000013 (3, 3) = 7
  SBOX[7][-2147483628] = 0x20; // 80000014 (3, 4) = 4
  SBOX[7][-2147483627] = 0x8020000; // 80000015 (3, 5) = 10
  SBOX[7][-2147483626] = 0x8000000; // 80000016 (3, 6) = 8
  SBOX[7][-2147483625] = 0x8000820; // 80000017 (3, 7) = 13
  SBOX[7][-2147483624] = 0x8020820; // 80000018 (3, 8) = 15
  SBOX[7][-2147483623] = 0x8000020; // 80000019 (3, 9) = 12
  SBOX[7][-2147483622] = 0x8000800; // 8000001a (3, 10) = 9
  SBOX[7][-2147483621] = 0x0; // 8000001b (3, 11) = 0
  SBOX[7][-2147483620] = 0x20800; // 8000001c (3, 12) = 3
  SBOX[7][-2147483619] = 0x820; // 8000001d (3, 13) = 5
  SBOX[7][-2147483618] = 0x20020; // 8000001e (3, 14) = 6
  SBOX[7][-2147483617] = 0x8020800; // 8000001f (3, 15) = 11

  State.prototype._exchangeLR = function (v, m) {
    var t = (this.lhs >> v ^ this.rhs) & m;
    this.rhs ^= t;
    this.lhs ^= t << v;
  };

  State.prototype._exchangeRL = function (v, m) {
    var t = (this.rhs >> v ^ this.lhs) & m;
    this.lhs ^= t;
    this.rhs ^= t << v;
  };

  /**
      * Perform the initial permutation of the input to create the starting state
      * of the algorithm. The initial permutation maps each consecutive bit of
      * the input into a different byte of the state.
      *
      * <pre>
      * The initial permutation is defined to be:
      *
      *      58    50   42    34    26   18    10    2
      *      60    52   44    36    28   20    12    4
      *      62    54   46    38    30   22    14    6
      *      64    56   48    40    32   24    16    8
      *      57    49   41    33    25   17     9    1
      *      59    51   43    35    27   19    11    3
      *      61    53   45    37    29   21    13    5
      *      63    55   47    39    31   23    15    7
      * </pre>
      *
      *
      * @param message
      *            The message as an array of unsigned bytes.
      * @param offset
      *            The offset into the message that the current 64-bit block
      *            begins.
      * @returns the initial engine state
      */
  State.prototype.initialPerm = function (message, offset) {
    var input = message.slice(offset, offset + 8);

    this.lhs = (input[0] << 24) + (input[1] << 16) + (input[2] << 8) +
    input[3];
    this.rhs = (input[4] << 24) + (input[5] << 16) + (input[6] << 8) +
    input[7];

    this._exchangeLR(4, 0x0f0f0f0f);
    this._exchangeLR(16, 0x0000ffff);
    this._exchangeRL(2, 0x33333333);
    this._exchangeRL(8, 0x00ff00ff);
    this._exchangeLR(1, 0x55555555);
  };

  /**
      * Perform one round of the DES algorithm using the given key. A round is
      * defined as:
      *
      * <pre>
      * L&amp;rsquo = R
      * R&amp;rsquo = L &circ; f(R, k)
      * </pre>
      *
      * where f consists of expanding, XORing with the key and contracting back
      * with the SBOXes.
      *
      * Note that the final round is defined slightly differently as:
      *
      * <pre>
      * L&amp;rsquo = L &circ; f(R, k)
      * R&amp;rsquo = R
      * </pre>
      *
      * Therefore in the final round this function produces LHS and RHS the wrong
      * way around.
      *
      * @param k
      *            the key
      */
  State.prototype.round = function (k) {
    var r = this.rhs,l = this.lhs;
    var f = 0;
    for (var i = 0; i < 8; i++) {
      var v = (r ^ k[i]) & State.SBOX_MASK[i];
      f += State.SBOX[i][v];
    }

    this.lhs = r;
    this.rhs = l ^ f;
  };

  /**
      * Apply the inverse of the initial permutation.
      *
      * <pre>
      * The inverse is defined to be:
      *
      *      40     8   48    16    56   24    64   32
      *      39     7   47    15    55   23    63   31
      *      38     6   46    14    54   22    62   30
      *      37     5   45    13    53   21    61   29
      *      36     4   44    12    52   20    60   28
      *      35     3   43    11    51   19    59   27
      *      34     2   42    10    50   18    58   26
      *      33     1   41     9    49   17    57   25
      * </pre>
      *
      * @param cipherText
      * @param offset
      */
  State.prototype.finalPerm = function (cipherText, offset) {
    var t = this.lhs;
    this.lhs = this.rhs;
    this.rhs = t;

    this._exchangeLR(1, 0x55555555);
    this._exchangeRL(8, 0x00ff00ff);
    this._exchangeRL(2, 0x33333333);
    this._exchangeLR(16, 0x0000ffff);
    this._exchangeLR(4, 0x0f0f0f0f);

    cipherText[offset] = this.lhs >> 24 & 0xff;
    cipherText[offset + 1] = this.lhs >> 16 & 0xff;
    cipherText[offset + 2] = this.lhs >> 8 & 0xff;
    cipherText[offset + 3] = this.lhs & 0xff;
    cipherText[offset + 4] = this.rhs >> 24 & 0xff;
    cipherText[offset + 5] = this.rhs >> 16 & 0xff;
    cipherText[offset + 6] = this.rhs >> 8 & 0xff;
    cipherText[offset + 7] = this.rhs & 0xff;
  };

  /**
      * DES cipher
      */
  var DES = C.DES = {
    _blocksize: 2,

    _keyschedule: null,

    _state: new State(),

    _init: function _init(k) {
      this._keyschedule = new KeySchedule(k);
    },

    encrypt: function encrypt(message, password, options) {

      options = options || {};

      // Determine mode
      var mode = options.mode || new C.mode.OFB();

      // Allow mode to override options
      if (mode.fixOptions)
      mode.fixOptions(options);

      var
      // Convert to bytes if message is a string
      m = message.constructor == String ? UTF8.stringToBytes(message) :
      message,

      // Generate random IV
      iv = options.iv || util.randomBytes(8),

      // Generate key
      k = password.constructor == String ?
      // Derive key from passphrase
      C.PBKDF2(password, iv, 8, {
        asBytes: true }) :

      // else, assume byte array representing cryptographic key
      password;

      // Create key schedule
      this._keyschedule = new KeySchedule(k);

      // Encrypt
      mode.encrypt(DES, m, iv);

      // Return ciphertext
      m = options.iv ? m : iv.concat(m);
      return options && options.asBytes ? m : util.bytesToBase64(m);
    },

    _encryptblock: function _encryptblock(message, offset) {
      this._state.initialPerm(message, offset);
      for (var i = 0; i <= 15; i++) {
        this._state.round(this._keyschedule.getKey(i));
      }
      this._state.finalPerm(message, offset);
    },

    decrypt: function decrypt(ciphertext, password, options) {
      options = options || {};

      // Determine mode
      var mode = options.mode || new C.mode.OFB();

      // Allow mode to override options
      if (mode.fixOptions)
      mode.fixOptions(options);

      var

      // Convert to bytes if ciphertext is a string
      c = ciphertext.constructor == String ? util.
      base64ToBytes(ciphertext) : ciphertext,

      // Separate IV and message
      iv = options.iv || c.splice(0, 8),

      // Generate key
      k = password.constructor == String ?
      // Derive key from passphrase
      C.PBKDF2(password, iv, 32, {
        asBytes: true }) :

      // else, assume byte array representing cryptographic key
      password;

      // Create key schedule
      this._keyschedule = new KeySchedule(k);

      mode.decrypt(DES, c, iv);

      // Return plaintext
      return options && options.asBytes ? c : UTF8.bytesToString(c);
    },

    _decryptblock: function _decryptblock(message, offset) {
      this._state.initialPerm(message, offset);
      for (var i = 15; i >= 0; i--) {
        this._state.round(this._keyschedule.getKey(i));
      }
      this._state.finalPerm(message, offset);
    } };


})();
/* eslint-disable */

/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 30:
/*!************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib/HMAC.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-disable */
(function () {

  var C = typeof window === 'undefined' ? __webpack_require__(/*! ./Crypto */ 24).Crypto : window.Crypto;

  // Shortcuts
  var util = C.util,
  charenc = C.charenc,
  UTF8 = charenc.UTF8,
  Binary = charenc.Binary;

  C.HMAC = function (hasher, message, key, options) {

    // Convert to byte arrays
    if (message.constructor == String) message = UTF8.stringToBytes(message);
    if (key.constructor == String) key = UTF8.stringToBytes(key);
    /* else, assume byte arrays already */

    // Allow arbitrary length keys
    if (key.length > hasher._blocksize * 4)
    key = hasher(key, { asBytes: true });

    // XOR keys with pad constants
    var okey = key.slice(0),
    ikey = key.slice(0);
    for (var i = 0; i < hasher._blocksize * 4; i++) {
      okey[i] ^= 0x5C;
      ikey[i] ^= 0x36;
    }

    var hmacbytes = hasher(okey.concat(hasher(ikey.concat(message), { asBytes: true })), { asBytes: true });

    return options && options.asBytes ? hmacbytes :
    options && options.asString ? Binary.bytesToString(hmacbytes) :
    util.bytesToHex(hmacbytes);

  };

})();
/* eslint-disable */

/***/ }),

/***/ 31:
/*!*************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib/MARC4.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-disable */
(function () {

  var C = typeof window === 'undefined' ? __webpack_require__(/*! ./Crypto */ 24).Crypto : window.Crypto;

  // Shortcuts
  var util = C.util,
  charenc = C.charenc,
  UTF8 = charenc.UTF8,
  Binary = charenc.Binary;

  var MARC4 = C.MARC4 = {

    /**
                           * Public API
                           */

    encrypt: function encrypt(message, password) {

      var

      // Convert to bytes
      m = UTF8.stringToBytes(message),

      // Generate random IV
      iv = util.randomBytes(16),

      // Generate key
      k = password.constructor == String ?
      // Derive key from passphrase
      C.PBKDF2(password, iv, 32, { asBytes: true }) :
      // else, assume byte array representing cryptographic key
      password;

      // Encrypt
      MARC4._marc4(m, k, 1536);

      // Return ciphertext
      return util.bytesToBase64(iv.concat(m));

    },

    decrypt: function decrypt(ciphertext, password) {

      var

      // Convert to bytes
      c = util.base64ToBytes(ciphertext),

      // Separate IV and message
      iv = c.splice(0, 16),

      // Generate key
      k = password.constructor == String ?
      // Derive key from passphrase
      C.PBKDF2(password, iv, 32, { asBytes: true }) :
      // else, assume byte array representing cryptographic key
      password;

      // Decrypt
      MARC4._marc4(c, k, 1536);

      // Return plaintext
      return UTF8.bytesToString(c);

    },


    /**
        * Internal methods
        */

    // The core
    _marc4: function _marc4(m, k, drop) {

      // State variables
      var i, j, s, temp;

      // Key setup
      for (i = 0, s = []; i < 256; i++) {s[i] = i;}
      for (i = 0, j = 0; i < 256; i++) {

        j = (j + s[i] + k[i % k.length]) % 256;

        // Swap
        temp = s[i];
        s[i] = s[j];
        s[j] = temp;

      }

      // Clear counters
      i = j = 0;

      // Encryption
      for (var k = -drop; k < m.length; k++) {

        i = (i + 1) % 256;
        j = (j + s[i]) % 256;

        // Swap
        temp = s[i];
        s[i] = s[j];
        s[j] = temp;

        // Stop here if we're still dropping keystream
        if (k < 0) continue;

        // Encrypt
        m[k] ^= s[(s[i] + s[j]) % 256];

      }

    } };



})();
/* eslint-disable */

/***/ }),

/***/ 32:
/*!***********************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib/MD5.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-disable */
(function () {

  var C = typeof window === 'undefined' ? __webpack_require__(/*! ./Crypto */ 24).Crypto : window.Crypto;

  // Shortcuts
  var util = C.util,
  charenc = C.charenc,
  UTF8 = charenc.UTF8,
  Binary = charenc.Binary;

  // Public API
  var MD5 = C.MD5 = function (message, options) {
    var digestbytes = util.wordsToBytes(MD5._md5(message));
    return options && options.asBytes ? digestbytes :
    options && options.asString ? Binary.bytesToString(digestbytes) :
    util.bytesToHex(digestbytes);
  };

  // The core
  MD5._md5 = function (message) {

    // Convert to byte array
    if (message.constructor == String) message = UTF8.stringToBytes(message);
    /* else, assume byte array already */

    var m = util.bytesToWords(message),
    l = message.length * 8,
    a = 1732584193,
    b = -271733879,
    c = -1732584194,
    d = 271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = (m[i] << 8 | m[i] >>> 24) & 0x00FF00FF |
      (m[i] << 24 | m[i] >>> 8) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << l % 32;
    m[(l + 64 >>> 9 << 4) + 14] = l;

    // Method shortcuts
    var FF = MD5._ff,
    GG = MD5._gg,
    HH = MD5._hh,
    II = MD5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
      bb = b,
      cc = c,
      dd = d;

      a = FF(a, b, c, d, m[i + 0], 7, -680876936);
      d = FF(d, a, b, c, m[i + 1], 12, -389564586);
      c = FF(c, d, a, b, m[i + 2], 17, 606105819);
      b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i + 4], 7, -176418897);
      d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
      c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i + 7], 22, -45705983);
      a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
      d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i + 10], 17, -42063);
      b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
      a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
      d = FF(d, a, b, c, m[i + 13], 12, -40341101);
      c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
      b = FF(b, c, d, a, m[i + 15], 22, 1236535329);

      a = GG(a, b, c, d, m[i + 1], 5, -165796510);
      d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
      c = GG(c, d, a, b, m[i + 11], 14, 643717713);
      b = GG(b, c, d, a, m[i + 0], 20, -373897302);
      a = GG(a, b, c, d, m[i + 5], 5, -701558691);
      d = GG(d, a, b, c, m[i + 10], 9, 38016083);
      c = GG(c, d, a, b, m[i + 15], 14, -660478335);
      b = GG(b, c, d, a, m[i + 4], 20, -405537848);
      a = GG(a, b, c, d, m[i + 9], 5, 568446438);
      d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
      c = GG(c, d, a, b, m[i + 3], 14, -187363961);
      b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
      a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
      d = GG(d, a, b, c, m[i + 2], 9, -51403784);
      c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
      b = GG(b, c, d, a, m[i + 12], 20, -1926607734);

      a = HH(a, b, c, d, m[i + 5], 4, -378558);
      d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
      b = HH(b, c, d, a, m[i + 14], 23, -35309556);
      a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
      d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
      c = HH(c, d, a, b, m[i + 7], 16, -155497632);
      b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
      a = HH(a, b, c, d, m[i + 13], 4, 681279174);
      d = HH(d, a, b, c, m[i + 0], 11, -358537222);
      c = HH(c, d, a, b, m[i + 3], 16, -722521979);
      b = HH(b, c, d, a, m[i + 6], 23, 76029189);
      a = HH(a, b, c, d, m[i + 9], 4, -640364487);
      d = HH(d, a, b, c, m[i + 12], 11, -421815835);
      c = HH(c, d, a, b, m[i + 15], 16, 530742520);
      b = HH(b, c, d, a, m[i + 2], 23, -995338651);

      a = II(a, b, c, d, m[i + 0], 6, -198630844);
      d = II(d, a, b, c, m[i + 7], 10, 1126891415);
      c = II(c, d, a, b, m[i + 14], 15, -1416354905);
      b = II(b, c, d, a, m[i + 5], 21, -57434055);
      a = II(a, b, c, d, m[i + 12], 6, 1700485571);
      d = II(d, a, b, c, m[i + 3], 10, -1894986606);
      c = II(c, d, a, b, m[i + 10], 15, -1051523);
      b = II(b, c, d, a, m[i + 1], 21, -2054922799);
      a = II(a, b, c, d, m[i + 8], 6, 1873313359);
      d = II(d, a, b, c, m[i + 15], 10, -30611744);
      c = II(c, d, a, b, m[i + 6], 15, -1560198380);
      b = II(b, c, d, a, m[i + 13], 21, 1309151649);
      a = II(a, b, c, d, m[i + 4], 6, -145523070);
      d = II(d, a, b, c, m[i + 11], 10, -1120210379);
      c = II(c, d, a, b, m[i + 2], 15, 718787259);
      b = II(b, c, d, a, m[i + 9], 21, -343485551);

      a = a + aa >>> 0;
      b = b + bb >>> 0;
      c = c + cc >>> 0;
      d = d + dd >>> 0;

    }

    return util.endian([a, b, c, d]);

  };

  // Auxiliary functions
  MD5._ff = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return (n << s | n >>> 32 - s) + b;
  };
  MD5._gg = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return (n << s | n >>> 32 - s) + b;
  };
  MD5._hh = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return (n << s | n >>> 32 - s) + b;
  };
  MD5._ii = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return (n << s | n >>> 32 - s) + b;
  };

  // Package private blocksize
  MD5._blocksize = 16;

  MD5._digestsize = 16;

})();
/* eslint-disable */

/***/ }),

/***/ 33:
/*!**************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib/PBKDF2.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-disable */
(function () {

  var C = typeof window === 'undefined' ? __webpack_require__(/*! ./Crypto */ 24).Crypto : window.Crypto;

  // Shortcuts
  var util = C.util,
  charenc = C.charenc,
  UTF8 = charenc.UTF8,
  Binary = charenc.Binary;

  C.PBKDF2 = function (password, salt, keylen, options) {

    // Convert to byte arrays
    if (password.constructor == String) password = UTF8.stringToBytes(password);
    if (salt.constructor == String) salt = UTF8.stringToBytes(salt);
    /* else, assume byte arrays already */

    // Defaults
    var hasher = options && options.hasher || C.SHA1,
    iterations = options && options.iterations || 1;

    // Pseudo-random function
    function PRF(password, salt) {
      return C.HMAC(hasher, salt, password, { asBytes: true });
    }

    // Generate key
    var derivedKeyBytes = [],
    blockindex = 1;
    while (derivedKeyBytes.length < keylen) {
      var block = PRF(password, salt.concat(util.wordsToBytes([blockindex])));
      for (var u = block, i = 1; i < iterations; i++) {
        u = PRF(password, u);
        for (var j = 0; j < block.length; j++) {block[j] ^= u[j];}
      }
      derivedKeyBytes = derivedKeyBytes.concat(block);
      blockindex++;
    }

    // Truncate excess bytes
    derivedKeyBytes.length = keylen;

    return options && options.asBytes ? derivedKeyBytes :
    options && options.asString ? Binary.bytesToString(derivedKeyBytes) :
    util.bytesToHex(derivedKeyBytes);

  };

})();
/* eslint-disable */

/***/ }),

/***/ 34:
/*!*******************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib/PBKDF2Async.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) { /* eslint-disable */
(function () {

  var C = typeof window === 'undefined' ? __webpack_require__(/*! ./Crypto */ 24).Crypto : window.Crypto;

  // Shortcuts
  var util = C.util,
  charenc = C.charenc,
  UTF8 = charenc.UTF8,
  Binary = charenc.Binary;

  if (!C.nextTick) {
    // node.js has setTime out but prefer process.nextTick
    if (typeof process != 'undefined' && typeof process.nextTick !== 'undefined') {
      C.nextTick = process.nextTick;
    } else if (typeof setTimeout !== 'undefined') {
      C.nextTick = function (callback) {
        setTimeout(callback, 0);
      };
    }
  }

  C.PBKDF2Async = function (password, salt, keylen, callback, options) {

    // Convert to byte arrays
    if (password.constructor == String) password = UTF8.stringToBytes(password);
    if (salt.constructor == String) salt = UTF8.stringToBytes(salt);
    /* else, assume byte arrays already */

    // Defaults
    var hasher = options && options.hasher || C.SHA1,
    iterations = options && options.iterations || 1;

    // Progress callback option
    var progressChangeHandler = options && options.onProgressChange;
    var totalIterations = Math.ceil(keylen / hasher._digestsize) * iterations;
    function fireProgressChange(currentIteration) {
      if (progressChangeHandler) {
        var iterationsSoFar = derivedKeyBytes.length / hasher._digestsize * iterations + currentIteration;
        setTimeout(function () {
          progressChangeHandler(Math.round(iterationsSoFar / totalIterations * 100));
        }, 0);
      }
    }

    // Pseudo-random function
    function PRF(password, salt) {
      return C.HMAC(hasher, salt, password, { asBytes: true });
    }

    var nextTick = C.nextTick;

    // Generate key
    var derivedKeyBytes = [],
    blockindex = 1;

    var _outer, _inner;
    nextTick(_outer = function outer() {
      if (derivedKeyBytes.length < keylen) {
        var block = PRF(password, salt.concat(util.wordsToBytes([blockindex])));
        fireProgressChange(1);

        var u = block,i = 1;
        nextTick(_inner = function inner() {
          if (i < iterations) {
            u = PRF(password, u);
            for (var j = 0; j < block.length; j++) {block[j] ^= u[j];}
            i++;
            fireProgressChange(i);

            nextTick(_inner);
          } else {
            derivedKeyBytes = derivedKeyBytes.concat(block);
            blockindex++;
            nextTick(_outer);
          }
        });
      } else {
        // Truncate excess bytes
        derivedKeyBytes.length = keylen;
        callback(
        options && options.asBytes ? derivedKeyBytes :
        options && options.asString ? Binary.bytesToString(derivedKeyBytes) :
        util.bytesToHex(derivedKeyBytes));
      }
    });
  };

})();
/* eslint-disable */
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/node-libs-browser/mock/process.js */ 35)))

/***/ }),

/***/ 35:
/*!********************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/process.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.nextTick = function nextTick(fn) {
	setTimeout(fn, 0);
};

exports.platform = exports.arch = 
exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.env = {};
exports.argv = [];

exports.binding = function (name) {
	throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    exports.cwd = function () { return cwd };
    exports.chdir = function (dir) {
        if (!path) path = __webpack_require__(/*! path */ 36);
        cwd = path.resolve(dir, cwd);
    };
})();

exports.exit = exports.kill = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};


/***/ }),

/***/ 36:
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
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

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/mock/process.js */ 35)))

/***/ }),

/***/ 37:
/*!**************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib/Rabbit.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-disable */
(function () {

  var C = typeof window === 'undefined' ? __webpack_require__(/*! ./Crypto */ 24).Crypto : window.Crypto;

  // Shortcuts
  var util = C.util,
  charenc = C.charenc,
  UTF8 = charenc.UTF8,
  Binary = charenc.Binary;

  // Inner state
  var x = [],
  c = [],
  b;

  var Rabbit = C.Rabbit = {

    /**
                             * Public API
                             */

    encrypt: function encrypt(message, password) {

      var

      // Convert to bytes
      m = UTF8.stringToBytes(message),

      // Generate random IV
      iv = util.randomBytes(8),

      // Generate key
      k = password.constructor == String ?
      // Derive key from passphrase
      C.PBKDF2(password, iv, 32, { asBytes: true }) :
      // else, assume byte array representing cryptographic key
      password;

      // Encrypt
      Rabbit._rabbit(m, k, util.bytesToWords(iv));

      // Return ciphertext
      return util.bytesToBase64(iv.concat(m));

    },

    decrypt: function decrypt(ciphertext, password) {

      var

      // Convert to bytes
      c = util.base64ToBytes(ciphertext),

      // Separate IV and message
      iv = c.splice(0, 8),

      // Generate key
      k = password.constructor == String ?
      // Derive key from passphrase
      C.PBKDF2(password, iv, 32, { asBytes: true }) :
      // else, assume byte array representing cryptographic key
      password;

      // Decrypt
      Rabbit._rabbit(c, k, util.bytesToWords(iv));

      // Return plaintext
      return UTF8.bytesToString(c);

    },


    /**
        * Internal methods
        */

    // Encryption/decryption scheme
    _rabbit: function _rabbit(m, k, iv) {

      Rabbit._keysetup(k);
      if (iv) Rabbit._ivsetup(iv);

      for (var s = [], i = 0; i < m.length; i++) {

        if (i % 16 == 0) {

          // Iterate the system
          Rabbit._nextstate();

          // Generate 16 bytes of pseudo-random data
          s[0] = x[0] ^ x[5] >>> 16 ^ x[3] << 16;
          s[1] = x[2] ^ x[7] >>> 16 ^ x[5] << 16;
          s[2] = x[4] ^ x[1] >>> 16 ^ x[7] << 16;
          s[3] = x[6] ^ x[3] >>> 16 ^ x[1] << 16;

          // Swap endian
          for (var j = 0; j < 4; j++) {
            s[j] = (s[j] << 8 | s[j] >>> 24) & 0x00FF00FF |
            (s[j] << 24 | s[j] >>> 8) & 0xFF00FF00;
          }

          // Convert words to bytes
          for (var b = 120; b >= 0; b -= 8) {
            s[b / 8] = s[b >>> 5] >>> 24 - b % 32 & 0xFF;}

        }

        m[i] ^= s[i % 16];

      }

    },

    // Key setup scheme
    _keysetup: function _keysetup(k) {

      // Generate initial state values
      x[0] = k[0];
      x[2] = k[1];
      x[4] = k[2];
      x[6] = k[3];
      x[1] = k[3] << 16 | k[2] >>> 16;
      x[3] = k[0] << 16 | k[3] >>> 16;
      x[5] = k[1] << 16 | k[0] >>> 16;
      x[7] = k[2] << 16 | k[1] >>> 16;

      // Generate initial counter values
      c[0] = util.rotl(k[2], 16);
      c[2] = util.rotl(k[3], 16);
      c[4] = util.rotl(k[0], 16);
      c[6] = util.rotl(k[1], 16);
      c[1] = k[0] & 0xFFFF0000 | k[1] & 0xFFFF;
      c[3] = k[1] & 0xFFFF0000 | k[2] & 0xFFFF;
      c[5] = k[2] & 0xFFFF0000 | k[3] & 0xFFFF;
      c[7] = k[3] & 0xFFFF0000 | k[0] & 0xFFFF;

      // Clear carry bit
      b = 0;

      // Iterate the system four times
      for (var i = 0; i < 4; i++) {Rabbit._nextstate();}

      // Modify the counters
      for (var i = 0; i < 8; i++) {c[i] ^= x[i + 4 & 7];}

    },

    // IV setup scheme
    _ivsetup: function _ivsetup(iv) {

      // Generate four subvectors
      var i0 = util.endian(iv[0]),
      i2 = util.endian(iv[1]),
      i1 = i0 >>> 16 | i2 & 0xFFFF0000,
      i3 = i2 << 16 | i0 & 0x0000FFFF;

      // Modify counter values
      c[0] ^= i0;
      c[1] ^= i1;
      c[2] ^= i2;
      c[3] ^= i3;
      c[4] ^= i0;
      c[5] ^= i1;
      c[6] ^= i2;
      c[7] ^= i3;

      // Iterate the system four times
      for (var i = 0; i < 4; i++) {Rabbit._nextstate();}

    },

    // Next-state function
    _nextstate: function _nextstate() {

      // Save old counter values
      for (var c_old = [], i = 0; i < 8; i++) {c_old[i] = c[i];}

      // Calculate new counter values
      c[0] = c[0] + 0x4D34D34D + b >>> 0;
      c[1] = c[1] + 0xD34D34D3 + (c[0] >>> 0 < c_old[0] >>> 0 ? 1 : 0) >>> 0;
      c[2] = c[2] + 0x34D34D34 + (c[1] >>> 0 < c_old[1] >>> 0 ? 1 : 0) >>> 0;
      c[3] = c[3] + 0x4D34D34D + (c[2] >>> 0 < c_old[2] >>> 0 ? 1 : 0) >>> 0;
      c[4] = c[4] + 0xD34D34D3 + (c[3] >>> 0 < c_old[3] >>> 0 ? 1 : 0) >>> 0;
      c[5] = c[5] + 0x34D34D34 + (c[4] >>> 0 < c_old[4] >>> 0 ? 1 : 0) >>> 0;
      c[6] = c[6] + 0x4D34D34D + (c[5] >>> 0 < c_old[5] >>> 0 ? 1 : 0) >>> 0;
      c[7] = c[7] + 0xD34D34D3 + (c[6] >>> 0 < c_old[6] >>> 0 ? 1 : 0) >>> 0;
      b = c[7] >>> 0 < c_old[7] >>> 0 ? 1 : 0;

      // Calculate the g-values
      for (var g = [], i = 0; i < 8; i++) {

        var gx = x[i] + c[i] >>> 0;

        // Construct high and low argument for squaring
        var ga = gx & 0xFFFF,
        gb = gx >>> 16;

        // Calculate high and low result of squaring
        var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb,
        gl = ((gx & 0xFFFF0000) * gx >>> 0) + ((gx & 0x0000FFFF) * gx >>> 0) >>> 0;

        // High XOR low
        g[i] = gh ^ gl;

      }

      // Calculate new state values
      x[0] = g[0] + (g[7] << 16 | g[7] >>> 16) + (g[6] << 16 | g[6] >>> 16);
      x[1] = g[1] + (g[0] << 8 | g[0] >>> 24) + g[7];
      x[2] = g[2] + (g[1] << 16 | g[1] >>> 16) + (g[0] << 16 | g[0] >>> 16);
      x[3] = g[3] + (g[2] << 8 | g[2] >>> 24) + g[1];
      x[4] = g[4] + (g[3] << 16 | g[3] >>> 16) + (g[2] << 16 | g[2] >>> 16);
      x[5] = g[5] + (g[4] << 8 | g[4] >>> 24) + g[3];
      x[6] = g[6] + (g[5] << 16 | g[5] >>> 16) + (g[4] << 16 | g[4] >>> 16);
      x[7] = g[7] + (g[6] << 8 | g[6] >>> 24) + g[5];

    } };



})();
/* eslint-disable */

/***/ }),

/***/ 38:
/*!************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib/SHA1.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-disable */
(function () {

  var C = typeof window === 'undefined' ? __webpack_require__(/*! ./Crypto */ 24).Crypto : window.Crypto;

  // Shortcuts
  var util = C.util,
  charenc = C.charenc,
  UTF8 = charenc.UTF8,
  Binary = charenc.Binary;

  // Public API
  var SHA1 = C.SHA1 = function (message, options) {
    var digestbytes = util.wordsToBytes(SHA1._sha1(message));
    return options && options.asBytes ? digestbytes :
    options && options.asString ? Binary.bytesToString(digestbytes) :
    util.bytesToHex(digestbytes);
  };

  // The core
  SHA1._sha1 = function (message) {

    // Convert to byte array
    if (message.constructor == String) message = UTF8.stringToBytes(message);
    /* else, assume byte array already */

    var m = util.bytesToWords(message),
    l = message.length * 8,
    w = [],
    H0 = 1732584193,
    H1 = -271733879,
    H2 = -1732584194,
    H3 = 271733878,
    H4 = -1009589776;

    // Padding
    m[l >> 5] |= 0x80 << 24 - l % 32;
    m[(l + 64 >>> 9 << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16) {

      var a = H0,
      b = H1,
      c = H2,
      d = H3,
      e = H4;

      for (var j = 0; j < 80; j++) {

        if (j < 16) w[j] = m[i + j];else
        {
          var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
          w[j] = n << 1 | n >>> 31;
        }

        var t = (H0 << 5 | H0 >>> 27) + H4 + (w[j] >>> 0) + (
        j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
        j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
        j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
        (H1 ^ H2 ^ H3) - 899497514);

        H4 = H3;
        H3 = H2;
        H2 = H1 << 30 | H1 >>> 2;
        H1 = H0;
        H0 = t;

      }

      H0 += a;
      H1 += b;
      H2 += c;
      H3 += d;
      H4 += e;

    }

    return [H0, H1, H2, H3, H4];

  };

  // Package private blocksize
  SHA1._blocksize = 16;

  SHA1._digestsize = 20;

})();
/* eslint-disable */

/***/ }),

/***/ 39:
/*!**************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/cryptojs/lib/SHA256.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-disable */
(function () {

  var C = typeof window === 'undefined' ? __webpack_require__(/*! ./Crypto */ 24).Crypto : window.Crypto;

  // Shortcuts
  var util = C.util,
  charenc = C.charenc,
  UTF8 = charenc.UTF8,
  Binary = charenc.Binary;

  // Constants
  var K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
  0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
  0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
  0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
  0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
  0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
  0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
  0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
  0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
  0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
  0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
  0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
  0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
  0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
  0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
  0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];

  // Public API
  var SHA256 = C.SHA256 = function (message, options) {
    var digestbytes = util.wordsToBytes(SHA256._sha256(message));
    return options && options.asBytes ? digestbytes :
    options && options.asString ? Binary.bytesToString(digestbytes) :
    util.bytesToHex(digestbytes);
  };

  // The core
  SHA256._sha256 = function (message) {

    // Convert to byte array
    if (message.constructor == String) message = UTF8.stringToBytes(message);
    /* else, assume byte array already */

    var m = util.bytesToWords(message),
    l = message.length * 8,
    H = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
    0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19],
    w = [],
    a,b,c,d,e,f,g,h,i,j,
    t1,t2;

    // Padding
    m[l >> 5] |= 0x80 << 24 - l % 32;
    m[(l + 64 >> 9 << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16) {

      a = H[0];
      b = H[1];
      c = H[2];
      d = H[3];
      e = H[4];
      f = H[5];
      g = H[6];
      h = H[7];

      for (var j = 0; j < 64; j++) {

        if (j < 16) w[j] = m[j + i];else
        {

          var gamma0x = w[j - 15],
          gamma1x = w[j - 2],
          gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (
          gamma0x << 14 | gamma0x >>> 18) ^
          gamma0x >>> 3,
          gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (
          gamma1x << 13 | gamma1x >>> 19) ^
          gamma1x >>> 10;

          w[j] = gamma0 + (w[j - 7] >>> 0) +
          gamma1 + (w[j - 16] >>> 0);

        }

        var ch = e & f ^ ~e & g,
        maj = a & b ^ a & c ^ b & c,
        sigma0 = (a << 30 | a >>> 2) ^ (
        a << 19 | a >>> 13) ^ (
        a << 10 | a >>> 22),
        sigma1 = (e << 26 | e >>> 6) ^ (
        e << 21 | e >>> 11) ^ (
        e << 7 | e >>> 25);


        t1 = (h >>> 0) + sigma1 + ch + K[j] + (w[j] >>> 0);
        t2 = sigma0 + maj;

        h = g;
        g = f;
        f = e;
        e = d + t1 >>> 0;
        d = c;
        c = b;
        b = a;
        a = t1 + t2 >>> 0;

      }

      H[0] += a;
      H[1] += b;
      H[2] += c;
      H[3] += d;
      H[4] += e;
      H[5] += f;
      H[6] += g;
      H[7] += h;

    }

    return H;

  };

  // Package private blocksize
  SHA256._blocksize = 16;

  SHA256._digestsize = 32;

})();
/* eslint-disable */

/***/ }),

/***/ 4:
/*!********************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/pages.json ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 40:
/*!******************************************!*\
  !*** ./node_modules/vuex/dist/logger.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
	 true ? module.exports = factory() :
	undefined;
}(this, (function () { 'use strict';

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
function find (list, f) {
  return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
function deepCopy (obj, cache) {
  if ( cache === void 0 ) cache = [];

  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  var hit = find(cache, function (c) { return c.original === obj; });
  if (hit) {
    return hit.copy
  }

  var copy = Array.isArray(obj) ? [] : {};
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy: copy
  });

  Object.keys(obj).forEach(function (key) {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy
}

/**
 * forEach for object
 */

// Credits: borrowed code from fcomb/redux-logger

function createLogger (ref) {
  if ( ref === void 0 ) ref = {};
  var collapsed = ref.collapsed; if ( collapsed === void 0 ) collapsed = true;
  var filter = ref.filter; if ( filter === void 0 ) filter = function (mutation, stateBefore, stateAfter) { return true; };
  var transformer = ref.transformer; if ( transformer === void 0 ) transformer = function (state) { return state; };
  var mutationTransformer = ref.mutationTransformer; if ( mutationTransformer === void 0 ) mutationTransformer = function (mut) { return mut; };
  var logger = ref.logger; if ( logger === void 0 ) logger = console;

  return function (store) {
    var prevState = deepCopy(store.state);

    store.subscribe(function (mutation, state) {
      if (typeof logger === 'undefined') {
        return
      }
      var nextState = deepCopy(state);

      if (filter(mutation, prevState, nextState)) {
        var time = new Date();
        var formattedTime = " @ " + (pad(time.getHours(), 2)) + ":" + (pad(time.getMinutes(), 2)) + ":" + (pad(time.getSeconds(), 2)) + "." + (pad(time.getMilliseconds(), 3));
        var formattedMutation = mutationTransformer(mutation);
        var message = "mutation " + (mutation.type) + formattedTime;
        var startMessage = collapsed
          ? logger.groupCollapsed
          : logger.group;

        // render
        try {
          startMessage.call(logger, message);
        } catch (e) {
          console.log(message);
        }

        logger.log('%c prev state', 'color: #9E9E9E; font-weight: bold', transformer(prevState));
        logger.log('%c mutation', 'color: #03A9F4; font-weight: bold', formattedMutation);
        logger.log('%c next state', 'color: #4CAF50; font-weight: bold', transformer(nextState));

        try {
          logger.groupEnd();
        } catch (e) {
          logger.log('—— log end ——');
        }
      }

      prevState = nextState;
    });
  }
}

function repeat (str, times) {
  return (new Array(times + 1)).join(str)
}

function pad (num, maxLength) {
  return repeat('0', maxLength - num.toString().length) + num
}

return createLogger;

})));


/***/ }),

/***/ 41:
/*!****************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/node_modules/js-md5/src/md5.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) {var __WEBPACK_AMD_DEFINE_RESULT__; /**
               * [js-md5]{@link https://github.com/emn178/js-md5}
               *
               * @namespace md5
               * @version 0.7.3
               * @author Chen, Yi-Cyuan [emn178@gmail.com]
               * @copyright Chen, Yi-Cyuan 2014-2017
               * @license MIT
               */
(function () {
  'use strict';

  var ERROR = 'input is invalid type';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_MD5_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD =  true && __webpack_require__(/*! !webpack amd options */ 42);
  var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [128, 32768, 8388608, -2147483648];
  var SHIFT = [0, 8, 16, 24];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'buffer', 'arrayBuffer', 'base64'];
  var BASE64_ENCODE_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

  var blocks = [],buffer8;
  if (ARRAY_BUFFER) {
    var buffer = new ArrayBuffer(68);
    buffer8 = new Uint8Array(buffer);
    blocks = new Uint32Array(buffer);
  }

  if (root.JS_MD5_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  /**
     * @method hex
     * @memberof md5
     * @description Output hash as hex string
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {String} Hex string
     * @example
     * md5.hex('The quick brown fox jumps over the lazy dog');
     * // equal to
     * md5('The quick brown fox jumps over the lazy dog');
     */
  /**
         * @method digest
         * @memberof md5
         * @description Output hash as bytes array
         * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
         * @returns {Array} Bytes array
         * @example
         * md5.digest('The quick brown fox jumps over the lazy dog');
         */
  /**
             * @method array
             * @memberof md5
             * @description Output hash as bytes array
             * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
             * @returns {Array} Bytes array
             * @example
             * md5.array('The quick brown fox jumps over the lazy dog');
             */
  /**
                 * @method arrayBuffer
                 * @memberof md5
                 * @description Output hash as ArrayBuffer
                 * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
                 * @returns {ArrayBuffer} ArrayBuffer
                 * @example
                 * md5.arrayBuffer('The quick brown fox jumps over the lazy dog');
                 */
  /**
                     * @method buffer
                     * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
                     * @memberof md5
                     * @description Output hash as ArrayBuffer
                     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
                     * @returns {ArrayBuffer} ArrayBuffer
                     * @example
                     * md5.buffer('The quick brown fox jumps over the lazy dog');
                     */
  /**
                         * @method base64
                         * @memberof md5
                         * @description Output hash as base64 string
                         * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
                         * @returns {String} base64 string
                         * @example
                         * md5.base64('The quick brown fox jumps over the lazy dog');
                         */
  var createOutputMethod = function createOutputMethod(outputType) {
    return function (message) {
      return new Md5(true).update(message)[outputType]();
    };
  };

  /**
      * @method create
      * @memberof md5
      * @description Create Md5 object
      * @returns {Md5} Md5 object.
      * @example
      * var hash = md5.create();
      */
  /**
          * @method update
          * @memberof md5
          * @description Create and update Md5 object
          * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
          * @returns {Md5} Md5 object.
          * @example
          * var hash = md5.update('The quick brown fox jumps over the lazy dog');
          * // equal to
          * var hash = md5.create();
          * hash.update('The quick brown fox jumps over the lazy dog');
          */
  var createMethod = function createMethod() {
    var method = createOutputMethod('hex');
    if (NODE_JS) {
      method = nodeWrap(method);
    }
    method.create = function () {
      return new Md5();
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type);
    }
    return method;
  };

  var nodeWrap = function nodeWrap(method) {
    var crypto = eval("require('crypto')");
    var Buffer = eval("require('buffer').Buffer");
    var nodeMethod = function nodeMethod(message) {
      if (typeof message === 'string') {
        return crypto.createHash('md5').update(message, 'utf8').digest('hex');
      } else {
        if (message === null || message === undefined) {
          throw ERROR;
        } else if (message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        }
      }
      if (Array.isArray(message) || ArrayBuffer.isView(message) ||
      message.constructor === Buffer) {
        return crypto.createHash('md5').update(new Buffer(message)).digest('hex');
      } else {
        return method(message);
      }
    };
    return nodeMethod;
  };

  /**
      * Md5 class
      * @class Md5
      * @description This is internal class.
      * @see {@link md5.create}
      */
  function Md5(sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
      this.buffer8 = buffer8;
    } else {
      if (ARRAY_BUFFER) {
        var buffer = new ArrayBuffer(68);
        this.buffer8 = new Uint8Array(buffer);
        this.blocks = new Uint32Array(buffer);
      } else {
        this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    }
    this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
  }

  /**
     * @method update
     * @memberof Md5
     * @instance
     * @description Update hash
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Md5} Md5 object.
     * @see {@link md5.update}
     */
  Md5.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }

    var notString,type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw ERROR;
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw ERROR;
          }
        }
      } else {
        throw ERROR;
      }
      notString = true;
    }
    var code,index = 0,i,length = message.length,blocks = this.blocks;
    var buffer8 = this.buffer8;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = blocks[16];
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if (notString) {
        if (ARRAY_BUFFER) {
          for (i = this.start; index < length && i < 64; ++index) {
            buffer8[i++] = message[index];
          }
        } else {
          for (i = this.start; index < length && i < 64; ++index) {
            blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
          }
        }
      } else {
        if (ARRAY_BUFFER) {
          for (i = this.start; index < length && i < 64; ++index) {
            code = message.charCodeAt(index);
            if (code < 0x80) {
              buffer8[i++] = code;
            } else if (code < 0x800) {
              buffer8[i++] = 0xc0 | code >> 6;
              buffer8[i++] = 0x80 | code & 0x3f;
            } else if (code < 0xd800 || code >= 0xe000) {
              buffer8[i++] = 0xe0 | code >> 12;
              buffer8[i++] = 0x80 | code >> 6 & 0x3f;
              buffer8[i++] = 0x80 | code & 0x3f;
            } else {
              code = 0x10000 + ((code & 0x3ff) << 10 | message.charCodeAt(++index) & 0x3ff);
              buffer8[i++] = 0xf0 | code >> 18;
              buffer8[i++] = 0x80 | code >> 12 & 0x3f;
              buffer8[i++] = 0x80 | code >> 6 & 0x3f;
              buffer8[i++] = 0x80 | code & 0x3f;
            }
          }
        } else {
          for (i = this.start; index < length && i < 64; ++index) {
            code = message.charCodeAt(index);
            if (code < 0x80) {
              blocks[i >> 2] |= code << SHIFT[i++ & 3];
            } else if (code < 0x800) {
              blocks[i >> 2] |= (0xc0 | code >> 6) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
            } else if (code < 0xd800 || code >= 0xe000) {
              blocks[i >> 2] |= (0xe0 | code >> 12) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code >> 6 & 0x3f) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
            } else {
              code = 0x10000 + ((code & 0x3ff) << 10 | message.charCodeAt(++index) & 0x3ff);
              blocks[i >> 2] |= (0xf0 | code >> 18) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code >> 12 & 0x3f) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code >> 6 & 0x3f) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
            }
          }
        }
      }
      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += this.bytes / 4294967296 << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  };

  Md5.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks,i = this.lastByteIndex;
    blocks[i >> 2] |= EXTRA[i & 3];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = blocks[16];
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[14] = this.bytes << 3;
    blocks[15] = this.hBytes << 3 | this.bytes >>> 29;
    this.hash();
  };

  Md5.prototype.hash = function () {
    var a,b,c,d,bc,da,blocks = this.blocks;

    if (this.first) {
      a = blocks[0] - 680876937;
      a = (a << 7 | a >>> 25) - 271733879 << 0;
      d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;
      d = (d << 12 | d >>> 20) + a << 0;
      c = (-271733879 ^ d & (a ^ -271733879)) + blocks[2] - 1126478375;
      c = (c << 17 | c >>> 15) + d << 0;
      b = (a ^ c & (d ^ a)) + blocks[3] - 1316259209;
      b = (b << 22 | b >>> 10) + c << 0;
    } else {
      a = this.h0;
      b = this.h1;
      c = this.h2;
      d = this.h3;
      a += (d ^ b & (c ^ d)) + blocks[0] - 680876936;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ a & (b ^ c)) + blocks[1] - 389564586;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ d & (a ^ b)) + blocks[2] + 606105819;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ c & (d ^ a)) + blocks[3] - 1044525330;
      b = (b << 22 | b >>> 10) + c << 0;
    }

    a += (d ^ b & (c ^ d)) + blocks[4] - 176418897;
    a = (a << 7 | a >>> 25) + b << 0;
    d += (c ^ a & (b ^ c)) + blocks[5] + 1200080426;
    d = (d << 12 | d >>> 20) + a << 0;
    c += (b ^ d & (a ^ b)) + blocks[6] - 1473231341;
    c = (c << 17 | c >>> 15) + d << 0;
    b += (a ^ c & (d ^ a)) + blocks[7] - 45705983;
    b = (b << 22 | b >>> 10) + c << 0;
    a += (d ^ b & (c ^ d)) + blocks[8] + 1770035416;
    a = (a << 7 | a >>> 25) + b << 0;
    d += (c ^ a & (b ^ c)) + blocks[9] - 1958414417;
    d = (d << 12 | d >>> 20) + a << 0;
    c += (b ^ d & (a ^ b)) + blocks[10] - 42063;
    c = (c << 17 | c >>> 15) + d << 0;
    b += (a ^ c & (d ^ a)) + blocks[11] - 1990404162;
    b = (b << 22 | b >>> 10) + c << 0;
    a += (d ^ b & (c ^ d)) + blocks[12] + 1804603682;
    a = (a << 7 | a >>> 25) + b << 0;
    d += (c ^ a & (b ^ c)) + blocks[13] - 40341101;
    d = (d << 12 | d >>> 20) + a << 0;
    c += (b ^ d & (a ^ b)) + blocks[14] - 1502002290;
    c = (c << 17 | c >>> 15) + d << 0;
    b += (a ^ c & (d ^ a)) + blocks[15] + 1236535329;
    b = (b << 22 | b >>> 10) + c << 0;
    a += (c ^ d & (b ^ c)) + blocks[1] - 165796510;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ c & (a ^ b)) + blocks[6] - 1069501632;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ b & (d ^ a)) + blocks[11] + 643717713;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ a & (c ^ d)) + blocks[0] - 373897302;
    b = (b << 20 | b >>> 12) + c << 0;
    a += (c ^ d & (b ^ c)) + blocks[5] - 701558691;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ c & (a ^ b)) + blocks[10] + 38016083;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ b & (d ^ a)) + blocks[15] - 660478335;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ a & (c ^ d)) + blocks[4] - 405537848;
    b = (b << 20 | b >>> 12) + c << 0;
    a += (c ^ d & (b ^ c)) + blocks[9] + 568446438;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ c & (a ^ b)) + blocks[14] - 1019803690;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ b & (d ^ a)) + blocks[3] - 187363961;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ a & (c ^ d)) + blocks[8] + 1163531501;
    b = (b << 20 | b >>> 12) + c << 0;
    a += (c ^ d & (b ^ c)) + blocks[13] - 1444681467;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ c & (a ^ b)) + blocks[2] - 51403784;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ b & (d ^ a)) + blocks[7] + 1735328473;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ a & (c ^ d)) + blocks[12] - 1926607734;
    b = (b << 20 | b >>> 12) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[5] - 378558;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[8] - 2022574463;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[11] + 1839030562;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[14] - 35309556;
    b = (b << 23 | b >>> 9) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[1] - 1530992060;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[4] + 1272893353;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[7] - 155497632;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[10] - 1094730640;
    b = (b << 23 | b >>> 9) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[13] + 681279174;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[0] - 358537222;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[3] - 722521979;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[6] + 76029189;
    b = (b << 23 | b >>> 9) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[9] - 640364487;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[12] - 421815835;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[15] + 530742520;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[2] - 995338651;
    b = (b << 23 | b >>> 9) + c << 0;
    a += (c ^ (b | ~d)) + blocks[0] - 198630844;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[5] - 57434055;
    b = (b << 21 | b >>> 11) + c << 0;
    a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[10] - 1051523;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
    b = (b << 21 | b >>> 11) + c << 0;
    a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[15] - 30611744;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
    b = (b << 21 | b >>> 11) + c << 0;
    a += (c ^ (b | ~d)) + blocks[4] - 145523070;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[2] + 718787259;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[9] - 343485551;
    b = (b << 21 | b >>> 11) + c << 0;

    if (this.first) {
      this.h0 = a + 1732584193 << 0;
      this.h1 = b - 271733879 << 0;
      this.h2 = c - 1732584194 << 0;
      this.h3 = d + 271733878 << 0;
      this.first = false;
    } else {
      this.h0 = this.h0 + a << 0;
      this.h1 = this.h1 + b << 0;
      this.h2 = this.h2 + c << 0;
      this.h3 = this.h3 + d << 0;
    }
  };

  /**
      * @method hex
      * @memberof Md5
      * @instance
      * @description Output hash as hex string
      * @returns {String} Hex string
      * @see {@link md5.hex}
      * @example
      * hash.hex();
      */
  Md5.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0,h1 = this.h1,h2 = this.h2,h3 = this.h3;

    return HEX_CHARS[h0 >> 4 & 0x0F] + HEX_CHARS[h0 & 0x0F] +
    HEX_CHARS[h0 >> 12 & 0x0F] + HEX_CHARS[h0 >> 8 & 0x0F] +
    HEX_CHARS[h0 >> 20 & 0x0F] + HEX_CHARS[h0 >> 16 & 0x0F] +
    HEX_CHARS[h0 >> 28 & 0x0F] + HEX_CHARS[h0 >> 24 & 0x0F] +
    HEX_CHARS[h1 >> 4 & 0x0F] + HEX_CHARS[h1 & 0x0F] +
    HEX_CHARS[h1 >> 12 & 0x0F] + HEX_CHARS[h1 >> 8 & 0x0F] +
    HEX_CHARS[h1 >> 20 & 0x0F] + HEX_CHARS[h1 >> 16 & 0x0F] +
    HEX_CHARS[h1 >> 28 & 0x0F] + HEX_CHARS[h1 >> 24 & 0x0F] +
    HEX_CHARS[h2 >> 4 & 0x0F] + HEX_CHARS[h2 & 0x0F] +
    HEX_CHARS[h2 >> 12 & 0x0F] + HEX_CHARS[h2 >> 8 & 0x0F] +
    HEX_CHARS[h2 >> 20 & 0x0F] + HEX_CHARS[h2 >> 16 & 0x0F] +
    HEX_CHARS[h2 >> 28 & 0x0F] + HEX_CHARS[h2 >> 24 & 0x0F] +
    HEX_CHARS[h3 >> 4 & 0x0F] + HEX_CHARS[h3 & 0x0F] +
    HEX_CHARS[h3 >> 12 & 0x0F] + HEX_CHARS[h3 >> 8 & 0x0F] +
    HEX_CHARS[h3 >> 20 & 0x0F] + HEX_CHARS[h3 >> 16 & 0x0F] +
    HEX_CHARS[h3 >> 28 & 0x0F] + HEX_CHARS[h3 >> 24 & 0x0F];
  };

  /**
      * @method toString
      * @memberof Md5
      * @instance
      * @description Output hash as hex string
      * @returns {String} Hex string
      * @see {@link md5.hex}
      * @example
      * hash.toString();
      */
  Md5.prototype.toString = Md5.prototype.hex;

  /**
                                               * @method digest
                                               * @memberof Md5
                                               * @instance
                                               * @description Output hash as bytes array
                                               * @returns {Array} Bytes array
                                               * @see {@link md5.digest}
                                               * @example
                                               * hash.digest();
                                               */
  Md5.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0,h1 = this.h1,h2 = this.h2,h3 = this.h3;
    return [
    h0 & 0xFF, h0 >> 8 & 0xFF, h0 >> 16 & 0xFF, h0 >> 24 & 0xFF,
    h1 & 0xFF, h1 >> 8 & 0xFF, h1 >> 16 & 0xFF, h1 >> 24 & 0xFF,
    h2 & 0xFF, h2 >> 8 & 0xFF, h2 >> 16 & 0xFF, h2 >> 24 & 0xFF,
    h3 & 0xFF, h3 >> 8 & 0xFF, h3 >> 16 & 0xFF, h3 >> 24 & 0xFF];

  };

  /**
      * @method array
      * @memberof Md5
      * @instance
      * @description Output hash as bytes array
      * @returns {Array} Bytes array
      * @see {@link md5.array}
      * @example
      * hash.array();
      */
  Md5.prototype.array = Md5.prototype.digest;

  /**
                                               * @method arrayBuffer
                                               * @memberof Md5
                                               * @instance
                                               * @description Output hash as ArrayBuffer
                                               * @returns {ArrayBuffer} ArrayBuffer
                                               * @see {@link md5.arrayBuffer}
                                               * @example
                                               * hash.arrayBuffer();
                                               */
  Md5.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(16);
    var blocks = new Uint32Array(buffer);
    blocks[0] = this.h0;
    blocks[1] = this.h1;
    blocks[2] = this.h2;
    blocks[3] = this.h3;
    return buffer;
  };

  /**
      * @method buffer
      * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
      * @memberof Md5
      * @instance
      * @description Output hash as ArrayBuffer
      * @returns {ArrayBuffer} ArrayBuffer
      * @see {@link md5.buffer}
      * @example
      * hash.buffer();
      */
  Md5.prototype.buffer = Md5.prototype.arrayBuffer;

  /**
                                                     * @method base64
                                                     * @memberof Md5
                                                     * @instance
                                                     * @description Output hash as base64 string
                                                     * @returns {String} base64 string
                                                     * @see {@link md5.base64}
                                                     * @example
                                                     * hash.base64();
                                                     */
  Md5.prototype.base64 = function () {
    var v1,v2,v3,base64Str = '',bytes = this.array();
    for (var i = 0; i < 15;) {
      v1 = bytes[i++];
      v2 = bytes[i++];
      v3 = bytes[i++];
      base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
      BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] +
      BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] +
      BASE64_ENCODE_CHAR[v3 & 63];
    }
    v1 = bytes[i];
    base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
    BASE64_ENCODE_CHAR[v1 << 4 & 63] +
    '==';
    return base64Str;
  };

  var exports = createMethod();

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    /**
           * @method md5
           * @description Md5 hash function, export to global in browsers.
           * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
           * @returns {String} md5 hashes
           * @example
           * md5(''); // d41d8cd98f00b204e9800998ecf8427e
           * md5('The quick brown fox jumps over the lazy dog'); // 9e107d9d372bb6826bd81d3542a419d6
           * md5('The quick brown fox jumps over the lazy dog.'); // e4d909c290d0fb1ca068ffaddf22cbd0
           *
           * // It also supports UTF-8 encoding
           * md5('中文'); // a7bac2239fcdcb3a067903d8077c4a07
           *
           * // It also supports byte `Array`, `Uint8Array`, `ArrayBuffer`
           * md5([]); // d41d8cd98f00b204e9800998ecf8427e
           * md5(new Uint8Array([])); // d41d8cd98f00b204e9800998ecf8427e
           */
    root.md5 = exports;
    if (AMD) {
      !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
        return exports;
      }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
  }
})();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/node-libs-browser/mock/process.js */ 35), __webpack_require__(/*! (webpack)/buildin/global.js */ 3)))

/***/ }),

/***/ 42:
/*!****************************************!*\
  !*** (webpack)/buildin/amd-options.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),

/***/ 43:
/*!****************************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/node_modules/jutils-src/dist/jutils.min.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
!function (e, t) { true ? module.exports = t() : undefined;}(void 0, function () {return function (e) {var t = {};function r(n) {if (t[n]) return t[n].exports;var o = t[n] = { i: n, l: !1, exports: {} };return e[n].call(o.exports, o, o.exports, r), o.l = !0, o.exports;}return r.m = e, r.c = t, r.d = function (e, t, n) {r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });}, r.r = function (e) {"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });}, r.t = function (e, t) {if (1 & t && (e = r(e)), 8 & t) return e;if (4 & t && "object" == typeof e && e && e.__esModule) return e;var n = Object.create(null);if (r.r(n), Object.defineProperty(n, "default", { enumerable: !0, value: e }), 2 & t && "string" != typeof e) for (var o in e) {r.d(n, o, function (t) {return e[t];}.bind(null, o));}return n;}, r.n = function (e) {var t = e && e.__esModule ? function () {return e.default;} : function () {return e;};return r.d(t, "a", t), t;}, r.o = function (e, t) {return Object.prototype.hasOwnProperty.call(e, t);}, r.p = "", r(r.s = 0);}([function (e, t, r) {var n = {};var o = r(1);o.keys().forEach(function (e) {if ("./index.js" !== e) for (var t in o(e)) {n[t] = o(e)[t];}}), e.exports = n;}, function (e, t, r) {var n = { "./array/array.js": 2, "./browser/browser.js": 3, "./cache/storage.js": 4, "./date/date.js": 5, "./devices/devices.js": 6, "./index.js": 0, "./mobile/mobile.js": 7, "./string/string.js": 8, "./url/url.js": 9, "./validate/validate.js": 10 };function o(e) {var t = i(e);return r(t);}function i(e) {if (!r.o(n, e)) {var t = new Error("Cannot find module '" + e + "'");throw t.code = "MODULE_NOT_FOUND", t;}return n[e];}o.keys = function () {return Object.keys(n);}, o.resolve = i, e.exports = o, o.id = 1;}, function (e, t) {e.exports = { arrayUniq: function arrayUniq(e) {for (var t = [], r = 0, n = e.length; r < n; r++) {("," + t + ",").indexOf("," + e[r] + ",") < 0 && t.push(e[r]);}return t;} };}, function (e, t) {var r = { getBrowserInfo: function getBrowserInfo() {var e,t,r,n = { name: "other", version: "0" },o = navigator.userAgent.toLowerCase();for (t = [["WeiXin", /micromessenger\/([^\s]+)/], ["QQ", /qq\/([^\s]+)/], ["QQBrowser", /(?:qqbrowser|qqlivebrowser)\/([^\s]+)/], ["JDAPP", /jdapp;/], ["QIHU", /qihu|360se/], ["LieBao", /(?:lbbrowser|liebaofast)\/?([\d\.]+)?/], ["Sogou", /(?:metasr|sogou[\w]*)[ \/]([\d\.]+)/], ["Opera", /(?:opera|opr|oupeng)\/([\d\.]+)/], ["BaiduBrowser", /(?:bidubrowser|baidubrowser)[\/ ]?([\d\.\w]+)/], ["BaiduBox", /baiduboxapp|baiduboxpad/], ["UC", /(?:ucweb|ucbrowser)\/?([\d\.]+)/], ["Maxthon", /maxthon\/([\d\.]+)/], ["Samsung", /samsungbrowser\/([\d\.]+)/], ["Dolphin", /aphone|apad/], ["2345", /2345/], ["Miui", /miuibrowser\/([\d\.]+)/], ["OppoBrowser", /oppobrowser\/([\d\.]+)/], ["MeiZu", /mz-/], ["Weibo", /weibo/], ["Youku", /youku/], ["NewsApp", /newsapp/], ["AliApp", /aliapp/], ["Firefox", /firefox\/([\d\.\w]+)/], ["Chrome", /chrome\/([\d\.]+)/], ["IE", /msie[ ](\d+\.\d+)/], ["Safari", /safari\/([\d\.]+)/]], e = 0; e < t.length; e++) {if (r = o.match(t[e][1])) {n.name = t[e][0], n.version = r[1] || "0";break;}}return n;}, isCss3Support: function isCss3Support() {var e,t,r,n = { TransitionEvent: "transitionend", WebKitTransitionEvent: "webkitTransitionEnd", OTransitionEvent: "oTransitionEnd", otransitionEvent: "otransitionEnd" },o = !1;for (r in n) {if (window[r]) {e = n[r];break;}try {document.createEvent(r), e = n[r];break;} catch (e) {}}for (r in "string" == typeof e && (o = !0), n = { AnimationEvent: "animationend", WebKitAnimationEvent: "webkitAnimationEnd" }) {if (window[r]) {t = n[r];break;}}return "string" == typeof t && (o = !0), o;} };e.exports = r;}, function (e, t) {var r = { removeStorage: function removeStorage(e) {window.localStorage.removeItem(e);}, saveStorage: function saveStorage(e, t, r) {try {window.localStorage.setItem(e, r ? JSON.stringify(t) : t);} catch (e) {console.error(e);}}, getStorage: function getStorage(e) {return window.localStorage.getItem(e);}, isSupportStorage: function isSupportStorage() {if (!window.localStorage) return !1;try {return window.localStorage.setItem("JUTILS_STOARGE_TEST", !0), window.localStorage.removeItem("JUTILS_STOARGE_TEST"), !0;} catch (e) {return !1;}} };e.exports = r;}, function (e, t) {function r(e, t) {for (var r = 0, n = t - (e + "").length; r < n; r++) {e = "0" + e;}return e + "";}var n = { isDuringDate: function isDuringDate(e, t) {var r = new Date(),n = new Date(e),o = new Date(t);return r >= n && r <= o;}, getDayType: function getDayType(e, t) {var r = e.split("-"),n = r[0].split(":"),o = r[1].split(":"),i = parseInt(n[0]),a = parseInt(o[0]),s = "";return i >= 0 && a <= 12 && (s = "上午"), i >= 12 && a <= 18 && (s = "下午"), i >= 18 && a <= 24 && (s = "晚间"), t && i >= 11 && a <= 13 && (s = "中午"), s;}, getTimeInterval: function getTimeInterval(e, t) {var r = [0, 0, 0, 0],n = "",o = t > e ? parseInt((t - e) / 1e3) : 0;return r[0] = o > 86400 ? parseInt(o / 86400) : 0, o -= 86400 * r[0], r[1] = o > 3600 ? parseInt(o / 3600) : 0, o -= 3600 * r[1], r[2] = o > 60 ? parseInt(o / 60) : 0, r[3] = o - 60 * r[2], n = r[0] > 0 ? r[0] + "天" : "", n += r[0] <= 0 && r[1] <= 0 ? "" : r[1] + "小时", n += r[0] <= 0 && r[1] <= 0 && r[2] <= 0 ? "" : r[2] + "分钟", n += r[0] <= 0 && r[1] <= 0 && r[2] <= 0 && r[3] <= 0 ? "" : r[3] + "秒";}, formatDate: function formatDate(e, t) {return t.replace(/yyyy|YYYY/, e.getFullYear()).replace(/yy|YY/, r(e.getFullYear() % 100, 2)).replace(/mm|MM/, r(e.getMonth() + 1, 2)).replace(/m|M/g, e.getMonth() + 1).replace(/dd|DD/, r(e.getDate(), 2)).replace(/d|D/g, e.getDate()).replace(/hh|HH/, r(e.getHours(), 2)).replace(/h|H/g, e.getHours()).replace(/ii|II/, r(e.getMinutes(), 2)).replace(/i|I/g, e.getMinutes()).replace(/ss|SS/, r(e.getSeconds(), 2)).replace(/s|S/g, e.getSeconds()).replace(/w/g, e.getDay()).replace(/W/g, ["日", "一", "二", "三", "四", "五", "六"][e.getDay()]);} };e.exports = n;}, function (e, t) {var r = { getOsInfo: function getOsInfo(e) {e = e || navigator.userAgent;for (var t = { os: "other", version: "" }, r = [["android", /Android;?[\s\/]+([\d.]+)?/], ["android", /jdapp;android;[\d.]+;([\d.]+);/], ["android", /[aA]ndroid;/], ["ipad", /iPad;.*?OS\s([\d_]+)/], ["ipod", /iPod(?:\stouch)?;.*?\sOS\s([\d_]+)?/], ["iphone", /CPU\siPhone\s(?:OS\s)?([\d_]+)/], ["windows", /Windows NT/], ["mac", /Macintosh;.*?Mac OS X\s([\d._]+)/], ["windows phone", /Windows Phone\s([\d.]+)?/], ["symbianos", /SymbianOS\/([\d.]+)?/], ["bb", /BlackBerry|BB10|RIM Tablet OS\s([\d.]+)?/], ["linux", /linux/i]], n = 0; n < r.length; n++) {var o = r[n],i = e.match(o[1]);if (i) {t.os = o[0], t.version = (i[1] || "").replace(/_/g, ".");break;}}return t;} };e.exports = r;}, function (e, t) {var r = { isSQ: function isSQ() {return !!/qq\/([\d\.]+)*/i.test(navigator.userAgent);}, isWX: function isWX() {return !!/MicroMessenger/i.test(navigator.userAgent);}, getOperator: function getOperator(e, t) {var r = e || "",n = r.substring(0, 3),o = r.substring(0, 4),i = !!/^1\d{10}$/.test(r) && ("130,131,132,155,156,185,186,145,176".indexOf(n) >= 0 ? "联通" : "133,153,180,181,189,177,173,170".indexOf(n) >= 0 ? "电信" : "1349" == o ? "电信" : "134,135,136,137,138,139,150,151,152,157,158,159,187,188,147,182,183,184,178".indexOf(n) >= 0 ? "移动" : "未知");return t || i || !/^1\d{2}\*{4}\d{4}$/.test(r) || (i = !0), i;} };e.exports = r;}, function (e, t) {var r = { strSubGB: function strSubGB(e, t, r, n) {if (e.replace(/[\u00FF-\uFFFF]/g, "  ").length > r - t) {n = n || "";var o = e.replace(/[\u00FF-\uFFFF]/g, "@-").substr(t, r),i = o.match(/@-/g) ? o.match(/@-/g).length : 0;return e.substring(0, r - i) + n;}return e;} };e.exports = r;}, function (e, t) {var r = { getQuery: function getQuery(e, t) {var r = arguments[1] || window.location.search,n = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),o = r.substr(r.indexOf("?") + 1).match(n);return null != o ? o[2] : "";}, setQuery: function setQuery(e, t) {var r = t ? t.match(/#.*/) && t.match(/#.*/)[0] || "" : location.hash,n = t ? t.replace(/#.*/, "").match(/\?.*/) && t.replace(/#.*/, "").match(/\?.*/)[0] || "" : location.search,o = t ? t.replace(/#.*/, "").replace(/\?.*/, "") : location.protocol + "//" + location.host + location.pathname;for (var i in e) {var a = i + "=" + e[i],s = getQuery(i, n);n = s ? n.replace(i + "=" + s, i + "=" + e[i]) : n.length > 0 ? n + "&" + a : "?" + a;}return o + n + r;}, getUrlParam: function getUrlParam(e) {var t = arguments[1] || window.location.search,r = new RegExp("(^|&)" + e + "=([^&]*)(&|$)", "i"),n = t.substr(t.indexOf("?") + 1).match(r);return null != n ? n[2] : "";}, getHash: function getHash(e) {var t = arguments[1] || location.hash,r = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),n = t.substr(t.indexOf("#") + 1).match(r);return null != n ? n[2] : "";}, replaceParam: function replaceParam(e, t, r, n) {r = r || location.href;var o = new RegExp("([\\?&]" + e + "=)[^&#]*");return r.match(o) ? n ? r.replace(o, "$1" + t) : r : -1 == r.indexOf("?") ? r + "?" + e + "=" + t : r + "&" + e + "=" + t;}, loadCss: function loadCss(e) {var t = document.createElement("link");t.setAttribute("type", "text/css"), t.setAttribute("rel", "stylesheet"), t.setAttribute("href", e), document.getElementsByTagName("head")[0].appendChild(t);}, loadonJS: function loadonJS(e, t, r) {"string" == typeof t && (r = t, t = function t() {});var n = document.createElement("script"),o = document.getElementsByTagName("head")[0];n.setAttribute("charset", r || "utf-8"), n.src = e, n.onload = function () {t && t(), o.removeChild(n);}, o.appendChild(n);} };e.exports = r;}, function (e, t) {var r = { checkUserId: function checkUserId(e) {var t, r, n, o, i, a, s, u;if (i = ["1", "0", "x", "9", "8", "7", "6", "5", "4", "3", "2"], a = ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"], t = "", !e) return "身份证号码不能为空";if (18 != e.length) return "身份证号码长度应该为18位";if (18 == e.length ? t = e.substring(0, 17) : 15 == e.length && (t = e.substring(0, 6) + "19" + e.substring(6, 15)), !/^\d+$/.test(t)) return "身份证格式错误";if (r = t.substring(6, 10), n = t.substring(10, 12), o = t.substring(12, 14), 0 == /[1-9]\d{3}\-(0[1-9]|1[0-2])\-([0-2]\d|3[0-1])/.test(r + "-" + n + "-" + o)) return "身份证生日无效。";if (new Date().getFullYear() - r > 150 || new Date().getTime() - new Date(r, n - 1, o).getTime() < 0) return "身份证生日不在有效范围";if (n > 12 || 0 == n) return "身份证月份无效";if (o > 31 || 0 == o) return "身份证日期无效";if (!{ 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }[t.substring(0, 2)]) return "身份证地区编码错误";for (u = 0, s = 0; s < 17; s++) {u += t.charAt(s) * a[s];}return t += i[u % 11], 18 != e.length ? "" : t != e.toLowerCase() ? "不是合法的身份证号码" : "";} };e.exports = r;}]);});

/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 560:
/*!**************************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/components/jyf-parser/libs/CssHandler.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             解析和匹配 Css 的选择器
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             github：https://github.com/jin-yufeng/Parser
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             docs：https://jin-yufeng.github.io/Parser
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             author：JinYufeng
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */
var config = __webpack_require__(/*! ./config.js */ 561);var
CssHandler = /*#__PURE__*/function () {
  function CssHandler() {var tagStyle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};_classCallCheck(this, CssHandler);
    this.styles = Object.assign({}, tagStyle);
  }_createClass(CssHandler, [{ key: "getStyle", value: function getStyle(
    data) {
      var style = '';
      data = data.replace(/<[sS][tT][yY][lL][eE][\s\S]*?>([\s\S]*?)<\/[sS][tT][yY][lL][eE][\s\S]*?>/g, function ($, $1) {
        style += $1;
        return '';
      });
      this.styles = new CssParser(style, this.styles).parse();
      return data;
    } }, { key: "match", value: function match(
    name, attrs) {
      var tmp,matched = (tmp = this.styles[name]) ? tmp + ';' : '';
      if (attrs.class) {
        var classes = attrs.class.split(' ');
        for (var i = 0; i < classes.length; i++) {
          if (tmp = this.styles['.' + classes[i]])
          matched += tmp + ';';}
      }
      if (tmp = this.styles['#' + attrs.id])
      matched += tmp + ';';
      return matched;
    } }]);return CssHandler;}();

module.exports = CssHandler;var
CssParser = /*#__PURE__*/function () {
  function CssParser(data, tagStyle) {_classCallCheck(this, CssParser);
    this.data = data;
    this.res = tagStyle;
    for (var item in config.userAgentStyles) {
      if (tagStyle[item]) tagStyle[item] = config.userAgentStyles[item] + ';' + tagStyle[item];else
      tagStyle[item] = config.userAgentStyles[item];
    }
    this._comma = false;
    this._floor = 0;
    this._i = 0;
    this._list = [];
    this._start = 0;
    this._state = this.Space;
  }_createClass(CssParser, [{ key: "parse", value: function parse()
    {
      for (; this._i < this.data.length; this._i++) {
        this._state(this.data[this._i]);}
      return this.res;
    } }, { key: "Space",
    // 状态机
    value: function Space(c) {
      if (c == '.' || c == '#' || c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
        this._start = this._i;
        this._state = this.StyleName;
      } else if (c == '/' && this.data[this._i + 1] == '*')
      this.Comment();else
      if (!config.blankChar[c] && c != ';')
      this._state = this.Ignore;
    } }, { key: "Comment", value: function Comment()
    {
      this._i = this.data.indexOf("*/", this._i) + 1;
      if (!this._i) this._i = this.data.length;
      this._state = this.Space;
    } }, { key: "Ignore", value: function Ignore(
    c) {
      if (c == '{') this._floor++;else
      if (c == '}' && ! --this._floor) {
        this._list = [];
        this._state = this.Space;
      }
    } }, { key: "StyleName", value: function StyleName(
    c) {
      if (config.blankChar[c]) {
        if (this._start != this._i)
        this._list.push(this.data.substring(this._start, this._i));
        this._state = this.NameSpace;
      } else if (c == '{') {
        this._list.push(this.data.substring(this._start, this._i));
        this._start = this._i + 1;
        this.Content();
      } else if (c == ',') {
        this._list.push(this.data.substring(this._start, this._i));
        this._start = this._i + 1;
        this._comma = true;
      } else if ((c < 'a' || c > 'z') && (c < 'A' || c > 'Z') && (c < '0' || c > '9') && c != '.' && c != '#' && c != '-' &&
      c != '_')
      this._state = this.Ignore;
    } }, { key: "NameSpace", value: function NameSpace(
    c) {
      if (c == '{') {
        this._start = this._i + 1;
        this.Content();
      } else if (c == ',') {
        this._comma = true;
        this._start = this._i + 1;
        this._state = this.StyleName;
      } else if (!config.blankChar[c]) {
        if (this._comma) {
          this._state = this.StyleName;
          this._start = this._i--;
          this._comma = false;
        } else this._state = this.Ignore;
      }
    } }, { key: "Content", value: function Content()
    {
      this._i = this.data.indexOf('}', this._i);
      if (this._i == -1) this._i = this.data.length;
      var content = this.data.substring(this._start, this._i);
      for (var i = this._list.length; i--;) {
        this.res[this._list[i]] = (this.res[this._list[i]] || '') + content;}
      this._list = [];
      this._state = this.Space;
    } }]);return CssParser;}();

/***/ }),

/***/ 561:
/*!**********************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/components/jyf-parser/libs/config.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* 配置文件 */
function makeMap(str) {var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var map = obj,
  list = str.split(',');
  for (var i = list.length; i--;) {
    map[list[i]] = true;}
  return map;
}
// 信任的属性列表，不在列表中的属性将被移除 
var trustAttrs = makeMap(
"align,allowfullscreen,alt,app-id,appid,apid,author,autoplay,border,cellpadding,cellspacing,class,color,colspan,controls,data-src,dir,face,frameborder,height,href,id,ignore,loop,media,muted,name,path,poster,rowspan,size,span,src,start,style,type,unit-id,unitId,width,xmlns");

// 信任的标签，将保持标签名不变 
var trustTags = makeMap(
"a,abbr,ad,audio,b,blockquote,br,code,col,colgroup,dd,del,dl,dt,div,em,fieldset,h1,h2,h3,h4,h5,h6,hr,i,img,ins,label,legend,li,ol,p,q,source,span,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,title,u,ul,video");





// 块级标签，将被转为 div
var blockTags = makeMap("address,article,aside,body,center,cite,footer,header,html,nav,pre,section");
// 被移除的标签（其中 svg 系列标签会被转为图片） 
var ignoreTags = makeMap(
"area,base,basefont,canvas,circle,command,ellipse,frame,head,input,isindex,keygen,line,link,map,meta,param,path,polygon,rect,script,source,svg,textarea,track,use,wbr" +


",embed,iframe");


// 只能用 rich-text 显示的标签（其中图片不能预览、不能显示视频、音频等） 
var richOnlyTags = makeMap("a,colgroup,fieldset,legend,picture,table,tbody,td,tfoot,th,thead,tr");
// 自闭合标签
var selfClosingTags = makeMap(
"area,base,basefont,br,col,circle,ellipse,embed,frame,hr,img,input,isindex,keygen,line,link,meta,param,path,polygon,rect,source,track,use,wbr");

// 空白字符
var blankChar = makeMap(" ,\xA0,\t,\r,\n,\f");
// 默认的标签样式
var userAgentStyles = {
  a: "color:#366092;word-break:break-all;padding:1.5px 0 1.5px 0",
  address: "font-style:italic",
  big: "display:inline;font-size:1.2em",
  blockquote: "background-color:#f6f6f6;border-left:3px solid #dbdbdb;color:#6c6c6c;padding:5px 0 5px 10px",
  center: "text-align:center",
  cite: "font-style:italic",
  dd: "margin-left:40px",
  img: "max-width:100%",
  mark: "background-color:yellow",
  picture: "max-width:100%",
  pre: "font-family:monospace;white-space:pre;overflow:scroll",
  s: "text-decoration:line-through",
  small: "display:inline;font-size:0.8em",
  u: "text-decoration:underline" };

var screenWidth = wx.getSystemInfoSync().screenWidth;

// 版本兼容
if (wx.canIUse("editor")) {
  makeMap("bdi,bdo,caption,rt,ruby,pre", trustTags);
  makeMap("bdi,bdo,caption,rt,ruby,pre", richOnlyTags);
  ignoreTags.rp = true;
  blockTags.pre = undefined;
} else

blockTags.caption = true;

function bubbling(Parser) {
  for (var i = Parser._STACK.length; i--;) {
    if (!richOnlyTags[Parser._STACK[i].name])
    Parser._STACK[i].c = 1;else
    return false;
  }
  return true;
}
module.exports = {
  // 高亮处理函数
  highlight: null,
  // 处理标签的属性，需要通过组件递归方式显示的标签需要调用 bubbling(Parser)
  LabelHandler: function LabelHandler(node, Parser) {
    var attrs = node.attrs;
    attrs.style = Parser.CssHandler.match(node.name, attrs, node) + (attrs.style || '');
    switch (node.name) {
      case "div":
      case 'p':
        if (attrs.align) {
          attrs.style = "text-align:".concat(attrs.align, ";").concat(attrs.style);
          attrs.align = void 0;
        }
        break;
      case "img":
        if (attrs["data-src"]) {
          attrs.src = attrs.src || attrs["data-src"];
          attrs["data-src"] = void 0;
        }
        if (attrs.width && parseInt(attrs.width) > screenWidth)
        attrs.style += ";height:auto !important";
        if (attrs.src && !attrs.ignore) {
          if (bubbling(Parser)) attrs.i = (Parser._imgNum++).toString();else
          attrs.ignore = 'T';
        }
        break;
      case 'a':
      case "ad":




        bubbling(Parser);
        break;
      case "font":
        if (attrs.color) {
          attrs.style = "color:".concat(attrs.color, ";").concat(attrs.style);
          attrs.color = void 0;
        }
        if (attrs.face) {
          attrs.style = "font-family:".concat(attrs.face, ";").concat(attrs.style);
          attrs.face = void 0;
        }
        if (attrs.size) {
          var size = parseInt(attrs.size);
          if (size < 1) size = 1;else
          if (size > 7) size = 7;
          var map = ["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large"];
          attrs.style = "font-size:".concat(map[size - 1], ";").concat(attrs.style);
          attrs.size = void 0;
        }
        break;
      case "video":
      case "audio":
        if (attrs.id) Parser["_".concat(node.name, "Num")]++;else
        attrs.id = node.name + ++Parser["_".concat(node.name, "Num")];
        if (node.name == "video") {
          attrs.style = attrs.style || '';
          if (attrs.width) {
            attrs.style = "width:".concat(parseFloat(attrs.width) + attrs.width.includes('%') ? '%' : "px", ";").concat(attrs.style);
            attrs.width = void 0;
          }
          if (attrs.height) {
            attrs.style = "height:".concat(parseFloat(attrs.height) + attrs.height.includes('%') ? '%' : "px", ";").concat(attrs.style);
            attrs.height = void 0;
          }
          if (Parser._videoNum > 3) node.lazyLoad = true;
        }
        attrs.source = [];
        if (attrs.src) attrs.source.push(attrs.src);
        if (!attrs.controls && !attrs.autoplay)
        console.warn("\u5B58\u5728\u6CA1\u6709 controls \u5C5E\u6027\u7684 ".concat(node.name, " \u6807\u7B7E\uFF0C\u53EF\u80FD\u5BFC\u81F4\u65E0\u6CD5\u64AD\u653E"), node);
        bubbling(Parser);
        break;
      case "source":
        var i,parent = Parser._STACK[Parser._STACK.length - 1];
        if (!parent || !attrs.src) break;
        if (parent.name == "video" || parent.name == "audio")
        parent.attrs.source.push(attrs.src);else
        {
          var i,media = attrs.media;
          if (parent.name == "picture" && !parent.attrs.src && (!media || media.includes("px") && (
          (i = media.indexOf("min-width")) != -1 && (i = media.indexOf(':', i + 8)) != -1 &&
          screenWidth > parseInt(media.substring(i + 1)) ||
          (i = media.indexOf("max-width")) != -1 && (i = media.indexOf(':', i + 8)) != -1 &&
          screenWidth < parseInt(media.substring(i + 1)))))
          parent.attrs.src = attrs.src;
        }}

    // 压缩 style
    var styles = attrs.style.split(';'),
    compressed = {};
    attrs.style = "";
    for (var i = 0, len = styles.length; i < len; i++) {
      var info = styles[i].split(':');
      if (info.length < 2) continue;
      var key = info[0].trim().toLowerCase(),
      value = info.slice(1).join(':').trim();
      // 填充链接
      if (value.includes("url")) {
        var j = value.indexOf('(');
        if (j++ != -1) {
          while (value[j] == '"' || value[j] == "'" || blankChar[value[j]]) {j++;}
          if (value[j] == '/') {
            if (value[j + 1] == '/') value = value.substring(0, j) + Parser._protocol + ':' + value.substring(j);else
            if (Parser._domain) value = value.substring(0, j) + Parser._domain + value.substring(j);
          }
        }
      }
      // 转换 rpx
      else if (value.includes("rpx"))
        value = value.replace(/[0-9.]*rpx/g, function ($) {
          return parseFloat($) * screenWidth / 750 + "px";
        });
      if (value.includes("-webkit") || value.includes("-moz") || value.includes("-ms") || value.includes("-o") || value.includes(
      "safe"))
      attrs.style += ";".concat(key, ":").concat(value);else
      if (!compressed[key] || value.includes("import") || !compressed[key].includes("import"))
      compressed[key] = value;
    }
    if (node.name == "img" && compressed.width && compressed.width.includes("%") && parseInt(compressed.width) >
    screenWidth)
    compressed.height = "auto !important";
    for (var key in compressed) {
      attrs.style += ";".concat(key, ":").concat(compressed[key]);}
    attrs.style = attrs.style.substr(1);
    if (!attrs.style) attrs.style = void 0;
    if (Parser._useAnchor && attrs.id) bubbling(Parser);
  },
  trustAttrs: trustAttrs,
  trustTags: trustTags,
  blockTags: blockTags,
  ignoreTags: ignoreTags,
  selfClosingTags: selfClosingTags,
  blankChar: blankChar,
  userAgentStyles: userAgentStyles,
  screenWidth: screenWidth };

/***/ }),

/***/ 562:
/*!****************************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/components/jyf-parser/libs/MpHtmlParser.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             将 html 解析为适用于小程序 rich-text 的 DOM 结构
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             github：https://github.com/jin-yufeng/Parser
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             docs：https://jin-yufeng.github.io/Parser
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             author：JinYufeng
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */
var config = __webpack_require__(/*! ./config.js */ 561);
var blankChar = config.blankChar;
var CssHandler = __webpack_require__(/*! ./CssHandler.js */ 560);
var emoji; // emoji 补丁包 https://jin-yufeng.github.io/Parser/#/instructions?id=emoji
var MpHtmlParser = /*#__PURE__*/function () {
  function MpHtmlParser(data) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};_classCallCheck(this, MpHtmlParser);
    this.CssHandler = new CssHandler(options.tagStyle);
    this.data = data;
    this.DOM = [];
    this._attrName = '';
    this._attrValue = '';
    this._attrs = {};
    this._domain = options.domain;
    this._protocol = this._domain && this._domain.includes("://") ? this._domain.split("://")[0] : "http";
    this._i = 0;
    this._start = 0;
    this._state = this.Text;
    this._STACK = [];
    this._tagName = '';
    this._audioNum = 0;
    this._imgNum = 0;
    this._videoNum = 0;
    this._useAnchor = options.useAnchor;
    this._pre = false;
  }_createClass(MpHtmlParser, [{ key: "parse", value: function parse()
    {
      if (emoji) this.data = emoji.parseEmoji(this.data);
      // 高亮处理
      if (config.highlight)
      this.data = this.data.replace(/<[pP][rR][eE]([\s\S]*?)>([\s\S]+?)<\/[pP][rR][eE][\s\S]*?>/g, function ($, $1, $2) {
        return "<pre".concat($1, ">").concat(config.highlight($2, $1), "</pre>");
      });
      this.data = this.CssHandler.getStyle(this.data);
      for (var len = this.data.length; this._i < len; this._i++) {
        this._state(this.data[this._i]);}
      if (this._state == this.Text) this.setText();
      while (this._STACK.length) {this.popNode(this._STACK.pop());}



















      if (this.DOM.length) this.DOM[0].PoweredBy = "Parser";
      return this.DOM;
    } }, { key: "setAttr",
    // 设置属性
    value: function setAttr() {
      if (config.trustAttrs[this._attrName]) {
        if (this._attrName == "src" && this._attrValue[0] == '/') {
          if (this._attrValue[1] == '/') this._attrValue = this._protocol + ':' + this._attrValue;else
          if (this._domain) this._attrValue = this._domain + this._attrValue;
        }
        this._attrs[this._attrName] = this._attrValue ? this._attrValue : this._attrName == "src" || this._attrName ==
        "alt" ? '' : 'T';
      }
      this._attrValue = '';
      while (blankChar[this.data[this._i]]) {this._i++;}
      if (this.checkClose()) this.setNode();else
      this._state = this.AttrName;
    } }, { key: "setText",
    // 设置文本节点
    value: function setText() {
      var text = this.getSelection();
      if (!text) return;
      if (!this._pre) {
        // 移除空白符
        for (var tmp = [], i = text.length, has = false, c; c = text[--i];) {
          if (!blankChar[c] && (has = true) || !blankChar[tmp[0]] && (c = ' ')) tmp.unshift(c);}
        if (!has) return;
        text = tmp.join('');
      }
      // 处理实体
































      var i = text.indexOf('&'),
      j,u,decode;
      while (i != -1) {
        j = text.indexOf(';', i + 2);
        if (j == -1) break;
        if (text[i + 1] == '#') {
          u = parseInt((text[i + 2] == 'x' ? '0' : '') + text.substring(i + 2, j));
          if (!isNaN(u)) text = text.substring(0, i) + String.fromCharCode(u) + text.substring(j + 1);
        } else {
          u = text.substring(i + 1, j);

          if (u == "nbsp") text = text.substring(0, i) + "\xA0" + text.substring(j + 1); // 解决连续 &nbsp; 失效的问题
          else if (u != "lt" && u != "gt" && u != "amp" && u != "ensp" && u != "emsp") decode = true;




        }
        i = text.indexOf('&', i + 1);
      }
      var slibings = this._STACK.length ? this._STACK[this._STACK.length - 1].children : this.DOM;
      if (slibings.length && slibings[slibings.length - 1].type == "text") {
        slibings[slibings.length - 1].text += text;
        if (decode) slibings[slibings.length - 1].decode = true;
      } else
      slibings.push({
        type: "text",
        text: text,
        decode: decode });

    } }, { key: "setNode",
    // 设置元素节点
    value: function setNode() {
      var slibings = this._STACK.length ? this._STACK[this._STACK.length - 1].children : this.DOM;
      var node = {
        name: this._tagName.toLowerCase(),
        attrs: this._attrs };

      config.LabelHandler(node, this);
      this._attrs = {};
      if (this.data[this._i] == '>') {
        if (!config.selfClosingTags[this._tagName]) {
          if (config.ignoreTags[node.name]) {
            var j = this._i;
            // 处理要被移除的标签
            while (this._i < this.data.length) {
              (this._i = this.data.indexOf("</", this._i + 1)) == -1 ? this._i = this.data.length : null;
              this._i += 2;
              this._start = this._i;
              while (!blankChar[this.data[this._i]] && this.data[this._i] != '>' && this.data[this._i] != '/') {this._i++;}
              if (this.data.substring(this._start, this._i).toLowerCase() == node.name) {
                this._i = this.data.indexOf('>', this._i);
                if (this._i == -1) this._i = this.data.length;else
                this._start = this._i + 1;
                this._state = this.Text;
                // 处理 svg 
                if (node.name == "svg") {
                  var src = this.data.substring(j, this._i + 1);
                  if (!node.attrs.xmlns) src = " xmlns=\"http://www.w3.org/2000/svg\"" + src;
                  this._i = j;
                  while (this.data[j] != '<') {j--;}
                  src = this.data.substring(j, this._i) + src;
                  this._i = this._start - 1;
                  node.name = "img";
                  node.attrs = {
                    src: "data:image/svg+xml;utf8," + src.replace(/#/g, "%23"),
                    ignore: 'T' };

                  slibings.push(node);
                }
                break;
              }
            }
            return;
          } else this._STACK.push(node);
          node.children = [];
        }
      } else this._i++;
      this._start = this._i + 1;
      this._state = this.Text;
      if (!config.ignoreTags[node.name]) {
        // 检查空白符是否有效
        if (node.name == "pre" || node.attrs.style && node.attrs.style.includes("white-space") && node.attrs.style.includes(
        "pre")) {
          this._pre = true;
          node.pre = true;
        }
        slibings.push(node);
      }
    } }, { key: "popNode",
    // 标签出栈处理
    value: function popNode(node) {
      // 替换一些标签名
      if (node.name == "picture") {
        node.name = "img";
        if (!node.attrs.src && node.children.length && node.children[0].name == "img")
        node.attrs.src = node.children[0].attrs.src;
        if (node.attrs.src && !node.attrs.ignore)
        node.attrs.i = (this._imgNum++).toString();
        return node.children = void 0;
      }
      if (config.blockTags[node.name]) node.name = "div";else
      if (!config.trustTags[node.name]) node.name = "span";
      // 空白符处理
      if (node.pre) {
        this._pre = false;
        node.pre = undefined;
        for (var i = this._STACK.length; i--;) {
          if (this._STACK[i].pre)
          this._pre = true;}
      }
      // 处理列表
      if (node.c) {
        if (node.name == "ul") {
          var floor = 1;
          for (var i = this._STACK.length; i--;) {
            if (this._STACK[i].name == "ul") floor++;}
          if (floor != 1)
          for (i = node.children.length; i--;) {
            node.children[i].floor = floor;}
        } else if (node.name == "ol") {var
          convert = function convert(num, type) {
            if (type == 'a') return String.fromCharCode(97 + (num - 1) % 26);
            if (type == 'A') return String.fromCharCode(65 + (num - 1) % 26);
            if (type == 'i' || type == 'I') {
              num = (num - 1) % 99 + 1;
              var one = ['I', "II", "III", "IV", 'V', "VI", "VII", "VIII", "IX"],
              ten = ['X', "XX", "XXX", "XL", 'L', "LX", "LXX", "LXXX", "XC"],
              res = (ten[Math.floor(num / 10) - 1] || '') + (one[num % 10 - 1] || '');
              if (type == 'i') return res.toLowerCase();
              return res;
            }
            return num;
          };
          for (var i = 0, num = 1, child; child = node.children[i++];) {
            if (child.name == "li") {
              child.type = "ol";
              child.num = convert(num++, node.attrs.type) + '.';
            }}
        }
      }
      // 处理表格的边框
      if (node.name == "table") {var





        setBorder = function setBorder(elem) {
          if (elem.name == "th" || elem.name == "td") {
            if (node.attrs.border)
            elem.attrs.style = "border:".concat(node.attrs.border, "px solid gray;").concat(elem.attrs.style || '');
            if (node.attrs.hasOwnProperty("cellpadding"))
            elem.attrs.style = "padding:".concat(node.attrs.cellpadding, "px;").concat(elem.attrs.style || '');
            return;
          }
          if (elem.type == "text") return;
          for (var i = 0; i < (elem.children || []).length; i++) {
            setBorder(elem.children[i]);}
        };if (node.attrs.border) node.attrs.style = "border:".concat(node.attrs.border, "px solid gray;").concat(node.attrs.style || '');if (node.attrs.hasOwnProperty("cellspacing")) node.attrs.style = "border-spacing:".concat(node.attrs.cellspacing, "px;").concat(node.attrs.style || '');
        if (node.attrs.border || node.attrs.hasOwnProperty("cellpadding"))
        for (var i = 0; i < node.children.length; i++) {
          setBorder(node.children[i]);}
      }
      // 后代选择器处理
      this.CssHandler.pop && this.CssHandler.pop(node);
    } }, { key: "checkClose",
    // 工具函数
    value: function checkClose() {
      if (this.data[this._i] == '>' || this.data[this._i] == '/' && this.data[this._i + 1] == '>')
      return true;
      return false;
    } }, { key: "getSelection", value: function getSelection(
    trim) {
      var str = this._start == this._i ? '' : this.data.substring(this._start, this._i);
      while (trim && (blankChar[this.data[++this._i]] || (this._i--, false))) {;}
      this._start = this._i + 1;
      return str;
    } }, { key: "Text",
    // 状态机
    value: function Text(c) {
      if (c == '<') {
        var next = this.data[this._i + 1];
        if (next >= 'a' && next <= 'z' || next >= 'A' && next <= 'Z') {
          this.setText();
          this._state = this.TagName;
        } else if (next == '/') {
          this.setText();
          this._i++;
          next = this.data[this._i + 1];
          if (next >= 'a' && next <= 'z' || next >= 'A' && next <= 'Z') {
            this._start = this._i + 1;
            this._state = this.EndTag;
          } else
          this._state = this.Comment;
        } else if (next == '!') {
          this.setText();
          this._state = this.Comment;
        }
      }
    } }, { key: "Comment", value: function Comment()
    {
      if (this.data.substring(this._i + 1, this._i + 3) == "--" || this.data.substring(this._i + 1, this._i + 7) ==
      "[CDATA[") {
        this._i = this.data.indexOf("-->", this._i + 1);
        if (this._i == -1) return this._i = this.data.length;else
        this._i = this._i + 2;
      } else
      (this._i = this.data.indexOf('>', this._i + 1)) == -1 ? this._i = this.data.length : null;
      this._start = this._i + 1;
      this._state = this.Text;
    } }, { key: "TagName", value: function TagName(
    c) {
      if (blankChar[c]) {
        this._tagName = this.getSelection(true);
        if (this.checkClose()) this.setNode();else
        this._state = this.AttrName;
      } else if (this.checkClose()) {
        this._tagName = this.getSelection();
        this.setNode();
      }
    } }, { key: "AttrName", value: function AttrName(
    c) {
      if (blankChar[c]) {
        this._attrName = this.getSelection(true).toLowerCase();
        if (this.data[this._i] == '=') {
          while (blankChar[this.data[++this._i]]) {;}
          this._start = this._i--;
          this._state = this.AttrValue;
        } else this.setAttr();
      } else if (c == '=') {
        this._attrName = this.getSelection().toLowerCase();
        while (blankChar[this.data[++this._i]]) {;}
        this._start = this._i--;
        this._state = this.AttrValue;
      } else if (this.checkClose()) {
        this._attrName = this.getSelection().toLowerCase();
        this.setAttr();
      }
    } }, { key: "AttrValue", value: function AttrValue(
    c) {
      if (c == '"' || c == "'") {
        this._start++;
        if ((this._i = this.data.indexOf(c, this._i + 1)) == -1) return this._i = this.data.length;
      } else
      for (; !blankChar[this.data[this._i]] && this.data[this._i] != '>'; this._i++) {;}
      this._attrValue = this.getSelection();
      while (this._attrValue.includes("&quot;")) {this._attrValue = this._attrValue.replace("&quot;", '"');}
      this.setAttr();
    } }, { key: "EndTag", value: function EndTag(
    c) {
      if (blankChar[c] || c == '>' || c == '/') {
        var name = this.getSelection().toLowerCase();
        var flag = false;
        for (var i = this._STACK.length; i--;) {
          if (this._STACK[i].name == name) {
            flag = true;
            break;
          }}
        if (flag) {
          var node;
          while (flag) {
            node = this._STACK.pop();
            if (node.name == name) flag = false;
            this.popNode(node);
          }
        } else if (name == 'p' || name == "br") {
          var slibings = this._STACK.length ? this._STACK[this._STACK.length - 1].children : this.DOM;
          slibings.push({
            name: name,
            attrs: {} });

        }
        this._i = this.data.indexOf('>', this._i);
        if (this._i == -1) this._i = this.data.length;else
        this._state = this.Text;
      }
    } }]);return MpHtmlParser;}();
;
module.exports = MpHtmlParser;

/***/ }),

/***/ 591:
/*!**********************************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/node_modules/mpvue-wxparse/src/libs/html2json.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;













var _wxDiscode = _interopRequireDefault(__webpack_require__(/*! ./wxDiscode */ 592));
var _htmlparser = _interopRequireDefault(__webpack_require__(/*! ./htmlparser */ 593));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                 * html2Json 改造来自: https://github.com/Jxck/html2json
                                                                                                                                                                 *
                                                                                                                                                                 *
                                                                                                                                                                 * author: Di (微信小程序开发工程师)
                                                                                                                                                                 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
                                                                                                                                                                 *               垂直微信小程序开发交流社区
                                                                                                                                                                 *
                                                                                                                                                                 * github地址: https://github.com/icindy/wxParse
                                                                                                                                                                 *
                                                                                                                                                                 * for: 微信小程序富文本解析
                                                                                                                                                                 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
                                                                                                                                                                 */function makeMap(str) {var obj = {};var items = str.split(',');for (var i = 0; i < items.length; i += 1) {obj[items[i]] = true;}return obj;} // Block Elements - HTML 5
var block = makeMap('br,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video'); // Inline Elements - HTML 5
var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');
// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

function removeDOCTYPE(html) {
  var isDocument = /<body.*>([^]*)<\/body>/.test(html);
  return isDocument ? RegExp.$1 : html;
}

function trimHtml(html) {
  return html.
  replace(/<!--.*?-->/gi, '').
  replace(/\/\*.*?\*\//gi, '').
  replace(/[ ]+</gi, '<').
  replace(/<script[^]*<\/script>/gi, '').
  replace(/<style[^]*<\/style>/gi, '');
}

function getScreenInfo() {
  var screen = {};
  wx.getSystemInfo({
    success: function success(res) {
      screen.width = res.windowWidth;
      screen.height = res.windowHeight;
    } });

  return screen;
}

function html2json(html, customHandler, imageProp, host) {
  // 处理字符串
  html = removeDOCTYPE(html);
  html = trimHtml(html);
  html = _wxDiscode.default.strDiscode(html);
  // 生成node节点
  var bufArray = [];
  var results = {
    nodes: [],
    imageUrls: [] };


  function Node(tag) {
    this.node = 'element';
    this.tag = tag;
  }
  Node.prototype.$screen = getScreenInfo();
  Node.prototype.$host = host;

  (0, _htmlparser.default)(html, {
    start: function start(tag, attrs, unary) {
      // node for this element
      var node = new Node(tag);

      if (bufArray.length !== 0) {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
      }

      if (block[tag]) {
        node.tagType = 'block';
      } else if (inline[tag]) {
        node.tagType = 'inline';
      } else if (closeSelf[tag]) {
        node.tagType = 'closeSelf';
      }

      node.attr = attrs.reduce(function (pre, attr) {var
        name = attr.name;var
        value = attr.value;
        if (name === 'class') {
          node.classStr = value;
        }
        // has multi attibutes
        // make it array of attribute
        if (name === 'style') {
          node.styleStr = value;
        }
        if (value.match(/ /)) {
          value = value.split(' ');
        }

        // if attr already exists
        // merge it
        if (pre[name]) {
          if (Array.isArray(pre[name])) {
            // already array, push to last
            pre[name].push(value);
          } else {
            // single value, make it array
            pre[name] = [pre[name], value];
          }
        } else {
          // not exist, put it
          pre[name] = value;
        }

        return pre;
      }, {});

      // 优化样式相关属性
      if (node.classStr) {
        node.classStr += " ".concat(node.tag);
      } else {
        node.classStr = node.tag;
      }
      if (node.tagType === 'inline') {
        node.classStr += ' inline';
      }

      // 对img添加额外数据
      if (node.tag === 'img') {
        var imgUrl = node.attr.src;
        imgUrl = _wxDiscode.default.urlToHttpUrl(imgUrl, imageProp.domain);
        Object.assign(node.attr, imageProp, {
          src: imgUrl || '' });

        if (imgUrl) {
          results.imageUrls.push(imgUrl);
        }
      }

      // 处理a标签属性
      if (node.tag === 'a') {
        node.attr.href = node.attr.href || '';
      }

      // 处理font标签样式属性
      if (node.tag === 'font') {
        var fontSize = [
        'x-small',
        'small',
        'medium',
        'large',
        'x-large',
        'xx-large',
        '-webkit-xxx-large'];

        var styleAttrs = {
          color: 'color',
          face: 'font-family',
          size: 'font-size' };

        if (!node.styleStr) node.styleStr = '';
        Object.keys(styleAttrs).forEach(function (key) {
          if (node.attr[key]) {
            var value = key === 'size' ? fontSize[node.attr[key] - 1] : node.attr[key];
            node.styleStr += "".concat(styleAttrs[key], ": ").concat(value, ";");
          }
        });
      }

      // 临时记录source资源
      if (node.tag === 'source') {
        results.source = node.attr.src;
      }

      if (customHandler.start) {
        customHandler.start(node, results);
      }

      if (unary) {
        // if this tag doesn't have end tag
        // like <img src="hoge.png"/>
        // add to parents
        var _parent = bufArray[0] || results;
        if (_parent.nodes === undefined) {
          _parent.nodes = [];
        }
        _parent.nodes.push(node);
      } else {
        bufArray.unshift(node);
      }
    },
    end: function end(tag) {
      // merge into parent tag
      var node = bufArray.shift();
      if (node.tag !== tag) {
        console.error('invalid state: mismatch end tag');
      }

      // 当有缓存source资源时于于video补上src资源
      if (node.tag === 'video' && results.source) {
        node.attr.src = results.source;
        delete results.source;
      }

      if (customHandler.end) {
        customHandler.end(node, results);
      }

      if (bufArray.length === 0) {
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (!parent.nodes) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      }
    },
    chars: function chars(text) {
      if (!text.trim()) return;

      var node = {
        node: 'text',
        text: text };


      if (customHandler.chars) {
        customHandler.chars(node, results);
      }

      if (bufArray.length === 0) {
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      }
    } });


  return results;
}var _default =

html2json;exports.default = _default;

/***/ }),

/***/ 592:
/*!**********************************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/node_modules/mpvue-wxparse/src/libs/wxDiscode.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; // HTML 支持的数学符号
function strNumDiscode(str) {
  str = str.replace(/&forall;/g, '∀');
  str = str.replace(/&part;/g, '∂');
  str = str.replace(/&exist;/g, '∃');
  str = str.replace(/&empty;/g, '∅');
  str = str.replace(/&nabla;/g, '∇');
  str = str.replace(/&isin;/g, '∈');
  str = str.replace(/&notin;/g, '∉');
  str = str.replace(/&ni;/g, '∋');
  str = str.replace(/&prod;/g, '∏');
  str = str.replace(/&sum;/g, '∑');
  str = str.replace(/&minus;/g, '−');
  str = str.replace(/&lowast;/g, '∗');
  str = str.replace(/&radic;/g, '√');
  str = str.replace(/&prop;/g, '∝');
  str = str.replace(/&infin;/g, '∞');
  str = str.replace(/&ang;/g, '∠');
  str = str.replace(/&and;/g, '∧');
  str = str.replace(/&or;/g, '∨');
  str = str.replace(/&cap;/g, '∩');
  str = str.replace(/&cup;/g, '∪');
  str = str.replace(/&int;/g, '∫');
  str = str.replace(/&there4;/g, '∴');
  str = str.replace(/&sim;/g, '∼');
  str = str.replace(/&cong;/g, '≅');
  str = str.replace(/&asymp;/g, '≈');
  str = str.replace(/&ne;/g, '≠');
  str = str.replace(/&le;/g, '≤');
  str = str.replace(/&ge;/g, '≥');
  str = str.replace(/&sub;/g, '⊂');
  str = str.replace(/&sup;/g, '⊃');
  str = str.replace(/&nsub;/g, '⊄');
  str = str.replace(/&sube;/g, '⊆');
  str = str.replace(/&supe;/g, '⊇');
  str = str.replace(/&oplus;/g, '⊕');
  str = str.replace(/&otimes;/g, '⊗');
  str = str.replace(/&perp;/g, '⊥');
  str = str.replace(/&sdot;/g, '⋅');
  return str;
}

// HTML 支持的希腊字母
function strGreeceDiscode(str) {
  str = str.replace(/&Alpha;/g, 'Α');
  str = str.replace(/&Beta;/g, 'Β');
  str = str.replace(/&Gamma;/g, 'Γ');
  str = str.replace(/&Delta;/g, 'Δ');
  str = str.replace(/&Epsilon;/g, 'Ε');
  str = str.replace(/&Zeta;/g, 'Ζ');
  str = str.replace(/&Eta;/g, 'Η');
  str = str.replace(/&Theta;/g, 'Θ');
  str = str.replace(/&Iota;/g, 'Ι');
  str = str.replace(/&Kappa;/g, 'Κ');
  str = str.replace(/&Lambda;/g, 'Λ');
  str = str.replace(/&Mu;/g, 'Μ');
  str = str.replace(/&Nu;/g, 'Ν');
  str = str.replace(/&Xi;/g, 'Ν');
  str = str.replace(/&Omicron;/g, 'Ο');
  str = str.replace(/&Pi;/g, 'Π');
  str = str.replace(/&Rho;/g, 'Ρ');
  str = str.replace(/&Sigma;/g, 'Σ');
  str = str.replace(/&Tau;/g, 'Τ');
  str = str.replace(/&Upsilon;/g, 'Υ');
  str = str.replace(/&Phi;/g, 'Φ');
  str = str.replace(/&Chi;/g, 'Χ');
  str = str.replace(/&Psi;/g, 'Ψ');
  str = str.replace(/&Omega;/g, 'Ω');

  str = str.replace(/&alpha;/g, 'α');
  str = str.replace(/&beta;/g, 'β');
  str = str.replace(/&gamma;/g, 'γ');
  str = str.replace(/&delta;/g, 'δ');
  str = str.replace(/&epsilon;/g, 'ε');
  str = str.replace(/&zeta;/g, 'ζ');
  str = str.replace(/&eta;/g, 'η');
  str = str.replace(/&theta;/g, 'θ');
  str = str.replace(/&iota;/g, 'ι');
  str = str.replace(/&kappa;/g, 'κ');
  str = str.replace(/&lambda;/g, 'λ');
  str = str.replace(/&mu;/g, 'μ');
  str = str.replace(/&nu;/g, 'ν');
  str = str.replace(/&xi;/g, 'ξ');
  str = str.replace(/&omicron;/g, 'ο');
  str = str.replace(/&pi;/g, 'π');
  str = str.replace(/&rho;/g, 'ρ');
  str = str.replace(/&sigmaf;/g, 'ς');
  str = str.replace(/&sigma;/g, 'σ');
  str = str.replace(/&tau;/g, 'τ');
  str = str.replace(/&upsilon;/g, 'υ');
  str = str.replace(/&phi;/g, 'φ');
  str = str.replace(/&chi;/g, 'χ');
  str = str.replace(/&psi;/g, 'ψ');
  str = str.replace(/&omega;/g, 'ω');
  str = str.replace(/&thetasym;/g, 'ϑ');
  str = str.replace(/&upsih;/g, 'ϒ');
  str = str.replace(/&piv;/g, 'ϖ');
  str = str.replace(/&middot;/g, '·');
  return str;
}

function strcharacterDiscode(str) {
  // 加入常用解析
  str = str.replace(/&nbsp;/g, ' ');
  str = str.replace(/&ensp;/g, ' ');
  str = str.replace(/&emsp;/g, '　');
  str = str.replace(/&quot;/g, "'");
  str = str.replace(/&amp;/g, '&');
  str = str.replace(/&lt;/g, '<');
  str = str.replace(/&gt;/g, '>');
  str = str.replace(/&#8226;/g, '•');

  return str;
}

// HTML 支持的其他实体
function strOtherDiscode(str) {
  str = str.replace(/&OElig;/g, 'Œ');
  str = str.replace(/&oelig;/g, 'œ');
  str = str.replace(/&Scaron;/g, 'Š');
  str = str.replace(/&scaron;/g, 'š');
  str = str.replace(/&Yuml;/g, 'Ÿ');
  str = str.replace(/&fnof;/g, 'ƒ');
  str = str.replace(/&circ;/g, 'ˆ');
  str = str.replace(/&tilde;/g, '˜');
  str = str.replace(/&ensp;/g, '');
  str = str.replace(/&emsp;/g, '');
  str = str.replace(/&thinsp;/g, '');
  str = str.replace(/&zwnj;/g, '');
  str = str.replace(/&zwj;/g, '');
  str = str.replace(/&lrm;/g, '');
  str = str.replace(/&rlm;/g, '');
  str = str.replace(/&ndash;/g, '–');
  str = str.replace(/&mdash;/g, '—');
  str = str.replace(/&lsquo;/g, '‘');
  str = str.replace(/&rsquo;/g, '’');
  str = str.replace(/&sbquo;/g, '‚');
  str = str.replace(/&ldquo;/g, '“');
  str = str.replace(/&rdquo;/g, '”');
  str = str.replace(/&bdquo;/g, '„');
  str = str.replace(/&dagger;/g, '†');
  str = str.replace(/&Dagger;/g, '‡');
  str = str.replace(/&bull;/g, '•');
  str = str.replace(/&hellip;/g, '…');
  str = str.replace(/&permil;/g, '‰');
  str = str.replace(/&prime;/g, '′');
  str = str.replace(/&Prime;/g, '″');
  str = str.replace(/&lsaquo;/g, '‹');
  str = str.replace(/&rsaquo;/g, '›');
  str = str.replace(/&oline;/g, '‾');
  str = str.replace(/&euro;/g, '€');
  str = str.replace(/&trade;/g, '™');

  str = str.replace(/&larr;/g, '←');
  str = str.replace(/&uarr;/g, '↑');
  str = str.replace(/&rarr;/g, '→');
  str = str.replace(/&darr;/g, '↓');
  str = str.replace(/&harr;/g, '↔');
  str = str.replace(/&crarr;/g, '↵');
  str = str.replace(/&lceil;/g, '⌈');
  str = str.replace(/&rceil;/g, '⌉');

  str = str.replace(/&lfloor;/g, '⌊');
  str = str.replace(/&rfloor;/g, '⌋');
  str = str.replace(/&loz;/g, '◊');
  str = str.replace(/&spades;/g, '♠');
  str = str.replace(/&clubs;/g, '♣');
  str = str.replace(/&hearts;/g, '♥');

  str = str.replace(/&diams;/g, '♦');
  str = str.replace(/&#39;/g, "'");
  return str;
}

function strDiscode(str) {
  str = strNumDiscode(str);
  str = strGreeceDiscode(str);
  str = strcharacterDiscode(str);
  str = strOtherDiscode(str);
  return str;
}

function urlToHttpUrl(url, domain) {
  if (/^\/\//.test(url)) {
    return "https:".concat(url);
  } else if (/^\//.test(url)) {
    return "https://".concat(domain).concat(url);
  }
  return url;
}var _default =

{
  strDiscode: strDiscode,
  urlToHttpUrl: urlToHttpUrl };exports.default = _default;

/***/ }),

/***/ 593:
/*!***********************************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/node_modules/mpvue-wxparse/src/libs/htmlparser.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /**
                                                                                                      *
                                                                                                      * htmlParser改造自: https://github.com/blowsie/Pure-JavaScript-HTML5-Parser
                                                                                                      *
                                                                                                      * author: Di (微信小程序开发工程师)
                                                                                                      * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
                                                                                                      *               垂直微信小程序开发交流社区
                                                                                                      *
                                                                                                      * github地址: https://github.com/icindy/wxParse
                                                                                                      *
                                                                                                      * for: 微信小程序富文本解析
                                                                                                      * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
                                                                                                      */
// Regular Expressions for parsing tags and attributes

var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z0-9_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
var endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
var attr = /([a-zA-Z0-9_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

function makeMap(str) {
  var obj = {};
  var items = str.split(',');
  for (var i = 0; i < items.length; i += 1) {obj[items[i]] = true;}
  return obj;
}

// Empty Elements - HTML 5
var empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr');

// Block Elements - HTML 5
var block = makeMap('address,code,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');

// Inline Elements - HTML 5
var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

function HTMLParser(html, handler) {
  var index;
  var chars;
  var match;
  var last = html;
  var stack = [];

  stack.last = function () {return stack[stack.length - 1];};

  function parseEndTag(tag, tagName) {
    // If no tag name is provided, clean shop
    var pos;
    if (!tagName) {
      pos = 0;
    } else {
      // Find the closest opened tag of the same type
      tagName = tagName.toLowerCase();
      for (pos = stack.length - 1; pos >= 0; pos -= 1) {
        if (stack[pos] === tagName) break;
      }
    }
    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i -= 1) {
        if (handler.end) handler.end(stack[i]);
      }

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }

  function parseStartTag(tag, tagName, rest, unary) {
    tagName = tagName.toLowerCase();

    if (block[tagName]) {
      while (stack.last() && inline[stack.last()]) {
        parseEndTag('', stack.last());
      }
    }

    if (closeSelf[tagName] && stack.last() === tagName) {
      parseEndTag('', tagName);
    }

    unary = empty[tagName] || !!unary;

    if (!unary) stack.push(tagName);

    if (handler.start) {
      var attrs = [];

      rest.replace(attr, function genAttr(matches, name) {
        var value = arguments[2] || arguments[3] || arguments[4] || (fillAttrs[name] ? name : '');

        attrs.push({
          name: name,
          value: value,
          escaped: value.replace(/(^|[^\\])"/g, '$1\\"') // "
        });
      });

      if (handler.start) {
        handler.start(tagName, attrs, unary);
      }
    }
  }

  while (html) {
    chars = true;

    if (html.indexOf('</') === 0) {
      match = html.match(endTag);

      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(endTag, parseEndTag);
        chars = false;
      }

      // start tag
    } else if (html.indexOf('<') === 0) {
      match = html.match(startTag);

      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(startTag, parseStartTag);
        chars = false;
      }
    }

    if (chars) {
      index = html.indexOf('<');
      var text = '';
      while (index === 0) {
        text += '<';
        html = html.substring(1);
        index = html.indexOf('<');
      }
      text += index < 0 ? html : html.substring(0, index);
      html = index < 0 ? '' : html.substring(index);

      if (handler.chars) handler.chars(text);
    }

    if (html === last) throw new Error("Parse Error: ".concat(html));
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();
}var _default =

HTMLParser;exports.default = _default;

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25720200116005","_inBundle":false,"_integrity":"sha512-RZFw3WAaS/CZTzzv9JPaWvmoNitojD/06vPdHSzlqZi8GbuE222lFuyochEjrGkG8rPPrWHAnwfoPBuQVtkfdg==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25720200116005.tgz","_shasum":"08bb17aba91c84a981f33d74153aa3dd07b578ad","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"a129bde60de35f7ef497f43d5a45b4556231995c","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25720200116005"};

/***/ }),

/***/ 7:
/*!*************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/pages.json?{"type":"style"} ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "瓶盖思维", "usingComponents": { "navigation": "/components/navigationTemplate/index", "music-play": "/components/musicPlayTemplate/index", "news": "/components/newsTemplate/index", "video-play-list": "/components/videoPlayListTemplate/index", "job-classify": "/components/jobClassifyTemplate/index" }, "usingAutoImportComponents": {} }, "pages/subject/subjectMusic/index": { "navigationBarTitleText": "专题详情", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "subject-intro": "/components/subjectIntroduceTemplate/index", "child-list": "/components/subjectChildListTemplate/index", "similar-course": "/components/similarCourseListTemplate/index", "comment-list": "/components/commentListTemplate/index", "loading-more": "/components/loadingMoreTemplate/index", "subject-state-bar": "/components/subjectStateBarTemplate/index" }, "usingAutoImportComponents": {} }, "pages/subject/subjectMusic/musicDetails/index": { "navigationBarTitleText": "音频详情", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "parser": "/components/jyf-parser/jyf-parser", "comment-list": "/components/commentListTemplate/index" }, "usingAutoImportComponents": {} }, "pages/subject/subjectVideo/index": { "navigationBarTitleText": "专题详情", "onReachBottomDistance": 50, "usingComponents": { "advertising": "/components/advertisingTemplate/index", "video-course-list": "/components/videoCourseListTemplate/index", "video-set-list": "/components/videoSetListTemplate/index", "comment-list": "/components/commentListTemplate/index", "subject-state-bar": "/components/subjectStateBarTemplate/index", "weixin-parse": "/node-modules/mpvue-wxparse/src/wxParse" }, "usingAutoImportComponents": {} }, "pages/subject/subjectVideo/videoDetails/index": { "navigationBarTitleText": "视频详情", "onReachBottomDistance": 50, "usingComponents": { "weixin-parse": "/node-modules/mpvue-wxparse/src/wxParse", "comment-list": "/components/commentListTemplate/index" }, "usingAutoImportComponents": {} }, "pages/subject/subjectQuality/index": { "navigationBarTitleText": "精品课", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "quality-list": "/components/subjectQualityListTemplate/index" }, "usingAutoImportComponents": {} }, "pages/subject/searchPage/index": { "navigationBarTitleText": "全部搜索", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "input-seek": "/components/inputSeekTemplate/index", "video-list": "/components/videoListTemplate/index", "subject-list": "/components/subjectListTemplate/index", "suspend-play": "/components/suspendPlayTemplate/index", "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/subject/lectureHome/index": { "navigationBarTitleText": "讲师主页", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "special-list": "/components/specialListTemplate/index", "video-list": "/components/videoListTemplate/index", "loading-more": "/components/loadingMoreTemplate/index", "parse": "/components/jyf-parser/jyf-parser" }, "usingAutoImportComponents": {} }, "pages/subject/lectureHome/lecturerDialogue/index": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/subject/lectureHome/lecturerGoods/index": { "navigationBarTitleText": "商品橱窗", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/subject/lectureHome/lecturerGoods/searchGoods/index": { "navigationBarTitleText": "商品搜索", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "input-seek": "/components/inputSeekTemplate/index", "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/subject/lectureHome/lecturerGoods/lecturerGoodsDetails/index": { "navigationBarTitleText": "橱窗详情", "usingComponents": { "parse": "/components/jyf-parser/jyf-parser" }, "usingAutoImportComponents": {} }, "pages/subject/lectureHome/lecturerConsulting/index": { "navigationBarTitleText": "咨询主页", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/subject/lectureHome/lecturerConsulting/consultingPay/index": { "navigationBarTitleText": "咨询", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/subject/hotMusic/index": { "navigationBarTitleText": "栏目热门音频", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "video-list": "/components/videoListTemplate/index", "suspend-play": "/components/suspendPlayTemplate/index", "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/subject/submitPay/index": { "navigationBarTitleText": "购买详情", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/boutiqueSubject/index": { "navigationBarTitleText": "精品课", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "goods-navigation": "/components/goodsNavigationTemplate/index", "goods-list": "/components/subjectGoodsListTemplate/index" }, "usingAutoImportComponents": {} }, "pages/robTuition/index": { "navigationBarTitleText": "知识和钱，我全都要", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "all-grab-floating-window": "/components/allGrabFloatingWindowTemplate/index", "tuition-list": "/components/tuitionListTemplate/index", "tuition-second": "/components/tuitionSecondListTemplate/index", "rule-popup": "/components/rulePopupTemplate/index", "tuition-me-list": "/components/tuitionMeListTemplate/index", "loading-more": "/components/loadingMoreTemplate/index", "suspend-play": "/components/suspendPlayTemplate/index" }, "usingAutoImportComponents": {} }, "pages/robTuition/tuitionShare/index": { "navigationBarTitleText": "助力返学费", "enablePullDownRefresh": true, "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/robTuition/tuitionBill/index": { "navigationBarTitleText": "学费晒单", "enablePullDownRefresh": true, "usingComponents": { "all-grab-floating-window": "/components/allGrabFloatingWindowTemplate/index", "tuition-draw-popup": "/components/tuitionDrawPopupTemplate/index" }, "usingAutoImportComponents": {} }, "pages/robTuition/tuitionLandingPage/index": { "navigationBarTitleText": "邀请分享", "usingComponents": { "tuition-draw-popup": "/components/tuitionDrawPopupTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/index": { "navigationBarTitleText": "个人中心", "enablePullDownRefresh": true, "usingComponents": { "me-list": "/components/meListTemplate/index", "suspend-play": "/components/suspendPlayTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/mySubscription/index": { "navigationBarTitleText": "订阅", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/myAttention/index": { "navigationBarTitleText": "关注", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/privateLetter/index": { "navigationBarTitleText": "私信", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/myData/index": { "enablePullDownRefresh": true, "navigationBarTitleText": "个人资料", "backgroundColor": "#f5f5f5", "backgroundTextStyle": "dark", "usingComponents": { "data-popup": "/components/meDataPopupTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/myAddress/index": { "navigationBarTitleText": "地址管理", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/myAddress/addressDetails/index": { "navigationBarTitleText": "添加地址", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/me/setPayPassword/index": { "navigationBarTitleText": "设置支付密码", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/me/bingPhone/index": { "navigationBarTitleText": "绑定手机号", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/me/myProfession/index": { "navigationBarTitleText": "选择职业", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/me/myJob/index": { "navigationBarTitleText": "选择岗位", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/me/salary/index": { "navigationBarTitleText": "薪资", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/me/workSuffer/index": { "navigationBarTitleText": "添加工作经历", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/me/educationSuffer/index": { "navigationBarTitleText": "添加教育经历", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/me/amount/index": { "navigationBarTitleText": "收入", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "income-list": "/components/incomeListTemplate/index", "extract-list": "/components/extractListTemplate/index", "rule-popup": "/components/rulePopupTemplate/index", "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/amount/amountDetails/index": { "navigationBarTitleText": "收入详情", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/me/myCollect/index": { "navigationBarTitleText": "我的收藏", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "video-list": "/components/videoListTemplate/index", "subject-list": "/components/subjectListTemplate/index", "article-list": "/components/articleListTemplate/index", "suspend-play": "/components/suspendPlayTemplate/index", "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/playHistory/index": { "navigationBarTitleText": "播放历史", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "video-list": "/components/videoListTemplate/index", "suspend-play": "/components/suspendPlayTemplate/index", "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/giveThumbs/index": { "navigationBarTitleText": "我的点赞", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "video-list": "/components/videoListTemplate/index", "suspend-play": "/components/suspendPlayTemplate/index", "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/myOrder/index": { "navigationBarTitleText": "订单列表", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "order-list": "/components/orderListTemplate/index", "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/myOrder/orderDetails/index": { "navigationBarTitleText": "订单详情", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/me/myCourse/index": { "navigationBarTitleText": "我的课程", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "backgroundColor": "#333", "usingComponents": { "input-seek": "/components/inputSeekTemplate/index", "my-course-list": "/components/myCourseListTemplate/index", "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/myCourse/courseDetails/index": { "navigationBarTitleText": "课程详情", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/me/meEnergy/index": { "navigationBarTitleText": "上进心", "usingComponents": { "suspend-play": "/components/suspendPlayTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/contentCustom/index": { "navigationBarTitleText": "内容定制", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/me/contentCustom/contentList/index": { "navigationBarTitleText": "关键词列表", "usingComponents": { "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/feedback/index": { "navigationBarTitleText": "意见反馈", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/me/feedback/feedbackList/index": { "navigationBarTitleText": "反馈历史", "enablePullDownRefresh": true, "onReachBottomDistance": 50, "usingComponents": { "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/feedback/feedbackList/feedbackDetails/index": { "navigationBarTitleText": "反馈详情", "usingComponents": { "feedback-chat": "/components/feedbackChatTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/growthRecord/index": { "navigationBarTitleText": "成长记录", "usingComponents": { "parse": "/components/jyf-parser/jyf-parser", "loading-more": "/components/loadingMoreTemplate/index" }, "usingAutoImportComponents": {} }, "pages/me/applyEnter/index": { "navigationBarTitleText": "申请讲师入驻", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/login/index": { "navigationBarTitleText": "瓶盖思维", "usingComponents": { "login-page": "/components/loginPageTemplate/index" }, "usingAutoImportComponents": {} }, "pages/login/agreement/index": { "navigationBarTitleText": "瓶盖思维用户协议", "usingComponents": {}, "usingAutoImportComponents": {} } }, "globalStyle": { "backgroundTextStyle": "light", "navigationBarBackgroundColor": "#ffffff", "navigationBarTitleText": "瓶盖思维", "navigationBarTextStyle": "black", "backgroundColor": "#333333" } };exports.default = _default;

/***/ }),

/***/ 74:
/*!*********************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/utils/getQueryString.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.queryString = queryString;function queryString(item, name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = item.match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}

/***/ }),

/***/ 8:
/*!************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/pages.json?{"type":"stat"} ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__63ED51A" };exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map