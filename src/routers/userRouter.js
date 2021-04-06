const express = require('express');
const multer = require('multer'); //to send multipart data like images, files
const sharp = require('sharp'); //to resize images
const USERS = require('../models/USERS');
const FOLLOWING = require('../models/FOLLOWING');
const authMiddleware = require('../middleware/auth')


const router = express.Router()

//create new user
router.post("/user/create", async(req, res) => {
    const user = new USERS(req.body)

    try {
        await user.save()
        const token = await user.generateToken()

        res.status(201).send({ user: user.getPublicProfile(), token: token })
            // res.status(201).send({ user: user.getPublicProfile() })
    } catch (err) {
        res.status(400).send(err.message)
    }
});

//login in user account
router.post('/user/login', async(req, res) => {
    // console.log(req.body.email, req.body.password)
    try {
        const user = await USERS.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
            // console.log(user)
        res.send({ user: user.getPublicProfile(), token: token })

        // res.send({ user: user.getPublicProfile() })
    } catch (err) {
        res.status(400).send()
    }
})

//logout from user account
router.post('/me/logout', authMiddleware, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send("logout sucess!!!")
    } catch (err) {
        res.status(500).send()
    }
})

//upload profile image
const upload = multer({
    // dest: 'avaters',
    limits: {
        fileSize: 1000000 //1MB   
    },
    fileFilter(req, file, callBack) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callBack(new Error('Enter valid image file.'));
        }

        callBack(undefined, true);
    }
});
router.post('/me/avatar', authMiddleware, upload.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send({ message: 'upload sucess' })
}, (error, req, res, next) => { //used this function signiture to handel error
    res.status(400).send({ error: error.message })
})

//delete profile pic
router.delete('/me/avatar', authMiddleware, async(req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send({ message: 'delete sucess' })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})

//see profile pic of other user
router.get('/:user/avatar', async(req, res) => {
    try {
        const user = await USERS.findOne({ user_name: req.params.user }).select('avatar')
            // console.log(user.avatar)
        if (!user || !user.avatar) {
            throw new Error("no image or user found")
        }

        res.set('Content-Type', 'image/png') //set header for response
        res.send(user.avatar)
    } catch (err) {
        console.log(err)
        res.status(400).send({ message: err.message })
    }
})

//public profile of any user
router.get("/:user/publicProfile", async(req, res) => {
    try {
        const user = await USERS.findOne({ user_name: req.params.user }).select('bio fname lname user_name email dob createdAt')
        res.send(user)
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})

//get all folowers list
router.get("/me/followers", authMiddleware, async(req, res) => {
    // try {
    //     let followersList = await USERS.findOne({ _id: req.user._id }).populate({ path: 'followers', model: 'Users', select: { '_id': 1, 'user_name': 1 }, }).select('followers -_id')
    //     res.send(followersList)
    // } catch (err) {
    //     res.status(400).send({ message: err.message })
    // }

    try {
        let followersList = await FOLLOWING.find({ followedTo: req.user._id }).populate({ path: 'followedBy', model: 'Users', select: { '_id': 1, 'user_name': 1 } }).select('followedBy -_id')
        res.send(followersList)
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})

//get all following list
router.get("/me/following", authMiddleware, async(req, res) => {
    try {
        let followingList = await FOLLOWING.find({ followedBy: req.user._id }).populate({ path: 'followedTo', model: 'Users', select: { '_id': 1, 'user_name': 1 } }).select('followedTo -_id')
            // let followingList = await FOLLOWING.find({ followedBy: req.user._id }).populate('Users', '_id user_name').select('followedTo -_id')
        res.send(followingList)
    } catch (err) {
        res.status(400).send({ message: err.message })
    }

    // try {
    //     let followingList = await USERS.findOne({ _id: req.user._id }).populate({ path: 'following', model: 'Users', select: { '_id': 1, 'user_name': 1 }, }).select('following -_id')
    //     res.send(followingList)
    // } catch (err) {
    //     res.status(400).send({ message: err.message })
    // }
})

//Follow new person
router.post("/:user_name/follow", authMiddleware, async(req, res) => {
    try {
        if (req.params.user_name === req.user.user_name) {
            throw new Error("you cannot follow yourself.")
        }
        //find user id of Followed user
        let user = await USERS.findOne({ user_name: req.params.user_name }).select('_id')

        //Add new entry in following collection 
        const newEntry = new FOLLOWING({ followedBy: req.user._id, followedTo: user })
        await newEntry.save()

        res.send("Following...")
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})

//update user details with specific fields
router.patch("/me", authMiddleware, async(req, res) => {

    //seprate keys of all upadated fields in request body
    const updates = Object.keys(req.body)

    //list valides updates field which user can do
    const allowedToUpdate = ['fname', 'lname', 'bio', 'dob', 'password']

    //check for every update user mentioned are valid update or not
    //if any of update is invalid then return false
    const isValidUpdate = updates.every((update) => {
        return (allowedToUpdate.includes(update))
    })


    //if any of updates is invalid then throw an error
    if (!isValidUpdate) {
        return res.status(400).send({
            error: "Invalid Update!!"
        })
    }

    try {
        const user = req.user;

        //do all the update and store in user and then save it
        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save()
        res.send(user.getPublicProfile())
    } catch (err) {
        res.status(400).send(err)
    }
})

//delete user
router.delete("/me", authMiddleware, async(req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router;