const mongoose = require("mongoose")

mongoose.connect(process.env.DBURL , {
    useNewUrlParser : true ,
    useCreateIndex : true ,
    useUnifiedTopology : true,
    useFindAndModify : false
}).then(()=>console.log("Connected to database")).catch((e)=>{
    console.log(e)
})
