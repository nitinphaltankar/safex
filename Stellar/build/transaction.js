'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withdraw = exports.getCurrentStellarRate = exports.stellarPayment = exports.stripeTransaction = exports.userTransaction = exports.withdrawFeeTransaction = exports.depositFeeTransaction = exports.getReceivedAmount = exports.depositTransaction = exports.withdrawTransaction = exports.receivedStellarTransaction = exports.sentStellarTransaction = exports.saveTransaction = exports.nativeAssetTransaction = exports.stellarBalance = exports.fiatBalance = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stellarSdk = require('stellar-sdk');

var _stellarSdk2 = _interopRequireDefault(_stellarSdk);

var _cryptoJs = require('crypto-js');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _stream = require('stream');

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _stellarAccount = require('../service/stellarAccount');

var _user = require('./user');

var _admin = require('./admin');

var _TransactionSchema = require('../models/TransactionSchema');

var _card = require('./card');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const stripe = require("stripe")('sk_test_BlD4SrbP60Qa94PrQ1pTHYtB');


var ENVCryptoSecret = 'Stellar-is-awesome';
_stellarSdk2.default.Network.useTestNetwork();

var marketRate = void 0;

var fiatBalance = exports.fiatBalance = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
    var admin, stripe;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            admin = _context.sent;
            stripe = require("stripe")(admin.stripeKey);

            stripe.balance.retrieve(function (error, balance) {
              if (error) res.status(500).send('OOPS!! Something went wrong');
              res.status(200).send(balance);
            });

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function fiatBalance(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var stellarBalance = exports.stellarBalance = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
    var response, result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            response = _context2.sent;
            _context2.next = 5;
            return (0, _stellarAccount.getAccount)(response.stellarAddress);

          case 5:
            result = _context2.sent;

            res.status(200).send(result.balances);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function stellarBalance(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var nativeAssetTransaction = exports.nativeAssetTransaction = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
    var sender, receiver, admin, signerKeys, amount, _ref4, hash, transactionFee, dbUpdate, result;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _user.getUserProfile)(req.body.sender);

          case 2:
            sender = _context3.sent;
            _context3.next = 5;
            return (0, _user.getUserProfile)(req.body.receiver);

          case 5:
            receiver = _context3.sent;
            _context3.next = 8;
            return (0, _admin.getAdmin)();

          case 8:
            admin = _context3.sent;

            //////////////////////////////
            // const sender = {
            //   stellarAddress: "GCD6WBCRZ7HUSMCWPSCHKLCVKWC3VD5PH43ARYUAUSET6IEO5ERTXYEI",
            //   stellarSeed: "SAA7KH36FRAAJH575ZQTVJKGCRIEX7NHQBAE57XVMP6XY6PCNH4WAM2O"
            // }

            // const receiver = {
            //   stellarAddress: "GCGEZ26EZB3NVHYF7BSLLJZM2K2DI5H3CZR6VNYJMB6FJHGPENHFGH5H",
            //   stellarSeed: "U2FsdGVkX1+/kq8rTmIL0+MF2cUtKzXUVhfNL1gX48mfrZmHj3KehcP+7ZiAjrmLCkM6T+gRcDKS9wSl4dMe5iMvUjIrISZ1HblQ0q4iyOI="
            // }
            /////////////////
            signerKeys = _stellarSdk2.default.Keypair.fromSecret(_cryptoJs.AES.decrypt(sender.stellarSeed, ENVCryptoSecret).toString(_cryptoJs.enc.Utf8));
            _context3.prev = 10;
            amount = req.body.amount;
            _context3.next = 14;
            return (0, _stellarAccount.payment)(signerKeys, receiver.stellarAddress, req.body.amount.toString());

          case 14:
            _ref4 = _context3.sent;
            hash = _ref4.hash;

            console.log('sent successfully', hash);

            _context3.next = 19;
            return (0, _stellarAccount.payment)(signerKeys, admin.stellarAddress, req.body.fee.toString());

          case 19:
            transactionFee = _context3.sent;

            console.log('admin sent successfully', transactionFee.hash);

            dbUpdate = (0, _assign2.default)({}, { 'sender': sender._id, 'receiver': receiver._id, 'amount': req.body.amount, 'currency': 'xlm', 'fee': req.body.fee, 'hash': hash, 'walletAmount': req.body.walletAmount, 'walletFee': req.body.walletFee });
            _context3.next = 24;
            return saveTransaction(dbUpdate, res);

          case 24:
            result = _context3.sent;


            if (result !== '') res.status(200).send(result);
            _context3.next = 32;
            break;

          case 28:
            _context3.prev = 28;
            _context3.t0 = _context3['catch'](10);

            console.log('error', _context3.t0);
            res.status(500).send({ 'message': 'OOPS!! Something went wrong', 'error': _context3.t0 });

          case 32:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[10, 28]]);
  }));

  return function nativeAssetTransaction(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var saveTransaction = exports.saveTransaction = function saveTransaction(data) {
  var transaction = new _TransactionSchema.Transaction(data);
  return transaction.save();
};

var sentStellarTransaction = exports.sentStellarTransaction = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
    var admin;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            admin = _context4.sent;

            _TransactionSchema.Transaction.find({ $and: [{ currency: 'xlm', sender: admin._id }] }).sort({ createdTs: -1 }).populate({ path: 'receiver', select: 'stellarAddress' }).exec(function (error, response) {
              if (error) res.status(500).send('OOPS!! Something went wrong');else {
                res.status(200).send(response);
              }
            });

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function sentStellarTransaction(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

var receivedStellarTransaction = exports.receivedStellarTransaction = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
    var admin;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            admin = _context5.sent;

            _TransactionSchema.Transaction.find({ $and: [{ currency: 'xlm', receiver: admin._id }] }).sort({ createdTs: -1 }).populate({ path: 'sender', select: 'stellarAddress' }).exec(function (error, response) {
              if (error) res.status(500).send('OOPS!! Something went wrong');else {
                res.status(200).send(response);
              }
            });

          case 4:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function receivedStellarTransaction(_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}();

var withdrawTransaction = exports.withdrawTransaction = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
    var admin;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            admin = _context6.sent;

            _TransactionSchema.Transaction.find({ $and: [{ currency: 'usd', sender: admin._id }] }).sort({ createdTs: -1 }).exec(function (error, response) {
              if (error) res.status(500).send('OOPS!! Something went wrong');else {
                res.status(200).send(response);
              }
            });

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function withdrawTransaction(_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();

var depositTransaction = exports.depositTransaction = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
    var admin;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            admin = _context7.sent;

            _TransactionSchema.Transaction.find({ $and: [{ currency: 'usd', receiver: admin._id }] }).sort({ createdTs: -1 }).exec(function (error, response) {
              if (error) res.status(500).send('OOPS!! Something went wrong');else {
                res.status(200).send(response);
              }
            });

          case 4:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function depositTransaction(_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}();

var getReceivedAmount = exports.getReceivedAmount = function getReceivedAmount(transactionId) {
  return _TransactionSchema.Transaction.findOne({ transactionID: transactionId }, function (error, response) {
    if (error) console.error({ 'message': error });else {
      return response;
    }
  });
};

var depositFeeTransaction = exports.depositFeeTransaction = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(req, res) {
    var admin;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            admin = _context10.sent;

            _TransactionSchema.Transaction.find({ $and: [{ currency: 'usd', receiver: admin._id }] }).sort({ createdTs: -1 }).lean().exec(function () {
              var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(error, response) {
                var final;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        if (error) console.error(error);else {
                          final = [];

                          _async2.default.eachLimit(response, 1, function () {
                            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(usdTransaction, callback) {
                              var xlmTransaction;
                              return _regenerator2.default.wrap(function _callee8$(_context8) {
                                while (1) {
                                  switch (_context8.prev = _context8.next) {
                                    case 0:
                                      _context8.next = 2;
                                      return getReceivedAmount(usdTransaction._id);

                                    case 2:
                                      xlmTransaction = _context8.sent;

                                      if (xlmTransaction !== null) final.push((0, _assign2.default)({}, usdTransaction, { fee: xlmTransaction.fee, received: xlmTransaction.amount }));
                                      callback();

                                    case 5:
                                    case 'end':
                                      return _context8.stop();
                                  }
                                }
                              }, _callee8, undefined);
                            }));

                            return function (_x19, _x20) {
                              return _ref11.apply(this, arguments);
                            };
                          }(), function () {
                            res.status(200).send(final);
                          });
                        }

                      case 1:
                      case 'end':
                        return _context9.stop();
                    }
                  }
                }, _callee9, undefined);
              }));

              return function (_x17, _x18) {
                return _ref10.apply(this, arguments);
              };
            }());

          case 4:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  }));

  return function depositFeeTransaction(_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}();

