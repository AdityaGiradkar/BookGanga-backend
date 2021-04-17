const mongoose = require('mongoose')
const validator = require('validator')


const tagSchema = new mongoose.Schema({
    tag_name: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isAlpha(value)) {
                throw new Error('Please fill valid String...')
            }
        }
    },
    followers: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

//create index on tag name
tagSchema.index({ tag_name: 1 });

const TAGS = mongoose.model('Tags', tagSchema);

module.exports = TAGS;