import mongoose from 'mongoose';

const shippingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isPrimary: {
        type: Boolean,
        default: false
    },
    street: {
        type: String,
        required: true
    },
    building: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    }
},
    { timestamps: true });

const ShippingAddress = mongoose.model('Shipping', shippingSchema);

export default ShippingAddress;