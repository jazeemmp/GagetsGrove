const ProductDB = require("../model/productModel");
const OrderDB = require("../model/orderModel");
const UserDB = require("../model/userModel");
const CategoryDB = require("../model/categoryModel");
const AdminDB = require("../model/adminModel");
const bcrypt = require("bcrypt");

function calculateDiscountedPrice(originalPrice, discountPercentage) {
  const discountAmount = (originalPrice * discountPercentage) / 100;
  const discountedPrice = originalPrice - discountAmount;
  return discountedPrice;
}

const getHome = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const result = await OrderDB.aggregate([
      {
        $group: {
          _id: null,
          totalSum: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalSum = result.length > 0 ? result[0].totalSum : 0;
    const latestOrders = await OrderDB.find()
      .sort({ orderDate: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalOrders = await OrderDB.countDocuments();
    const totalProducts = await ProductDB.countDocuments();

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
  } catch (error) {
    console.log(error);
  }
};
const getLogin = (req, res) => {
  res.render("admin/login", {
    layout: "layouts/admin-layout",
    page: null,
  });
};
const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await AdminDB.findOne({ email });
    if (!admin) {
      return res.status(401).send("Admin not found");
    }
    const match = await bcrypt.compare(password, admin.password);
    if (match) {
      req.session.admin = admin;
      req.session.adminLogedIn = true;
      res.redirect("/admin");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
};
const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  try {
    const products = await ProductDB.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalProducts = await ProductDB.countDocuments();
    const categories = await CategoryDB.find();
    res.render("admin/all-products", {
      layout: "layouts/admin-layout",
      page: "all-products",
      products,
      categories,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / pageSize),
    });
  } catch (error) {
    console.log(error);
  }
};

const getAddProducts = async (req, res) => {
  try {
    const categories = await CategoryDB.find();

    res.render("admin/add-products", {
      layout: "layouts/admin-layout",
      page: "add-product",
      categories,
    });
  } catch (error) {
    console.log(error);
  }
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
    const categories = await CategoryDB.find();
    const product = await ProductDB.findOne({ _id: id }).populate("category");
    console.log(product);
    res.render("admin/edit-product", {
      page: "all-products",
      product,
      categories,
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
  try {
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
  } catch (error) {
    console.log(error);
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderDetails = await OrderDB.findOne({ _id: req.params.id }).populate(
      "products.productId"
    );
    console.log(orderDetails);

    res.render("admin/order-details", {
      layout: "layouts/admin-layout",
      page: "order-list",
      orderDetails,
    });
  } catch (error) {
    console.log(error);
  }
};

const postOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;
  if (orderStatus === "Delivered") {
    const status = await OrderDB.updateOne(
      { _id: id },
      { $set: { paymentStatus: "paid" } }
    );
  }

  try {
    const status = await OrderDB.updateOne(
      { _id: id },
      { $set: { status: orderStatus } }
    );
    console.log(status);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};
const getUserList = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  try {
    const userList = await UserDB.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const totalUsers = await UserDB.countDocuments();
    res.render("admin/user-list", {
      layout: "layouts/admin-layout",
      page: "user-list",
      userList,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / pageSize),
    });
  } catch (error) {
    console.log(error);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await CategoryDB.find();
    res.render("admin/all-categories", {
      layout: "layouts/admin-layout",
      page: "category-list",
      categories,
    });
  } catch (error) {
    console.log(error);
  }
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const postCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    const slugifiedCategoryName = slugify(categoryName);

    const existingCategory = await CategoryDB.findOne({
      slug: slugifiedCategoryName,
    });
    if (existingCategory) {
      return res.status(400).send("Category already exists");
    }
    const newCategory = new CategoryDB({
      name: categoryName,
      slug: slugifiedCategoryName,
      description: description,
      image: req.file ? req.file.filename : null,
    });

    await newCategory.save();
    res.redirect("/admin/categories");
  } catch (error) {
    console.log(error);
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryDB.deleteOne({ _id: id });
    res.redirect("/admin/categories");
  } catch (error) {
    console.log(error);
  }
};

// [registering new admin uncomment if needed]

// const createAdmin = async (req,res)=>{
//   const email = ""
//   const password = ""

//   try {
//     const hasedPassword = await bcrypt.hash(password,10);
//     const newAdmin = new AdminDB({
//       email:email,
//       password:hasedPassword
//     })
//     await newAdmin.save()
//     console.log('Admin created successfully.');
//   } catch (error) {
//     console.error('Error creating admin:', error);
//   }
// }
// createAdmin()

module.exports = {
  getLogin,
  postLogin,
  getAllProducts,
  getOrderList,
  getOrderDetails,
  getAddProducts,
  postAddProducts,
  getUserList,
  postOrderStatus,
  getHome,
  deleteCategory,
  postCategory,
  getCategories,
  deleteProduct,
  editProduct,
  postEditProduct,
};
