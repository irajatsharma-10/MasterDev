const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        trim: true,
        required: true,
    },
    courseDescription:{
        type:String,
        trim: true,
        required:true,
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    whatYouWillLearn:{
        type:String,
        required:true,
    },
    courseContent:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }],
    // a course could get multiple rating and reviews
    ratingAndReviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
    }],
    price:{
        type:Number,
    },
    thumbnail:{
        type: String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    studentsEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    tag:{
        type:[String],
    },// here we are using tag to increase the reach of the video (SEO types)
    instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
	createdAt: {
		type:Date,
		default:Date.now
	},
})

module.exports  = mongoose.model('Course', CourseSchema);