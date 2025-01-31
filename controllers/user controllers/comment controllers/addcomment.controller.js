import Blog from "../../../models/blog.model.js";
import Comment from "../../../models/comment.model.js";
import { AdminValidator, UserValidator } from "../../../validation/inputs.validation.js";

const AddComment = async (req, res) => {
    try {
        console.log("Add Comment");
        const { comment } = req.body;
        const blogId = req.params.id;
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator({ assignRole, Status });
        const validName = new UserValidator({ comment, blogId });

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();
        const commentIs = validName.validateComment();

        if (!commentIs) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }
        if (Status !== 'Active') {
            return res.status(400).json({ message: "With this role, you cannot make this change." })
        }

        const existingBlog = await Blog.findOne({ _id: blogId });
        if (!existingBlog) {
            return res.status(400).json({ message: "With this role, you cannot make this change." })
        }


        const newComment = new Comment({
            userId: user._id,
            blogId,
            commentText: comment,
        });

        const savedComment = await newComment.save();

        res.status(201)
            .json({ message: "Successfull Add Comment!", data: savedComment, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Add Comment!" });
    }
}

export default AddComment;