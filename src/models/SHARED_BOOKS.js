const mongoose = require('mongoose')
const validator = require('validator')


const shared_bookSchema = new mongoose.Schema({
    book_id: {
        type: ObjectId,
        ref: 'Books'
    },
    shared_by: {
        type: ObjectId,
        ref: 'Users'
    },
    received_by: {
        type: ObjectId,
        ref: 'Users'
    },
    rent_price: {
        type: Number
    },
    status: {
        type: String
    }
}, {
    timestamps: true
});

const SHARED_BOOKS = mongoose.model('Shared_books', shared_bookSchema);

module.exports = SHARED_BOOKS;