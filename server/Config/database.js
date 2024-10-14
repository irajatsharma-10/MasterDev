const mongoose = require('mongoose');
require('dotenv').config();
const DBConnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("Database Connnection is successful");

    }).catch((err)=>{

        console.log("Issue in connection",err);
        process.exit(1);
    })
}
module.exports = DBConnect;