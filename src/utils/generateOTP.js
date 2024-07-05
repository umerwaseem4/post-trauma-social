import nodemailer from 'nodemailer';
import crypto from 'crypto';

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const sendOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for email verification',
        text: `Your OTP is ${otp}, it is valid for 10 minutes`,
    };

    await transporter.sendMail(mailOptions);
};

export { generateOTP, sendOTP };
