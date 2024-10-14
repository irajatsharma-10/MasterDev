const RatingAndReview = require("../Models/RatingAndReview");
const Course = require("../Models/Course");

// create rating 
// course id isliye taki kis course ko rating and review de rhe ho
// user id isliye taki pta chl jaye kisne rating di h(so that in future he/she will not be able to perform duplicate rating and review)
exports.createRating = async(req,res)=>{
    try{
        // get userId
        const userId = req.user.id;
        // fetch data from req body
        const {rating, review , courseId} = req.body;
        // check if user is enrolled or not
        const courseDetails = await Course.findOne({_id: courseId, studentsEnrolled: {$elemMatch: {$eq: userId}},
        })
        // validate if the courseDetails is valid or not
        if(!courseDetails){
            return res.status(404).json({
                message: "Student is not enrolled in the course",
                success: false,
            })
        }
        // check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        })
        if(alreadyReviewed){
            return res.status(401).json({
                success: false,
                message: "Course is already reviewed by the user",
            })
        }
        // create rating and review
        const ratingReview = await RatingAndReview.create({
            rating, review, course: courseId, user: userId
        })
        // update the course with rating/ review
        // findByIdAndUpdate method should use only the ID directly without an additional object
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                            {
                                $push:{
                                    ratingAndReviews: ratingReview._id,
                                }
                            },{new: true},
        )
        console.log(updatedCourseDetails);
        // return response
        return res.status(200).json({
            success: true,
            message: "Rating and Review created successfully",
            ratingReview
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Error in creating the ratingAndReview",
        })
    }
}

// get average rating
exports.getAverageRating = async (req,res)=>{
    try{
        // get course id
        const courseId = req.body.courseId;
        // calculate average rating
        const result = await RatingAndReview([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id: null,
                    // rating is inside the model
                    averageRating: {$avg: "rating"}
                }
            }
        ])
        // return rating
        if(res.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })

        }
        //if no rating/review exists
        return res.status(200).json({
            success: true,
            message:" Average rating is 0, no rating given till now"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Error in finding the average ratingAndReview",
        })

    }
}

// getAllrating and reviews
exports.getAllRating = async (req,res)=>{
    try{
        const allRatingReviews = await RatingAndReview.find({})
                                            .sort({rating: "desc"})
                                            .populate({
                                                path: "User",
                                                // {firstName: true, lastName: true, email: true, image: true}
                                                select:"firstName lastName email image"
                                            })
                                            .populate({
                                                path: "Course",
                                                select: "courseName",
                                            }).exec();
        return res.status(200).json({
            succcess: true,
            message: "All rating and reviews fetched successfully",
            data: allRatingReviews,
        })

    }
    catch(error){
        console.log(error);
        return res.status({
            success: false,
            message: "No rating and review available"
        })
    }
}