import { UserValidator } from "../../validation/inputs.validation.js";
import { genneraeOTP } from "../../middleware/generateotp.middleware.js";
import User from "../../models/user.model.js";
import sendEmail from "../../middleware/mail.middleware.js";

const regenreteOTP = async (req, res) => {
    try {
        console.log("OTP Regenrate!")
        const email = req.user.email;

        const validName = new UserValidator({ email });
        const emailIs = validName.validateEmail();

        if (!emailIs) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const verificationCode = await genneraeOTP(6);
        const user = await User.findOne({ email })
        const exp = new Date(Date.now() + 180000);

        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            {
                verificationCode,
                verificationCodeExpiration: exp
            },
            { new: true }
        )
            .select("email verificationCode");

        const to = updatedUser.email;
        const subject = 'Verify Your Email for Regenerate Your Handcrafted OTP';
        const text = `Dear  ${updatedUser.name}, Welcome to <strong>Handcrafted</strong>! We're excited to have you on board. To ensure the security of your account and complete your registration, please verify your email address with the code below. This code will expire in 24 hours, so please verify your email as soon as possible. If you didn’t sign up for a Handcrafted account, please disregard this email.`;
        const html = `<p>Dear ${updatedUser.name},</p><p>Welcome to <strong>Handcrafted</strong>!</p><p>We're excited to have you on board. To ensure the security of your account and complete your registration, please verify your email address with the code below:</p><p>OTP Code: <strong>${updatedUser.verificationCode}</strong></p><p>This code will expire in 24 hours, so please verify your email as soon as possible. If you didn’t sign up for a Handcrafted account, please disregard this email.</p><p>We are committed to ensuring the security of your account. Please do not share this OTP with anyone.</p><p>Thank you for joining the Handcrafted community!</p><p>Best regards,</p><p>The Handcrafted Team</p><p>support@handcrafted.com</p>`;
        sendEmail(to, subject, text, html);

        res.status(201)
            .json({ message: "Successfull Regenerate OTP!", data: updatedUser, redirect: "redirectat verify code URL" });
    } catch (error) {
        res.status(500).json({ message: "Fail to Regenerate OTP!" });
    }
}

export default regenreteOTP;