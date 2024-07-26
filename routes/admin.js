const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    const products = [
        {
            name:"Poco m2 pro",
            category:"mobile",
            description:"this is a good phone",
            image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxXdXcko8lt3HyuPICbmF__7SYjxDtKogngA&s"
        },
        {
            name:"Poco m3 pro",
            category:"mobile",
            description:"this is a good phone",
            image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDh3AvTrR4FAYHliq0juOCoVV1DOp8_EVAg&s"
        },
        {
            name:"Poco m4 pro",
            category:"mobile",
            description:"this is a good phone",
            image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvmRGiNmhvIOdJgh8w_ZNCUI4E16drhu5sXg&s"
        },
        {
            name:"Poco m5 pro",
            category:"mobile",
            description:"this is a good phone",
            image:"https://www.jiomart.com/images/product/original/493178757/poco-m5-128-gb-6-gb-ram-icy-blue-mobile-phone-digital-o493178757-p594861508-0-202210281109.jpeg?im=Resize=(420,420)"
        }
    ]
    res.render('admin/view-products',{title:"Admin Dasboard",admin:true,products})
})
router.get('/add-products',(req,res)=>{
    res.render('admin/add-products',{admin:true,title:"Add Products"})
})
router.post('/add-product',(req,res)=>{
    console.log(req.body);
})

module.exports = router;