const mongoose = require('mongoose')
const validator = require('validator')


const commentSchema = new mongoose.Schema({
    blog_id: {
        type: ObjectId,
        ref: 'Blogs'
    },
    writer: {
        type: ObjectId,
        ref: 'Users'
    },
    content: {
        type: String
    },
}, {
    timestamps: true
});

const COMMENTS = mongoose.model('Comments', commentSchema);

module.exports = COMMENTS;