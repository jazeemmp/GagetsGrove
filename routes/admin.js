const express = require("express");
const router = express.Router();
const ProductDB = require("../model/addProducts");
const adminController = require("../controller/adminController")
const upload = require('../controller/multer/multer')

router.get("/",adminController.getProducts);
router.get("/add-products",adminController.getAddProducts);
router.post("/add-product",upload.single('image'),adminController.postAddProducts);

module.exports = router;
