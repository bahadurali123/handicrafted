
import { Configuration } from "./env.config.js";
const base = Configuration.paypalBaseUrl;

// ................................

//   Create PayPal Order

// ................................
const createOrder = async (cart) => {
    // const { totalprice, address_line_1, address_line_2, admin_area_2, admin_area_1, postal, country, } = cart;
    const { totalprice } = cart;

    const accessToken = await generatePaypalAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: totalprice,
                },
                shipping: {
                    name: {
                        full_name: "John Doe"
                    },
                    // address: {
                    //     address_line_1,
                    //     address_line_2,
                    //     admin_area_2,
                    //     admin_area_1,
                    //     postal_code: postal,
                    //     country_code: country,
                    // }
                }
            }
        ]
    }
    const checkout = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });

    return handleResponse(checkout);
};

// ................................

//   Capture PayPal Order

// ................................
const captureOrder = async (orderID) => {
    const accessToken = await generatePaypalAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return handleResponse(response);
}

// ................................

//   Generate PayPal AccessToken

// ................................
const generatePaypalAccessToken = async () => {
    try {
        if (!Configuration.paypalClientId || !Configuration.paypalClientSecret) {
            throw new Error("PayPal credentials are missing.")
        };
        const auth = Buffer.from(
            Configuration.paypalClientId + ":" + Configuration.paypalClientSecret
        ).toString("base64");
        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        const oauthResponse = await response.json();
        // console.log("Successfully generate Access Token:");

        return oauthResponse.access_token;
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
};

// ................................

//   Response Handler

// ................................
const handleResponse = async (response) => {
    try {
        const jsonResponse = await response.json();
        // console.log("Handel response: ", jsonResponse);
        return {
            jsonResponse,
            StatusCode: response.status,
        };
    } catch (error) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
};

export {
    createOrder,
    captureOrder
}