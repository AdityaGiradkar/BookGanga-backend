const express = require('express');
const multer = require('multer'); //to send multipart data like images, files
const sharp = require('sharp'); //to resize images
const USERS = require('../models/USERS');
const FOLLOWING = require('../models/FOLLOWING');
const BLOGS = require('../models/BLOGS');
const TAGS = require('../models/TAGS');
const BLOG_COMMENTS = require('../models/BLOG_COMMENTS');
const authMiddleware = require('../middleware/auth')

const router = express.Router()

//create new blog
router.post("/blogs/create", authMiddleware, async(req, res) => {
    const blog = new BLOGS(req.body)

    try {
        blog["writer"] = req.user._id;
        let created_blog = await blog.save()
        res.status(200).send({ blog: created_blog })
    } catch (err) {
        res.status(400).send(err.message)
    }
});


//get blog's tital header_image likes description for home page
//:no define how much blog have to skip / last number of blog count
//user_profile -id, username, avatar. time of blog 
router.get('/blogs/homeScreen/:no', async(req, res) => {
    try {
        let last_no = parseInt(req.params.no);
        let blogs = await BLOGS.find().sort({ $natural: -1 }).skip(last_no).limit(2).select('tital header_image likes description comments writer').populate({
            path: 'writer',
            model: 'Users',
            select: { '_id': 1, 'user_name': 1, 'avatar': 1 }
        });
        res.status(200).send(blogs)
    } catch (err) {
        res.status(400).send(err.message)
    }
});


//get full details of one perticular blog by using :blog_id
//writter - user_name, id, profile image url pending
router.get('/blogs/:blog_id', async(req, res) => {
    try {
        let blog_id = req.params.blog_id;
        let blog = await BLOGS.find({ _id: blog_id }).populate({
            path: 'comments',
            model: 'Blog_comments',
            populate: {
                path: 'comment_writer',
                model: 'Users',
                select: { '_id': 1, 'user_name': 1 }
            },
            select: { '_id': 1, 'content': 1, 'createdAt': 1, 'comment_writer': 1 }
        }).populate({
            path: 'tags',
            model: 'Tags',
            select: { '_id': 1, 'tag_name': 1 }
        }).populate({
            path: 'writer',
            model: 'Users',
            select: { '_id': 1, 'user_name': 1, 'avatar': 1 }
        });
        res.status(200).send(blog[0])
    } catch (err) {
        res.status(400).send(err.message)
    }
});


//get all blogs of perticular user
router.get('/blogs/:user_id/:no', async(req, res) => {
    try {
        //console.log(req.user)
        let last_no = parseInt(req.params.no);
        let blogs = await BLOGS.find({ writer: req.params.user_id }).sort({ $natural: -1 }).skip(last_no).limit(2).select('tital header_image likes description comments')
        res.status(200).send(blogs)
    } catch (err) {
        res.status(400).send(err.message)
    }
});


//edit blog 'tital', 'content', 'description', 'time_to_read', 'tags'
router.patch('/blogs/:blog_id', authMiddleware, async(req, res) => {
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
        let blog = await BLOGS.findOne({ _id: blog_id, writer: req.user._id });

        //do all the update and store in user and then save it
        updates.forEach((update) => {
            blog[update] = req.body[update]
        })

        await blog.save()
        res.status(200).send(blog)
    } catch (err) {
        res.status(400).send(err.message)
    }
});


//delete blog
router.delete('/blogs/:blog_id', authMiddleware, async(req, res) => {

    try {
        let deleted_blog = await BLOGS.findOneAndDelete({ _id: req.params.blog_id, writer: req.user._id })
        if (!deleted_blog) {
            throw new Error("No blog found for cureent user..")
        }
        res.status(200).send({ message: "Blog Deleted" })
    } catch (err) {
        res.status(400).send(err.message)
    }
});


module.exports = router;