var withdrawFeeTransaction = exports.withdrawFeeTransaction = function () {
  var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(req, res) {
    var admin;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            admin = _context13.sent;

            _TransactionSchema.Transaction.find({ $and: [{ currency: 'xlm', receiver: admin._id }] }).sort({ createdTs: -1 }).lean().exec(function () {
              var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(error, response) {
                var final;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        if (error) console.error(error);else {
                          final = [];

                          _async2.default.eachLimit(response, 1, function () {
                            var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(xlmTransaction, callback) {
                              var usdTransaction;
                              return _regenerator2.default.wrap(function _callee11$(_context11) {
                                while (1) {
                                  switch (_context11.prev = _context11.next) {
                                    case 0:
                                      _context11.next = 2;
                                      return getReceivedAmount(xlmTransaction._id);

                                    case 2:
                                      usdTransaction = _context11.sent;

                                      if (usdTransaction !== null) final.push((0, _assign2.default)({}, xlmTransaction, { fee: usdTransaction.walletFee, received: usdTransaction.amount }));
                                      callback();

                                    case 5:
                                    case 'end':
                                      return _context11.stop();
                                  }
                                }
                              }, _callee11, undefined);
                            }));

                            return function (_x25, _x26) {
                              return _ref14.apply(this, arguments);
                            };
                          }(), function () {
                            res.status(200).send(final);
                          });
                        }

                      case 1:
                      case 'end':
                        return _context12.stop();
                    }
                  }
                }, _callee12, undefined);
              }));

              return function (_x23, _x24) {
                return _ref13.apply(this, arguments);
              };
            }());

          case 4:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  }));

  return function withdrawFeeTransaction(_x21, _x22) {
    return _ref12.apply(this, arguments);
  };
}();

