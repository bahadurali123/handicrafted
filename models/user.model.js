import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Configuration } from '../config/env.config.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        // required: true,
    },
    phone: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    shippingAddresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipping',
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }],
    role: {
        type: String,
        enum: ['Admin', 'User', 'Moderator'],
        default: 'User',
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: Number,
    },
    verificationCodeExpiration: {
        type: Date,
    },
    socialLogin: {
        type: String,
        enum: [false, 'Google', 'Facebook'],
        default: false
    },
    googleId: {
        type: String,
    },
    token: {
        type: String
    }
},
    { timestamps: true }
)


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword
    next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();  // Get the update object from the query
    if (update.password) {  // Check if the password is being updated
        const hashPassword = await bcrypt.hash(update.password, 10);
        update.password = hashPassword;  // Hash the new password and update the query
    }
    next();
});


userSchema.methods.accessToken = async function () {
    const payload = {
        _id: this._id,
        name: this.name,
        email: this.email
    };
    const secret = Configuration.accessTokenSecret;
    const expiry = {
        expiresIn: Configuration.accessTokenExpiry
    };
    const userToken = jwt.sign(payload, secret, expiry);

    return userToken;
};

userSchema.methods.refreshToken = async function () {
    const payload = {
        _id: this._id,
        name: this.name,
        email: this.email
    };
    const secret = Configuration.refreshTokenSecret;
    const expiry = {
        expiresIn: Configuration.refreshTokenExpiry
    };
    const userToken = jwt.sign(payload, secret, expiry);

    return userToken;
};


const User = mongoose.model('User', userSchema);

export default User