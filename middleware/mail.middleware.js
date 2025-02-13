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
        return info.messageId;
    } catch (error) {
        throw error;
    }
};

export default sendEmail;