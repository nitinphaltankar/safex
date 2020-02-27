'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createStellarAddress = exports.adminDetails = exports.getAdmin = exports.updateProfile = exports.updateUser = exports.loginUser = exports.createUser = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _AdminSchema = require('../models/AdminSchema');

var _stellarAccount = require('../service/stellarAccount');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createUser = exports.createUser = function createUser(req, res) {
    var admin = new _AdminSchema.Admin(req.body);
    admin.save(function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(error, response) {
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (error) console.error(error);else {
                                res.send(response);
                            }

                        case 1:
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

var loginUser = exports.loginUser = function loginUser(req, res) {

    _AdminSchema.Admin.findOne({ mobile_number: req.body.mobile_number }, function (error, user) {
        if (error) console.error(error);else {
            user.comparePassword(req.body.password, function (error, isMatch) {
                if (error) console.error(error);else {
                    isMatch ? res.status(200).send(user) : res.send('Incorrect password');
                }
            });
        }
    });
};

var updateUser = exports.updateUser = function updateUser(id, body, res) {

    _AdminSchema.Admin.findOneAndUpdate({ _id: id }, { $set: body }, { new: true, upsert: true }, function (error, response) {
        if (error) console.error(error);else {
            res.status(200).send(response);
        }
    });
};

var updateProfile = exports.updateProfile = function updateProfile(req, res) {
    updateUser(req.params.id, req.body, res);
};

var getAdmin = exports.getAdmin = function getAdmin() {
    return _AdminSchema.Admin.findOne(function (error, response) {
        if (error) console.error(error);else {
            return response;
        }
    });
};

var adminDetails = exports.adminDetails = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var response;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return getAdmin();

                    case 2:
                        response = _context2.sent;

                        res.status(200).send(response);

                    case 4:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function adminDetails(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var createStellarAddress = exports.createStellarAddress = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var admin, stellarAccount;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return getAdmin();

                    case 2:
                        admin = _context3.sent;
                        _context3.next = 5;
                        return (0, _stellarAccount.createAccount)();

                    case 5:
                        stellarAccount = _context3.sent;

                        console.log('stellarAccount', stellarAccount);
                        updateUser(admin._id, stellarAccount, res);

                    case 8:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function createStellarAddress(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();