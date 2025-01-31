import Blog from "../../../models/blog.model.js";
import Like from "../../../models/like.model.js";
import { AdminValidator, UserValidator } from "../../../validation/inputs.validation.js";

const AddLike = async (req, res) => {
    try {
        console.log("Like");
        const { status } = req.body;
        const slug = req.params.slug;
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        let newLike;

        const validName_A = new AdminValidator({ assignRole, Status });
        const validName = new UserValidator({ slug, status });

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();
        const likeIs = validName.validateLike();

        if (!likeIs) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }
        if (Status !== 'Active') {
            return res.status(400).json({ message: "With this role, you cannot make this change." })
        }

        const blogIs = await Blog.findOne({ slug });
        if (!blogIs) {
            return res.status(400).json({ message: "Blog not found." })
        }
        const existinglike = await Like.findOne({
            $or: [
                {
                    userId: user._id,
                    blogId: blogIs._id
                }
            ]
        });

        if (!existinglike) {
            const likeObj = new Like({
                userId: user._id,
                blogId: blogIs._id,
                status
            });
            newLike = await likeObj.save();
        } else {
            const newStatus = !existinglike.status ? true : false;
            newLike = await Like.findOneAndUpdate(
                {
                    userId: user._id,
                    blogId: blogIs._id
                },
                {
                    status: newStatus
                },
                { new: true }
            )
        }

        res.status(201)
            .json({ message: "Successfull Update Like!", data: newLike, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Update Like!" });
    }
}

export default AddLike;