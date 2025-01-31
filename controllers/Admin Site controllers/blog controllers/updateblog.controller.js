import { findFile, updateCloudinaryFile } from "../../../middleware/cloudinary.middleware.js";
import Blog from "../../../models/blog.model.js";
import { AdminValidator } from "../../../validation/inputs.validation.js";

const UpdateBlog = async (req, res) => {
    try {
        console.log("Update Blgo");
        const { title, slug, content, categoryId, metaDesc, publishedAt, status } = req.body;
        const file = req.file?.buffer;
        const blogId = req.params.id;
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

        if (!blogIs || !publishedAt) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }
        if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
            return res.status(401).json({ message: "With this role, you cannot make this change." })
        }

        const existingBlog = await Blog.findOne({ _id: blogId });
        let image;

        if (!file) {
            image = existingBlog.image;
        } else {
            const prevFileId = await findFile(existingBlog.image)
            image = await updateCloudinaryFile(prevFileId, file);
        }

        const updatedBlog = await Blog.findOneAndUpdate(
            { _id: blogId },
            {
                title,
                slug,
                metaDesc,
                content,
                image,
                status,
                categoryId,
                authorId: user._id,
                publishedAt
            }, { new: true });

        res.status(201)
            .json({ message: "Successfull Update Blog!", data: updatedBlog, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Update Blog!" });
    }
}

export default UpdateBlog;