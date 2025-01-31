import User from "../../../models/user.model.js";
import { AdminValidator, UserValidator } from "../../../validation/inputs.validation.js";

const EditUserStatus = async (req, res) => {
    try {
        console.log("Edit User Status");
        const { email, status } = req.body;
        console.log("Edit User Status 1", email, status);
        const userId = req.params.id;
        console.log("Edit User Status 2", userId);
        const user = req.user;
        console.log("Edit User Status 3", user);
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator({ assignRole, Status: status, blogId: userId });
        const validName = new UserValidator({ email });

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();
        const userIdIs = validName_A.validateId();
        const emailIs = validName.validateEmail();
        console.log("Edit User Status 4", userStatusIs, userRoleIs, userIdIs, emailIs);

        if (!userIdIs || !emailIs || !userStatusIs) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!Status || !userRoleIs) {
            return res.status(401).json({ message: "Your account status and role is unacceptable." })
        }
        if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
            return res.status(401).json({ message: "With this role, you cannot make this change." })
        }

        const UpdatedUser = await User.findOneAndUpdate(
            {
                $and: [
                    { _id: userId }, { email }
                ]
            },
            {
                status
            },
            { new: true }
        ).select("-password -token");

        if (!UpdatedUser) {
            return res.status(404).json({ message: "Not Found." })
        }
        console.log("Edit User Status 5", UpdatedUser);


        res.status(201)
            .json({ message: "Successfull Get All Users!", data: UpdatedUser, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Get All Users!" });
    }
}

export default EditUserStatus;