'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Admin = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var ObjectId = Schema.ObjectId;
var saltRounds = 10;

var AdminModel = new Schema({
    mobile_number: String,
    password: String,
    createdTs: { type: Date, default: Date.now },
    stellarAddress: String,
    stellarSeed: String,
    stripeKey: String,
    sellRate: String,
    sellTransactionFee: String,
    sendTransactionFee: String,
    termsAndConditions: String
});

AdminModel.pre("save", function (next) {
    var user = this;
    _bcrypt2.default.genSalt(saltRounds, function (error, salt) {
        if (error) return next(error);
        _bcrypt2.default.hash(user.password, salt, function (error, hash) {
            if (error) return next(error);
            // Store hashed password in DB.
            user.password = hash;
            next();
        });
    });
});

AdminModel.methods.comparePassword = function (candidatePassword, cb) {
    var user = this;
    _bcrypt2.default.compare(candidatePassword, user.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var Admin = exports.Admin = _mongoose2.default.model('admin', AdminModel);