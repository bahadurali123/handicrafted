import { CreateShip } from "../../config/createShip.config.js";
import { createOrder } from "../../config/paypal.config.js";
import Order from "../../models/order.model.js";
import OrderShipping from "../../models/ordershipping.model.js";
import ShippingAddress from "../../models/shippingaddress.model.js";

const createPaypalOrder = async (req, res) => {
    try {
        console.log("Create New Order with PayPal!");

        const { cart, totalPrice } = req.body;
        const user = req.user;
        const { name, email, phone, shippingAddresses } = user;
        const shippingAddressData = await ShippingAddress.find(
            {
                _id: { $in: shippingAddresses },
                userId: user._id,
                isPrimary: true
            });
        const { street, building, state, city, postalCode, countryCode } = shippingAddressData[0];
        const userData = {
            name, email, phone, street, building, state, city, postalCode, countryCode
        }
        const shipdata = {
            cartProducts: cart,
            user
        };
        const shipresponse = await CreateShip(shipdata);
        const { serviceType, currency, deliveryDatestamp, trackingNumber, url, totalCharges, totalShippings } = shipresponse.shipdata;
        const shipresponsedata = {
            serviceType,
            trackingNumber,
            currency,
            totalShippings,
            deliveryDatestamp,
            url,
            // totalCharges,
        }

        const ShippingData = new OrderShipping({
            customerName: name,
            phoneNumber: phone,
            email: email,
            street: street,
            building: building,
            state: state,
            city: city,
            postalCode: postalCode,
            countryCode: countryCode,
            shippingType: serviceType,
            trackingNumber: trackingNumber,
            currencyType: currency,
            shippingCost: totalShippings,
            document: url,
            deliveryDate: deliveryDatestamp,
        });
        const newShipping = await ShippingData.save();

        const totalIs = (totalPrice + totalShippings).toFixed(2);
        const cartData = {
            totalprice: totalIs,
        }

        const { jsonResponse, StatusCode } = await createOrder(cartData);
        const OrderData = new Order({
            userId: user._id,
            gatewayOrderId: jsonResponse.id,
            orderShippingId: newShipping._id,
            paymentStatus: jsonResponse.status,
            products: [...cart],
        });

        const newOrder = await OrderData.save();

        res.status(200).json({ message: "Successfull Create Order!", data: jsonResponse });
    } catch (error) {
        res.status(500).json("fail to Create Order!");
    }
}

export default createPaypalOrder;