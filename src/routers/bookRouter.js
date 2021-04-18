const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { findById } = require('../models/BOOKS');
const Book = require('../models/BOOKS');
const Review = require('../models/REVIEWS');
const User = require('../models/USERS');
const authmiddleware = require('../middleware/auth')


const router = express.Router()

//Create new Book
router.post('/books/create', authmiddleware, async(req, res) => {
    const book = new Book({
        ...req.body,
        author: req.user._id
    })
    try {
        await book.save()
        res.status(200).send(book)
    } catch (err) {
        res.status(400).send(err.message)
    }

});

//Upload header image
const upload = multer({

    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callBack) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callBack(new Error('Enter valid image file.'));
        }
        callBack(undefined, true);
    }
});

router.post('/books/:id/image', upload.single('image'), async(req, res) => {
    const book = await Book.findById(req.params.id)
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    book.header_image = buffer
    await book.save()

    res.status(200).send({ message: 'Image Uploaded' })

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


//Get all the books
router.get('/books', async(req, res) => {
    const book = await Book.find({}).select('author description reviews rent_price createdAt')
    res.status(200).send(book)
})

//Get book by id
router.get('/books/:id', async(req, res) => {
    const _id = req.params.id
    try {

        const book = await Book.findById({ _id }).select('author description reviews rent_price createdAt')
            // if(!book){
            //     return res.status(404).send()
            // }
        res.send(book)

    } catch (e) {
        res.status(500).send()

    }
})

//Update Book details
router.patch('/books/:id', authmiddleware, async(req, res) => {

    const updates = Object.keys(req.body)
    const validUpdate = ['header_image', 'description', 'rent_price']
    const isValidOperation = updates.every((update) => validUpdate.includes(update))

    if (!isValidOperation) {
        res.status(400).send({ error: 'Invalid Updates' })
    }

    try {
        const book = await Book.findById({ _id: req.params.id })

        updates.forEach((update) => book[update] = req.body[update])
        await book.save()


        if (!book) {
            return res.status(404).send()
        }
        res.send(book)

    } catch (err) {
        res.status(400).send(err)

    }


})


//Delete Book
router.delete('/books/:id', authmiddleware, async(req, res) => {
    try {
        const book = await Book.findOneAndDelete({ _id: req.params.id })

        res.send({ message: "Book Deleted" })
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;