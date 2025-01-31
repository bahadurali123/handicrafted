import Product from "../../../models/product.model.js";
import User from "../../../models/user.model.js";
import { AdminValidator, UserValidator } from "../../../validation/inputs.validation.js";

const AddWishlist = async (req, res) => {
    try {
        console.log("Wishlist");
        const productId = req.params.id;
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const { _id, wishlist } = user;
        let updatedUser;
        let wisIs;

        const validName_A = new AdminValidator({ assignRole, Status });
        const validName = new UserValidator({ Id: productId });

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();
        const validProductIs = validName.validateId();

        if (!validProductIs) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }
        if (Status !== 'Active') {
            return res.status(401).json({ message: "With this role, you cannot make this change." })
        }

        const productIs = await Product.findOne({ _id: productId });
        const proId = productIs._id;
        if (!productIs) {
            return res.status(404).json({ message: "Product not found." })
        }

        if (!wishlist[0]) {
            const wis = [proId];
            updatedUser = await User.findByIdAndUpdate(
                { _id },
                { wishlist: wis },
                { new: true }
            );
        } else {
            const updateWishlist = (wishlist, proId) => {
                return wishlist.includes(proId)
                    ? wishlist.filter(item => item.toString() !== proId.toString()) // Remove if it exists
                    : [...wishlist, proId];
            };
            wisIs = updateWishlist(wishlist, proId);

            updatedUser = await User.findByIdAndUpdate(
                { _id },
                { wishlist: wisIs },
                { new: true }
            ).select("-password");
        }
        console.log("Updated User: ", updatedUser);

        res.status(201)
            .json({ message: "Successfull Update Wishlist!", data: updatedUser, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Update Wishlist!" });
    }
}

export default AddWishlist;