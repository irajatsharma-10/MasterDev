const mongoose = require("mongoose");
const CategorysSchema = new mongoose.Schema({
    name: {
        required: true,
        trim: true,
        type: String,
    },
    description:{
        type: String,
        trim: true,
    },
    // one tag can be used for multiple course
    // python as a tag k multiple course ho skte h
    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],

})

module.exports  = mongoose.model('Category', CategorysSchema

);