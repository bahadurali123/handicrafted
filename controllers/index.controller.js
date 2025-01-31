import SignUp from "./user controllers/signup.controller.js"
import SignIn from "./user controllers/signin.controller.js"
import CheckOauth from "./user controllers/checkoauth.controller.js"
import googleRedirect from "./user controllers/googleredirect.controller.js"
import googleCalback from "./user controllers/googlecalback.controller.js"
import facebookRedirect from "./user controllers/facebookredirect.controller.js"
import facebookCalback from "./user controllers/facebookcalback.controller.js"
import veirfyOTP from "./user controllers/otpverify.controller.js"
import regenreteOTP from "./user controllers/otpregenrete.controller.js"
import resetPassword from "./user controllers/resetpassword.controller.js"
import UpdateProfile from "./user controllers/updateprofile.controller.js"
import SignOut from "./user controllers/signout.controller.js"
// import AddShipping from "./user controllers/addshipping.controller.js"
import UserShippings from "./user controllers/shipping controllers/usershipping.controller.js"
import AddShipping from "./user controllers/shipping controllers/addshipping.controller.js"
import DeleteShipping from "./user controllers/shipping controllers/deleteshipping.controller.js"
import EditShippingAddressStatus from "./user controllers/shipping controllers/editshippingstatus.controller.js"
import UpdateShipping from "./user controllers/shipping controllers/editshipping.controller.js"
import AddComment from "./user controllers/comment controllers/addcomment.controller.js"
import AllComments from "./user controllers/comment controllers/comments.controller.js"
import AddLike from "./user controllers/like controllers/addlike.controller.js"
import AllLikes from "./user controllers/like controllers/likes.controller.js"
import AddWishlist from "./user controllers/wishlist controllers/addwishlist.controller.js"
import AllReviews from "./user controllers/review controllers/reviews.controller.js"
import AddMessage from "./user controllers/message controllers/addmessage.controller.js"
import AddReview from "./user controllers/review controllers/addreview.controller.js"

import findFedexRate from "./user controllers/fedex controllers/fedexrate.controller.js"
import orderShippingTracking from "./user controllers/fedex controllers/ordertrackbyid.controller.js"
// import createFedexShipment from "./user controllers/fedex controllers/createshipping.controller.js"

import createPaypalOrder from "./user controllers/createpaypalorder.controller.js"
import capturePaypalOrder from "./user controllers/capturepaypalorder.controller.js"
import stripeCheckout from "./user controllers/stripecheckout.controller.js"
import stripeWebhook from "./user controllers/stripewebhook.controller.js"
import userOrders from "./user controllers/userorders.controller.js"

import GetBlog from "./user controllers/blog controllers/getblog.controller.js"
import GetAllBlogs from "./user controllers/blog controllers/getallblogs.controller.js"
// ................................

//   Admin Controllers

// ................................
import GetCategories from "./Admin Site controllers/category controllers/allcategories.controller.js"
import AddCategory from "./Admin Site controllers/category controllers/addcategory.controller.js"
import UpdateCategory from "./Admin Site controllers/category controllers/updatecategory.controller.js"
import DeleteCategory from "./Admin Site controllers/category controllers/deletecategory.controller.js"
import AddBlog from "./Admin Site controllers/blog controllers/addblog.controller.js"
import UpdateBlog from "./Admin Site controllers/blog controllers/updateblog.controller.js"
import DeleteBlog from "./Admin Site controllers/blog controllers/deleteblog.controller.js"
import GetProducts from "./Admin Site controllers/product controllers/allproducts.controller.js"
import AddProduct from "./Admin Site controllers/product controllers/addproduct.controller.js"
import UpdateProduct from "./Admin Site controllers/product controllers/updateproduct.controller.js"
import DeleteProduct from "./Admin Site controllers/product controllers/deleteproduct.controller.js"
import UpdateComment from "./Admin Site controllers/comment controllers/updatecomment.controller.js"
import DeleteComment from "./Admin Site controllers/comment controllers/deletecomment.controller.js"
import AllShippings from "./Admin Site controllers/shipping controllers/allshippings.controller.js"
import GetUsers from "./Admin Site controllers/users controllers/allusers.controller.js"
import EditUserStatus from "./Admin Site controllers/users controllers/edituserstatus.controller.js"
import allOrders from "./Admin Site controllers/order controllers/allorders.controller.js"

export {
    SignUp, // User
    SignIn,
    CheckOauth,
    googleRedirect,
    googleCalback,
    facebookRedirect,
    facebookCalback,
    veirfyOTP,
    regenreteOTP,
    resetPassword,
    UpdateProfile,
    SignOut,
    UserShippings,
    AddShipping,
    DeleteShipping,
    EditShippingAddressStatus,
    UpdateShipping,
    AddCategory,
    AddComment,
    AllComments,
    AddLike,
    AllLikes,
    AddWishlist,
    AllReviews,
    AddMessage,
    AddReview,
    findFedexRate,
    orderShippingTracking,
    createPaypalOrder,
    capturePaypalOrder,
    stripeCheckout,
    stripeWebhook,
    userOrders,
    GetBlog, // Admin
    GetAllBlogs,
    GetCategories,
    UpdateCategory,
    DeleteCategory,
    AddBlog,
    UpdateBlog,
    DeleteBlog,
    AddProduct,
    GetProducts,
    UpdateProduct,
    DeleteProduct,
    UpdateComment,
    DeleteComment,
    AllShippings,
    GetUsers,
    EditUserStatus,
    allOrders,
}