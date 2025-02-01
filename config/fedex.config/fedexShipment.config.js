import { Configuration } from "../env.config.js";

const createShipment = async (accessToken, shipmentData) => {
    try {
        // const url = `${Configuration.fedexBaseUrl}/ship/v1/shipments`;
        const url = `${process.env.FEDEX_TEST_URL}/ship/v1/shipments`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.access_token}`,
                'Content-Type': 'application/json',
                'X-locale': 'en_US'
            },
            body: JSON.stringify(shipmentData)
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            console.error('Error creating shipment:', data);
            throw new Error(data.errors[0].message || 'Shipment creation failed');
        }
    } catch (error) {
        console.error('Error in createShipment:', error.message);
        throw error;
    }
};

export { createShipment };