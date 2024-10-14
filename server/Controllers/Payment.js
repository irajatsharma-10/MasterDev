const { instance } = require('../Config/razorpay');

const Course = require("../Models/Course");
const User = require('../Models/User');
const mongoose = require('mongoose');

const mailSender = require('../Utils/mailsender');
const { paymentSuccessEmail } = require('../Mail/templates/paymentSuccessEmail');
const { courseEnrollmentEmail } = require('../Mail/templates/courseEnrollmentEmail');


const crypto = require("crypto")





// this payment method is used to initiate the payment 
exports.capturePayment = async (req, res) => {
    const { courses } = req.body;
    const userId = req.user.id;
    if (courses.length === 0) {
        return res.json({ success: false, message: "Please provide Course Id" })
    }
    let totalAmount = 0;
    // courses is an array containing all the course id
    for (const course_id of courses) {
        let course;
        try {
            course = await Course.findById(course_id);
            if (!course) {
                return res.status(200).json({ success: false, message: "Could not find the course" });
            }
            // from the req.user.id we got the string userId so first convert it to the object
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({ success: false, message: "User is already enrolled in the course" });
            }
            totalAmount += course.price;
        } catch (error) {
            console.log("Error in capturePayment", error);
            return res.status(500).json({ success: false, message: error.message })
        }
    }
    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }
    try {
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success: true,
            message: paymentResponse,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message })
    }
}


