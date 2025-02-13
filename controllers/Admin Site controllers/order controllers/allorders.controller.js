import Order from "../../../models/order.model.js";
import OrderShipping from "../../../models/ordershipping.model.js";
import { AdminValidator } from "../../../validation/inputs.validation.js";

const allOrders = async (req, res) => {
    try {
        console.log("All Orders!");
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator({ assignRole, Status });

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();

        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." });
        }
        if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
            return res.status(401).json({ message: "With this role, you cannot make this change." });
        }
        const orders = await Order.find();
        if (!orders) {
            return res.status(404).json({ message: "Orders not found." });
        }
        const ordersShippingIds = orders.map(item => item.orderShippingId);
        const ordersShippings = await OrderShipping.find({ _id: { $in: ordersShippingIds } });


        res.status(200).json({ message: "Successfull Get Orders!", data: { orders, ordersShippings } });
    } catch (error) {
        res.status(500).json("fail to Get Orders!");
    }
}

export default allOrders;