var userTransaction = exports.userTransaction = function () {
  var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(req, res) {
    var admin;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            admin = _context14.sent;

            _TransactionSchema.Transaction.find({ $and: [{ currency: 'xlm', receiver: { $ne: admin._id }, sender: { $ne: admin._id } }] }).sort({ createdTs: -1 }).populate({ path: 'receiver', select: ['stellarAddress', '_id'] }).exec(function (error, response) {
              if (error) res.status(500).send('OOPS!! Something went wrong');else {
                res.status(200).send(response);
              }
            });

          case 4:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  }));

  return function userTransaction(_x27, _x28) {
    return _ref15.apply(this, arguments);
  };
}();

var checkStellarAmount = function () {
  var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(admin, req, res, next) {
    var response, result;
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            response = _context15.sent;
            _context15.next = 5;
            return (0, _stellarAccount.getAccount)(response.stellarAddress);

          case 5:
            result = _context15.sent;

            res.status(200).send(result.balances);

          case 7:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, undefined);
  }));

  return function checkStellarAmount(_x29, _x30, _x31, _x32) {
    return _ref16.apply(this, arguments);
  };
}();

var stripeTransaction = exports.stripeTransaction = function () {
  var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(req, res) {
    var admin, card, stripe;
    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:

            console.log(req.body);
            _context17.next = 3;
            return getCurrentStellarRate();

          case 3:
            _context17.next = 5;
            return (0, _admin.getAdmin)();

          case 5:
            admin = _context17.sent;

            if (!(req.body.saveCard === true || req.body.saveCard == 1)) {
              _context17.next = 11;
              break;
            }

            _context17.next = 9;
            return (0, _card.saveCardDetails)(req.body.card);

          case 9:
            card = _context17.sent;

            console.log('inside if');

          case 11:

            console.log('admin.stripeKey ' + admin.stripeKey);
            stripe = require("stripe")(admin.stripeKey);


            stripe.customers.create({
              description: 'Customer for stripe transaction',
              source: req.body.stripeToken
            }, function (error, customer) {
              if (error || customer === null) {
                console.log('error occured ' + error);
                return res.status(500).send('OOPS!! Something went wrong');
              }
              stripe.charges.create({
                amount: (req.body.amount * 100).toString(),
                currency: "usd",
                customer: customer.id,
                description: "Charge for each transaction"
              }, function () {
                var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(error, charge) {
                  var dbUpdate, usdTransaction;
                  return _regenerator2.default.wrap(function _callee16$(_context16) {
                    while (1) {
                      switch (_context16.prev = _context16.next) {
                        case 0:
                          console.log(error);
                          if (error || charge == null) res.status(500).send('OOPS!! Something went wrong');

                          if (!(charge.status === 'succeeded')) {
                            _context16.next = 9;
                            break;
                          }

                          dbUpdate = (0, _assign2.default)({}, { 'sender': req.body.user, 'receiver': admin._id, 'amount': req.body.amount, 'currency': 'usd', 'cardNumber': req.body.card.number });
                          _context16.next = 6;
                          return saveTransaction(dbUpdate);

                        case 6:
                          usdTransaction = _context16.sent;
                          _context16.next = 9;
                          return stellarPayment(admin, usdTransaction, req, res);

                        case 9:
                        case 'end':
                          return _context16.stop();
                      }
                    }
                  }, _callee16, undefined);
                }));

                return function (_x35, _x36) {
                  return _ref18.apply(this, arguments);
                };
              }());
            });

          case 14:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, undefined);
  }));

  return function stripeTransaction(_x33, _x34) {
    return _ref17.apply(this, arguments);
  };
}();

