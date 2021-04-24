const express = require('express');
const BLOGS = require('../models/BLOGS');
const BLOG_COMMENTS = require('../models/BLOG_COMMENTS');
const authMiddleware = require('../middleware/auth');
const router = require('./blogRouter');


router.post('/comment/blogs/:blog_id', authMiddleware, async(req, res) => {
    try {
        let comment = new BLOG_COMMENTS(req.body);

        //current user is a comment writter
        comment["comment_writer"] = req.user._id;
        //blog_id taken from the url
        comment["blog_id"] = req.params.blog_id;

        let created_comment = await comment.save()
        await BLOGS.updateOne({ _id: req.params.blog_id }, { $push: { comments: created_comment._id } });
        res.status(200).send(created_comment);

    } catch (err) {
        res.status(400).send(err.message)
    }
});

router.delete('/comment/blogs/:blog_id/:comment_id', authMiddleware, async(req, res) => {
    try {
        let deleted_comment = await BLOG_COMMENTS.findOneAndDelete({ _id: req.params.comment_id, comment_writer: req.user._id })

        if (!deleted_comment) {
            throw new Error("No Comment found for cureent user..")
        }

        await BLOGS.updateOne({ _id: req.params.blog_id }, { $pullAll: { comments: [req.params.comment_id] } })
        res.status(200).send({ message: "Comment Deleted" })
    } catch (err) {
        res.status(400).send(err.message)
    }
});

module.exports = router;