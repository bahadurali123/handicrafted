import Blog from "../../../models/blog.model.js";

const GetAllBlogs = async (__, res) => {
    try {
        console.log("Blogs Request!");

        const Blogs = await Blog.find();
        if (!Blogs) {
            return res.status(404).json({ message: "Not Found." })
        }

        res.status(201)
            .json({ message: "Successfull Get Blogs!", data: Blogs, redirect: "redirectURL" });
    } catch (error) {
        res.status(500).json({ message: "fail to Get Blogs!" });
    }
}

export default GetAllBlogs;