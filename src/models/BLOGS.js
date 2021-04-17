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
        ref: 'Users'
    },
    tital: {
        type: String,
        required: true
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
    tags: {
        type: [{
            type: ObjectId,
            ref: 'Tags'
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