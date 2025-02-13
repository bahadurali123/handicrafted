import { Configuration } from "../../../config/env.config.js";
import { fedexOAuth } from "../../../config/fedex.config/fedexAuth.config.js";
import { createNumberTracking } from "../../../config/fedex.config/fedexNumberTrack.config.js";
import OrderShipping from "../../../models/ordershipping.model.js";

const orderShippingTracking = async (req, res) => {
    try {
        console.log("Order Tracking!");
        const shippingId = req.params.id;
        const fedExStatusCodes = [
            { key: "PF", value: "Plane in Flight" },
            { key: "AA", value: "At Airport" },
            { key: "PL", value: "Plane Landed" },
            { key: "AC", value: "At Canada Post facility" },
            { key: "PM", value: "In Progress" },
            { key: "AD", value: "At Delivery" },
            { key: "PU", value: "Picked Up" },
            { key: "AF", value: "At local FedEx Facility" },
            { key: "PX", value: "Picked up (see Details)" },
            { key: "AO", value: "Shipment arriving On-time" },
            { key: "RR", value: "CDO requested" },
            { key: "AP", value: "At Pickup" },
            { key: "RM", value: "CDO Modified" },
            { key: "AR", value: "Arrived at FedEx location" },
            { key: "RC", value: "CDO Cancelled" },
            { key: "AX", value: "At USPS facility" },
            { key: "RS", value: "Return to Shipper" },
            { key: "CA", value: "Shipment Cancelled" },
            { key: "RP", value: "Return label link emailed to return sender" },
            { key: "CH", value: "Location Changed" },
            { key: "LP", value: "Return label link cancelled by shipment originator" },
            { key: "DD", value: "Delivery Delay" },
            { key: "RG", value: "Return label link expiring soon" },
            { key: "DE", value: "Delivery Exception" },
            { key: "RD", value: "Return label link expired" },
            { key: "DL", value: "Delivered" },
            { key: "SE", value: "Shipment Exception" },
            { key: "DP", value: "Departed" },
            { key: "SF", value: "At Sort Facility" },
            { key: "DR", value: "Vehicle furnished but not used" },
            { key: "SP", value: "Split Status" },
            { key: "DS", value: "Vehicle Dispatched" },
            { key: "TR", value: "Transfer" },
            { key: "DY", value: "Delay Regulatory" },
            { key: "EA", value: "Enroute to Airport" },
            { key: "CC", value: "Cleared Customs" },
            { key: "ED", value: "Enroute to Delivery" },
            { key: "CD", value: "Clearance Delay" },
            { key: "EO", value: "Enroute to Origin Airport" },
            { key: "CP", value: "Clearance in Progress" },
            { key: "EP", value: "Enroute to Pickup" },
            { key: "EA", value: "Export Approved" },
            { key: "FD", value: "At FedEx Destination" },
            { key: "HL", value: "Hold at Location" },
            { key: "HP", value: "Ready for Recipient Pickup" },
            { key: "IT", value: "In Transit" },
            { key: "IX", value: "In transit (see Details)" },
            { key: "LO", value: "Left Origin" },
            { key: "OC", value: "Order Created" },
            { key: "OD", value: "Out for Delivery" },
            { key: "OF", value: "At FedEx origin facility" },
            { key: "OX", value: "Shipment information sent to USPS" },
            { key: "PD", value: "Pickup Delay" }
        ];

        const statusMapping = {
            Pending: ['OC', 'PU', 'PM'], // Order Created, Picked Up, In Progress
            Shipped: ['IT', 'EP', 'AR', 'SP', 'OF', 'IX'], // In Transit, Enroute to Pickup, Arrived, etc.
            Delivered: ['DL', 'OD', 'HP'], // Delivered, Out for Delivery, Ready for Pickup
            Canceled: ['CA', 'RD'] // Shipment Cancelled, Return Declined
        };

        const orderShipping = await OrderShipping.findOne({ _id: shippingId });

        // Define the request options
        const fedexoauth = await fedexOAuth(Configuration.fedexTrackKey, Configuration.fedexTrackSecret);

        const body = {
            includeDetailedScans: true,
            trackingInfo: [
                {
                    trackingNumberInfo: {
                        trackingNumber: orderShipping.trackingNumber
                    }
                }
            ]
        }

        const data = await createNumberTracking(fedexoauth, body);

        // Get the most recent scan event
        const scanEvents = data.output.completeTrackResults[0].trackResults[0].scanEvents;

        // Map scan events to include eventName
        const enrichedScanEvents = scanEvents.map(event => {
            const status = fedExStatusCodes.find(code => code.key === event.eventType);
            return {
                ...event,
                eventName: status ? status.value : event.eventType // Default to "event Type" if "status value" not found
            };
        });

        function mapFedExStatus(fedExStatusCode) {
            for (const [key, codes] of Object.entries(statusMapping)) {
                if (codes.includes(fedExStatusCode)) {
                    return key; // Returns "Pending", "Shipped", "Delivered", or "Canceled"
                }
            }
            return 'Unknown'; // Default for unmapped statuses
        }

        // Example usage:
        const mostRecentEvent = enrichedScanEvents[0].eventType;
        const simplifiedStatus = mapFedExStatus(mostRecentEvent);

        const trackingData = {
            simplifiedStatus,
            enrichedScanEvents
        }

        if (orderShipping.status !== simplifiedStatus) {
            await OrderShipping.findOneAndUpdate(
                { _id: orderShipping._id },
                {
                    status: simplifiedStatus,
                }, { new: true });
        };

        res.status(200).json({ message: "Successfull Order Track!", data: trackingData });
    } catch (error) {
        res.status(500).json("fail to track!");
    }
};

export default orderShippingTracking;