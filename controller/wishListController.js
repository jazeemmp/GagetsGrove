const getWishList = async (req,res)=>{
    res.render('user/wishlist',{user:req.session.user})
}
module.exports ={
    getWishList
}