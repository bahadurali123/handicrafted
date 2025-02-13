import Message from "../../../models/message.model.js";
import { UserValidator } from "../../../validation/inputs.validation.js";

const AddMessage = async (req, res) => {
    try {
        console.log("Add Message!");
        const user = req.user
        const { name, phone, email, message } = req.body;

        if (!(user.status === 'Active')) {
            return res.status(401).json({ message: "You are blocked, you cannot make this change." });
        }

        const validMessage = new UserValidator({ name, phone, email, message });

        const messageNameIs = validMessage.validateName();
        const messageEmailIs = validMessage.validateEmail();
        const messagePhoneNUmberIs = validMessage.validatePhoneNumber();
        const messageIs = validMessage.validateMessage();

        if (!messageIs || !messageNameIs || !messageEmailIs || !messagePhoneNUmberIs) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // add Message
        const MessageObg = new Message({
            userId: user._id,
            name,
            phone,
            email,
            message,
        });

        const newMessage = await MessageObg.save();


        res.status(201)
            .json({ message: "Successfull Add Message!", data: newMessage, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to add Message!" });
    }
}

export default AddMessage;