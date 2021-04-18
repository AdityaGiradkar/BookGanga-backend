const mongoose = require('mongoose')
const validator = require('validator')
var ObjectId = require('mongodb').ObjectID;


const reviewSchema = new mongoose.Schema({
    reviewBy: {
        type: ObjectId,
        ref: 'Users'
    },
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