var stellarPayment = exports.stellarPayment = function () {
  var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(admin, usdTransaction, req, res) {
    var receiver, adminKeys, _ref20, hash, dbUpdate, result, resp;

    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return (0, _user.getUserProfile)(req.body.user);

          case 2:
            receiver = _context18.sent;

            console.log('admin.stellarSeed' + admin.stellarSeed);
            adminKeys = _stellarSdk2.default.Keypair.fromSecret(_cryptoJs.AES.decrypt(admin.stellarSeed, ENVCryptoSecret).toString(_cryptoJs.enc.Utf8));
            _context18.prev = 5;
            _context18.next = 8;
            return (0, _stellarAccount.payment)(adminKeys, receiver.stellarAddress, req.body.xlmAmount.toString());

          case 8:
            _ref20 = _context18.sent;
            hash = _ref20.hash;

            console.log('sent successfully', hash);

            dbUpdate = (0, _assign2.default)({}, { 'sender': admin._id, 'receiver': receiver._id, 'amount': req.body.xlmAmount, 'currency': 'xlm', 'transactionID': usdTransaction._id, 'hash': hash });
            _context18.next = 14;
            return saveTransaction(dbUpdate, res);

          case 14:
            result = _context18.sent;

            //let resp = Object.assign({}, result, {usdAmount: usdTransaction.amount});

            resp = {};

            resp.data = result;
            resp.fiat_amount = usdTransaction.amount;
            if (result !== '') res.status(200).send(resp);
            _context18.next = 24;
            break;

          case 21:
            _context18.prev = 21;
            _context18.t0 = _context18['catch'](5);

            res.status(500).send('OOPS!! Something went wrong');

          case 24:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee18, undefined, [[5, 21]]);
  }));

  return function stellarPayment(_x37, _x38, _x39, _x40) {
    return _ref19.apply(this, arguments);
  };
}();

