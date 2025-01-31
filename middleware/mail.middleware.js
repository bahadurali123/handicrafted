import nodemailer from 'nodemailer';
import { Configuration } from '../config/env.config.js';

const transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: Configuration.emailIs,
        pass: Configuration.emailPasswordIs
        // user: 'your-email@gmail.com',
        // pass: 'your-password'
    }
})
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"Handcrafted" <handcrafted@gmail.com>',
            to: to,
            subject: subject,
            text: text,
            html: html
        });
        // console.log("Mail info: ", info);
        return info.messageId;
    } catch (error) {
        throw error;
    }
};

export default sendEmail;