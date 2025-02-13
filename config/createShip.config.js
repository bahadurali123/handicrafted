import Product from "../models/product.model.js";
import ShippingAddress from "../models/shippingaddress.model.js";
import { Configuration } from "./env.config.js";
import { fedexOAuth } from "./fedex.config/fedexAuth.config.js";
import { createShipment } from "./fedex.config/fedexShipment.config.js";

const CreateShip = async (reqdata) => {
    const { cartProducts, user } = reqdata;

    const shippingAdd = await ShippingAddress.find(
        {
            _id: { $in: user.shippingAddresses },
            userId: user._id,
            isPrimary: true
        });
    const productIds = cartProducts.map(item => item._id);
    const productsList = await Product.find({ _id: { $in: productIds } });
    const fedexoauth = await fedexOAuth(Configuration.fedexKey, Configuration.fedexSecret);

    const HandcraftedUSStore = {
        Street: "123 Main Street",
        Building: "Unit 5B",
        State: "CA",
        City: "Los Angeles",
        PostalCode: 90012,
        CountryCode: "US"
    }

    const domesticBody = {
        accountNumber: {
            value: Configuration.fedexAccountNumber  // Use your FedEx account number here
        },
        labelResponseOptions: "URL_ONLY",
        requestedShipment: {
            shipTimestamp: new Date().toISOString(),
            pickupType: 'DROPOFF_AT_FEDEX_LOCATION',
            serviceType: 'FEDEX_GROUND',  // For domestic shipment
            packagingType: 'YOUR_PACKAGING',
            shipper: {
                contact: {
                    personName: 'Nadir khan',
                    phoneNumber: '1234567890'
                },
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
            recipients: [
                {
                    contact: {
                        personName: user.name,
                        phoneNumber: user.phone
                    },
                    address: {
                        // stateOrProvinceCode: 'NY',
                        // postalCode: '10001',
                        stateOrProvinceCode: shippingAdd[0].state,
                        postalCode: shippingAdd[0].postalCode,
                        streetLines: [shippingAdd[0].building, shippingAdd[0].street],
                        city: shippingAdd[0].city,
                        countryCode: shippingAdd[0].countryCode,
                    }
                }
            ],
            requestedPackageLineItems: productsList.map(item => ({
                weight: {
                    units: 'LB',
                    value: item.weight * 2.2
                },
                dimensions: {
                    length: item.length / 2.54,
                    width: item.width / 2.54,
                    height: item.height / 2.54,
                    units: 'IN'
                }
            })),
            shippingChargesPayment: {
                paymentType: 'SENDER', // The sender pays for the shipping
                payor: {
                    responsibleParty: {
                        accountNumber: {
                            value: Configuration.fedexAccountNumber  // FedEx account number
                        }
                    }
                }
            },
            labelSpecification: {
                labelFormatType: 'COMMON2D',
                imageType: 'PDF',
                labelStockType: 'PAPER_4X6'
            },

            customsClearanceDetail: {
                commodities: productsList.map(item => ({
                    description: item.name,  // Description of the product
                    // countryOfManufacture: 'US',  // Where the product was made
                    quantity: cartProducts.find(pro => pro._id === (item._id).toString()).quantity,  // How many items are being shipped
                    weight: {
                        units: 'LB',
                        value: item.weight * 2.2
                    },
                    unitPrice: {
                        amount: item.price,  // The value of each item
                        currency: 'USD'
                    },
                })),
            }
        }
    };

    const internationalBody = {
        accountNumber: {
            value: Configuration.fedexAccountNumber
        },
        labelResponseOptions: "URL_ONLY",
        requestedShipment: {
            shipTimestamp: new Date().toISOString(),
            pickupType: 'DROPOFF_AT_FEDEX_LOCATION',
            serviceType: 'INTERNATIONAL_PRIORITY',
            packagingType: 'YOUR_PACKAGING',
            shipper: {
                contact: {
                    personName: 'Nadir khan',
                    phoneNumber: '1234567890'
                },
                address: {
                    // streetLines: ['123 Shipper St'],
                    // city: 'Shipper City',
                    // postalCode: '44050',
                    // countryCode: 'PK'

                    streetLines: [HandcraftedUSStore.Street],
                    city: HandcraftedUSStore.City,
                    stateOrProvinceCode: HandcraftedUSStore.State,
                    postalCode: HandcraftedUSStore.PostalCode,
                    countryCode: HandcraftedUSStore.CountryCode
                }
            },
            recipients: [
                {
                    contact: {
                        personName: user.name,
                        phoneNumber: user.phone
                    },
                    address: {
                        streetLines: [shippingAdd[0].building, shippingAdd[0].street],
                        city: shippingAdd[0].city,
                        // stateOrProvinceCode: 'TX',
                        // postalCode: '79999',
                        stateOrProvinceCode: shippingAdd[0].state,
                        postalCode: shippingAdd[0].postalCode,
                        countryCode: shippingAdd[0].countryCode,
                    }
                }
            ],
            requestedPackageLineItems: productsList.map(item => ({
                weight: {
                    units: 'LB',
                    value: item.weight * 2.2
                },
                dimensions: {
                    length: item.length / 2.54,
                    width: item.width / 2.54,
                    height: item.height / 2.54,
                    units: 'IN'
                }
            })),
            shippingChargesPayment: {
                paymentType: 'SENDER',
                payor: {
                    responsibleParty: {
                        accountNumber: {
                            value: Configuration.fedexAccountNumber
                        }
                    }
                }
            },
            labelSpecification: {
                labelFormatType: 'COMMON2D',
                imageType: 'PDF',
                labelStockType: 'PAPER_4X6'
            },
            // Required for international shipments
            customsClearanceDetail: {
                dutiesPayment: {
                    paymentType: 'SENDER',  // Specify who is paying for the duties
                    payor: {
                        responsibleParty: {
                            accountNumber: {
                                value: Configuration.fedexAccountNumber
                            }
                        }
                    }
                },
                commodities: productsList.map(item => ({
                    description: item.name,  // Description of the product
                    countryOfManufacture: 'US',  // Where the product was made
                    quantity: cartProducts.find(pro => pro._id === (item._id).toString()).quantity,  // How many items are being shipped
                    quantityUnits: 'EA',
                    weight: {
                        units: 'LB',
                        value: item.weight * 2.2
                    },
                    unitPrice: {
                        amount: item.price,  // The value of each item
                        currency: 'USD'
                    },
                    customsValue: {
                        currency: 'USD',
                        amount: 100  // Total customs value
                    }
                })),
            }
        }
    };

    let data;
    if (shippingAdd[0].countryCode === 'US') {
        data = await createShipment(fedexoauth, domesticBody);
    } else {
        data = await createShipment(fedexoauth, internationalBody);
    }

    const serviceType = data.output.transactionShipments[0].serviceType;
    const { currency, deliveryDatestamp, trackingNumber } = data.output.transactionShipments[0].pieceResponses[0];
    const shipmentDocument = data.output.transactionShipments[0]?.shipmentDocuments?.[0]?.url;
    const url = data.output.transactionShipments[0].pieceResponses[0].packageDocuments[0].url;
    const totalCharges = data.output.transactionShipments[0].completedShipmentDetail.shipmentRating.shipmentRateDetails[0].totalNetCharge;
    const shipItems = data.output.transactionShipments[0].pieceResponses;
    const shippingtotalarray = cartProducts.map((item, index) => item.quantity * shipItems[index].baseRateAmount);
    const shipp = shippingtotalarray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const shipdata = {
        serviceType,
        currency,
        deliveryDatestamp,
        trackingNumber,
        url: shipmentDocument || url,
        totalCharges,
        totalShippings: shipp
    }

    return { shipdata, data };
};

export { CreateShip };