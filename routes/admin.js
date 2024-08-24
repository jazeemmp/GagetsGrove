const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController")
const upload = require('../config/multer/multer')

router.get("/",adminController.getHome);
router.get('/all-products',adminController.getAllProducts)
router.get('/order-list',adminController.getOrderList)
router.get('/order-details/:id',adminController.getOrderDetails)
router.get("/add-products",adminController.getAddProducts);
router.post("/change-status/:id",adminController.postOrderStatus)
router.get('/delete-category/:id',adminController.deleteCategory)
router.get('/user-list',adminController.getUserList)
router.get('/categories',adminController.getCategories)
router.post('/post-category',upload.single('image'),adminController.postCategory)
router.post("/add-product", upload.array('images'),adminController.postAddProducts);
router.get("/delete-product/:id",adminController.deleteProduct)
router.get("/edit-product/:id",adminController.editProduct)
router.post("/edit-product/:id",upload.array('images'),adminController.postEditProduct)
module.exports = router;


module.exports = router;
