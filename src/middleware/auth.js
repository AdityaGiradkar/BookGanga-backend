const jwt = require('jsonwebtoken')
const USER = require('../models/USERS')

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        // console.log(token)
        const decoded = jwt.verify(token, 'thisismynewcourse')
        const user = await USER.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next();
        // console.log(user)
    } catch (err) {
        res.status(401).send({ error: 'please authenticate' })
    }

    // next()
}

module.exports = auth