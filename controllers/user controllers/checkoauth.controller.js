const CheckOauth = async (req, res) => {
    try {
        console.log("Check OAuth!");
        let user = req.user;

        if (!user) {
            return res.status(201).json({ message: "User is not logged in.", data: null })
        }

        const { password, verificationCode, ...responseData } = user.toObject();

        res.status(201)
            .json({ message: "Successfull Check Authantication!", data: responseData, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Check Authantication!" });
    }
}

export default CheckOauth;