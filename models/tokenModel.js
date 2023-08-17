// models/tokenModel.js

const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    token: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
