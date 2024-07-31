const UserDB = require("../model/userModel");
const bcrypt = require("bcrypt");

const getSignup = (req, res) => {
    const user = req.session.user
    res.render("user/signup",{user,title:"Signup"});
};

const getLogin = (req, res) => {
   const user = req.session.user
    if(req.session.logedIn){
      res.redirect('/')
    }else{
      res.render("user/login",{title:"Login",user })
    }
};

const postSignup = async (req, res) => {
  try {
    const {userName,email,password} = req.body;
    const isExisting = await UserDB.findOne({email:email})
    if(isExisting){
       return res.json({success:false})
    }else{
      const HashedPassword = await bcrypt.hash(password, 10);
      const user = new UserDB({
        fullname:userName,
        email:email,
        password: HashedPassword,
      });
      await user.save();
      req.session.logedIn =true;
      req.session.user = user;
      return res.json({success:true})
    }
  } catch (error) {
    console.log(error);
  }
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserDB.findOne({ email: email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        req.session.logedIn =true;
        req.session.user = user;
        res.json({success:true})
      } else {
        res.json({success:false});
      }
    } else {
      res.json({success:false});
    }
  } catch (error) {
    console.error(error);
  }
};

const getLogout = (req,res)=>{
    req.session.destroy()
    res.redirect('/')
}
module.exports = {
  getLogin,
  getSignup,
  postSignup,
  postLogin,
  getLogout,

};
