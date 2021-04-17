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
    // console.log(req.body)
    // res.status(201).send();
    const blog = new BLOGS(req.body)

    try {
        await blog.save()
        res.status(200).send('created..')
    } catch (err) {
        res.status(400).send(err.message)
    }
});

router.get('/blogs/homeScreen', async(req, res) => {
    try {
        let blogs = await BLOGS.find().select('tital header_image likes')
        res.status(200).send(blogs)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = router;