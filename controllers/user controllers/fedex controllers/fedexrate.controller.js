import { Configuration } from "../../../config/env.config.js";
import { fedexOAuth } from "../../../config/fedex.config/fedexAuth.config.js";
import { findRate } from "../../../config/fedex.config/fedexRate.config.js";
import Product from "../../../models/product.model.js";
import ShippingAddress from "../../../models/shippingaddress.model.js";

const findFedexRate = async (req, res) => {
    try {
        // Define the request options
        console.log("Find Shipping Rate!");
        const productId = req.params.productId;
        const user = req.user;

        const shippingAdd = await ShippingAddress.find(
            {
                _id: { $in: user.shippingAddresses },
                isPrimary: true
            });

        const product = await Product.findById({ _id: productId });
        const fedexoauth = await fedexOAuth(Configuration.fedexKey, Configuration.fedexSecret);

        const HandcraftedUSStore = {
            Street: "123 Main Street",
            Building: "Unit 5B",
            State: "CA",
            City: "Los Angeles",
            PostalCode: 90012,
            CountryCode: "US"
        }

        const localeShipmentDetails = {
            accountNumber: {
                value: Configuration.fedexAccountNumber
            },
            requestedShipment: {
                shipper: {
                    address: {
                        // streetLines: ['123 Shipper St'],
                        // city: 'Shipper City',
                        // stateOrProvinceCode: 'CA',
                        // postalCode: '90210',
                        // countryCode: 'US'
                        streetLines: [HandcraftedUSStore.Street],
                        city: HandcraftedUSStore.City,
                        stateOrProvinceCode: HandcraftedUSStore.State,
                        postalCode: HandcraftedUSStore.PostalCode,
                        countryCode: HandcraftedUSStore.CountryCode
                    }
                },
                recipient: {
                    address: {
                        streetLines: [shippingAdd[0].building, shippingAdd[0].street],
                        city: shippingAdd[0].city,
                        postalCode: shippingAdd[0].postalCode,
                        countryCode: shippingAdd[0].countryCode,
                        residential: false
                    }
                },
                pickupType: "DROPOFF_AT_FEDEX_LOCATION",
                serviceType: "FEDEX_GROUND", // Or specify as per your requirement
                packagingType: "YOUR_PACKAGING",
                shippingChargesPayment: {
                    paymentType: "SENDER"
                },
                rateRequestType: ["ACCOUNT"],
                requestedPackageLineItems: [
                    {
                        weight: {
                            units: "LB",
                            value: product.weight * 2.2
                        },
                        dimensions: {
                            length: product.length / 2.54,
                            width: product.width / 2.54,
                            height: product.height / 2.54,
                            units: 'IN'
                        }
                    }
                ]
            }
        };

        const internationalShipmentDetails = {
            accountNumber: {
                value: Configuration.fedexAccountNumber // Use your actual FedEx account number here
            },
            requestedShipment: {
                shipper: {
                    address: {
                        // postalCode: "05450",
                        // countryCode: "PK",
                        // postalCode: '33101',
                        // countryCode: 'US'
                        postalCode: HandcraftedUSStore.PostalCode,
                        countryCode: HandcraftedUSStore.CountryCode
                    }
                },
                recipient: {
                    address: {
                        postalCode: shippingAdd[0].postalCode,         // Recipient's postal code
                        countryCode: shippingAdd[0].countryCode        // Recipient's country code
                    }
                },
                // This field specifies the package's pickup method
                pickupType: 'DROPOFF_AT_FEDEX_LOCATION',
                // Requested package details
                requestedPackageLineItems: [
                    {
                        weight: {
                            units: "LB",
                            value: product.weight * 2.2
                        },
                        dimensions: {
                            length: product.length / 2.54,
                            width: product.width / 2.54,
                            height: product.height / 2.54,
                            units: 'IN'
                        }
                    }
                ],
                // Service type for international shipping
                serviceType: 'INTERNATIONAL_PRIORITY',
                packagingType: 'YOUR_PACKAGING',        // Packaging type
                shippingChargesPayment: {
                    paymentType: 'SENDER'               // Who is paying for the shipping
                },
                customsClearanceDetail: {
                    commodities: [                       // Customs information for international shipping
                        {
                            description: product.description,
                            quantity: 1,
                            quantityUnits: 'EA',
                            weight: {
                                units: 'LB',
                                value: product.weight / 2.2
                            },
                            customsValue: {
                                currency: 'USD',
                                amount: product.price              // Total value of the shipment
                            }
                        }
                    ]
                },
                rateRequestType: ['ACCOUNT', 'LIST']     // Type of rates to request
            }
        };

        let data;
        if (shippingAdd[0].countryCode === 'US') {
            data = await findRate(fedexoauth, localeShipmentDetails);
        } else {
            data = await findRate(fedexoauth, internationalShipmentDetails);
        }

        res.status(200).json({ message: "Successfull tracking!", data });
    } catch (error) {
        res.status(500).json("fail to track!");
    }
};

export default findFedexRate;