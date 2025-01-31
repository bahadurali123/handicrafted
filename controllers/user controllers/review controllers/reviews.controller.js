import Review from "../../../models/review.model.js";

const AllReviews = async (__, res) => {
    try {
        console.log("All Review");
        const reviews = await Review.find();
        if (!reviews) {
            return res.status(404).json({ message: "Not Found." })
        }

        res.status(201)
            .json({ message: "Successfull Get All Reviews!", data: reviews, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Get All Reviews!" });
    }
}

export default AllReviews;