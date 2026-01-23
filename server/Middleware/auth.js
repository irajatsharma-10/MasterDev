const jwt = require('jsonwebtoken');
const User = require('../Models/User');
require('dotenv').config();

// auth
exports.auth = async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header only (not body for security)
        const token = req.cookies.token ||
                      req.header("Authorization")?.replace("Bearer ", "");

        // If token is missing, return unauthorized
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login."
            });
        }

        // Verify the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Session expired. Please login again."
                });
            }
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again."
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed. Please try again."
        });
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