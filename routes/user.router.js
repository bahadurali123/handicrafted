import express from "express";
import uploadOnMulter from "../middleware/multer.middleware.js";
import { SignIn, SignUp, googleRedirect, googleCalback, veirfyOTP, regenreteOTP, resetPassword, UpdateProfile, AddShipping, AddComment, AddLike, AddWishlist, GetBlog, GetAllBlogs, CheckOauth, UserShippings, AllLikes, AllReviews, AllComments, findFedexRate, createPaypalOrder, capturePaypalOrder, stripeCheckout, stripeWebhook, AddMessage, userOrders, orderShippingTracking, AddReview, DeleteShipping, EditShippingAddressStatus, UpdateShipping, facebookRedirect, facebookCalback, SignOut } from "../controllers/index.controller.js"
import { UserAuth, UserFlexibleAuth } from "../middleware/auth.middleware.js";

const UserRouter = express.Router();

// Real routes
UserRouter.get('/fedex/rates/:productId', UserFlexibleAuth, findFedexRate);
// UserRouter.get('/fedex/track/:id', UserAuth, orderShippingTracking);
UserRouter.get('/fedex/track/:id', UserFlexibleAuth, orderShippingTracking);
// UserRouter.post('/fedex/createshipment', UserFlexibleAuth, createFedexShipment);

UserRouter.post('/paypal/order/create', UserAuth, createPaypalOrder);
UserRouter.post('/paypal/order/capture', UserAuth, capturePaypalOrder);
UserRouter.post('/create-checkout-session', UserAuth, stripeCheckout);
UserRouter.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
UserRouter.get('/orders/user/:id', UserFlexibleAuth, userOrders);

UserRouter.post('/signup', SignUp);
UserRouter.post('/signin', SignIn);
UserRouter.get('/checkauth', UserFlexibleAuth, CheckOauth);
UserRouter.get('/googleredirect', googleRedirect);
UserRouter.get('/handcrafted/auth/google/calback', googleCalback);
UserRouter.get('/facebook/redirect', facebookRedirect);
UserRouter.get('/handcrafted/auth/facebook/calback', facebookCalback);
UserRouter.post('/verifyotp', UserFlexibleAuth, veirfyOTP);
// UserRouter.post('/verifyotp', UserAuth, veirfyOTP);
UserRouter.post('/regenerateotp', UserFlexibleAuth, regenreteOTP);
UserRouter.post('/resetpassword', UserFlexibleAuth, resetPassword);
UserRouter.patch('/user/update', UserAuth, uploadOnMulter.single('image'), UpdateProfile);
UserRouter.get('/signout', UserAuth, SignOut);

UserRouter.get('/shippings', UserFlexibleAuth, UserShippings);
UserRouter.post('/shipping/add', UserAuth, AddShipping);
UserRouter.delete('/shipping/delete/:id', UserAuth, DeleteShipping);
UserRouter.get('/shipping/edit/status/:id', UserAuth, EditShippingAddressStatus);
UserRouter.put('/shipping/edit/:id', UserAuth, UpdateShipping);

UserRouter.post('/:id/addcomment', UserAuth, AddComment);
UserRouter.get('/comments', UserFlexibleAuth, AllComments);
UserRouter.post('/:slug/addlike', UserAuth, AddLike);
UserRouter.get('/likes', UserFlexibleAuth, AllLikes);
UserRouter.post('/wishlist/:id/add', UserAuth, AddWishlist);
UserRouter.post('/contact', UserAuth, AddMessage);

UserRouter.post('/review/add/:orderId', UserAuth, uploadOnMulter.single('image'), AddReview);

// Get requests
UserRouter.get('/blog/:slug', UserFlexibleAuth, GetBlog);

// Route for Main pages.
UserRouter.get('/blogs', UserFlexibleAuth, GetAllBlogs);
UserRouter.get('/reviews', UserFlexibleAuth, AllReviews);

export default UserRouter;