const mongoose = require("mongoose");
const OTPschema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    otp:{
        type: String,
        required: true,
        unique: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires : '5m',
    }
})

module.exports  = mongoose.model('OTP', OTPschema);