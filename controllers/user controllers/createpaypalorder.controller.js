import { CreateShip } from "../../config/createShip.config.js";
import { createOrder } from "../../config/paypal.config.js";
import Order from "../../models/order.model.js";
import OrderShipping from "../../models/ordershipping.model.js";
import ShippingAddress from "../../models/shippingaddress.model.js";

const createPaypalOrder = async (req, res) => {
    try {
        console.log("Create New Order with PayPal!");
        console.log("Create order 1: ", req.body);
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
        console.log("User Data", userData);
        const shipdata = {
            cartProducts: cart,
            user
        };
        console.log("Ship Data", shipdata);
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
        console.log("Data for Shipping: ", shipresponsedata);
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
        console.log("New Shipping of data: ", newShipping);

        console.log("Total Price: ", totalPrice + totalShippings);
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
        console.log("Data for Order: ", OrderData);
        const newOrder = await OrderData.save();
        console.log("Order Response: ", newOrder);
        console.log("Create order 2: ", jsonResponse);
        res.status(200).json({ message: "Successfull Create Order!", data: jsonResponse });
    } catch (error) {
        res.status(500).json("fail to Create Order!");
    }
}

export default createPaypalOrder;