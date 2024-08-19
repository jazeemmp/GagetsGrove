const ProductDB = require("../model/productModel");

function calculateDiscountedPrice(originalPrice, discountPercentage) {
  console.log("1",originalPrice,discountPercentage);
  const discountAmount = (originalPrice * discountPercentage) / 100;
  const discountedPrice = originalPrice - discountAmount;
  console.log("Disc",discountPercentage);
  console.log(typeof discountedPrice);
  return discountedPrice
}

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
  console.log(req.files);
  try { 
    const imageFiles = req.files.map(file => file.filename); 
    const product = new ProductDB({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      discount:req.body.discout,
      discountedPrice:calculateDiscountedPrice(req.body.price, req.body.discout),
      color:req.body.color,
      description: req.body.description,
      images: imageFiles,
    });
    await product.save();
    res.status(201).redirect("/admin");
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductDB.deleteOne({ _id: id });
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductDB.findOne({ _id: id });
    res.render("admin/edit-product", {
      admin: true,
      product,
      title: "Edit Product",
    });
  } catch (error) {
    console.log(error);
  }
};
const postEditProduct = async (req, res) => {
  try {
    const imageFiles = req.files.lenght? req.files.map(file => file.filename):req.body.existingImages;
    const { id } = req.params;
    const { name, category, price, description } = req.body;
    await ProductDB.updateOne(
      { _id: id },
      {
        $set: {
          name: name,
          category: category,
          price: price,
          discount:req.body.discout,
          discountedPrice:calculateDiscountedPrice(req.body.price, req.body.discout),
          color:req.body.color,
          description: description,
          images: imageFiles,
        },
      }
    );
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  getAddProducts,
  postAddProducts,
  getProducts,
  deleteProduct,
  editProduct,
  postEditProduct,
};
