const Homeroute = async (__, res) => {
    try {
        res.status(201)
            .json({ message: "Welcome to Handcrafted. The frontend can be viewed at: https://hand-crafted.vercel.app" });
    } catch (error) {
        res.status(500).json({ message: "fail to get Response!" });
    }
}

export default Homeroute;
