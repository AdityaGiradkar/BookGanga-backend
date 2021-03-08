const mongoose = require('mongoose')
const validator = require('validator')


const blogSchema = new mongoose.Schema({
    header_image: {
        type: Buffer
    },
    writer: {
        type: ObjectId,
        ref: 'Users'
    },
    content: {
        type: String
    },
    description: {
        type: String
    },
    time_to_read: {
        type: String
    },
    publish_date: {
        type: String
    },
    comments: {
        type: [{
            type: ObjectId,
            ref: 'comments'
        }]
    },
    tags: {
        type: [{
            type: ObjectId,
            ref: 'Tags'
        }]
    },
    likes: {
        type: Number
    },
    reads: {
        type: Number
    }
}, {
    timestamps: true
});

const BLOGS = mongoose.model('Blogs', blogSchema);

module.exports = BLOGS;