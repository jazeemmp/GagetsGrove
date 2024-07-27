const express = require('express');
const router = express.Router();
const showProducts = require('../controller/showProducts')
const userControll = require('../controller/userControler')

router.get('/',showProducts.getProducts);
router.get('/signup',userControll.getSignup)
router.get('/login',userControll.getLogin)
module.exports = router;