var getCurrentStellarRate = exports.getCurrentStellarRate = function () {
  var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
    return _regenerator2.default.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            (0, _request2.default)('https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=XLM', function (error, result) {
              if (error) console.error(error);else {
                marketRate = JSON.parse(result.body).XLM;
              }
            });

          case 1:
          case 'end':
            return _context19.stop();
        }
      }
    }, _callee19, undefined);
  }));

  return function getCurrentStellarRate() {
    return _ref21.apply(this, arguments);
  };
}();

var checkFiatAmount = function () {
  var _ref22 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(admin, req, res, next) {
    var stripe;
    return _regenerator2.default.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            stripe = require("stripe")(admin.stripeKey);

            stripe.balance.retrieve(function (error, balance) {
              if (error) res.status(500).send('OOPS!! Something went wrong');
              if (balance < req.body.usd * 100) res.status(500).send('Please try smaller amount');else next();
            });

          case 2:
          case 'end':
            return _context20.stop();
        }
      }
    }, _callee20, undefined);
  }));

  return function checkFiatAmount(_x41, _x42, _x43, _x44) {
    return _ref22.apply(this, arguments);
  };
}();

var withdraw = exports.withdraw = function () {
  var _ref23 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21(req, res) {
    return _regenerator2.default.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            fileUpload(req, res);

          case 1:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, undefined);
  }));

  return function withdraw(_x45, _x46) {
    return _ref23.apply(this, arguments);
  };
}();

var downloadFile = function () {
  var _ref24 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23(url, extension, req) {
    return _regenerator2.default.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            return _context23.abrupt('return', new _promise2.default(function (resolve, reject) {
              _http2.default.request(url, function (response) {
                var data = new _stream.Transform();

                response.on('data', function (chunk) {
                  data.push(chunk);
                });

                response.on('end', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
                  var currentDate;
                  return _regenerator2.default.wrap(function _callee22$(_context22) {
                    while (1) {
                      switch (_context22.prev = _context22.next) {
                        case 0:
                          currentDate = Date.now();
                          _context22.next = 3;
                          return _fs2.default.writeFileSync('images/' + req.params.id + '.' + extension, data.read());

                        case 3:
                          resolve();

                        case 4:
                        case 'end':
                          return _context22.stop();
                      }
                    }
                  }, _callee22, this);
                })));
              }).end(console.log('end'));
            }));

          case 1:
          case 'end':
            return _context23.stop();
        }
      }
    }, _callee23, undefined);
  }));

  return function downloadFile(_x47, _x48, _x49) {
    return _ref24.apply(this, arguments);
  };
}();

var fileUpload = function () {
  var _ref26 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24(req, res) {
    var url, extensionArray, extension, admin, stripe;
    return _regenerator2.default.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            url = req.body.verificationFile;
            extensionArray = url.split('.');
            extension = extensionArray[extensionArray.length - 1];
            _context24.next = 5;
            return downloadFile(url, extension, req);

          case 5:
            _context24.next = 7;
            return (0, _admin.getAdmin)();

          case 7:
            admin = _context24.sent;
            stripe = require("stripe")(admin.stripeKey);


            stripe.fileUploads.create({
              purpose: 'identity_document',
              file: {
                data: _fs2.default.readFileSync('images/' + req.params.id + '.' + extension),
                name: 'licence.jpg',
                type: 'application/octet-stream'
              }
            }, function (error, file) {
              if (error) res.status(500).send('OOPS!! Something went wrong');
              createStripeAccount(file, req, res);
            });

          case 10:
          case 'end':
            return _context24.stop();
        }
      }
    }, _callee24, undefined);
  }));

  return function fileUpload(_x50, _x51) {
    return _ref26.apply(this, arguments);
  };
}();

