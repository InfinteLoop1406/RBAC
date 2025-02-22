const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Basic', 'admin'], default: 'Basic' }
});

module.exports = mongoose.model('User', userSchema);
