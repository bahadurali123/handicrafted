import Comment from "../../../models/comment.model.js";
import { AdminValidator, UserValidator } from "../../../validation/inputs.validation.js";

const UpdateComment = async (req, res) => {
    try {
        console.log("Update Comment");
        const { status } = req.body;
        const commentId = req.params.id;
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator({ assignRole, Status });
        const validName = new UserValidator({ Item: status, Id: commentId });

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();
        const statusIs = validName.validateId();
        const commentIs = validName.validateArray();

        if (!commentIs || !statusIs) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }
        if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
            return res.status(401).json({ message: "With this role, you cannot make this change." })
        }

        const updatedComment = await Comment.findOneAndUpdate(
            {
                _id: commentId
            },
            {
                status
            },
            { new: true }
        );

        res.status(201)
            .json({ message: "Successfull Update Comment!", data: updatedComment, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Update Comment!" });
    }
}

export default UpdateComment;