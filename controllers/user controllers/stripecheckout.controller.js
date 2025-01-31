import { CreateShip } from "../../config/createShip.config.js";
import { Checkout } from "../../config/stripe.config.js";
import Order from "../../models/order.model.js";
import OrderShipping from "../../models/ordershipping.model.js";
import ShippingAddress from "../../models/shippingaddress.model.js";


const stripeCheckout = async (req, res) => {
    try {
        console.log("Stripe Checkout Order!");
        const { cart, totalPrice } = req.body;
        const user = req.user;
        const shipdata = {
            cartProducts: cart,
            user
        };
        const shipresponse = await CreateShip(shipdata);

        const { serviceType, currency, deliveryDatestamp, trackingNumber, url, totalCharges, totalShippings } = shipresponse.shipdata;
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

        const cartData = {
            totalprice: totalPrice + totalShippings,
        }
        console.log("1.3", cartData);

        const session = await Checkout(cartData);
        console.log("2", session);
        const { id, amount_total, currency: currencyCode, payment_method_types, payment_status } = session;
        const obj = {
            serviceType,
            currency,
            deliveryDatestamp,
            trackingNumber,
            url,
            totalCharges,
            totalShippings,
            id,
            amount_total,
            currencyCode,
            payment_method_types,
            payment_status
        }
        console.log("Data for order:> ", obj);
        const OrderData = new Order({
            userId: user._id,
            gatewayOrderId: id,
            orderShippingId: newShipping._id,
            paymentStatus: payment_status,
            products: [...cart],
            currencyCode: currencyCode,
            totalAmount: amount_total / 100,
            paymentGateway: 'stripe'
        });
        console.log("Data for Order: ", OrderData);
        const newOrder = await OrderData.save();
        console.log("Order Response: ", newOrder);

        res.status(200).json({ message: "Successfull Checkout Order!", data: session, id: session.id });
    } catch (error) {
        res.status(500).json("fail to Checkout Order!");
    }
}

export default stripeCheckout;