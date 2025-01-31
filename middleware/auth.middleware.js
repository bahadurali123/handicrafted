import jwt from 'jsonwebtoken';
import { Configuration } from '../config/env.config.js';
import User from '../models/user.model.js';

const UserAuth = async (req, res, next) => {
    try {
        let user;
        console.log("User Auth 4:", req.cookies);
        const token = req.cookies.handcrafted;

        if (!token) {
            return res.status(401).json({ message: 'You must be Login' });
        }
        const payload = await jwt.verify(token, Configuration.accessTokenSecret);
        // console.log("User Payload is:", payload);
        if (!payload) {
            return res.status(400).json({ message: "something wrong with the payload." })
        }
        const { _id, name, email } = payload;
        if (_id, name, email) {
            user = await User.findOne({ _id, name, email })
                .select("-password -token");
        }

        if (!user) {
            return res.status(400).json({ message: "something went wrong" })
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: "First login Now" })
    }
};

const UserFlexibleAuth = async (req, res, next) => {
    try {
        let user;
        let payload;
        const token = req.cookies.handcrafted;
        console.log("Token flex", token);
        if (!token) return next();
        const decoded = jwt.decode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp > currentTime) {
            payload = jwt.verify(token, Configuration.accessTokenSecret);
        } else {
            return next();
        }

        // console.log("payload 3", payload);
        if (!payload) {
            return res.status(400).json({ message: "something wrong with the payload." })
        }
        const { _id, name, email } = payload;
        if (_id, name, email) {
            user = await User.findOne({ _id, name, email })
                .select("-password -token");
        }
        if (!user) {
            return res.status(400).json({ message: "something went wrong" })
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json('Some one error!');
    }
}

export {
    UserAuth,
    UserFlexibleAuth
};