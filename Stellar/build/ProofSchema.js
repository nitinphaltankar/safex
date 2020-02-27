'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Proof = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var ObjectId = Schema.ObjectId;

var ProofModel = new Schema({
    addressProof: String,
    idProof: String,
    photoProof: String,
    createdTs: { type: Date, default: Date.now }
});

var Proof = exports.Proof = _mongoose2.default.model('proof', ProofModel);