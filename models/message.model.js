import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Foreign key linking to User collection
            required: false, // Optional if the user is not logged in
        },
        name: {
            type: String,
            required: true,
            trim: true, // Removes extra spaces
        },
        phone: {
            type: String,
            required: false, // Optional field
            match: /^\+?[1-9]\d{1,14}$/, // Regex for validating international phone numbers
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        // CreatedAt: {
        //   type: Date,
        //   default: Date.now,
        // },
        // UpdatedAt: {
        //   type: Date,
        //   default: Date.now,
        // },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Message = mongoose.model('Message', ContactMessageSchema);

export default Message;