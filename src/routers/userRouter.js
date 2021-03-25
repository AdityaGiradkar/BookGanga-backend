const express = require('express');
const multer = require('multer'); //to send multipart data like images, files
// const sharp = require('sharp'); //to resize images
const USERS = require('../models/USERS');
const authMiddleware = require('../middleware/auth')


const router = express.Router()

router.post("/user/create", async(req, res) => {
    const user = new USERS(req.body)

    try {
        await user.save()
        const token = await user.generateToken()

        res.status(201).send({ user: user.getPublicProfile(), token: token })
            // res.status(201).send({ user: user.getPublicProfile() })
    } catch (err) {
        res.status(400).send(err)
    }
});

router.post('/user/login', async(req, res) => {
    // console.log(req.body.email, req.body.password)
    try {
        const user = await USERS.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()

        res.send({ user: user.getPublicProfile(), token: token })

        // res.send({ user: user.getPublicProfile() })
    } catch (err) {
        res.status(400).send()
    }
})

router.post('/user/logout', authMiddleware, async(req, res) => {
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

// const upload = multer({
//     // dest: 'avaters',
//     limits: {
//         fileSize: 1000000 //1MB   
//     },
//     fileFilter(req, file, callBack) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return callBack(new Error('Enter valid image file.'));
//         }

//         callBack(undefined, true);
//     }
// });

// router.post('/user/me/avater', authMiddleware, upload.single('avater'), async(req, res) => {
//         const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
//         req.user.avatar = buffer
//         await req.user.save()
//         res.status(200).send({ message: 'upload sucess' })
//     }, (error, req, res, next) => { //used this function signiture to handel error
//         res.status(400).send({ error: error.message })
//     })
// router.get("/users/:id", async(req, res) => {
//     const id = req.params.id;

//     try {
//         const user = await User.find({ _id: id });
//         if (!user) {
//             return res.status(404).send()
//         } else {
//             res.send(user);
//         }
//     } catch (err) {
//         res.status(500).send()
//     }

//     // User.find({ _id: id }).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send()
//     //     } else {
//     //         res.send(user);
//     //     }
//     // }).catch((err) => {
//     //     res.status(500).send()
//     // })
// })

// //delete profile pic
// router.delete('/user/me/avater', authMiddleware, async(req, res) => {

//     req.user.avatar = undefined
//     await req.user.save()
//     res.status(200).send({ message: 'delete sucess' })
// })

// router.get('/user/:id/avater', async(req, res) => {
//     try {
//         const user = await User.findById(req.params.id)

//         if (!user || !user.avatar) {
//             throw new Error()
//         }

//         res.set('Content-Type', 'image/png') //set header for response
//         res.send(user.avatar)
//     } catch (err) {
//         res.status(400).send()
//     }
// })


// router.get("/usersProfile", async(req, res) => {
//     res.send(req.user.getPublicProfile())
// })

//update user details with specific fields
router.patch("/user/me", authMiddleware, async(req, res) => {

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
router.delete("/user/me", authMiddleware, async(req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router;