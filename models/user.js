const mongoose = require('mongoose');

// Configuration Mongoose model for user
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minlength: 8
    }
});

const User = new mongoose.model('User', schema);

module.exports = User