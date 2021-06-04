const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator')


const clubSchema = new mongoose.Schema({
    club_name: {
        type: String,
        required: true
    },
    cover_image: {
        type: Buffer,
        // required: true
    },
    admin: {
        type: ObjectId,
        ref: 'Users',
        required: true
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});


const CLUBS = mongoose.model('Clubs', clubSchema);

module.exports = CLUBS;