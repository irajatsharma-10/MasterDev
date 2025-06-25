const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,// trim remove the whitespaces from both the sides
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
    },
    accountType:{
        required:true,
        type:String,
        enum:["Admin","Student","Instructor"],// when defining the enum we specify the allowed values as an array within Schema defination
        // enum particularly useful for fields that allowed only limited number of predefined values
    },
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            // required: true, 
        }
    ],
    resetPasswordExpires:{
        type: Date,
    },
    image:{
        type: String,
        trim:true,
    },
    status: {
		type: String,
		enum: ["Draft", "Published"],
	},
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress",
        }
    ],
})

const UserFile = mongoose.model('User', UserSchema);
module.exports = UserFile;