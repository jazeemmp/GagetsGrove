const ajaxisLogined = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    if (req.accepts('json')) {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.redirect('/login');
    }
  }
};
const isLogined = (req,res,next)=>{
  if (req.session.user) {
    res.locals.user = req.session.user;
    next();
  } else {
      res.redirect('/login');
  }
}
module.exports = {
    isLogined,
    ajaxisLogined
}