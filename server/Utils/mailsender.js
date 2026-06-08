const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER?.trim(),
            pass: process.env.MAIL_PASS?.replace(/\s/g, ""),
        },
    });

    const info = await transporter.sendMail({
        from: `"MasterDev" <${process.env.MAIL_USER}>`,
        to: email,
        subject: title,
        html: body,
    });

    console.log("Email sent:", info.messageId);
    return info;
};

module.exports = mailSender;