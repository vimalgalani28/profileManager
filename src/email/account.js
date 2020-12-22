const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    service : 'gmail' ,
    auth : {
        user : process.env.EMAIL ,
        pass : process.env.PASSWORD
    }
})
const sendMailToUser = (email , subject, text) => {
    let mailOptions = {
        from : process.env.EMAIL,
        to : email,
        subject,
        text
    }
    
    transporter.sendMail(mailOptions , (err , data)=>{
        if(err) {
            console.log(err)
        }else {
            console.log("Email Sent")
        }
    })
}
module.exports = sendMailToUser