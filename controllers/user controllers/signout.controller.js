import User from "../../models/user.model.js";

const SignOut = async (req, res) => {
    try {
        console.log("SignOut!");
        const _id = req.user._id;

        await User.findByIdAndUpdate(_id, { $set: { token: null } });

        res.status(201)
            .clearCookie("handcrafted")
            .json({ message: "Successfull Sign Out!", redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Sign Out!" });
    }
}

export default SignOut;