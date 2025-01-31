import { Configuration } from "../env.config.js";

const createNumberTracking = async (accessToken, trackingData) => {
    try {
        const url = `${Configuration.fedexBaseUrl}/track/v1/trackingnumbers`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.access_token}`,
                'Content-Type': 'application/json',
                'X-locale': 'en_US'
            },
            body: JSON.stringify(trackingData)
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            console.error('Error order tracking:', data);
            throw new Error(data.errors[0].message || 'Order tracking failed');
        }
    } catch (error) {
        console.error('Error in orderTracking:', error.message);
        throw error;
    }
};

export { createNumberTracking };