const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({ success: false, message: "Please provide data for Courses or UserId" })
    }
    try {
        for (const courseId of courses) {
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true },
            );
            if (!enrolledCourse) {
                return res.status(500).json({ success: false, message: "Course not Found" });
            }
            // find the student and add the course to their list of enrolled courses
            const enrolledStudent = await User.findByIdAndUpdate(userId,
                {
                    $push: {
                        courses: courseId
                    }
                }, { new: true },
            )
            console.log("Enrolled student course email: ",enrolledStudent.email);
            // send the mail to the student 
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName}`)
            )
            console.log("Email sent successfully", emailResponse.response);
        }
    } catch (error) {
        console.log("Error in enrolling students", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }


}



// verify the payment
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses

    const userId = req.user.id

    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses ||
        !userId
    ) {
        return res.status(200).json({ success: false, message: "Payment Failed" })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex")

    if (expectedSignature === razorpay_signature) {
        await enrollStudents(courses, userId, res)
        return res.status(200).json({ success: true, message: "Payment Verified" })
    }

    return res.status(200).json({ success: false, message: "Payment Failed" })
}


// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body

    const userId = req.user.id

    if (!orderId || !paymentId || !amount || !userId) {
        return res
            .status(400)
            .json({ success: false, message: "Please provide all the details" })
    }

    try {
        const enrolledStudent = await User.findById(userId)

        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100,
                orderId,
                paymentId
            )
        )
    } catch (error) {
        console.log("Could not sent mail", error)
        return res
            .status(400)
            .json({ success: false, message: error.message })
    }
}











// // capture the payment and initiate the razorpay order
// exports.captuerPayment = async (req, res) => {
//     // get courseId and userId
//     const { courseId } = req.body;
//     const { userId } = req.user.id;
//     // validation
//     // valid courseId
//     if (!courseId) {
//         return res.status(401).json({
//             success: false,
//             message: "Please provide valid courseId"
//         })
//     }
//     // valide courseDetail
//     let course;
//     try {
//         course = await Course.findById(courseId);
//         // course find krliya check valid course h y nhi
//         if (!course) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Could not find the course"
//             })
//         }
//         // user already payed for the same course
//         // convert user id into the object id
//         // abhi meri userId string form m h and courseId object id mein stored h
//         // then first convert the userId(string) into the object course Id


//         // user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if (course.studentsEnrolled.includes(uid)) {
//             return res.status(200).json({
//                 success: false,
//                 message: "User is already enrolled",
//             })
//         }
//         // order create
//         const amount = course.price;
//         const currency = "INR";

//         const options = {
//             amount: amount * 100,
//             currency,
//             receipt: Math.random(Date.now()).toString(),
//             notes: {
//                 courseId: courseId,
//                 userId,
//             }
//         }

//         try {
//             // initiate the payment using razorpay
//             const paymentResponse = await instance.orders.create(options);
//             console.log(paymentResponse);
//             // return response
//             return res.status(200).json({
//                 success: true,
//                 courseName: course.courseName,
//                 courseDescription: course.courseDescription,
//                 thumbnail: course.thumbnail,
//                 orderId: paymentResponse.id,
//                 currency: paymentResponse.currency,
//                 amount: paymentResponse.amount,
//             })
//         } catch (error) {
//             console.log("Not able to initiate the payment");
//             return res.status(200).json({
//                 success: false,
//                 message: "Could not initiate the payment"
//             })
//         }


//     } catch (error) {
//         console.error("Course Details catch error", error);
//         return res.status(500).json({
//             success: false,
//             meessage: error.message,
//         })
//     }
// }

// // verify Signature of Razorpay and server
// // verifyPayment means verifySignature
// exports.verifyPayment = async (req, res) => {
//     const webhookSecret = "9411497047";


//     // SIGNATURE WE GET FROM THE RAZORPAY (x-razorpay-signature key mein hoga)

//     // 3 steps to encrypt
//     const signature = req.headers["x-razorpay-signature"];
//     // a
//     const shasum = crypto.createHmac("sha256", webhookSecret);// Hmac means hashed based message algorithm code and a algorithm SHA secure hashed algorithm by which you can convert the data into the encrypted format
//     // Hmac requires two things hashing algorithm and secret key

//     // b
//     shasum.update(JSON.stringify(req.body));
//     // c
//     const digest = shasum.digest("hex");

//     // order create and my payment is authorised
//     if (signature === digest) {
//         console.log("Payment is authorised");

//         const { courseId, userId } = req.body.payload.payment.entity.notes;

//         try {
//             // fullfill the action
//             // find the course and enroll the student in it
//             const enrolledCourse = await Course.findOneAndUpdate(
//                 { _id: courseId },
//                 { $push: { studentsEnrolled: userId } },
//                 { new: true },
//             );
//             if (!enrolledCourse) {
//                 return res.status(500).json({
//                     success: false,
//                     message: "course not found",
//                 })
//             }
//             console.log(enrolledCourse);

//             // find the student and add the course to the list of enrolled courses
//             const enrolledStudent = await User.findOneAndUpdate(
//                 { _id: studentId },
//                 { $push: { courses: courseId } },
//                 { new: true },
//             )
//             console.log(enrolledCourse);
//             // send the mail for confirmation
//             const emailResponse = await mailSender(enrolledStudent.email, "Congratulations from MasterDev", "Congratulations you are onboarded into new MasterDev course");
//             console.log(emailResponse);
//             return res.status(200).json({
//                 success: true,
//                 message: "Signature Verified and Course Added",
//             })
//         } catch (error) {
//             console.log("Couldn't enrolled into the course ", error);
//             return res.status(500).json({
//                 success: false,
//                 message: error.message,
//             })
//         }
//     }
//     else {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid request",
//         })
//     }

// }


// // enroll the student in the courses
// const enrollStudents = async (courses, userId, res) => {
//     if (!courses || !userId) {
//         return res
//             .status(400)
//             .json({ success: false, message: "Please Provide Course ID and User ID" })
//     }

//     for (const courseId of courses) {
//         try {
//             // Find the course and enroll the student in it
//             const enrolledCourse = await Course.findOneAndUpdate(
//                 { _id: courseId },
//                 { $push: { studentsEnroled: userId } },
//                 { new: true }
//             )

//             if (!enrolledCourse) {
//                 return res
//                     .status(500)
//                     .json({ success: false, error: "Course not found" })
//             }
//             console.log("Updated course: ", enrolledCourse)

//             const courseProgress = await CourseProgress.create({
//                 courseID: courseId,
//                 userId: userId,
//                 completedVideos: [],
//             })
//             // Find the student and add the course to their list of enrolled courses
//             const enrolledStudent = await User.findByIdAndUpdate(
//                 userId,
//                 {
//                     $push: {
//                         courses: courseId,
//                         courseProgress: courseProgress._id,
//                     },
//                 },
//                 { new: true }
//             )

//             console.log("Enrolled student: ", enrolledStudent)
//             // Send an email notification to the enrolled student
//             const emailResponse = await mailSender(
//                 enrolledStudent.email,
//                 `Successfully Enrolled into ${enrolledCourse.courseName}`,
//                 courseEnrollmentEmail(
//                     enrolledCourse.courseName,
//                     `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
//                 )
//             )

//             console.log("Email sent successfully: ", emailResponse.response)
//         } catch (error) {
//             console.log(error)
//             return res.status(400).json({ success: false, error: error.message })
//         }
//     }
// }