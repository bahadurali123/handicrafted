import express from "express";
import uploadOnMulter from "../middleware/multer.middleware.js";
import { UserAuth, UserFlexibleAuth } from "../middleware/auth.middleware.js";
import { AddBlog, AddCategory, AddProduct, allOrders, AllShippings, DeleteBlog, DeleteCategory, DeleteComment, DeleteProduct, EditUserStatus, GetCategories, GetProducts, GetUsers, UpdateBlog, UpdateCategory, UpdateComment, UpdateProduct } from "../controllers/index.controller.js";

const AdminRouter = express.Router();

// AdminRouter.get('/admin/users', UserAuth, GetUsers);
AdminRouter.get('/admin/users', UserFlexibleAuth, GetUsers);
AdminRouter.patch('/admin/user/update/:id', UserAuth, EditUserStatus);

// AdminRouter.get('/getcategories', UserAuth, GetCategories);
AdminRouter.post('/addcategory', UserAuth, uploadOnMulter.single('image'), AddCategory);
AdminRouter.put('/updatecategory/:id', UserAuth, uploadOnMulter.single('image'), UpdateCategory);
AdminRouter.delete('/deletecategory/:id', UserAuth, DeleteCategory);

AdminRouter.post('/admin/addblog', UserAuth, uploadOnMulter.single('image'), AddBlog);
AdminRouter.patch('/admin/updateblog/:id', UserAuth, uploadOnMulter.single('image'), UpdateBlog);
AdminRouter.delete('/admin/deleteblog/:id', UserAuth, DeleteBlog);

// AdminRouter.get('/admin/products', UserAuth, GetProducts);
AdminRouter.post('/admin/addproduct', UserAuth, uploadOnMulter.array('images'), AddProduct);
AdminRouter.patch('/admin/updateproduct/:id', UserAuth, uploadOnMulter.array('images'), UpdateProduct);
AdminRouter.delete('/admin/deleteproduct/:id', UserAuth, DeleteProduct);

AdminRouter.patch('/admin/comment/update/:id', UserAuth, UpdateComment);
AdminRouter.delete('/admin/comment/delete/:id', UserAuth, DeleteComment);

AdminRouter.get('/shippings/all', UserAuth, AllShippings);
AdminRouter.get('/orders/all', UserAuth, allOrders);

// Route for Main pages.
AdminRouter.get('/admin/products', GetProducts);
AdminRouter.get('/getcategories', GetCategories);

export default AdminRouter;