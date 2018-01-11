'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
  * debounce(func, [wait=0], [options={}])
  *
  * @param {Function} func The function to debounce.
  * @param {number} [wait=0] The number of milliseconds to delay.
  * @param {Object} [options={}] The options object.
  * @param {boolean} [options.leading=false] Specify invoking on the leading edge of the timeout.
  * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's invoked.
  * @param {boolean} [options.trailing=true]  Specify invoking on the trailing edge of the timeout.
  * @param {cancelObj} [options.cancelObj='canceled'] Specify the error object to be rejected.
  * @returns {Function} Returns the new debounced function.
  */
function debounce(func) {
  var wait = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _ref$leading = _ref.leading;
  var leading = _ref$leading === undefined ? false : _ref$leading;
  var maxWait = _ref.maxWait;
  var _ref$trailing = _ref.trailing;
  var trailing = _ref$trailing === undefined ? true : _ref$trailing;
  var _ref$cancelObj = _ref.cancelObj;
  var cancelObj = _ref$cancelObj === undefined ? 'canceled' : _ref$cancelObj;

  var timerId = void 0,
      latestResolve = void 0,
      shouldCancel = void 0;

  return function () {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (!latestResolve) {
      return leading ? func.apply(this, args) : new Promise(function (resolve, reject) {
        latestResolve = resolve;
        timerId = setTimeout(invokeFunc.bind(_this, args, resolve, reject), wait);
      });
    }

    shouldCancel = true;
    return new Promise(function (resolve, reject) {
      latestResolve = resolve;
      timerId = setTimeout(invokeFunc.bind(_this, args, resolve, reject), wait);
    });
  };

  function invokeFunc(args, resolve, reject) {
    if (shouldCancel && resolve !== latestResolve) {
      reject(cancelObj);
    } else {
      func.apply(this, args).then(resolve).catch(reject);
      if (resolve === latestResolve) {
        shouldCancel = false;
        clearTimeout(timerId);
        timerId = latestResolve = null;
      }
    }
  }
}

exports.default = debounce;