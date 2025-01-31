import User from "../models/user.model.js";

const generateTokens = async (userId) => {
    try {
        let data;
        if (userId) {
            data = await User.findById(userId);
        }

        const refreshToken = await data.refreshToken();
        const accessToken = await data.accessToken();
        data.token = refreshToken;
        await data.save({ validateBeforeSave: false });
        return { refreshToken, accessToken };
    } catch (error) {
        res.status(500).error();
    }
};

export default generateTokens;