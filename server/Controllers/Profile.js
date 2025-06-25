const Profile = require("../Models/Profile");
const User = require("../Models/User");
const { uploadImageToCloudinary } = require('../Utils/ImageUploader')
const { convertSecondsToDuration } = require("../Utils/SecToDuration");
const CourseProgress = require("../Models/CourseProgress");
const Course = require("../Models/Course")
exports.updateProfile = async (req, res) => {
    try {

        // fetch data
        const { dateOfBirth = "", about = "", contactNumber = "", gender = "" } = req.body;
        // get user id (req.user = decode mein se mil jayegi)
        const id = req.user.id; // auth middleware mein jo token pass kiya tha
        // validation
        if (!contactNumber || !gender || !id || !dateOfBirth) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Fill all the necessory details ",
                }
            )
        }
        // find profile 
        // this provide the id of the user
        const userDetails = await User.findById(id);// this will provide the id of User model
        const profileId = await Profile.findById(userDetails.additionalDetails);
        const profileDetails = await Profile.findById(profileId);
        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        // two options to store it into the data
        // .create and .save if already created then just simply apply .save 
        await profileDetails.save();


        // Find the updated user details after changing the profile details
        const updatedUserDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec()
        // return response 
        res.status(200).json({
            success: true,
            message: " Profile upadated successfully",
            data: updatedUserDetails,
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Not able to update the profile, Please try again later",
            error: error.message,
        })
    }
}

// update display profile
exports.updateDisplayPicture = async (req, res) => {
    try {
        if (!req.files || !req.files.DisplayKey) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }
        // fetch data 
        const file = req.files.DisplayKey;
        //validation
        const fileType = file.name.split('.')[1].toLowerCase();
        const supportedTypes = ["jpg", "jpeg", "png"];
        if (!supportedTypes.includes(fileType)) {
            return res.status(401).json({
                success: false,
                message: "Not a valid file type",
            })
        }
        //user id
        const userId = req.user.id;
        const image = await uploadImageToCloudinary(file, process.env.FOLDER_NAME, 1000, 1000);
        // update the string of the user display profile picture in the user schema
        const updatedProfile = await User.findByIdAndUpdate(userId,
            { image: image.secure_url }, { new: true },
        )
        return res.status(200).json({
            success: true,
            message: "Profile display updated succesfully",
            data: updatedProfile,
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Couldn't able to update the display profile",
            error: error.message,
        })
    }
}



// delete account
// TODo how can be schedule this delete operation (coronJob)
exports.deleteAccount = async (req, res) => {
    try {
        //get id
        const id = req.user.id;// this will provide you the id of the user
        // valid id or not 
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(401).json({
                success: false,
                message: "User not exits",
            })
        }
        // koi user h and bo delete ho gya but uski additional details pdi h
        // esa nhi hoga isliye phle uski additionalDetail(profile) ko delete krna pdega
        // then have to delete the user

        // delete profile
        // profile ki id ko delete krne k liye profile id required hogi
        // ToDo: unenroll user from all enroll process
        await Profile.findByIdAndDelete(userDetails.additionalDetails._id);
        // findByIdAndDelete excepts single ID value not an objectPassing {_id: userDetails.additionalDetails} means you are providing an object where the _id is a field within that object, which is not what the method expects.
        // delete user
        await User.findByIdAndDelete(id);
        // response return 
        return res.status(200).json({
            success: true,
            message: "User deleted Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Not able to delete the account please try again later",
            error: error.message,
        })
    }
}

exports.getAllUserDetails = async (req, res) => {
    try {
        // get id
        const id = req.user.id;
        // validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        // return response
        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            userDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Couldn't able to fetch the user details",
            error: error.message,
        })

    }
}

// get all section and subsection

// getEnrolledCourses
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        // this will provide the details of the enrolled courses
        let userDetails = await User.findOne({
            _id: userId,
        })
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                },
            })
            .exec()
        userDetails = userDetails.toObject()// this method will convert the mongoose document into the plain js object
        var SubsectionLength = 0

        // userDetails.courses in this coures is the property of the userDetails object (userDetails.courses.length is use to determine that how many course are present in courses array of the userDetails object)
        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[
                    j
                ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                    totalDurationInSeconds
                )
                SubsectionLength +=
                    userDetails.courses[i].courseContent[j].subSection.length
            }
            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            })
            courseProgressCount = courseProgressCount?.completedVideos.length
            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
            } else {
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage =
                    Math.round(
                        (courseProgressCount / SubsectionLength) * 100 * multiplier
                    ) / multiplier
            }
        }

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            })
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id })

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            }

            return courseDataWithStats
        })

        res.status(200).json({ courses: courseData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
}