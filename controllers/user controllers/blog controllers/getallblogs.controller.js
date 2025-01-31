import Blog from "../../../models/blog.model.js";

const GetAllBlogs = async (__, res) => {
    try {
        console.log("Blogs Request");
        // const bahadur = 5;
        // if (bahadur) {
        //     return res.status(400).json({ message: "All fields are required" })
        // }

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