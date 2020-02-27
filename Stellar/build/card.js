'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getWithdrawDetails = exports.saveWithdrawDetails = exports.saveCardDetails = exports.getCardDetails = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _CardSchema = require('../models/CardSchema');

var _AccountSchema = require('../models/AccountSchema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getCardDetails = exports.getCardDetails = function getCardDetails(req, res) {
    return _CardSchema.Card.find({ user: req.params.id }, function (error, response) {
        if (error) console.error(error);else {
            res.status(200).send(response);
        }
    });
};

var saveCardDetails = exports.saveCardDetails = function saveCardDetails(cardDetails) {
    var card = new _CardSchema.Card(cardDetails);
    return card.save();
};

var saveWithdrawDetails = exports.saveWithdrawDetails = function saveWithdrawDetails(details) {
    return new _promise2.default(function (resolve, reject) {
        var account = new _AccountSchema.Account(details);
        resolve(account.save());
    });
};

var getWithdrawDetails = exports.getWithdrawDetails = function getWithdrawDetails(req, res) {
    return _AccountSchema.Account.find({ user: req.params.id }, function (error, response) {
        if (error) console.error(error);else {
            res.status(200).send(response);
        }
    });
};