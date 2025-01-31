import ShippingAddress from "../../../models/shippingaddress.model.js";

const AllShippings = async (req, res) => {
    try {
        console.log("All Shippings")
        const user = req.user
        const assignRole = user.role;
        const Status = user.status;

        if (!(Status === 'Active')) {
            return res.status(401).json({ message: "You are blocked, ........" });
        }
        if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
            return res.status(401).json({ message: "With this role, you cannot accees this rout." })
        }

        const allshippings = await ShippingAddress.find();

        res.status(201)
            .json({ message: "Successfull Get All Shipping!", data: allshippings, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Get All Shipping!" });
    }
}

export default AllShippings;