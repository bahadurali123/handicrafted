import User from "../../../models/user.model.js";
// import { AdminValidator } from "../../../validation/inputs.validation.js";

const GetUsers = async (req, res) => {
    try {
        console.log("All Users");
        // const user = req.user;
        // const assignRole = user.role;
        // const Status = user.status;

        // const validName_A = new AdminValidator({ assignRole, Status });

        // const userStatusIs = validName_A.validateUserStatus();
        // const userRoleIs = validName_A.validateRoleAssignment();


        // if (!userStatusIs || !userRoleIs) {
        //     return res.status(400).json({ message: "Your account status and role is unacceptable." })
        // }
        // if (Status !== 'Active' && (assignRole !== 'Admin' || assignRole !== 'Moderator')) {
        //     return res.status(400).json({ message: "With this role, you cannot make this change." })
        // }

        const Users = await User.find().select("-password -verificationCode -token");
        // console.log("Users: ", Users);
        if (Users.length === 0) {
            return res.status(404).json({ message: "Not Found." })
        }

        res.status(201)
            .json({ message: "Successfull Get All Users!", data: Users, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Get All Users!" });
    }
}

export default GetUsers;