import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stockQuantity: {
    type: Number,
    required: true
  },
  featured: {
    type: Boolean,
    enum: [true, false],
    default: false
  },
  images: {
    type: [String],
    default: []
  },
  colors: {
    type: [String],
    // enum: ['red', 'blue', 'green', 'white', 'black', 'yellow'],
    default: []
  },
  weight: {
    type: Number,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }]
},
  { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;