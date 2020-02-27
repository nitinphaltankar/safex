'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.withdrawTransaction = exports.depositTransaction = exports.getReceivedAmount = exports.receivedStellarTransaction = exports.sentStellarTransaction = exports.uploadKyc = exports.getStellarAccount = exports.getUserCount = exports.getAllProfile = exports.getCountryCode = exports.getUserProfile = exports.getUserDetails = exports.getUser = exports.searchAutocomplete = exports.uploadImage = exports.loginUser = exports.editProfile = exports.updateUser = exports.createAddress = exports.createUser = exports.saveUser = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _cloudinary = require('cloudinary');

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _UserSchema = require('../models/UserSchema');

var _ProofSchema = require('../models/ProofSchema');

var _sendSms = require('../service/sendSms');

var _stellarAccount = require('../service/stellarAccount');

var _TransactionSchema = require('../models/TransactionSchema');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _admin = require('./admin');

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var saveUser = exports.saveUser = function saveUser(req, res) {
    _UserSchema.User.findOne({ mobile_number: req.body.mobile_number, code: req.body.code }, function (error, existingUser) {
        if (error) console.error(error);
        if (existingUser !== null) {
            loginUser(req, res);
        } else {
            createUser(req, res);
        }
    });
};

var createUser = exports.createUser = function createUser(req, res) {
    var user = new _UserSchema.User(req.body);
    user.save(function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(error, response) {
            var result, otp;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!error) {
                                _context.next = 4;
                                break;
                            }

                            console.error(error);
                            _context.next = 12;
                            break;

                        case 4:
                            _context.next = 6;
                            return (0, _stellarAccount.createAccount)();

                        case 6:
                            result = _context.sent;
                            _context.next = 9;
                            return (0, _sendSms.sendSms)(req.body.mobile_number);

                        case 9:
                            otp = _context.sent;

                            console.log('otp', otp);
                            updateUser(response._id, (0, _assign2.default)({}, result, { 'otp': otp }), res);

                        case 12:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());
};

