'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendSms = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var accountSid = 'AC6beda5a6add9e30ae1deb2004bfeb1ac';
// var authToken = '8c960e4dfc245e911d832cc76e3f1627';
var accountSid = 'AC1d936a0f44ed4ebd569270740691fbf1'; // Your Account SID from www.twilio.com/console
var authToken = 'a47d9865c5c1c3e15b9a007ce2d71c0f';   // Your Auth Token from www.twilio.com/console
var client = require('twilio')(accountSid, authToken);

var sendSms = exports.sendSms = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(mobileNumber) {
    var otp;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('called');
            otp = Math.floor(1000 + Math.random() * 9000);
            _context.next = 4;
            return client.messages.create({
              body: otp,
              from: '+12057083986',
              to: mobileNumber
            }).then(function (message) {
              return console.log('message', message.sid);
            }).done();

          case 4:
            return _context.abrupt('return', otp);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function sendSms(_x) {
    return _ref.apply(this, arguments);
  };
}();