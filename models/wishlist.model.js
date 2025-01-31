import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema(
    {
        UserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Foreign key linking to User collection
            required: true,
        },
        ProductId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Foreign key linking to Product collection
            required: true,
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

export default Wishlist;