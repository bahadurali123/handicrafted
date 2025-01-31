import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlogPost',
        required: true,
    },
    status: {
        type: Boolean,
        required: true
    },
},
    { timestamps: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;