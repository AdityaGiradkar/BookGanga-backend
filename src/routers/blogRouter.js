const express = require('express');
const multer = require('multer'); //to send multipart data like images, files
const sharp = require('sharp'); //to resize images
const USERS = require('../models/USERS');
const FOLLOWING = require('../models/FOLLOWING');
const BLOGS = require('../models/BLOGS');
const TAGS = require('../models/TAGS');
const COMMENTS = require('../models/COMMENTS');
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.post("/blogs/create", async(req, res) => {
    const blog = new BLOGS(req.body)

    try {
        await blog.save()
        res.status(200).send('created..')
    } catch (err) {
        res.status(400).send(err.message)
    }
});

router.get('/blogs/homeScreen/:no', async(req, res) => {
    try {
        let last_no = parseInt(req.params.no);
        let blogs = await BLOGS.find().sort({ $natural: -1 }).skip(last_no).limit(2).select('tital header_image likes description')
        res.status(200).send(blogs)
    } catch (err) {
        res.status(400).send(err.message)
    }
});

router.get('/blogs/:blog_id', async(req, res) => {
    try {
        let blog_id = req.params.blog_id;
        let blog = await BLOGS.find({ _id: blog_id });
        res.status(200).send(blog)
    } catch (err) {
        res.status(400).send(err.message)
    }
});

router.patch('/blogs/:blog_id', async(req, res) => {
    //seprate keys of all upadated fields in request body
    const updates = Object.keys(req.body)

    //list valides updates field which user can do
    const allowedToUpdate = ['tital', 'content', 'description', 'time_to_read', 'tags']

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
        let blog_id = req.params.blog_id

        let blog = BLOG.find({ _id: blog_id });

        //do all the update and store in user and then save it
        updates.forEach((update) => {
            blog[update] = req.body[update]
        })

        await blog.save()
        res.status(200).send(blog)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = router;