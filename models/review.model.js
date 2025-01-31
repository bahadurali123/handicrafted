import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    review: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewDescription: {
        type: String,
        required: true
    }
},
    { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;