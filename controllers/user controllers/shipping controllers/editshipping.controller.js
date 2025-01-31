import { UserValidator } from "../../../validation/inputs.validation.js";
import ShippingAddress from "../../../models/shippingaddress.model.js";

const UpdateShipping = async (req, res) => {
    try {
        console.log("Update Shipping Address!");
        const user = req.user
        const shippingAddressesId = req.params.id;

        const { street, building, state, city, postalCode, countryCode } = req.body

        if (!(user.status === 'Active')) {
            return res.status(401).json({ message: "You are blocked, you cannot make this change." });
        }

        const validName = new UserValidator({ Id: shippingAddressesId, street, building, state, city, postalCode, countryCode });

        const addressIs = validName.validateAddress();
        const countryIs = validName.validateCountryCode();
        const validShippingIs = validName.validateId();

        if (!addressIs || !countryIs || !validShippingIs) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const updatedShipping = await ShippingAddress.findOneAndUpdate(
            {
                $and: [{ _id: shippingAddressesId }, { userId: user._id }]
            },
            {
                street,
                building,
                state,
                city,
                postalCode,
                countryCode
            },
            {
                new: true
            }
        );

        res.status(201)
            .json({ message: "Successfull Update Shipping!", data: updatedShipping, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to update Shipping!" });
    }
}

export default UpdateShipping;