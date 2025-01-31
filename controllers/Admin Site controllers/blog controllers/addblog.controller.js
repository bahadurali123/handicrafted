import { uploadOnCloudinary } from "../../../middleware/cloudinary.middleware.js";
import Blog from "../../../models/blog.model.js";
import { AdminValidator } from "../../../validation/inputs.validation.js";

const AddBlog = async (req, res) => {
    try {
        console.log("Add Blgo", req.body);
        const { title, slug, content, categoryId, metaDesc, publishedAt, status } = req.body;
        // console.log("0", req.file);
        const file = req.file.buffer;
        // console.log("0.1", file);
        const user = req.user;
        // console.log("0.2");
        const assignRole = user.role;
        // console.log("0.3");
        const Status = user.status;
        // console.log("1", req.body, user);

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
        // console.log("2");

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();
        const blogIs = validName_A.validateBlogPost();
        // console.log("3", userStatusIs, userRoleIs, blogIs);

        if (!blogIs || !publishedAt || !file) {
            return res.status(400).json({ message: "All fields are required" })
        }
        // console.log("4");
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }
        // console.log("5");
        if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
            return res.status(401).json({ message: "With this role, you cannot make this change." })
        }
        // console.log("6");

        const cloudinaryResponse = await uploadOnCloudinary(file);
        const image = cloudinaryResponse.secure_url;
        // console.log("7");

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
        // console.log("8", newBlog);

        const savedBlog = await newBlog.save();
        // console.log("9", savedBlog);

        res.status(201)
            .json({ message: "Successfull Add Blog!", data: savedBlog, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Add Blog!" });
    }
}

export default AddBlog;