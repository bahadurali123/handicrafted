import { findFile, updateCloudinaryFile } from "../../../middleware/cloudinary.middleware.js";
import Category from "../../../models/category.model.js";
import { UserValidator, AdminValidator } from "../../../validation/inputs.validation.js";

const UpdateCategory = async (req, res) => {
    try {
        console.log("Update Category");
        const { name, parentId } = req.body;
        const _id = req.params.id;
        const file = req.file?.buffer;
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator({ assignRole, Status });
        const validName = new UserValidator({ name });

        const nameIs = validName.validateName();
        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();

        if (!nameIs, !_id) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." });
        }
        if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
            return res.status(401).json({ message: "With this role, you cannot make this change." });
        }

        let parentCategory;
        if (!parentId) {
            parentCategory = null;
        } else {
            parentCategory = await Category.findOne({ _id: parentId });
        }

        const existingCategory = await Category.findOne({ _id });

        let image;

        if (!file) {
            image = existingCategory?.image;
        } else {
            const prevFileId = await findFile(existingCategory?.image)
            image = await updateCloudinaryFile(prevFileId, file);
        }

        const UpdatedCategory = await Category.findOneAndUpdate(
            { _id },
            {
                name,
                parentId: parentCategory || null, // Set the parent to null if parentCategory is not provided
                image
            },
            { new: true });

        res.status(201)
            .json({ message: "Successfull Update Category!", data: UpdatedCategory, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Update Category!" });
    }
}

export default UpdateCategory;