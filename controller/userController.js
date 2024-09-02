const UserDB = require("../model/userModel");
const AddressDB = require("../model/addressModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
let otpStore = {};

const getOtp = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;
  console.log(otpStore);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
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

const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] == otp) {
    return res.json({ otpVerified: true });
  }
  res.json({ otpVerified: false });
};
const getSignup = (req, res) => {
  res.render("user/signup", { title: "Signup" });
};

const postSignup = async (req, res) => {
  try {
    const { userName, email, password, otp } = req.body;
    const isExisting = await UserDB.findOne({ email: email });
    if (isExisting) {
      res.json({ userExists: true });
      return;
    } else {
      const HashedPassword = await bcrypt.hash(password, 10);
      const user = new UserDB({
        fullname: userName,
        email: email,
        password: HashedPassword,
        registered: Date.now(),
      });
      await user.save();
      req.session.userlogedIn = true;
      req.session.user = user;
      return res.json({ success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
const getLogin = (req, res) => {
  const user = req.session.user;
  if (req.session.userLogedIn) {
    res.redirect("/");
  } else {
    res.render("user/login", { title: "Login", user });
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
        const redirectTo = req.session.redirectTo || "/";
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

const getLogout = (req, res) => {
  req.session.userLogedIn = false;
  req.session.user = null;
  res.redirect("/");
};

const getMyProfile = async (req, res) => {
  const savedAddresses = await AddressDB.find({ user: req.session.user._id });
  res.render("user/user-profile", { user: req.session.user, savedAddresses });
};

const getForgotPassword = (req, res) => {
  res.render("user/forgot-password");
};

const postForgotPassword = async (req, res) => {
  try {
    const crypto = require("crypto");
    const { email } = req.body; // Get email from the request body
    console.log(email);

    // Check if the user exists
    const user = await UserDB.findOne({ email });
    if (!user) {
      return res.json({ userNotFound: true });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour validity

    // Save the user with the token
    await user.save();

    // Create reset URL
    const resetUrl = `http://${req.headers.host}/change-password/${resetToken}`;

    // Set up nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email, // Send to the user's email
      subject: "Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Hello,</p>
          <p>You are receiving this because you (or someone else) requested to reset your password. Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If you did not request this, please ignore this email, and your password will remain unchanged.</p>
          <p>Thank you!</p>
        </div>
      `,
    };
    

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with success
    res.json({ emailSend: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

const getChangePassword = async(req, res) => {
  try {
    res.render("user/change-password", { token: req.params.token });
  } catch (error) {
    console.log(error);
  }
};

const postChangePassword = async (req, res) => {
  const { password } = req.body;
  try {
    const user = await UserDB.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Invalid token or token expired.");
      return res.json({ notValidToken: true });
    }

    console.log("User found, proceeding to change password.");
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log("Password changed successfully.");
    res.json({ success: true });
  } catch (error) {
    console.log("Error occurred:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getLogin,
  getSignup,
  postSignup,
  postLogin,
  getLogout,
  getOtp,
  verifyOtp,
  getMyProfile,
  getForgotPassword,
  postForgotPassword,
  getChangePassword,
  postChangePassword
};
