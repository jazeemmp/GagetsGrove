const express = require('express');
const router = express.Router();

// Controllers
const productController = require('../controller/productController');
const userController = require('../controller/userController');
const cartController = require('../controller/cartController');
const orderController = require('../controller/orderController');
const wishListController = require('../controller/wishListController');

// Middlewares
const middle = require('../middlewares/userMiddlewares');

// User Routes
router.get('/signup', userController.getSignup);
router.get('/login', userController.getLogin);
router.post('/signup', userController.postSignup);
router.post('/login', userController.postLogin);
router.get('/logout', userController.getLogout);
router.get('/my-profile', middle.isLogined, userController.getMyProfile);
router.post('/get-otp', userController.getOtp);
router.post('/verify-otp', userController.verifyOtp);

// Product Routes
router.get('/', productController.getProducts);
router.get('/product-details/:id', productController.getProductDetails);
router.get('/category/:categoryName', productController.getCategory);
router.get('/search', productController.getSearch);

// Cart Routes
router.get('/cart', middle.isLogined, cartController.getCart);
router.post('/add-to-cart', middle.ajaxisLogined, cartController.addToCart);
router.get('/remove-cart-product/:id', middle.isLogined, cartController.removeProduct);
router.post('/change-product-quantiy', cartController.changeProductQuantity);

// Order Routes
router.get('/place-order', middle.isLogined, orderController.getPlaceOrder);
router.post('/add-address', orderController.addAddress);
router.post('/place-order', orderController.postPlaceOrder);
router.get('/orders', middle.isLogined, orderController.getOrders);
router.get('/orders/view-details/:id', orderController.getOrderDetails);
router.post('/verify-payment', orderController.verifyPayment);
router.post('/cancel-order/:id', orderController.cancelOrder);

// Wishlist Routes
router.get('/wish-list', middle.isLogined, wishListController.getWishList);
router.post('/add-to-wishlist', middle.ajaxisLogined, wishListController.postWishlist);
router.get('/delete-wish-product/:id', wishListController.deleteWishProduct);

module.exports = router;
