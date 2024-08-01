const express = require('express');
const router = express.Router();
const showProducts = require('../controller/showProducts')
const userControl = require('../controller/userControler')
const middle = require('../middlewares/userMiddlewares')
const cartControl = require('../controller/cartController')

router.get('/',showProducts.getProducts);
router.get('/signup',userControl.getSignup)
router.get('/login',userControl.getLogin)
router.post('/signup',userControl.postSignup)
router.post('/login',userControl.postLogin)
router.get('/logout',userControl.getLogout)
router.get('/cart',middle.isLogined,cartControl.getCart)
router.get('/add-to-cart/:id',middle.isLogined,cartControl.addToCart)
router.get('/remove-cart-product/:id',middle.isLogined,cartControl.removeProduct)

module.exports = router;
