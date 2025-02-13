import { UserValidator } from "../../../validation/inputs.validation.js";
import ShippingAddress from "../../../models/shippingaddress.model.js";
import User from "../../../models/user.model.js";

const AddShipping = async (req, res) => {
    try {
        console.log("Add Shipping Address!");
        const user = req.user

        const { street, building, state, city, postalCode, countryCode } = req.body

        if (!(user.status === 'Active')) {
            return res.status(400).json({ message: "You are blocked, you cannot make this change." });
        }

        const validName = new UserValidator({ street, building, state, city, postalCode, countryCode });

        const addressIs = validName.validateAddress();
        const countryIs = validName.validateCountryCode();

        let newshipping;

        if (!addressIs || !countryIs) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!user.shippingAddresses[0]) {
            // add Shipping address with default true
            const ShipIs = new ShippingAddress({
                userId: user._id,
                isPrimary: true,
                street,
                building,
                state,
                city,
                postalCode,
                countryCode
            });

            newshipping = await ShipIs.save();
        }

        if (user.shippingAddresses[0]) {
            // add Shipping address with default false
            const ShipIs = new ShippingAddress({
                userId: user._id,
                isPrimary: false,
                street,
                building,
                state,
                city,
                postalCode,
                countryCode
            });

            newshipping = await ShipIs.save();
        }

        const newUser = await User.findOneAndUpdate(
            {
                _id: user._id
            },
            {
                shippingAddresses: [...user.shippingAddresses, newshipping._id],
            },
            {
                new: true
            }
        ).select("-password");

        res.status(201)
            .json({ message: "Successfull Add Shipping!", data: { shipping: newshipping, user: newUser }, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to add Shipping!" });
    }
}

export default AddShipping;