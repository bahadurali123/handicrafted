import Category from "../../../models/category.model.js";
import { AdminValidator } from "../../../validation/inputs.validation.js";

const DeleteCategory = async (req, res) => {
    try {
        console.log("Delete Category!");
        const _id = req.params.id;
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator({ assignRole, Status });

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();

        if (!_id) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." });
        }
        if (Status !== 'Active' && assignRole !== 'Admin') {
            return res.status(401).json({ message: "With this role, you cannot make this change." });
        }
        await Category.deleteMany({ $or: [{ _id }, { parentId: _id }] }, { new: true });

        res.status(201)
            .json({ message: "Successfull Delete Category!", data: { status: true }, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Delete Category!" });
    }
}

export default DeleteCategory;