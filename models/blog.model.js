import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: {
        type: String
    },
    metaDesc: {
        type: String
    },
    publishedAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'unpublish'],
        default: 'draft'
    }
},
    { timestamps: true });

const Blog = mongoose.model('BlogPost', blogPostSchema);

export default Blog;