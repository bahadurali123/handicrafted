import { Configuration } from "../config/env.config.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client({
    clientId: Configuration.googleclientId,
    clientSecret: Configuration.googleclientSecret,
    redirectUri: Configuration.googleredirecturl,
});

const getGoogleAuthUrl = () => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ];
    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        redirect_uri: Configuration.googleredirecturl,
    });
    return authUrl;
};

export {
    getGoogleAuthUrl
}