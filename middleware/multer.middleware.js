import multer from "multer";

const storage = multer.memoryStorage();

const uploadOnMulter = multer({storage})

export default uploadOnMulter;