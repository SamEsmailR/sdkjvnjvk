const mongoose = require('mongoose');
const { ROLES } = require('../config');

// User Schema
const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ROLES
    },
    tenant: { type: String, ref: 'Tenant' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
