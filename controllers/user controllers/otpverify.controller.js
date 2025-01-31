import { UserValidator } from "../../validation/inputs.validation.js";
import User from "../../models/user.model.js";

const veirfyOTP = async (req, res) => {
    try {
        console.log("Verify!");
        let { verificationCode } = req.body;
        console.log("Verify! 1", req.body, req.user);
        const email = req.user.email;
        console.log("verifyOTP: ", email, verificationCode);
        verificationCode = parseInt(verificationCode);

        const validName = new UserValidator({ email, verificationCode });

        const emailIs = validName.validateEmail();
        const otpIs = validName.validateOtpCode();

        if (!emailIs || !otpIs) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const givenUser = await User.findOne({ email });
        const time = new Date();


        if (!(verificationCode === givenUser.verificationCode)) {
            res.status(401).json({ message: "Incorrect OTP!" });
            return;
        }

        if (!(time < givenUser.verificationCodeExpiration)) {
            res.status(401).json({ message: "OTP is expire!" });
            return;
        }

        const updatedUser = await User.findByIdAndUpdate(
            { _id: givenUser._id },
            {
                emailVerified: true,
                status: 'Active'
            },
            { new: true }
        );

        res.status(201)
            .json({ message: "Successfull Verify OTP!", data: updatedUser, redirect: "redirectat homme URL" });
    } catch (error) {
        res.status(500).json({ message: "Fail to Verify OTP!" });
    }
}

export default veirfyOTP;