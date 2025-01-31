import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gatewayOrderId: {
        type: String, // UUID
        required: true,
        unique: true,
    },
    orderShippingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderShipping',
        required: true,
    },
    paymentGateway: {
        type: String,
        enum: ['stripe', 'paypal'],
        // required: true,
    },
    totalAmount: {
        type: mongoose.Schema.Types.Decimal128,
        // required: true,
    },
    // products: {
    //     type: [ProductSchema],
    //     required: true,
    // },
    products: [],
    paymentStatus: {
        type: String,
        // enum: ['Paid', 'Pending', 'Failed'],
        required: true,
    },
    currencyCode: {
        type: String,
        // required: true,
    }
},
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    });

const Order = mongoose.model('Order', OrderSchema);

export default Order;