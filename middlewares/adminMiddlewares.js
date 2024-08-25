const isLogined = (req,res,next)=>{
    if (req.session.admin) {
      res.locals.admin = req.session.admin; // Make `admin` available in templates
      next();
    } else {
        res.redirect('/admin/login');
    }
  }
module.exports = {
    isLogined,
}