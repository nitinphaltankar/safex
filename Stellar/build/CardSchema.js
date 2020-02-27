'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Card = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var ObjectId = Schema.ObjectId;

var CardModel = new Schema({
    number: 'String',
    expiry: 'String',
    holder: 'String',
    type: 'String',
    user: { type: ObjectId, ref: 'user' },
    createdTs: { type: Date, default: Date.now }
});

var Card = exports.Card = _mongoose2.default.model('card', CardModel);