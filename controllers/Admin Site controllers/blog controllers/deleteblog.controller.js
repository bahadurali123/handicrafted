import { deletefile, findFile } from "../../../middleware/cloudinary.middleware.js";
import Blog from "../../../models/blog.model.js";
import { AdminValidator } from "../../../validation/inputs.validation.js";

const DeleteBlog = async (req, res) => {
    try {
        console.log("Delete Blog");
        const blogId = req.params.id;
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator(
            {
                assignRole,
                Status,
                blogId,
            });

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();
        const IdIs = validName_A.validateId();

        if (!IdIs) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }
        if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
            return res.status(401).json({ message: "With this role, you cannot make this change." })
        }

        const existingBlog = await Blog.findOne({ _id: blogId });
        const prevFileId = await findFile(existingBlog.image)
        await deletefile(prevFileId);

        const deletedBlog = await Blog.findOneAndDelete(
            { _id: blogId }, { new: true });

        res.status(201)
            .json({ message: "Successfull Delete Blog!", data: deletedBlog, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Delete Blog!" });
    }
}

export default DeleteBlog;