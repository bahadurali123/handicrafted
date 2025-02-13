import User from "../../models/user.model.js";
import { UserValidator } from "../../validation/inputs.validation.js";
import { genneraeOTP } from "../../middleware/generateotp.middleware.js";
import sendEmail from "../../middleware/mail.middleware.js";
import generateTokens from "../../middleware/generateToken.middleware.js";
import { Configuration } from "../../config/env.config.js";

const SignUp = async (req, res) => {
  console.log("SignUp!");
  try {
    const { name, email, password: ispass, confpassword, phone } = req.body;

    const validName = new UserValidator({ name, email, password: ispass, confpassword, phone });

    const nameIs = validName.validateName();
    const emailIs = validName.validateEmail();
    const passIs = validName.validatePassword();
    const cpassIs = validName.validateConfPassword();
    const phoneIs = validName.validatePhoneNumber();

    if (!nameIs || !emailIs || !passIs || !phoneIs || !cpassIs) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email address already exists" });
    }

    const otpCode = await genneraeOTP(6);

    const UserIs = new User({
      name,
      email,
      password: ispass,
      phone,
      verificationCode: otpCode,
      verificationCodeExpiration: new Date(Date.now() + 180000),
    });

    const savedUser = await UserIs.save();

    const { accessToken } = await generateTokens(savedUser._id);

    const to = savedUser.email;
    const subject = 'Please Verify Your Email for Handcrafted';
    const text = `Dear  ${savedUser.name}, Welcome to <strong>Handcrafted</strong>! We're excited to have you on board. To ensure the security of your account and complete your registration, please verify your email address with the code below. This code will expire in 24 hours, so please verify your email as soon as possible. If you didn’t sign up for a Handcrafted account, please disregard this email.`;
    const html = `<p>Dear ${savedUser.name},</p><p>Welcome to <strong>Handcrafted</strong>!</p><p>We're excited to have you on board. To ensure the security of your account and complete your registration, please verify your email address with the code below:</p><p>OTP Code: <strong>${savedUser.verificationCode}</strong></p><p>This code will expire in 24 hours, so please verify your email as soon as possible. If you didn’t sign up for a Handcrafted account, please disregard this email.</p><p>We are committed to ensuring the security of your account. Please do not share this OTP with anyone.</p><p>Thank you for joining the Handcrafted community!</p><p>Best regards,</p><p>The Handcrafted Team</p><p>support@handcrafted.com</p>`;
    sendEmail(to, subject, text, html);

    const options = {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: true,
      sameSite: "None",
      domain: `${Configuration.CookieDomain}`,
    };

    const { password, verificationCode, token, ...responseData } = savedUser.toObject();
    res.status(201)
      .cookie('handcrafted', accessToken, options)
      .json({ message: "Successfull SignUp!", data: responseData, redirect: "redirectURL" });
  } catch (error) {
    res.status(500).json({ message: "fail to SignUp!" });
  }
}

export default SignUp;