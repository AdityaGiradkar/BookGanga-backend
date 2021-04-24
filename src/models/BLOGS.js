const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator');


const blogSchema = new mongoose.Schema({
    header_image: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Please fill valid URL...')
            }
        }
    },
    writer: {
        type: ObjectId,
        ref: 'Users',
        required: true
    },
    tital: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    time_to_read: {
        type: String,
        required: true
    },
    tags: {
        type: [{
            type: ObjectId,
            ref: 'Tags'
        }]
    },
    comments: {
        type: [{
            type: ObjectId,
            ref: 'Blog_comments'
        }]
    },
    likes: {
        type: Number,
        default: 0
    },
    reads: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const BLOGS = mongoose.model('Blogs', blogSchema);

module.exports = BLOGS;