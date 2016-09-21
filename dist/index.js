'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function debounce(func) {
  var wait = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _ref$leading = _ref.leading;
  var leading = _ref$leading === undefined ? false : _ref$leading;
  var _ref$cancelObj = _ref.cancelObj;
  var cancelObj = _ref$cancelObj === undefined ? 'canceled' : _ref$cancelObj;

  var timer = void 0,
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
        timer = setTimeout(exec.bind(_this, args, resolve, reject), wait);
      });
    }

    shouldCancel = true;
    return new Promise(function (resolve, reject) {
      latestResolve = resolve;
      timer = setTimeout(exec.bind(_this, args, resolve, reject), wait);
    });
  };

  function exec(args, resolve, reject) {
    if (shouldCancel && resolve !== latestResolve) {
      reject(cancelObj);
    } else {
      func.apply(this, args).then(resolve).catch(reject);
      if (resolve === latestResolve) {
        shouldCancel = false;
        clearTimeout(timer);
        timer = latestResolve = null;
      }
    }
  }
}

exports.default = debounce;