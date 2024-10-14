const jwt = require('jsonwebtoken');
const User = require('../Models/User');
require('dotenv').config();

// auth
exports.auth = async (req,res,next)=>{
    try{
        // extract token
        // best practice header // worst practice body
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        // if token is missing, then return 
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }
        // verify the token 
        try{
            // token verify using the secret key
            // decode payload mein already id pass kr rkhi h
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error){
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }
        next();
    }catch(error){
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token"
        })
    }
}
// isStudent
exports.isStudent = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is the protected route for students only"
            })
        }
        next(); 
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again later"
            },
        )
    }
}
// isInstructor
exports.isInstructor = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is the protected route for instructor only"
            })
        }
        next(); 
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again later"
            },
        )
    }
}


// isAdmin
exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is the protected route for admin only"
            })
        }
        next(); 
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again later"
            },
        )
    }
}