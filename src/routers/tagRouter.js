const express = require('express');
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

router.patch('/tags/:tagId/addFollower', async(req, res) => {
    try {
        let tag = await TAGS.findOneAndUpdate({ _id: req.params.tagId }, { $inc: { followers: 1 } })
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