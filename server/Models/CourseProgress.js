
const mongoose = require("mongoose");
const CourseProgressSchema = new mongoose.Schema({
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    completedVideos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubSection',
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
})

module.exports  = mongoose.model('CourseProgress', CourseProgressSchema);