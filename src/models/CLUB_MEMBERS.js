const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator')


const clubMemberSchema = new mongoose.Schema({
    club_id: {
        type: ObjectId,
        ref: 'Clubs',
        required: true
    },
    user_id: {
        type: ObjectId,
        ref: 'Users',
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    confirmation: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});


const CLUB_MEMBERS = mongoose.model('Club_member', clubMemberSchema);

module.exports = CLUB_MEMBERS;