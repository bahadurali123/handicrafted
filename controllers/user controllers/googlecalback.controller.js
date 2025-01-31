import { Configuration } from "../../config/env.config.js";
import { OAuth2Client } from "google-auth-library";
import generateTokens from "../../middleware/generateToken.middleware.js";
import User from "../../models/user.model.js";

const client = new OAuth2Client({
    clientId: Configuration.googleclientId,
    clientSecret: Configuration.googleclientSecret,
    redirectUri: Configuration.googleredirecturl,
});

// recive user data from google
const googleCalback = async (req, res) => {
    try {
        console.log("Google calback!");
        const code = req.query.code;

        // Exchanged authorization code for tokens.
        const { tokens } = await client.getToken(code);
        // console.log("Tokens", tokens);
        client.setCredentials(tokens);

        // Verify theID token verified by Google.
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: Configuration.googleclientId,
        });

        // Extract user information from the payload of the ID token.
        const payload = ticket.getPayload();
        // console.log("Payload:", payload);

        const googleId = payload['sub'];
        const email = payload['email'];
        const name = payload['name'];
        const profilePicture = payload['picture'];

        const userExist = await User.findOne({ $or: [{ email: email }, { googleId }] })
            .select("_id email googleId");

        console.log("User: ", userExist);
        if (userExist) {
            const { accessToken } = await generateTokens(userExist._id);

            const options = {
                httpOnly: true,
                secure: true,
            };

            res.status(200)
                .cookie("handcrafted", accessToken, options)
                .redirect(`${Configuration.FrontendUrl}`)
        } else {
            const newUser = new User({
                googleId,
                email,
                name,
                profilePicture,
                socialLogin: true,
            });

            const user = await newUser.save();
            const { accessToken } = await generateTokens(user._id);
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

export default googleCalback;