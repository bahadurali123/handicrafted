import { Configuration } from "../../config/env.config.js";

const facebookRedirect = async (_, res) => {
    try {
        console.log("Redirect on facebook!");

        const redirectUri = encodeURIComponent(`${Configuration.facebookredirecturl}`);
        const facebookAuthUrl = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${Configuration.facebookappId}&redirect_uri=${redirectUri}&scope=email,public_profile`;

        res.status(201).json({ message: "Redirect ap Facebook!", redirect: facebookAuthUrl });
    } catch (error) {
        res.status(500).json({ message: "Failed to redirect on Facebook!" });
    }
}

export default facebookRedirect;