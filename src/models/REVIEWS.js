const mongoose = require('mongoose')
const validator = require('validator')


const reviewSchema = new mongoose.Schema({
    writer: {
        type: ObjectId,
        ref: 'Users'
    },
    book: {
        type: ObjectId,
        ref: 'Books'
    },
    content: {
        type: String
    }
}, {
    timestamps: true
});

const REVIEWS = mongoose.model('Reviews', reviewSchema);

module.exports = REVIEWS;