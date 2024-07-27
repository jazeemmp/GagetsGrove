const UserDB = require("../model/userModel")

const getSignup= (req,res)=>{
    res.render('user/signup',{title:"Signup"})
}
const getLogin = (req,res)=>{
    res.render('user/login',{title:"Login"})
}




module.exports = {
    getLogin,
    getSignup,
}