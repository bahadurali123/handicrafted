import { uploadOnCloudinary } from "../../../middleware/cloudinary.middleware.js";
import Blog from "../../../models/blog.model.js";
import { AdminValidator } from "../../../validation/inputs.validation.js";

const AddBlog = async (req, res) => {
    try {
        console.log("Add Blgo", req.body);

        const { title, slug, content, categoryId, metaDesc, publishedAt, status } = req.body;
        const file = req.file.buffer;
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator(
            {
                assignRole,
                Status,
                blogTitle: title,
                blogSlug: slug,
                blogMetaDescription: metaDesc,
                blogContent: content,
                blogCategory: categoryId,
                blogStatus: status
            });

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();
        const blogIs = validName_A.validateBlogPost();

        if (!blogIs || !publishedAt || !file) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }
        if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
            return res.status(401).json({ message: "With this role, you cannot make this change." })
        }

        const cloudinaryResponse = await uploadOnCloudinary(file);
        const image = cloudinaryResponse.secure_url;

        const newBlog = new Blog({
            title,
            slug,
            metaDesc,
            content,
            image,
            status,
            categoryId,
            authorId: user._id,
            publishedAt
        });

        const savedBlog = await newBlog.save();

        res.status(201)
            .json({ message: "Successfull Add Blog!", data: savedBlog, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Add Blog!" });
    }
}

export default AddBlog;