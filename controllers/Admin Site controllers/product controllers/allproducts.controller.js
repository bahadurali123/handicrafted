import Product from "../../../models/product.model.js";

const GetProducts = async (__, res) => {
    try {
        console.log("All Products");

        const Products = await Product.find();

        if (!Products) {
            return res.status(404).json({ message: "Not Found." })
        }

        res.status(201)
            .json({ message: "Successfull Get All Products!", data: Products, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Get All Products!" });
    }
}

export default GetProducts;