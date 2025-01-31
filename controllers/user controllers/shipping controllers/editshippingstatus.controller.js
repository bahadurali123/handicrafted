import { UserValidator } from "../../../validation/inputs.validation.js";
import ShippingAddress from "../../../models/shippingaddress.model.js";

const EditShippingAddressStatus = async (req, res) => {
    try {
        console.log("Edit Shipping Address!");
        const user = req.user;
        const userId = user._id;

        const shippingId = req.params.id;

        if (!(user.status === 'Active')) {
            return res.status(401).json({ message: "You are blocked, you cannot make this change." });
        }
        const validName = new UserValidator({ Id: shippingId });

        const validShippingIs = validName.validateId();
        if (!validShippingIs) {
            return res.status(400).json({ message: "Shipping address ID required" })
        }

        await ShippingAddress.updateMany(
            { userId },
            { $set: { isPrimary: false } } // Mark them as isPrimary
        );

        await ShippingAddress.updateOne(
            { _id: shippingId, userId },
            { $set: { isPrimary: true } },
        );
        const data = await ShippingAddress.find({ userId })

        res.status(201)
            .json({ message: "Successfull Edit Shipping!", data, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to edit Shipping!" });
    }
}

export default EditShippingAddressStatus;