import { UserValidator } from "../../validation/inputs.validation.js";
import { genneraeOTP } from "../../middleware/generateotp.middleware.js";
import sendEmail from "../../middleware/mail.middleware.js";
import User from "../../models/user.model.js";

const resetPassword = async (req, res) => {
    try {
        const { email, password, confpassword } = req.body;
        const user = req.user;

        if (!(user.status === 'Active')) {
            return res.status(400).json({ message: "You are blocked, you cannot make this change." });
        }

        const validName = new UserValidator({ email, password, confpassword });

        const emailIs = validName.validateEmail();
        const passIs = validName.validatePassword();
        const cpassIs = validName.validateConfPassword();

        if (!emailIs || !passIs || !cpassIs) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(409).json({ message: "Email address isn't valid." });
        }

        const otpCode = await genneraeOTP(6);
        const updatedUser = await User.findOneAndUpdate(
            { email: existingUser.email },
            {
                status: 'Inactive',
                password: password,
                verificationCode: otpCode,
                verificationCodeExpiration: new Date(Date.now() + 180000),
            },
            {
                new: true
            }
        );

        const to = updatedUser.email;
        const subject = 'Verify Your Email for Reset Your Handcrafted Password';
        const text = `Dear  ${updatedUser.name}, Welcome to <strong>Handcrafted</strong>! We're excited to have you on board. To ensure the security of your account and complete your registration, please verify your email address with the code below. This code will expire in 24 hours, so please verify your email as soon as possible. If you didn’t sign up for a Handcrafted account, please disregard this email.`;
        const html = `<p>Dear ${updatedUser.name},</p><p>Welcome to <strong>Handcrafted</strong>!</p><p>We're excited to have you on board. To ensure the security of your account and complete your registration, please verify your email address with the code below:</p><p>OTP Code: <strong>${updatedUser.verificationCode}</strong></p><p>This code will expire in 24 hours, so please verify your email as soon as possible. If you didn’t sign up for a Handcrafted account, please disregard this email.</p><p>We are committed to ensuring the security of your account. Please do not share this OTP with anyone.</p><p>Thank you for joining the Handcrafted community!</p><p>Best regards,</p><p>The Handcrafted Team</p><p>support@handcrafted.com</p>`;
        sendEmail(to, subject, text, html);


        res.status(201)
            .json({ message: "Successfull Reset Password!", data: updatedUser, redirect: "redirectat otp verify URL" });
    } catch (error) {
        res.status(500).json({ message: "Fail to Reset Password!" });
    }
}

export default resetPassword;