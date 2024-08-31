const UserDB = require("../model/userModel");
const AddressDB = require("../model/addressModel")
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer')
let otpStore = {};

const getOtp = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;
  console.log(otpStore);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ otpSend: true });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.json({ otpSend: false });
  }
};

const verifyOtp = (req,res)=>{
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] == otp) {
    return res.json({ otpVerified: true })
  }
  res.json({ otpVerified: false })
}
const getSignup = (req, res) => {
    res.render("user/signup",{title:"Signup"});
};


const postSignup = async (req, res) => {
  try {
    const {userName,email,password,otp} = req.body;
    const isExisting = await UserDB.findOne({email:email})
    if(isExisting){
       res.json({userExists:true})
       return
    }else{
      const HashedPassword = await bcrypt.hash(password, 10);
      const user = new UserDB({
        fullname:userName,
        email:email,
        password: HashedPassword,
        registered:Date.now()
      });
      await user.save();
      req.session.userlogedIn =true;
      req.session.user = user;
      return res.json({success:true})
    }
  } catch (error) {
    console.log(error);
  }
};
const getLogin = (req, res) => {
  const user = req.session.user
   if(req.session.userLogedIn){
     res.redirect('/')
   }else{
     res.render("user/login",{title:"Login",user })
   }
};
const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserDB.findOne({ email: email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        req.session.userLogedIn = true;
        req.session.user = user;
        const redirectTo = req.session.redirectTo || '/';
        delete req.session.redirectTo; 
        res.json({ success: true, redirectTo });
      } else {
        res.json({ nopassword: true });
      }
    } else {
      res.json({ nouser: true });
    }
  } catch (error) {
    console.error(error);
  }
};


const getLogout = (req,res)=>{
    req.session.userLogedIn = false
    req.session.user = null
    res.redirect('/')
}




const getMyProfile = async(req,res)=>{
  const savedAddresses = await AddressDB.find({user:req.session.user._id})
  res.render('user/user-profile',{user:req.session.user,savedAddresses})
}
module.exports = {
  getLogin,
  getSignup,
  postSignup,
  postLogin,
  getLogout,
  getOtp,
  verifyOtp,
  getMyProfile

};
