import Comment from "../../../models/comment.model.js";

const AllComments = async (req, res) => {
    try {
        console.log("All Comments")
        const user = req.user;

        // const allcomments = await Comment.find({ userId: user?._id });
        const allcomments = await Comment.find();

        res.status(201)
            .json({ message: "Successfull Get All Comments!", data: allcomments, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Get All Comments!" });
    }
}

export default AllComments;