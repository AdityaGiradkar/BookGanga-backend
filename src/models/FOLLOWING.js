const mongoose = require('mongoose')
const validator = require('validator')


const followingSchema = new mongoose.Schema({
    follower: {
        type: ObjectId,
        ref: 'Users'
    },
    following: {
        type: ObjectId,
        ref: 'Users'
    }
});

const FOLLOWING = mongoose.model('Following', followingSchema);

module.exports = FOLLOWING;