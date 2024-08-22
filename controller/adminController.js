const ProductDB = require("../model/productModel");
const OrderDB = require("../model/orderModel");

function calculateDiscountedPrice(originalPrice, discountPercentage) {
  const discountAmount = (originalPrice * discountPercentage) / 100;
  const discountedPrice = originalPrice - discountAmount;
  return discountedPrice;
}

const getHome = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  
  const result = await OrderDB.aggregate(
    [
      {
        $group:{
          _id:null,
          totalSum:{$sum:'$totalAmount'}
        }
      }
    ]
  );
  const totalSum = result.length >0? result[0].totalSum : 0;
  const latestOrders = await OrderDB.find()
    .sort({ orderDate: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  const totalOrders = await OrderDB.countDocuments();
  const totalProducts = await ProductDB.countDocuments()

  res.render("admin/admin-home", {
    page: "dashboard",
    layout: "layouts/admin-layout",
    latestOrders,
    totalSum,
    currentPage: page,
    totalOrders,
    totalProducts,
    totalPages: Math.ceil(totalOrders / pageSize),
  });
};

const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;

  const products = await ProductDB.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  const totalProducts = await ProductDB.countDocuments();

  res.render("admin/all-products", {
    layout: "layouts/admin-layout",
    page: "all-products",
    products,
    currentPage: page,
    totalPages: Math.ceil(totalProducts / pageSize),
  });
};
const getAddProducts = (req, res) => {
  res.render("admin/add-products", {
    layout: "layouts/admin-layout",
    page: "add-product",
  });
};
const postAddProducts = async (req, res) => {
  if (!req.body) {
    console.log("No body data received");
    return res.status(400).send("No product data received");
  }
  try {
    const imageFiles = req.files.map((file) => file.filename);
    const product = new ProductDB({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      discount: req.body.discount,
      discountedPrice: calculateDiscountedPrice(
        req.body.price,
        req.body.discount
      ),
      color: req.body.color,
      description: req.body.description,
      images: imageFiles,
    });
    await product.save();

    res.redirect("/admin/all-products");
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Internal Server Error");
  }
};
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductDB.findOne({ _id: id });
    res.render("admin/edit-product", {
      page: "all-products",
      product,
      layout: "layouts/admin-layout",
      title: "Edit Product",
    });
  } catch (error) {
    console.log(error);
  }
};

const postEditProduct = async (req, res) => {
  const imageFiles = req.files.length
    ? req.files.map((file) => file.filename)
    : req.body.existingImages;
  const { id } = req.params;
  console.log(id);
  try {
    await ProductDB.updateOne(
      { _id: id },
      {
        $set: {
          name: req.body.name,
          category: req.body.category,
          price: req.body.price,
          discount: req.body.discount,
          discountedPrice: calculateDiscountedPrice(
            req.body.price,
            req.body.discount
          ),
          color: req.body.color,
          description: req.body.description,
          images: imageFiles,
        },
      }
    );
    res.redirect("/admin/all-products");
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductDB.deleteOne({ _id: id });
    res.redirect("/admin/all-products");
  } catch (error) {
    console.log(error);
  }
};
const getOrderList = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;

  const orders = await OrderDB.find()
    .sort({ orderDate: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  const totalOrders = await OrderDB.countDocuments();

  res.render("admin/order-list", {
    layout: "layouts/admin-layout",
    page: "order-list",
    orders,
    currentPage: page,
    totalPages: Math.ceil(totalOrders / pageSize),
  });
};

const getOrderDetails = async (req, res) => {
  const orderDetails = await OrderDB.findOne({ _id: req.params.id }).populate(
    "products.productId"
  );
  console.log(orderDetails);

  res.render("admin/order-details", {
    layout: "layouts/admin-layout",
    page: "order-list",
    orderDetails,
  });
};

const postOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;
  if(orderStatus === 'Delivered'){
    const status = await OrderDB.updateOne({_id: id }, { $set: { paymentStatus: "paid" } });
  }
  
  try {
    const status = await OrderDB.updateOne({_id: id }, { $set: { status: orderStatus } });
    console.log(status);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllProducts,
  getOrderList,
  getOrderDetails,
  getAddProducts,
  postAddProducts,
  postOrderStatus,
  getHome,
  deleteProduct,
  editProduct,
  postEditProduct,
};
