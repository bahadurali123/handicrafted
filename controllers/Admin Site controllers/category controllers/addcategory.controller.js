import { uploadOnCloudinary } from "../../../middleware/cloudinary.middleware.js";
import Category from "../../../models/category.model.js";
import { UserValidator, AdminValidator } from "../../../validation/inputs.validation.js";

const AddCategory = async (req, res) => {
    try {
        console.log("Add Category");
        const { name, parentId } = req.body;
        const file = req.file?.buffer;
        console.log("category body: ", req.body, file);
        const user = req.user;
        console.log("1");
        const assignRole = user.role;
        console.log("2");
        const Status = user.status;
        console.log("3");

        const validName_A = new AdminValidator({ assignRole, Status });
        const validName = new UserValidator({ name });
        console.log("4");

        const nameIs = validName.validateName();
        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();
        console.log("5");

        if (!nameIs || !file) {
            return res.status(400).json({ message: "All fields are required" })
        }
        console.log("6");
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }
        console.log("7");
        if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
            return res.status(401).json({ message: "With this role, you cannot make this change." })
        }
        console.log("8");

        let parentCategory;
        console.log("Length", parentId.length);
        if (!parentId) {
            parentCategory = null;
        } else {
            if (parentId.length === 24) {
                parentCategory = await Category.findOne({ _id: parentId });
                parentCategory = parentCategory._id;
                // console.log("Parent: ", parentCategory._id);
            } else {
                return res.status(400).json({ message: "Some problem in the parent category." })
            }
        }
        console.log("9", parentCategory);

        const cloudinaryResponse = await uploadOnCloudinary(file);
        const image = cloudinaryResponse.secure_url;
        console.log("10", image);

        const CategoryIs = new Category({
            name,
            parentId: parentCategory || null, // Set the parent to null if parentCategory is not provided
            image
        });
        console.log("11", CategoryIs);

        const savedCategory = await CategoryIs.save();
        console.log("12", savedCategory);

        res.status(201)
            .json({ message: "Successfull Add Category!", data: savedCategory, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Add Category!" });
    }
}

export default AddCategory;