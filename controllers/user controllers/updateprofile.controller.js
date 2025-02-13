import User from "../../models/user.model.js";
import { UserValidator } from "../../validation/inputs.validation.js";
import { findFile, updateCloudinaryFile, uploadOnCloudinary } from "../../middleware/cloudinary.middleware.js";

const UpdateProfile = async (req, res) => {
    try {
        console.log("Update profile!");
        const { name, email, phone } = req.body
        const file = req.file.buffer;
        const user = req.user;

        if (!(user.status === 'Active')) {
            return res.status(400).json({ message: "You are blocked, you cannot make this change." });
        }

        const validName = new UserValidator({ name, email, phone });

        const nameIs = validName.validateName();
        const emailIs = validName.validateEmail();
        const phoneIs = validName.validatePhoneNumber();

        if (!nameIs || !emailIs || !phoneIs || !(file !== '')) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await User.findOne({ $and: [{ email: user.email }, { _id: user._id }] });

        if (!existingUser) {
            return res.status(401).json({ message: "You are unauthorized" });
        }

        function getCloudinaryDomain(url) {
            const regex = /^(?:https?:\/\/)?(?:[^.]+\.)?cloudinary\.com/;
            const match = url.match(regex);
            return match ? 'cloudinary.com' : null;
        }

        let profilePicture;
        if (file) {
            if (!existingUser.profilePicture) {
                const cloudinaryResponse = await uploadOnCloudinary(file);
                profilePicture = cloudinaryResponse.secure_url;
            } else {
                const domainName = getCloudinaryDomain(existingUser.profilePicture);
                if (domainName === "cloudinary.com ") {
                    const prevFileId = await findFile(existingUser.profilePicture);
                    profilePicture = await updateCloudinaryFile(prevFileId, file)
                } else {
                    const cloudinaryResponse = await uploadOnCloudinary(file);
                    profilePicture = cloudinaryResponse.secure_url;
                }
            }
        } else {
            profilePicture = existingUser.profilePicture;
        }

        const updatedUser = await User.findOneAndUpdate(
            {
                $and: [
                    { email: existingUser.email },
                    { _id: existingUser._id }
                ]
            },
            {
                name,
                email,
                phone,
                profilePicture,
            },
            {
                new: true
            }
        ).select("-password");

        res.status(201)
            .json({ message: "Successfull Updata User!", data: updatedUser, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Update User!" });
    }
}

export default UpdateProfile;