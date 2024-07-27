const ProductDB = require("../model/addProducts");

const getProducts = async (req, res) => {
  const products = await ProductDB.find();
  res.render("admin/view-products", {
    title: "Admin Dasboard",
    admin: true,
    products,
  });
};

const getAddProducts = (req, res) => {
  res.render("admin/add-products", { admin: true, title: "Add Products" });
};

const postAddProducts = async (req, res) => {
  if (!req.body) {
    console.log("no body");
    return;
  }
  try {
    const product = new ProductDB({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      image: req.file ? req.file.filename : null,
    });
    await product.save();
    res.status(201).redirect("/admin");
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAddProducts,
  postAddProducts,
  getProducts,
};
