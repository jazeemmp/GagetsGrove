const fillError = document.querySelector(".fill-error");

  const signupForm =  async () => {
  const userName = document.getElementById("userName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (userName === "" || email === "" || password === "") {
   alert("please fill all the fileds")
  } else {
    const response = await fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, email, password }),
    });
    const data = await response.json();
    if (data.success) {
      window.location.href = "/";
    } else {
      fillError.style.display = "block"
    }
  }
}
const loginForm = async()=>{
  const email= document.getElementById('email').value;
  const password = document.getElementById('password').value;
  console.log(email,password);
  if(email===""|| password===""){
    alert("please fill all fileds")
  }else{
    const response = await fetch('/login',{
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()
    if(data.success){
      window.location.href = "/";
    }else{
     fillError.style.display = "block"
    }
  }
}
const addToCart = async(productId)=>{
   const response = await fetch(`/add-to-cart/${productId}`)
   if(!response.ok){
    throw new Error
   }
}
const deleteCartProduct = async(productId)=>{
  await fetch(`/remove-cart-product/${productId}`)
}