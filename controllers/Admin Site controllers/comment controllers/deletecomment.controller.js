import Comment from "../../../models/comment.model.js";
import { AdminValidator } from "../../../validation/inputs.validation.js";

const DeleteComment = async (req, res) => {
    try {
        console.log("Delete Comment");
        const commentId = req.params.id;
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator(
            {
                assignRole,
                Status,
                blogId: commentId,
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

        const deletedComment = await Comment.findOneAndDelete(
            { _id: commentId }, { new: true });

        res.status(201)
            .json({ message: "Successfull Delete Comment!", data: deletedComment, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Delete Comment!" });
    }
}

export default DeleteComment;