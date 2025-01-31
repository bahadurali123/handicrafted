import ShippingAddress from "../../../models/shippingaddress.model.js";

const UserShippings = async (req, res) => {
    try {
        console.log("User Shippings")
        const user = req.user;
        const userShippAddreses = user.shippingAddresses;

        const allshippings = await ShippingAddress.find({ _id: { $in: userShippAddreses } });

        res.status(201)
            .json({ message: "Successfull Get All Shipping!", data: allshippings, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Get All Shipping!" });
    }
}

export default UserShippings;