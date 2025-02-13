import { findMultiFile, multiUploadOnCloudinary, updateMultiCloudinaryFiles } from "../../../middleware/cloudinary.middleware.js";
import Category from "../../../models/category.model.js";
import Product from "../../../models/product.model.js";
import { AdminValidator } from "../../../validation/inputs.validation.js";

const UpdateProduct = async (req, res) => {
    try {
        console.log("Product Update");
        const { name, description, categoryId, price, stockQuantity, featured, colors, weight, length, width, height } = req.body;
        const productId = req.params.id;
        const files = req.files.map(file => file.buffer);
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

        if (!dataIs || !productId) {
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

        // // Update multiple files on cloudinary
        const existingProduct = await Product.findOne({ _id: productId });

        // Upload multiple files on cloudinary
        const cloudinaryResponse = await multiUploadOnCloudinary(files);
        const cloudinaryimages = cloudinaryResponse.map(item => item.secure_url);
        const images = [...existingProduct.images, ...cloudinaryimages];

        const UpdatedProduct = await Product.findOneAndUpdate(
            {
                _id: productId
            },
            {
                name,
                description,
                categoryId,
                price,
                stockQuantity,
                featured: featured === "" || featured === null ? false : featured,
                colors,
                weight,
                length,
                width,
                height,
                images
            },
            { new: true }
        )

        res.status(201)
            .json({ message: "Successfull Update Product!", data: UpdatedProduct, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Update Product!" });
    }
}

export default UpdateProduct;