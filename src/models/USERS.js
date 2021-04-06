const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        // required: true,
        trim: true
    },
    lname: {
        type: String,
        // required: true,
        trim: true
    },
    user_name: {
        type: String,
        unique: true,
        trim: true
    },
    bio: {
        type: String,
        default: ""
    },
    avatar: {
        type: Buffer
    },
    email: {
        type: String,
        unique: true,
        // required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    dob: {
        type: String
    },
    // followers: {
    //     type: [{
    //         type: ObjectId,
    //         ref: 'Users'
    //     }]
    // },
    // following: {
    //     type: [{
    //         type: ObjectId,
    //         ref: 'Users'
    //     }]
    // },
    list_of_blogs: {
        type: [{
            type: ObjectId,
            ref: 'Blogs'
        }]
    },
    // list_of_reviews: {
    //     type: [{
    //         type: ObjectId,
    //         ref: 'Reviews'
    //     }]
    // },
    bookshelf: {
        type: [{
            type: ObjectId,
            ref: 'Books'
        }]
    },
    wishlist: {
        type: [{
            type: ObjectId,
            ref: 'Books'
        }]
    },
    taglist: {
        type: [{
            type: ObjectId,
            ref: 'Tags'
        }]
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password is not set as password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})


//generation of token
userSchema.methods.generateToken = async function() {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token: token })
    await user.save()

    return token

}

userSchema.methods.getPublicProfile = function() {
    // console.log('sucess')
    const user = this;

    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;
    // delete userObject.followers;
    // delete userObject.following;
    delete userObject.list_of_blogs;
    // delete userObject.list_of_reviews;
    delete userObject.bookshelf;
    delete userObject.wishlist;
    delete userObject.taglist;
    delete userObject.avatar;

    return userObject
}

//find user by using credentials 
userSchema.statics.findByCredentials = async(email, password) => {
    //console.log("abc")
    const user = await USERS.findOne({ email: email })

    if (!user) {
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user
}

userSchema.pre('save', async function(next) {
    const user = this

    // console.log("just")

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//removing all tasks related to to user which is deleting account
// userSchema.pre('remove', async function(next) {
//     const user = this
//     await Task.deleteMany({ owner: user._id })
//     next()
// })

const USERS = mongoose.model('Users', userSchema);

module.exports = USERS;