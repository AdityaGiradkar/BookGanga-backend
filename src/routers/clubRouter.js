const express = require('express');
const multer = require('multer'); //to send multipart data like images, files
const sharp = require('sharp'); //to resize images
const USERS = require('../models/USERS');
const TAGS = require('../models/TAGS');
const CLUBS = require('../models/CLUBS');
const CLUB_MEMBERS = require('../models/CLUB_MEMBERS');
const authMiddleware = require('../middleware/auth')

const router = express.Router()


//upload profile image
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

//create new club
router.post('/club/create', authMiddleware, async(req, res) => {
    // const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    const club = new CLUBS({
        ...req.body,
        admin: req.user._id
    })
    try {
        let new_club = await club.save()
            // console.log(new_club._id)

        const club_join = new CLUB_MEMBERS({
            club_id: new_club._id,
            user_id: req.user._id,
            admin: true,
            confirmation: true
        })

        await club_join.save();

        res.status(200).send({ message: 'Club created' })
    } catch (err) {
        res.status(400).send(err.message)
    }

})

//join club - make request for join to admin
router.post('/club/join/:clubid', authMiddleware, async(req, res) => {
    try {
        let present = await CLUB_MEMBERS.exists({ club_id: req.params.clubid, user_id: req.user._id })

        // check if user already member of club
        // if yes then throw error
        if (present) {
            throw new Error('Already a member...')
        }

        const club_join = new CLUB_MEMBERS({
            club_id: req.params.clubid,
            user_id: req.user._id,
            admin: false
        })

        await club_join.save();
        res.status(200).send('Request for joining...');
    } catch (err) {
        res.status(400).send(err.message)
    }
})


//list of request for joining the club
router.get('/club/requests/:clubid', authMiddleware, async(req, res) => {
    try {
        // console.log(req.user._id)
        let isAdmin = await CLUBS.exists({ _id: req.params.clubid, admin: req.user._id })
            // console.log(isAdmin)
        if (!isAdmin) {
            throw new Error('Invalid access...')
        }

        let all_request = await CLUB_MEMBERS.find({ club_id: req.params.clubid, confirmation: false }).sort({ $natural: -1 }).populate({
            path: 'user_id',
            model: 'Users',
            select: { '_id': 1, 'user_name': 1, 'avatar': 1 }
        })
        res.status(200).send(all_request);
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//confirm participetation in club by admin of the club
router.patch('/club/confirm/:clubid/:userid', authMiddleware, async(req, res) => {

    try {
        let isAdmin = await CLUBS.exists({ _id: req.params.clubid, admin: req.user._id })
            // console.log(isAdmin)
        if (!isAdmin) {
            throw new Error('Invalid access...')
        }

        await CLUB_MEMBERS.findOneAndUpdate({ club_id: req.params.clubid, user_id: req.params.userid }, { $set: { confirmation: true } })

        res.status(200).send('confirm request...')
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//get all the club members
router.get('/club/member/:clubid', authMiddleware, async(req, res) => {
    try {
        let all_members = await CLUB_MEMBERS.find({ club_id: req.params.clubid, confirmation: true }).populate({
            path: 'user_id',
            model: 'Users',
            select: { '_id': 1, 'user_name': 1, 'avatar': 1 }
        })
        res.status(200).send(all_members);
    } catch (err) {
        res.status(400).send(err.message)
    }
})

//all the books belong to club members
router.get('/club/allbooks', authMiddleware, async(req, res) => {

})


module.exports = router;