import { Configuration } from "../../config/env.config.js";
import generateTokens from "../../middleware/generateToken.middleware.js";
import User from "../../models/user.model.js";

const facebookCalback = async (req, res) => {
    try {
        console.log("Facebook calback!");

        const { code } = req.query;
        const redirectUri = `${Configuration.facebookredirecturl}`;

        // Exchange code for access token
        const tokenResponse = await fetch(`https://graph.facebook.com/v16.0/oauth/access_token?client_id=${Configuration.facebookappId}&client_secret=${Configuration.facebookappSecret}&redirect_uri=${redirectUri}&code=${code}`, {
            method: 'GET',
        });
        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error(tokenData.error.message || 'Error exchanging code for access token');
        }

        const accessToken = tokenData.access_token;

        // Fetch user profile using the access token
        const profileResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`, {
            method: 'GET',
        });

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
            throw new Error(profileData.error.message || 'Error fetching user profile');
        }

        const userExist = await User.findOne({ $or: [{ email: profileData.email }, { googleId: profileData.id }] })
            .select("_id email googleId");

        if (userExist) {
            const { accessToken } = await generateTokens(userExist._id);

            const options = {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                domain: `${Configuration.CookieDomain}`,
                maxAge: 1000 * 60 * 60 * 24 * 30,
            };

            res.status(200)
                .cookie("handcrafted", accessToken, options)
                .redirect(`${Configuration.FrontendUrl}`)
        } else {
            const newUser = new User({
                googleId: profileData.id,
                email: profileData.email,
                name: profileData.name,
                socialLogin: 'Facebook',
            });

            const user = await newUser.save();
            const { accessToken } = await generateTokens(user._id);

            const options = {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                domain: `${Configuration.CookieDomain}`,
                maxAge: 1000 * 60 * 60 * 24 * 30,
            };

            res.status(200)
                .cookie("handcrafted", accessToken, options)
                .redirect(`${Configuration.FrontendUrl}`)
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export default facebookCalback;