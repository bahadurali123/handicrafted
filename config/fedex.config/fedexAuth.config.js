import { Configuration } from "../env.config.js";

const fedexOAuth = async (apiKey, secretKey) => {
    console.log("FedEx Auth!");
    const url = `${Configuration.fedexBaseUrl}/oauth/token`;
    console.log("FedEx Auth! 1", url);

    // Encode the credentials using Base64
    const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');
    console.log("FedEx Auth! 2", credentials, apiKey, secretKey);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`
    });
    console.log("FedEx Auth! 3", response);

    if (!response.ok) {
        throw new Error(`Failed to fetch OAuth token: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Auth Data: ", data);
    return data;
}

export {
    fedexOAuth
}