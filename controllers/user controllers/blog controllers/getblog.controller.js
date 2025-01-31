import Blog from "../../../models/blog.model.js";
import { AdminValidator, UserValidator } from "../../../validation/inputs.validation.js";

const GetBlog = async (req, res) => {
    try {
        console.log("Blog Request")
        const slug = req.params.slug;
        console.log("1", slug)
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator({ assignRole, Status });
        // const validName = new UserValidator({ slug, status });

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();

        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." });
        }
        if (Status !== 'Active') {
            return res.status(400).json({ message: "With this role, you cannot make this change." });
        }
        if (!slug) {
            return res.status(400).json({ message: "Argument is required." });
        }
        
        const BlogIs = await Blog.findOne({ slug });
        if (!BlogIs) {
            return res.status(400).json({ message: "Not found." });
        }

        res.status(201)
            .json({ message: "Successfull Get Blog!", data: BlogIs, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Get Blog!" });
    }
}

export default GetBlog;