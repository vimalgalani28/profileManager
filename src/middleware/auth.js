const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req , res , next) => {
    try {
        const token = req.cookies.jwt
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        const user = await User.findOne({_id : decode._id, 'tokens.token' : token})
        if (!user){
            throw new Error()
        }
        req.user = user
        req.token =token
        next()

    } catch(e){
        res.status(401).redirect("/user")
    }
}

module.exports = auth