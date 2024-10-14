const User = require("../Models/User");
const mailSender = require('../Utils/mailsender');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');


// resetPasswordToken
exports.resetPasswordToken = async (req,res)=>{
    try{
            // get email from the req body
        const email = req.body.email;
        // check user for this email, email validation
        const user = await User.findOne({email: email});
        if(!user){
            return res.json({
                success: false,
                message: 'Your Email is not registered with us'
            })
        }
        // generate the token
        const token = crypto.randomBytes(20).toString("hex");
        console.log("Generated Token ",token);
        // update user  by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            {email: email},
            // password ko update krne k liye token ko as an search parameter use kiya h
            {token: token,
                resetPasswordExpires : Date.now() + 360000 
            },{new: true})
        // create url
        console.log(updatedDetails);
        const url =  `https://localhost:3000/update-password/${token}`
        // send mail containing the url
        await mailSender(email,"Password Reset Link",`Password Reset Link: ${url}`)
        // return response
        return res.json({
            success: true,
            message: 'Email sent successfully, please check email and change password'
        })
    }catch(error){
        console.log("Error in reset password", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reset password"
        })
    }
}

// resetpassword
exports.resetPassword = async( req, res)=>{
    try{
        // data fetch
        const {password, confirmPassword , token} = req.body;
        // validation
        if(password !== confirmPassword){
            return res.json({
                success: false,
                message: "Password not matching"
            })
        }
        // get userDetails from Database using token( only possible when token is valid)
        console.log("Token for reset password", token);
        // if theres is no field named token inside the User model then query will return null
        const userDetails = await User.findOne({token: token});
        console.log("User details after password updation",userDetails);
        // if no entry - invalid token
        if(!userDetails){
            return res.status(401).json({
                success: false,
                message: 'Token is invalid'
            })
        }
        // token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: "Token is expired, please regenerate the token"
            })
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password,10);
        // update the password
        const updatedPassword = await User.findOneAndUpdate(
            {token:token},
            {password: hashedPassword, token: null},{new: true},// token null means reset the token after user
        )
        console.log(updatedPassword);
        // return response 
        return res.status(200).json({
            success: true,
            message: "Password Reset successfully"
        })

    }catch(error){
        console.log("No able to reset the password",error);
        return res.status(500).json({
            success: false,
            message: "Not able to reset the password , Please try again later"
        })
    }
}