import { Configuration } from "../env.config.js";

const findRate = async (accessToken, rateData) => {
    try {
        console.log("FedEx Rate!");
        const url = `${Configuration.fedexBaseUrl}/rate/v1/rates/quotes`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.access_token}`,
                'Content-Type': 'application/json',
                'X-locale': 'en_US'
            },
            body: JSON.stringify(rateData)
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            console.error('Error finding shipment rate:', data);
            throw new Error(data.errors[0].message || 'Finding shipment rate failed');
        }
    } catch (error) {
        console.error('Error in find shipment rate:', error.message);
        throw error;
    }
};

export { findRate };