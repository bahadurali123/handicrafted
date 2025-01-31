import Like from "../../../models/like.model.js";

const AllLikes = async (req, res) => {
    try {
        console.log("All Likes");
        const user = req.user;


        const alllikes = await Like.find({ userId: user?._id });

        res.status(201)
            .json({ message: "Successfull Get All Likes!", data: alllikes, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Get All Likes!" });
    }
}

export default AllLikes;