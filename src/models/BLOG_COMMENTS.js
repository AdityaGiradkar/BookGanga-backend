const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator')


const commentSchema = new mongoose.Schema({
    blog_id: {
        type: ObjectId,
        ref: 'Blogs',
        required: true
    },
    comment_writer: {
        type: ObjectId,
        ref: 'Users',
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const COMMENTS = mongoose.model('Blog_comments', commentSchema);

module.exports = COMMENTS;