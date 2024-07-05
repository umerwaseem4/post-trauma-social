import nodemailer from 'nodemailer';
import crypto from 'crypto';

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const sendOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'umerwas4@gmail.com',
            pass: 'pnet sabn ovhu dffl ',
        },
    });

    const mailOptions = {
        from: 'umerwas4@gmail.com',
        to: email,
        subject: 'Your OTP for email verification',
        text: `Your OTP is ${otp}, it is valid for 10 minutes`,
    };

    await transporter.sendMail(mailOptions);
};

export { generateOTP, sendOTP };