var createStripeAccount = function () {
  var _ref27 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25(file, req, res) {
    var admin, stripe;
    return _regenerator2.default.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _context25.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            admin = _context25.sent;
            stripe = require("stripe")(admin.stripeKey);


            stripe.accounts.create({
              country: "US",
              type: "custom",
              legal_entity: {
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                ssn_last_4: req.body.ssn,
                dob: {
                  day: req.body.day,
                  month: req.body.month,
                  year: req.body.year
                },
                address: {
                  city: req.body.city,
                  line1: req.body.line1,
                  line2: req.body.line2,
                  postal_code: req.body.postalCode,
                  state: req.body.state
                },
                verification: {
                  document: file.id
                },
                type: 'individual',
                phone_number: req.body.phoneNumber
              }
            }, function (error, account) {
              if (error || account === null) res.status(500).send('OOPS!! Something went wrong');
              createBankToken(account.id, req, res);
            });

          case 5:
          case 'end':
            return _context25.stop();
        }
      }
    }, _callee25, undefined);
  }));

  return function createStripeAccount(_x52, _x53, _x54) {
    return _ref27.apply(this, arguments);
  };
}();

var createBankToken = function () {
  var _ref28 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee26(accountId, req, res) {
    var admin, stripe;
    return _regenerator2.default.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            _context26.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            admin = _context26.sent;
            stripe = require("stripe")(admin.stripeKey);


            stripe.tokens.create({
              bank_account: {
                country: 'US',
                currency: 'usd',
                account_holder_name: req.body.accountHolder,
                account_holder_type: 'individual',
                routing_number: req.body.routingNumber,
                account_number: req.body.accountNumber
              }
            }, function (error, token) {
              if (error || token === null) res.status(500).send('OOPS!! Something went wrong');
              createBankAccount(accountId, token.id, req, res);
            });

          case 5:
          case 'end':
            return _context26.stop();
        }
      }
    }, _callee26, undefined);
  }));

  return function createBankToken(_x55, _x56, _x57) {
    return _ref28.apply(this, arguments);
  };
}();

var createBankAccount = function () {
  var _ref29 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee27(accountId, tokenId, req, res) {
    var admin, stripe;
    return _regenerator2.default.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            _context27.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            admin = _context27.sent;
            stripe = require("stripe")(admin.stripeKey);


            stripe.accounts.createExternalAccount(accountId, { external_account: tokenId }, function (error, bank_account) {
              if (error) res.status(500).send('OOPS!! Something went wrong');
              createTransfers(accountId, req, res);
            });

          case 5:
          case 'end':
            return _context27.stop();
        }
      }
    }, _callee27, undefined);
  }));

  return function createBankAccount(_x58, _x59, _x60, _x61) {
    return _ref29.apply(this, arguments);
  };
}();

