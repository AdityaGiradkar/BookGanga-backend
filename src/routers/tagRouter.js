const express = require('express');
const USERS = require('../models/USERS');
const TAGS = require('../models/TAGS');
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.post("/tags/new", async(req, res) => {
    const tag = new TAGS(req.body)

    try {
        await tag.save()

        res.status(201).send({ "message": 'new tag created...' })
    } catch (err) {
        res.status(400).send(err.message)
    }
});

router.get("/tags/all", async(req, res) => {
    try {
        let tags = await TAGS.find({}).select('tag_name followers')
            // console.log(tags)
        res.status(200).send(tags)
    } catch (err) {
        res.status(400).send(err.message)
    }
});

router.patch('/tags/:tagId/addFollower', authMiddleware, async(req, res) => {

    //seprate keys of all upadated fields in request body
    const updates = Object.keys(req.body)

    //list valides updates field which user can do
    const allowedToUpdate = ['taglist']

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

        //Check for user already following the tag
        let check = await USERS.find({ taglist: { "$in": [req.params.tagId] } })
        if (check) {
            throw new Error('Already Follow...')
        }

        //add tagid into array in user documnet 
        await USERS.findOneAndUpdate({ _id: req.user._id }, { $push: { taglist: req.params.tagId } });

        //increment follower count in tags collection
        await TAGS.findOneAndUpdate({ _id: req.params.tagId }, { $inc: { followers: 1 } })
        res.status(200).send('follower added...')

    } catch (err) {
        res.status(400).send(err.message)
    }
});

router.delete('/tags/:tagId/deleteTag', async(req, res) => {
    try {
        let tag = await TAGS.findOneAndDelete({ _id: req.params.tagId })
        res.status(200).send('tag deleted...')
    } catch (err) {
        res.status(400).send(err.message)
    }
});



module.exports = router;