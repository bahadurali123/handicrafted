import { deleteMultiFiles, findMultiFile } from "../../../middleware/cloudinary.middleware.js";
import Product from "../../../models/product.model.js";
import { AdminValidator } from "../../../validation/inputs.validation.js";

const DeleteProduct = async (req, res) => {
    try {
        console.log("Product Delete");
        const productId = req.params.id;
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator({ assignRole, Status });

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();

        if (!productId) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }
        if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
            return res.status(401).json({ message: "With this role, you cannot make this change." })
        }


        // Delete multiple files on cloudinary
        const DeletedProduct = await Product.findOneAndDelete({ _id: productId });
        const prevFileId = await findMultiFile(DeletedProduct.images);
        await deleteMultiFiles(prevFileId);

        res.status(201)
            .json({ message: "Successfull Delete Product!", data: DeletedProduct, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Delete Product!" });
    }
}

export default DeleteProduct;