var createAddress = exports.createAddress = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var result;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return (0, _stellarAccount.createAccount)();

                    case 2:
                        result = _context2.sent;

                        console.log(result);
                        //await updateUser(req.body._id, Object.assign({}, result), res);
                        res.send({ 'status': true, 'data': result });

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function createAddress(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var updateUser = exports.updateUser = function updateUser(id, body, res) {

    _UserSchema.User.findOneAndUpdate({ _id: id }, { $set: body }, { new: true, upsert: true }, function (error, response) {
        if (error) console.error(error);else {
            res.status(200).send(response);
        }
    });
};

var editProfile = exports.editProfile = function editProfile(req, res) {
    updateUser(req.params.id, req.body, res);
};

var loginUser = exports.loginUser = function loginUser(req, res) {

    _UserSchema.User.findOne({ mobile_number: req.body.mobile_number }, function (error, user) {
        if (error) res.status(500).send({ 'message': error });else {
            user.comparePassword(req.body.password, function (error, isMatch) {
                if (error) res.status(500).send({ 'message': error });else {
                    isMatch ? res.status(200).send({ user: user, message: 'Existing user' }) : res.status(500).send({ 'message': 'Incorrect password' });
                }
            });
        }
    });
};

var uploadImage = exports.uploadImage = function uploadImage(req, res) {
    _cloudinary2.default.v2.uploader.upload('data:image/jpg;base64,' + req.body.image, function (error, result) {
        console.log('err', error, result);
        res.send(result);
    });
};

var searchAutocomplete = exports.searchAutocomplete = function searchAutocomplete(req, res) {
    var regex = new RegExp('^' + req.query.mobile_number);
    _UserSchema.User.find({ mobile_number: regex }, function (error, response) {
        if (error) console.error(error);else {
            res.status(200).send(response);
        }
    });
};

var getUser = exports.getUser = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _UserSchema.User.findOne({ _id: req.params.id }).populate('proofs').exec(function (error, response) {
                            if (error) console.error({ 'message': error });else {
                                res.status(200).send(response);
                            }
                        });

                    case 1:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function getUser(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

var getUserDetails = exports.getUserDetails = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _UserSchema.User.findOne({ mobile_number: req.query.mobile_number }).exec(function (error, response) {
                            if (error) console.error({ 'message': error });else {
                                res.status(200).send(response);
                            }
                        });

                    case 1:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function getUserDetails(_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();

var getUserProfile = exports.getUserProfile = function getUserProfile(id) {
    return _UserSchema.User.findOne({ _id: id }, function (error, response) {
        if (error) console.error({ 'message': error });else {
            return response;
        }
    });
};

var getCountryCode = exports.getCountryCode = function getCountryCode(req, res) {
    var country = [];
    var url = req.query.name == undefined ? 'https://restcountries.eu/rest/v2/all' : 'https://restcountries.eu/rest/v2/name/' + req.query.name;

    (0, _request2.default)(url, function (error, result) {
        if (error) res.status(500).send({ 'message': error });else {
            JSON.parse(result.body).map(function (item) {
                return country.push(_lodash2.default.pick(item, ['name', 'callingCodes', 'flag']));
            });
            res.status(200).send(country);
        }
    });
};

var getAllProfile = exports.getAllProfile = function getAllProfile(req, res) {
    _UserSchema.User.find().populate('proofs').exec(function (error, response) {
        if (error) console.error(error);else {
            res.status(200).send(response);
        }
    });
};

var getUserCount = exports.getUserCount = function getUserCount(req, res) {
    _UserSchema.User.countDocuments().exec(function (error, count) {
        if (error) console.error(error);else {
            res.status(200).send({ count: count });
        }
    });
};

var getStellarAccount = exports.getStellarAccount = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
        var user, result;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return getUserProfile(req.params.id);

                    case 2:
                        user = _context5.sent;
                        _context5.next = 5;
                        return (0, _stellarAccount.getAccount)(user.stellarAddress);

                    case 5:
                        result = _context5.sent;

                        res.status(200).send(result.balances);

                    case 7:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function getStellarAccount(_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}();

var uploadKyc = exports.uploadKyc = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
        var proof;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        proof = new _ProofSchema.Proof(req.body);

                        proof.save(function () {
                            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(error, response) {
                                return _regenerator2.default.wrap(function _callee6$(_context6) {
                                    while (1) {
                                        switch (_context6.prev = _context6.next) {
                                            case 0:
                                                if (error) console.error(error);else {
                                                    updateUser(req.params.id, { 'proofs': response._id }, res);
                                                }

                                            case 1:
                                            case 'end':
                                                return _context6.stop();
                                        }
                                    }
                                }, _callee6, undefined);
                            }));

                            return function (_x13, _x14) {
                                return _ref7.apply(this, arguments);
                            };
                        }());

                    case 2:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function uploadKyc(_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}();

var sentStellarTransaction = exports.sentStellarTransaction = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(req, res) {
        var admin;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return (0, _admin.getAdmin)();

                    case 2:
                        admin = _context8.sent;

                        console.log('stellar transaction get');
                        _TransactionSchema.Transaction.find({ $and: [{ currency: 'xlm', sender: req.params.id, receiver: { $ne: admin._id } }] })
                        //Transaction.find({$and: [{currency: 'xlm', sender: req.params.id}]})
                        .sort({ createdTs: -1 }).populate({ path: 'receiver', select: ['stellarAddress', 'full_name'] }).exec(function (error, response) {
                            if (error) console.error(error);else {
                                res.status(200).send(response);
                            }
                        });

                    case 5:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function sentStellarTransaction(_x15, _x16) {
        return _ref8.apply(this, arguments);
    };
}();

var receivedStellarTransaction = exports.receivedStellarTransaction = function () {
    var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(req, res) {
        var admin;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return (0, _admin.getAdmin)();

                    case 2:
                        admin = _context9.sent;

                        _TransactionSchema.Transaction.find({ $and: [{ currency: 'xlm', receiver: req.params.id, sender: { $ne: admin._id } }] }).sort({ createdTs: -1 }).populate({ path: 'sender', select: ['stellarAddress', 'full_name', 'mobile_number'] }).exec(function (error, response) {
                            if (error) console.error(error);else {
                                res.status(200).send(response);
                            }
                        });

                    case 4:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }));

    return function receivedStellarTransaction(_x17, _x18) {
        return _ref9.apply(this, arguments);
    };
}();

var getReceivedAmount = exports.getReceivedAmount = function getReceivedAmount(transactionId) {
    console.log('called', transactionId);
    return _TransactionSchema.Transaction.findOne({ transactionID: transactionId }, function (error, response) {
        console.log('response', response);
        if (error) console.error({ 'message': error });else {
            return response;
        }
    });
};

