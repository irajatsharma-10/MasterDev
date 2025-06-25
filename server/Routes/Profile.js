const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../Middleware/auth");
const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    getEnrolledCourses,
    updateDisplayPicture,
    instructorDashboard,
} = require("../Controllers/Profile");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);

// // Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;
