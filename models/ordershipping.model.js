import mongoose from 'mongoose';

const orderShippingSchema = new mongoose.Schema({
    customerName: {
        type: String,
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    street: {
        type: String,
    },
    building: {
        type: String,
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
    },
    shippingType: {
        type: String
    },
    trackingNumber: {
        type: String,
        require: true
    },
    currencyType: {
        type: String,
        require: true
    },
    shippingCost: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Canceled'],
        default: 'Pending'
    },
    document: {
        type: String,
        require: true
    },
    deliveryDate: {
        type: Date,
    }
},
    { timestamps: true });

const OrderShipping = mongoose.model('OrderShipping', orderShippingSchema);

export default OrderShipping;