var depositTransaction = exports.depositTransaction = function () {
    var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(req, res) {
        return _regenerator2.default.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        _TransactionSchema.Transaction.find({ $and: [{ currency: 'usd', sender: req.params.id }] }).sort({ createdTs: -1 }).lean().exec(function () {
                            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(error, response) {
                                var final;
                                return _regenerator2.default.wrap(function _callee11$(_context11) {
                                    while (1) {
                                        switch (_context11.prev = _context11.next) {
                                            case 0:
                                                if (error) console.error(error);else {
                                                    final = [];

                                                    _async2.default.eachLimit(response, 1, function () {
                                                        var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(usdTransaction, callback) {
                                                            var xlmTransaction;
                                                            return _regenerator2.default.wrap(function _callee10$(_context10) {
                                                                while (1) {
                                                                    switch (_context10.prev = _context10.next) {
                                                                        case 0:
                                                                            _context10.next = 2;
                                                                            return getReceivedAmount(usdTransaction._id);

                                                                        case 2:
                                                                            xlmTransaction = _context10.sent;

                                                                            if (xlmTransaction !== null) final.push((0, _assign2.default)({}, usdTransaction, { hash: xlmTransaction.hash, received: xlmTransaction.amount }));
                                                                            callback();

                                                                        case 5:
                                                                        case 'end':
                                                                            return _context10.stop();
                                                                    }
                                                                }
                                                            }, _callee10, undefined);
                                                        }));

                                                        return function (_x23, _x24) {
                                                            return _ref12.apply(this, arguments);
                                                        };
                                                    }(), function () {
                                                        res.status(200).send(final);
                                                    });
                                                }

                                            case 1:
                                            case 'end':
                                                return _context11.stop();
                                        }
                                    }
                                }, _callee11, undefined);
                            }));

                            return function (_x21, _x22) {
                                return _ref11.apply(this, arguments);
                            };
                        }());

                    case 1:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee12, undefined);
    }));

    return function depositTransaction(_x19, _x20) {
        return _ref10.apply(this, arguments);
    };
}();

var withdrawTransaction = exports.withdrawTransaction = function () {
    var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(req, res) {
        var admin;
        return _regenerator2.default.wrap(function _callee15$(_context15) {
            while (1) {
                switch (_context15.prev = _context15.next) {
                    case 0:
                        _context15.next = 2;
                        return (0, _admin.getAdmin)();

                    case 2:
                        admin = _context15.sent;

                        _TransactionSchema.Transaction.find({ $and: [{ currency: 'xlm', sender: req.params.id, receiver: admin._id }] }).sort({ createdTs: -1 }).lean().exec(function () {
                            var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(error, response) {
                                var final;
                                return _regenerator2.default.wrap(function _callee14$(_context14) {
                                    while (1) {
                                        switch (_context14.prev = _context14.next) {
                                            case 0:
                                                if (error) console.error(error);else {
                                                    final = [];

                                                    _async2.default.eachLimit(response, 1, function () {
                                                        var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(xlmTransaction, callback) {
                                                            var usdTransaction;
                                                            return _regenerator2.default.wrap(function _callee13$(_context13) {
                                                                while (1) {
                                                                    switch (_context13.prev = _context13.next) {
                                                                        case 0:
                                                                            _context13.next = 2;
                                                                            return getReceivedAmount(xlmTransaction._id);

                                                                        case 2:
                                                                            usdTransaction = _context13.sent;

                                                                            if (usdTransaction !== null) final.push((0, _assign2.default)({}, xlmTransaction, { received: usdTransaction.amount, walletFee: usdTransaction.walletFee }));
                                                                            callback();

                                                                        case 5:
                                                                        case 'end':
                                                                            return _context13.stop();
                                                                    }
                                                                }
                                                            }, _callee13, undefined);
                                                        }));

                                                        return function (_x29, _x30) {
                                                            return _ref15.apply(this, arguments);
                                                        };
                                                    }(), function () {
                                                        res.status(200).send(final);
                                                    });
                                                }

                                            case 1:
                                            case 'end':
                                                return _context14.stop();
                                        }
                                    }
                                }, _callee14, undefined);
                            }));

                            return function (_x27, _x28) {
                                return _ref14.apply(this, arguments);
                            };
                        }());

                    case 4:
                    case 'end':
                        return _context15.stop();
                }
            }
        }, _callee15, undefined);
    }));

    return function withdrawTransaction(_x25, _x26) {
        return _ref13.apply(this, arguments);
    };
}();