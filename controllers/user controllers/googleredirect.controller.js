import { getGoogleAuthUrl } from "../../middleware/googleauthurl.middleware.js";

const googleRedirect = async (_, res) => {
  try {
    console.log("Redirect on google!");
    const authUrl = getGoogleAuthUrl();

    res.status(201).json({ message: "Redirect ap Google!", redirect: authUrl });
  } catch (error) {
    res.status(500).json({ message: "Failed to redirect on Google!" });
  }
}

export default googleRedirect;