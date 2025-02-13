import Order from "../../models/order.model.js";
import OrderShipping from "../../models/ordershipping.model.js";
import { AdminValidator } from "../../validation/inputs.validation.js";

const userOrders = async (req, res) => {
    try {
        console.log("User Orders!");
        const userId = req.params.id;
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator({ assignRole, Status });

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();

        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }

        const orders = await Order.find({ userId: user._id });
        const ordersShippingIds = orders.map(item => item.orderShippingId);
        const ordersShippings = await OrderShipping.find({ _id: { $in: ordersShippingIds } });


        res.status(200).json({ message: "Successfull Get Orders!", data: { orders, ordersShippings } });
    } catch (error) {
        res.status(500).json("fail to Get Orders!");
    }
}

export default userOrders;