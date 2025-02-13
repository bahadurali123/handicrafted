import { captureOrder } from "../../config/paypal.config.js";
import Order from "../../models/order.model.js";


const capturePaypalOrder = async (req, res) => {
    try {
        console.log("Capture PayPal Order!");
        const { orderId, source } = req.body;
        const { jsonResponse, StatusCode } = await captureOrder(orderId);
        const OrderData = await Order.findOneAndUpdate(
            { gatewayOrderId: orderId },
            {
                paymentStatus: jsonResponse.status,
                currencyCode: jsonResponse.purchase_units[0]?.payments.captures[0]?.amount?.currency_code,
                totalAmount: jsonResponse.purchase_units[0]?.payments.captures[0]?.amount?.value,
                paymentGateway: source
            },
            { new: true }
        );
        res.status(StatusCode).json({ message: "Successfull Capture Order!", data: jsonResponse });
    } catch (error) {
        res.status(500).json("fail to Capture Order!");
    }
}

export default capturePaypalOrder;