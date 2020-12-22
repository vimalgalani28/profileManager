const express = require("express")
const path = require("path")
const hbs = require("hbs")
const cookieParser = require("cookie-parser")
const userRouter = require("./routes/app")
require("./db/mongoose")

const publicDirPath = path.join(__dirname , "../public/")
const viewsPath = path.join(__dirname , "../templates/views")
const partialsPath = path.join(__dirname , "../templates/partials")

const app = express()

app.use(express.static(publicDirPath))
app.set('view engine' , 'hbs')
app.set('views' , viewsPath)
hbs.registerPartials(partialsPath)

const port = process.env.PORT 

app.use(express.json())
app.use(cookieParser())

app.get("/" , (req , res)=>{
    res.redirect("/user/me")
})
app.get("/user",(req , res)=>{
    res.render("index")
})

app.use("/user",userRouter)

app.listen(port , ()=> console.log(`App is on port ${port}`))