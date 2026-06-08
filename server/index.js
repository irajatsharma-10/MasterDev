const express = require('express');
const app = express();
require('dotenv').config();

const userRoutes = require('./Routes/User');
const profileRoutes = require('./Routes/Profile');
const paymentRoutes = require('./Routes/Payment');
const CourseRoutes = require('./Routes/Course');
const contactUsRoutes = require('./Routes/ContactUs');
const DBConnect = require('./Config/database');

const cookieParser = require("cookie-parser");
const {cloudinaryConnect} = require('./Config/Cloudinary');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// Initialize Database
DBConnect();

const PORT = process.env.PORT || 8000;

// Security Headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https://api.razorpay.com"],
        },
    },
}));

// Rate Limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts for auth routes
    message: { success: false, message: 'Too many authentication attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// CORS Configuration
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
)

cloudinaryConnect();


// Apply rate limiters and routes
app.use('/api/v1/auth', authLimiter, userRoutes);
app.use('/api/v1/profile', generalLimiter, profileRoutes);
app.use('/api/v1/course', generalLimiter, CourseRoutes);
app.use('/api/v1/payment', generalLimiter, paymentRoutes);
app.use('/api/v1/contact', generalLimiter, contactUsRoutes);


app.get("/",(req,res)=>{
    return res.json({
        success: true,
        message: "Server is learning successfully"
    })
})

const server = app.listen(PORT, ()=>{
    console.log(`Server listening on the PORT,  ${PORT}`);
})

const shutdown = () => {
    server.close(() => process.exit(0));
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);