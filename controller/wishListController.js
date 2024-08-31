const WishlistDB = require("../model/wishlistModel");

const getWishList = async (req, res) => {
  const userId = req.session.user._id;
  try {
    const wishlist = await WishlistDB.findOne({ user: userId }).populate(
      "products.productId"
    );
    res.render("user/wishlist", { user: req.session.user, wishlist });
  } catch (error) {
    console.log(error);
  }
};

const postWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.session.user._id;
  const isExisting = await WishlistDB.findOne({
    user: userId,
    "products.productId": productId,
  });
  if (isExisting) {
    const product = await WishlistDB.findOneAndUpdate(
      { user:userId },
      { $pull: { products: { productId: productId } } },
      { new: true }
    );
    res.json({productRemove:true})
    return
  } else {
     await WishlistDB.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          products: {
            productId: productId,
          },
        },
      },
      {
        upsert: true, //create new document if doest exist
      }
    );
  }
  res.json({ success: true });
};
const deleteWishProduct = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { id } = req.params;
    const wish = await WishlistDB.findOneAndUpdate(
      { user:userId },
      { $pull: { products: { productId: id } } },
      { new: true }
    );
    const isEmpty = wish.products.length === 0;
    res.json({ success: true,wishEmpty:isEmpty });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getWishList,
  postWishlist,
  deleteWishProduct,
};
