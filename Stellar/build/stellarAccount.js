'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAccount = exports.payment = exports.createAccountInLedger = exports.createAccount = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stellarSdk = require('stellar-sdk');

var _stellarSdk2 = _interopRequireDefault(_stellarSdk);

var _cryptoJs = require('crypto-js');

var _admin = require('../routes/admin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENVCryptoSecret = 'Stellar-is-awesome';
var stellarServer = new _stellarSdk2.default.Server('https://horizon-testnet.stellar.org');
// const stellarAsset = new StellarSdk.Asset(
//     StellarSdk.Asset.native().code,
//     'GCD6WBCRZ7HUSMCWPSCHKLCVKWC3VD5PH43ARYUAUSET6IEO5ERTXYEI'
// );
_stellarSdk2.default.Network.useTestNetwork();

var createAccount = exports.createAccount = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        return _context2.abrupt('return', new _promise2.default(function () {
                            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(resolve, reject) {
                                var keypair, secret, data;
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                keypair = _stellarSdk2.default.Keypair.random();
                                                secret = _cryptoJs.AES.encrypt(keypair.secret(), ENVCryptoSecret).toString();
                                                data = {
                                                    stellarAddress: keypair.publicKey(),
                                                    stellarSeed: secret
                                                };
                                                _context.next = 5;
                                                return createAccountInLedger(keypair.publicKey());

                                            case 5:

                                                console.log('acc', data);
                                                resolve(data);

                                            case 7:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, undefined);
                            }));

                            return function (_x, _x2) {
                                return _ref2.apply(this, arguments);
                            };
                        }()));

                    case 1:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function createAccount() {
        return _ref.apply(this, arguments);
    };
}();

var createAccountInLedger = exports.createAccountInLedger = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(newAccount) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        return _context4.abrupt('return', new _promise2.default(function () {
                            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(resolve, reject) {
                                var admin, provisionerKeyPair, provisioner, transaction, result;
                                return _regenerator2.default.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                _context3.prev = 0;
                                                _context3.next = 3;
                                                return (0, _admin.getAdmin)();

                                            case 3:
                                                admin = _context3.sent;
                                                provisionerKeyPair = _stellarSdk2.default.Keypair.fromSecret(_cryptoJs.AES.decrypt(admin.stellarSeed, ENVCryptoSecret).toString(_cryptoJs.enc.Utf8));
                                                _context3.next = 7;
                                                return stellarServer.loadAccount(provisionerKeyPair.publicKey());

                                            case 7:
                                                provisioner = _context3.sent;


                                                console.log('creating account in ledger', newAccount);

                                                transaction = new _stellarSdk2.default.TransactionBuilder(provisioner).addOperation(_stellarSdk2.default.Operation.createAccount({
                                                    destination: newAccount,
                                                    startingBalance: '1'
                                                })).build();


                                                transaction.sign(provisionerKeyPair);

                                                _context3.next = 13;
                                                return stellarServer.submitTransaction(transaction);

                                            case 13:
                                                result = _context3.sent;

                                                console.log('Account created: ', result);
                                                resolve(result);
                                                _context3.next = 21;
                                                break;

                                            case 18:
                                                _context3.prev = 18;
                                                _context3.t0 = _context3['catch'](0);

                                                console.log('Stellar account not created.', _context3.t0);

                                            case 21:
                                            case 'end':
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, undefined, [[0, 18]]);
                            }));

                            return function (_x4, _x5) {
                                return _ref4.apply(this, arguments);
                            };
                        }()));

                    case 1:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function createAccountInLedger(_x3) {
        return _ref3.apply(this, arguments);
    };
}();

var payment = exports.payment = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(signerKeys, destination, amount) {
        var account, transaction, result;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return stellarServer.loadAccount(signerKeys.publicKey());

                    case 2:
                        account = _context5.sent;
                        transaction = new _stellarSdk2.default.TransactionBuilder(account).addOperation(_stellarSdk2.default.Operation.payment({
                            destination: destination,
                            asset: _stellarSdk2.default.Asset.native(),
                            amount: amount
                        })).build();


                        transaction.sign(signerKeys);

                        console.log('sending ' + amount + ' from ' + signerKeys.publicKey() + ' to ' + destination + ' ');
                        _context5.prev = 6;
                        _context5.next = 9;
                        return stellarServer.submitTransaction(transaction);

                    case 9:
                        result = _context5.sent;

                        console.log('sent ' + result);
                        return _context5.abrupt('return', result);

                    case 14:
                        _context5.prev = 14;
                        _context5.t0 = _context5['catch'](6);

                        console.log('failure ' + _context5.t0);
                        throw _context5.t0;

                    case 18:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined, [[6, 14]]);
    }));

    return function payment(_x6, _x7, _x8) {
        return _ref5.apply(this, arguments);
    };
}();

var getAccount = exports.getAccount = function getAccount(id) {
    console.log('called');
    return stellarServer.accounts().accountId(id).call().then(function (response) {
        console.log('res', response);
        return response;
    }).catch(function (error) {
        console.log('error', error);
        throw error;
    });
};