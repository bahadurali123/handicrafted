import { findFile, updateCloudinaryFile } from "../../../middleware/cloudinary.middleware.js";
import Category from "../../../models/category.model.js";
import { UserValidator, AdminValidator } from "../../../validation/inputs.validation.js";

const UpdateCategory = async (req, res) => {
    try {
        console.log("Update Category");
        const { name, parentId } = req.body;
        const _id = req.params.id;
        const file = req.file?.buffer;
        console.log("Update Category 1", name, parentId, _id, file);
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator({ assignRole, Status });
        const validName = new UserValidator({ name });

        const nameIs = validName.validateName();
        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();
        console.log("Update Category 2", nameIs, userStatusIs, userRoleIs);

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
        console.log("Update Category 3", parentCategory);

        const existingCategory = await Category.findOne({ _id });
        console.log("Update Category 4", existingCategory);
        let image;
        console.log("Update Category 4.1");
        if (!file) {
            console.log("Update Category 4.2");
            image = existingCategory?.image;
        } else {
            console.log("Update Category 4.3");
            const prevFileId = await findFile(existingCategory?.image)
            console.log("Update Category 4.4");
            image = await updateCloudinaryFile(prevFileId, file);
        }
        console.log("Update Category 5", image);

        const UpdatedCategory = await Category.findOneAndUpdate(
            { _id },
            {
                name,
                parentId: parentCategory || null, // Set the parent to null if parentCategory is not provided
                image
            },
            { new: true });
        console.log("Update Category 6", UpdatedCategory);

        res.status(201)
            .json({ message: "Successfull Update Category!", data: UpdatedCategory, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Update Category!" });
    }
}

export default UpdateCategory;