const express = require("express")
const User=require("../models/User")
const auth = require("../middleware/auth")
const sendMailToUser = require("../email/account")

const router = new express.Router()

router.get("/register" , async(req,res)=>{
    res.render('register')
})

router.post("/register",async(req, res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        sendMailToUser(req.body.email, "Thanks For Registeration!", `Hey ${req.body.Name} ${req.body.lName}, you just signed up on our website. We value your efforts. Your email is ${req.body.email}.`)
        res.cookie('jwt' , token , {maxAge : 3 * 24 * 60 * 60 * 1000 , httpOnly : true})
        res.status(201).send({user , token})
    }catch(e) {
        try {
            if(e.errors.email)
            {
                return res.status(400).send({
                    error : e.errors.email.message
                })
            }
            if(e.errors.password)
            {
                return res.status(400).send({
                    error : "Password too weak. Enter strong password"
                })
            }
        }catch(e) {

        }
        if(e.code === 11000)
        {
            return res.status(400).send({
                error : "Email already exists. Contact Support!"
            })
        }
        res.status(500).send({
            error : 'Internal Server Error'
        })
    }
})

router.get("/login" , async(req,res)=>{
    res.render('login')
})

router.post("/login" , async (req , res)=>{
    try {
        const user = await User.findByCredentials(req.body.email , req.body.password)
        const token = await user.generateAuthToken()
        sendMailToUser(req.body.email, "Login Alert!", `Hey ${user.Name} ${user.lName}, you just logged in on our website. We value your efforts. Your email is ${req.body.email}.`)
        res.cookie('jwt' , token , {maxAge : 3 * 24 * 60 * 60 * 1000 , httpOnly : true})
        res.send({user , token})
    } catch(e) {
        res.status(400).send({
            error : "Invalid Email/Password."
        })
    }
})

router.get("/me" , auth , async(req , res)=>{
    res.render("profile", {
        Name : req.user.Name,
        lName : req.user.lName
    })
})

router.post("/logout" , auth , async(req , res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send('Logged out')
    } catch(e){
        res.status(500).send({
            error : "Internal Server Error"
        })
    }
})

router.delete("/me", auth , async (req , res)=>{
    try {
        await req.user.remove()
        sendMailToUser(req.user.email, "Delete Account Alert!", `Hey ${req.user.Name} ${req.user.lName}, your account have been deleted from our website.`)
        res.send("User Deleted")
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router