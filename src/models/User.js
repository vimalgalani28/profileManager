const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = mongoose.Schema({
    Name : {
        type : String,
        trim : true,
        required : true
    },
    lName : {
        type : String,
        trim : true,
        required : true
    },
    email : {
        type : String,
        trim : true,
        lowercase : true ,
        unique : true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Enter valid email')
            }
        }
    },
    password :{
        type : String,
        trim : true,
        required : true,
        minlength : 7
    },
    tokens :[{
        token : {
            type : String,
            required : true
        }
    }]
}, {
    timestamps : true
})

userSchema.pre('save' , async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password , 8 )
    }
    next()
})

userSchema.statics.findByCredentials = async (email , password) => {
    const user = await User.findOne({ email })
    if(!user){
        throw new Error("Unable to login")
    }
    const ismatch = await bcrypt.compare(password , user.password)
    if(!ismatch){
        throw new Error('Unale to login')
    }
    return user
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = await jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET,{
        expiresIn : 3 * 24 * 60 * 60
    })
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

const User = mongoose.model("User" , userSchema)

module.exports = User