'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Account = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var ObjectId = Schema.ObjectId;

var AccountModel = new Schema({
    firstName: String,
    lastName: String,
    line1: String,
    line2: String,
    state: String,
    city: String,
    mobile_number: String,
    ssn: String,
    day: String,
    month: String,
    year: String,
    verificationFile: String,
    postalCode: String,
    accountNumber: String,
    accountHolder: String,
    routingNumber: String,
    phoneNumber: String,
    user: { type: ObjectId, ref: 'user' },
    createdTs: { type: Date, default: Date.now }
});

var Account = exports.Account = _mongoose2.default.model('account', AccountModel);