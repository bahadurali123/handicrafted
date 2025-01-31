import { multiUploadOnCloudinary } from "../../../middleware/cloudinary.middleware.js";
import Category from "../../../models/category.model.js";
import Product from "../../../models/product.model.js";
import { AdminValidator } from "../../../validation/inputs.validation.js";

const AddProduct = async (req, res) => {
    try {
        console.log("Product");
        const { name, description, categoryId, price, stockQuantity, featured, colors, weight, length, width, height } = req.body;
        // console.log("1", req.body);
        // console.log("2", req.files);
        const images = req.files.map(file => file.buffer);
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator({
            assignRole, Status,
            name, description, categoryId, price, stockQuantity, featured, colors, weight, length, width, height
        });

        const dataIs = validName_A.validateProduct();
        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();

        // console.log("6", dataIs, userStatusIs, userRoleIs);
        if (!dataIs || !images[0]) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }
        if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
            return res.status(401).json({ message: "With this role, you cannot make this change." })
        }

        const categoryIs = await Category.findOne({ _id: categoryId });
        if (!categoryIs) {
            return res.status(404).json({ message: "Category not found." })
        }

        // Upload multiple files on cloudinary
        const cloudinaryResponse = await multiUploadOnCloudinary(images);
        const cloudinary_images = cloudinaryResponse.map(item => item.secure_url);


        const ProductIs = new Product({
            name,
            description,
            images: cloudinary_images,
            categoryId,
            price,
            stockQuantity,
            featured,
            colors,
            weight,
            length,
            width,
            height
        });

        const savedProduct = await ProductIs.save();

        res.status(201)
            .json({ message: "Successfull Add Product!", data: "savedProduct", redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Add Product!" });
    }
}

export default AddProduct;