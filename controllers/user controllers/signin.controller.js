import User from "../../models/user.model.js";
import { UserValidator } from "../../validation/inputs.validation.js";
import generateTokens from "../../middleware/generateToken.middleware.js";
import bcrypt from "bcrypt";
import { Configuration } from "../../config/env.config.js";

const SignIn = async (req, res) => {
    try {
        console.log("SignIn");
        // let { email, pass: password } = req.body
        const email = req.body.email;
        const pass = req.body.password;

        const validName = new UserValidator({ email, password: pass });

        const emailIs = validName.validateEmail();
        const passIs = validName.validatePassword();

        if (!emailIs || !passIs) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await User.findOne({ email }).select("_id name email password status role emailVerified profilePicture");
        if (!existingUser) {
            return res.status(401).json({ message: "You are unauthorized" });
        }
        console.log("Existing User: ", existingUser);

        const checkPassword = await bcrypt.compare(pass, existingUser.password);
        console.log("Check password: ", checkPassword);
        if (!checkPassword) {
            return res.status(401).json({ message: "You are unauthorized" });
        }

        const { accessToken } = await generateTokens(existingUser._id);

        const options = {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30,
            // secure: true,
            // sameSite: "None", // Allows cross-site cookies
            // domain: ".hand-crafted.vercel.app", // Set the specific domain
            // path: "/", // Ensure it's accessible across the site
        };

        const { password, verificationCode, ...responseData } = existingUser.toObject();

        res.status(201)
            .cookie('handcrafted', accessToken, options)
            .json({ message: "Successfull SignIn!", data: responseData, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to SignIn!" });
    }
}

export default SignIn;