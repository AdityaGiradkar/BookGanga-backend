const mongoose = require('mongoose')
const validator = require('validator')


const bookSchema = new mongoose.Schema({
    header_image: {
        type: Buffer
    },
    author: {
        type: ObjectId,
        ref: 'Users'
    },
    description: {
        type: String
    },
    reviews: {
        type: ObjectId,
        ref: 'reviews'
    },
    rent_price: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const BOOKS = mongoose.model('Books', bookSchema);

module.exports = BOOKS;