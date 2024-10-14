const express = require('express');
const app = express();
const userRoutes = require('./Routes/User');
const profileRoutes = require('./Routes/Profile');
const paymentRoutes = require('./Routes/Payment');
const CourseRoutes = require('./Routes/Course');
const contactUsRoutes = require('./Routes/ContactUs');
const DBConnect = require('./Config/database'); 
DBConnect();


const cookieParser = require("cookie-parser");
const {cloudinaryConnect} = require('./Config/Cloudinary');
const cors = require('cors')
const fileUpload = require('express-fileupload');


require('dotenv').config();

const PORT = process.env.PORT || 8000;

// middlewares

// backend k kaam h frontend ki request ko entertain krna
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
)

cloudinaryConnect();


app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/profile',profileRoutes);
app.use('/api/v1/course',CourseRoutes)
app.use('/api/v1/payment',paymentRoutes);
app.use('/api/v1/contact', contactUsRoutes);


app.listen(PORT, ()=>{
    console.log(`Server listening on the PORT,  ${PORT}`);
})

app.get("/",(req,res)=>{
    return res.json({

        success: true,
        message: "Server is learning successfully"
    })
})