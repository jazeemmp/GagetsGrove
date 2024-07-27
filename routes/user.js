const express = require('express');
const router = express.Router();
const showProducts = require('../controller/showProducts')

router.get('/',showProducts.getProducts);

module.exports = router;