var createTransfers = function () {
  var _ref30 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee29(accountId, req, res) {
    var admin, stripe, xlmTransaction;
    return _regenerator2.default.wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            _context29.next = 2;
            return (0, _admin.getAdmin)();

          case 2:
            admin = _context29.sent;
            stripe = require("stripe")(admin.stripeKey);
            _context29.next = 6;
            return createStellarTransfer(req, res);

          case 6:
            xlmTransaction = _context29.sent;


            stripe.transfers.create({
              amount: Math.round((Number(req.body.usd) - Number(req.body.walletFee)) * 100),
              currency: "usd",
              destination: accountId
            }, function () {
              var _ref31 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee28(error, transfer) {
                var dbUpdate, usdUpdate;
                return _regenerator2.default.wrap(function _callee28$(_context28) {
                  while (1) {
                    switch (_context28.prev = _context28.next) {
                      case 0:

                        if (error) res.status(500).send('OOPS!! Something went wrong');

                        if (!(req.body.saveDetails === true || req.body.saveDetails == 1)) {
                          _context28.next = 4;
                          break;
                        }

                        _context28.next = 4;
                        return (0, _card.saveWithdrawDetails)(_lodash2.default.pick(req.body, ['ssn', 'firstName', 'lastName', 'day', 'month', 'year', 'city', 'line1', 'line2', 'state', 'postalCode', 'phoneNumber', 'verificationFile', 'accountNumber', 'accountHolder', 'routingNumber', 'user']));

                      case 4:
                        dbUpdate = (0, _assign2.default)({}, { 'sender': admin._id, 'receiver': req.params.id, 'amount': req.body.usd, 'currency': 'usd', 'walletFee': req.body.walletFee, 'transactionID': xlmTransaction._id });
                        _context28.next = 7;
                        return saveTransaction(dbUpdate);

                      case 7:
                        usdUpdate = _context28.sent;


                        res.status(200).send(usdUpdate);

                      case 9:
                      case 'end':
                        return _context28.stop();
                    }
                  }
                }, _callee28, undefined);
              }));

              return function (_x65, _x66) {
                return _ref31.apply(this, arguments);
              };
            }());

          case 8:
          case 'end':
            return _context29.stop();
        }
      }
    }, _callee29, undefined);
  }));

  return function createTransfers(_x62, _x63, _x64) {
    return _ref30.apply(this, arguments);
  };
}();

var createStellarTransfer = function () {
  var _ref32 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee31(req, res) {
    return _regenerator2.default.wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            return _context31.abrupt('return', new _promise2.default(function () {
              var _ref33 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee30(resolve, reject) {
                var admin, user, signerKeys, _ref34, hash, sendUpdate, xlmTransaction;

                return _regenerator2.default.wrap(function _callee30$(_context30) {
                  while (1) {
                    switch (_context30.prev = _context30.next) {
                      case 0:
                        _context30.next = 2;
                        return (0, _admin.getAdmin)();

                      case 2:
                        admin = _context30.sent;
                        _context30.next = 5;
                        return (0, _user.getUserProfile)(req.params.id);

                      case 5:
                        user = _context30.sent;
                        signerKeys = _stellarSdk2.default.Keypair.fromSecret(_cryptoJs.AES.decrypt(user.stellarSeed, ENVCryptoSecret).toString(_cryptoJs.enc.Utf8));
                        _context30.prev = 7;
                        _context30.next = 10;
                        return (0, _stellarAccount.payment)(signerKeys, admin.stellarAddress, req.body.xlm.toString());

                      case 10:
                        _ref34 = _context30.sent;
                        hash = _ref34.hash;

                        console.log('sent successfully', hash);

                        sendUpdate = (0, _assign2.default)({}, { 'sender': user._id, 'receiver': admin._id, 'amount': req.body.xlm, 'currency': 'xlm', fee: Number(req.body.fee) + Number(req.body.rate), 'hash': hash });
                        _context30.next = 16;
                        return saveTransaction(sendUpdate);

                      case 16:
                        xlmTransaction = _context30.sent;

                        resolve(xlmTransaction);
                        _context30.next = 23;
                        break;

                      case 20:
                        _context30.prev = 20;
                        _context30.t0 = _context30['catch'](7);

                        res.status(500).send('OOPS!! Something went wrong');

                      case 23:
                      case 'end':
                        return _context30.stop();
                    }
                  }
                }, _callee30, undefined, [[7, 20]]);
              }));

              return function (_x69, _x70) {
                return _ref33.apply(this, arguments);
              };
            }()));

          case 1:
          case 'end':
            return _context31.stop();
        }
      }
    }, _callee31, undefined);
  }));

  return function createStellarTransfer(_x67, _x68) {
    return _ref32.apply(this, arguments);
  };
}();