const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator')


const followingSchema = new mongoose.Schema({
    followedBy: {
        type: ObjectId,
        ref: 'Users'
    },
    followedTo: {
        type: ObjectId,
        ref: 'Users'
    }
});

const FOLLOWING = mongoose.model('Following', followingSchema);

module.exports = FOLLOWING;