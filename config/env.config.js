import dotenv from 'dotenv';
dotenv.config();

const Configuration = {
    PORT: process.env.PORT,
    DBUri: process.env.URI,
    FrontendUrl: process.env.FRONTEND_REACT_URL,
    fedexBaseUrl: process.env.FEDEX_TEST_URL,
    fedexTrackKey: process.env.FEDEX_TRACK_API_KEY,
    fedexTrackSecret: process.env.FEDEX_TRACK_SECRET_KEY,
    fedexAccountNumber: process.env.FEDEX_ACCOUNT_NUMBER,
    fedexKey: process.env.FEDEX_API_KEY,
    fedexSecret: process.env.FEDEX_SECRET_KEY,
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryKey: process.env.CLOUDINARY_KEY,
    cloudinarySecret: process.env.CLOUDINARY_SECRET,
    cloudinaryFolder: process.env.CLOUDINARY_FOLDER_NAME,
    emailIs: process.env.HANDCRAFTED_EMAIL,
    emailPasswordIs: process.env.HANDCRAFTED_MAIL_PASSWORD,
    paypalBaseUrl: process.env.PAYPAL_BASE_URL,
    paypalClientId: process.env.PAYPAL_CLIENT_ID,
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    googleclientId: process.env.GOOGLE_CLIENT_ID,
    googleclientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleredirecturl: process.env.GOOGLE_REDIRECT_URL,
    facebookappId: process.env.FACEBOOK_APP_ID,
    facebookappSecret: process.env.FACEBOOK_APP_SECRET,
    facebookredirecturl: process.env.fACEBOOK_REDIRECT_URL,
    stripesecretkey: process.env.STRIPE_SECRET_KEY,
    stripewebhooksecretkey: process.env.STRIPE_WEBHOOK_SECRET_KEY,
};

export { Configuration };