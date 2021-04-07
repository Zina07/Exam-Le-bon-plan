const mongoose = require('mongoose');

// Configuration Mongoose model for user
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    cities: {
        type: String,
        enum: ['paris', 'lyon', 'marseille'],
        required: true,
    },
    description: String,
    pictureUrl: {
        type: String
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});

const Product = new mongoose.model('Product', schema);

module.exports = Product