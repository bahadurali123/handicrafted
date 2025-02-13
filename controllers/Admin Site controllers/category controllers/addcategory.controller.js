import { uploadOnCloudinary } from "../../../middleware/cloudinary.middleware.js";
import Category from "../../../models/category.model.js";
import { UserValidator, AdminValidator } from "../../../validation/inputs.validation.js";

const AddCategory = async (req, res) => {
    try {
        console.log("Add Category");

        const { name, parentId } = req.body;
        const file = req.file?.buffer;
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator({ assignRole, Status });
        const validName = new UserValidator({ name });

        const nameIs = validName.validateName();
        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();

        if (!nameIs || !file) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }
        if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
            return res.status(401).json({ message: "With this role, you cannot make this change." })
        }

        let parentCategory;

        if (!parentId) {
            parentCategory = null;
        } else {
            if (parentId.length === 24) {
                parentCategory = await Category.findOne({ _id: parentId });
                parentCategory = parentCategory._id;
            } else {
                return res.status(400).json({ message: "Some problem in the parent category." })
            }
        }

        const cloudinaryResponse = await uploadOnCloudinary(file);
        const image = cloudinaryResponse.secure_url;

        const CategoryIs = new Category({
            name,
            parentId: parentCategory || null, // Set the parent to null if parentCategory is not provided
            image
        });

        const savedCategory = await CategoryIs.save();

        res.status(201)
            .json({ message: "Successfull Add Category!", data: savedCategory, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Add Category!" });
    }
}

export default AddCategory;