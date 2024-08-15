const UserDB = require("../model/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer')

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
  console.log(otpStore);
  if (otpStore[email] && otpStore[email] == otp) {
    return res.json({ otpVerified: true })
  }
  res.json({ otpVerified: false })
}

module.exports = {
  getLogin,
  getSignup,
  postSignup,
  postLogin,
  getLogout,
  getOtp,
  verifyOtp

};
