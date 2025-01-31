import { Configuration } from "../../config/env.config.js";
import generateTokens from "../../middleware/generateToken.middleware.js";
import User from "../../models/user.model.js";

const facebookCalback = async (req, res) => {
    try {
        console.log("Facebook calback!");

        const { code } = req.query;
        console.log("Facebook calback! 1", code);
        const redirectUri = `${Configuration.facebookredirecturl}`;

        // Exchange code for access token
        const tokenResponse = await fetch(`https://graph.facebook.com/v16.0/oauth/access_token?client_id=${Configuration.facebookappId}&client_secret=${Configuration.facebookappSecret}&redirect_uri=${redirectUri}&code=${code}`, {
            method: 'GET',
        });
        console.log("Facebook calback! 2", tokenResponse);
        const tokenData = await tokenResponse.json();
        console.log("Facebook calback! 3", tokenData);

        if (!tokenResponse.ok) {
            throw new Error(tokenData.error.message || 'Error exchanging code for access token');
        }
        console.log("Facebook calback! 4");

        const accessToken = tokenData.access_token;
        console.log("Facebook calback! 5", accessToken);

        // Fetch user profile using the access token
        const profileResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`, {
            method: 'GET',
        });
        console.log("Facebook calback! 6", profileResponse);

        const profileData = await profileResponse.json();
        console.log("Facebook calback! 7", profileData);

        if (!profileResponse.ok) {
            throw new Error(profileData.error.message || 'Error fetching user profile');
        }
        console.log("Facebook calback! 8");

        const userExist = await User.findOne({ $or: [{ email: profileData.email }, { googleId: profileData.id }] })
            .select("_id email googleId");
        console.log("Facebook calback! 9", userExist);

        console.log("User: ", userExist);
        if (userExist) {
            console.log("Facebook calback! 10");
            const { accessToken } = await generateTokens(userExist._id);

            const options = {
                httpOnly: true,
                secure: true,
            };

            res.status(200)
                .cookie("handcrafted", accessToken, options)
                .redirect(`${Configuration.FrontendUrl}`)
        } else {
            console.log("Facebook calback! 11");
            const newUser = new User({
                googleId: profileData.id,
                email: profileData.email,
                name: profileData.name,
                socialLogin: 'Facebook',
            });
            console.log("Facebook calback! 12");

            const user = await newUser.save();
            const { accessToken } = await generateTokens(user._id);
            console.log("Facebook calback! 13");
            // console.log("Access token", accessToken);

            const options = {
                httpOnly: true,
                secure: true,
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