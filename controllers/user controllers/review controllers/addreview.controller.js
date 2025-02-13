import { uploadOnCloudinary } from "../../../middleware/cloudinary.middleware.js";
import Order from "../../../models/order.model.js";
import Review from "../../../models/review.model.js";
import { AdminValidator, UserValidator } from "../../../validation/inputs.validation.js";

const AddReview = async (req, res) => {
    try {
        console.log("Add Review");
        const { name, email, review, reviewDescription } = req.body;
        const orderId = req.params.orderId;
        const file = req.file.buffer;
        const user = req.user;
        const assignRole = user.role;
        const Status = user.status;

        const validName_A = new AdminValidator({ assignRole, Status });
        const validName = new UserValidator({ Id: orderId, name, email, review, reviewDescription });

        const userStatusIs = validName_A.validateUserStatus();
        const userRoleIs = validName_A.validateRoleAssignment();
        const validOrderIs = validName.validateId();
        const nameIs = validName.validateName();
        const emailIs = validName.validateEmail();
        const reviewIs = validName.validateReview();
        const descriptionIs = validName.validateReviewDescription();

        if (!nameIs || !emailIs || !reviewIs || !descriptionIs || !validOrderIs || !(file !== '')) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!userStatusIs || !userRoleIs) {
            return res.status(400).json({ message: "Your account status and role is unacceptable." })
        }
        if (Status !== 'Active') {
            return res.status(400).json({ message: "With this role, you cannot make this change." })
        }

        const reviewOrder = await Order.findOne({ _id: orderId });

        if (!reviewOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        const cloudinaryResponse = await uploadOnCloudinary(file);
        const image = cloudinaryResponse.secure_url;

        // Heandel upload image on cloudinary
        const ReviewIs = new Review({
            userId: user._id,
            orderId: reviewOrder._id,
            name,
            email,
            review,
            reviewDescription,
            image
        });

        const newReview = await ReviewIs.save();


        res.status(201)
            .json({ message: "Successfull Add Review!", data: newReview, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to add Review!" });
    }
}

export default AddReview;