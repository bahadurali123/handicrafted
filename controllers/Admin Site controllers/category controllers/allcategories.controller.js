import Category from "../../../models/category.model.js";

const GetCategories = async (__, res) => {
    try {
        console.log("All Category");

        const Categories = await Category.find();

        if (!Categories) {
            return res.status(404).json({ message: "Not Found." })
        }

        res.status(201)
            .json({ message: "Successfull Get All Categories!", data: Categories, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Get All Categories!" });
    }
}

export default GetCategories;