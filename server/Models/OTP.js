const mongoose = require("mongoose");
const mailSender = require('../Utils/mailsender')
const otpTemplate = require("../Mail/templates/emailVerificationTemplate")
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
        default: Date.now(),
        expires : '5m',
    }
})

// function -> to send email
async function sendVerificationEmail(email,otp){
    try{
        // email title Body
        // mailSender is the function created in utils (which will take three arguments email , message and otp)
        const mailResponse = await mailSender(email,"Verification Email from MasterDev",
            otpTemplate(otp),

        );
        console.log("Email sent successfully", mailResponse);
    }catch(error){
        console.log("Error sending email", error);
        throw new Error("Error sending email");
    }
}

OTPschema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

module.exports  = mongoose.model('OTP', OTPschema);