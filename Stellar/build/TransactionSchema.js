'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Transaction = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var ObjectId = Schema.ObjectId;
var saltRounds = 10;

var TransactionModel = new Schema({
    sender: { type: ObjectId, ref: 'user' },
    receiver: { type: ObjectId, ref: 'user' },
    currency: { type: String, enum: ['usd', 'xlm'] },
    amount: String,
    cardNumber: String,
    fee: String,
    createdTs: { type: Date, default: Date.now },
    hash: String,
    transactionID: String,
    walletAmount: String,
    walletFee: String
});

var Transaction = exports.Transaction = _mongoose2.default.model('transaction', TransactionModel);