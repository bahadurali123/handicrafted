import ShippingAddress from "../../../models/shippingaddress.model.js";
import User from "../../../models/user.model.js";

const DeleteShipping = async (req, res) => {
    try {
        console.log("Delete Shipping Address!");
        const user = req.user

        const shippingAddressesId = req.params.id;

        if (!(user.status === 'Active')) {
            return res.status(401).json({ message: "You are blocked, you cannot make this change." });
        }

        if (!shippingAddressesId || !user.shippingAddresses.includes(shippingAddressesId)) {
            return res.status(400).json({ message: "Shipping address not found" })
        }

        const deletedAddress = await ShippingAddress.findOneAndDelete({ _id: shippingAddressesId }, { new: true });

        const shippingAddresses = user.shippingAddresses.filter(item => item.toString() !== shippingAddressesId);

        const updatedUser = await User.findOneAndUpdate(
            {
                _id: user._id
            },
            {
                shippingAddresses,
            },
            {
                new: true
            }
        ).select("-password");

        res.status(201)
            .json({ message: "Successfull Add Shipping!", data: { shipping: deletedAddress, user: updatedUser }, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to add Shipping!" });
    }
}

export default DeleteShipping;