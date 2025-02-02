import mongoose from "mongoose";
import { Configuration } from "./env.config.js";

const URI = Configuration.DBUri;
const connection = mongoose.connect(URI)
    .then(() => {
        console.log("DB connection of Handcrafted  is successful.");
    }).catch((error) => {
        console.log("Error in handcrafted DB connection.", error);
    })

export default connection;