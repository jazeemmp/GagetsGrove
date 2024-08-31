
/*[ Global decelaration]
    ===========================================================*/
const totalAmout = document.getElementById("totalAmout");
const allPrice = document.querySelectorAll(".price");
console.log("Script loaded");

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // The page was restored from the cache
    window.location.reload();
  }
});


/*[Form validation by bootstarp]
    ===========================================================*/
(function () {
  "use strict"; //strict mode
  var forms = document.querySelectorAll(".needs-validation");
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})(); //Calling the Function

// AJAX Request Function
const makeRequest = async (url, method, body) => {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.json();
  } catch (error) {
    console.error(error);
    showMessage(otpMsg, "An error occurred. Please try again later.", "red");
    return null;
  }
};
/*[ Add to cart ]
    ===========================================================*/
const addToCart = async (productId, priceString) => {
  const price = parseInt(priceString);
  const cartCount = document.querySelector(".count");
  const quantityDiv = document.getElementById('productCount')
  let quantity = 1
  if (quantityDiv) {
     quantity = Number(quantityDiv.value)
  }
  try {
    const response = await sendCartRequest(productId, price,quantity);
    await handleCartResponse(response, cartCount);
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};
const sendCartRequest = (productId, price,quantity) => {
  return fetch("/add-to-cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, price, quantity }),
  });
};

const handleCartResponse = async (response, cartCount) => {
  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "/login";
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  const data = await response.json();
  if (data.success) {
    alertUser(data.message, "success");
    updateCartCount(cartCount);
  } else {
    alertUser(data.message, "error");
  }
};

const updateCartCount = (cartCount) => {
  const existingCountNum = parseInt(cartCount.innerText);
  cartCount.innerText = existingCountNum + 1;
};

/*[ delete cart product]
    ===========================================================*/
const deleteCartProduct = async (productId, compId) => {
  try {
    const container = document.getElementById(compId);
    const response = await fetch(`/remove-cart-product/${productId}`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data.productremoved) {
      container.remove();
    }
    if (data.cartEmpty) {
      location.reload();
    }
    totalAmout.innerText = `₹ ${data.total}`;
  } catch (error) {
    console.log(error);
  }
};

/*[ Change quantity]
    ===========================================================*/
const changeQuantity = async (cartId, productId, priceString, count) => {
  try {
    const priceFiled = document.getElementById(`${cartId}-price-${productId}`);
    const quantityString = document.getElementById(productId);
    const quantity = parseInt(quantityString.innerText);
    const price = parseInt(priceString);
    const newQuantity = quantity + count;
    const newPrice = newQuantity * price;
    const data = await makeRequest("/change-product-quantiy", "post", {
      cartId,
      productId,
      count,
      quantity,
      price,
    });
    if (data.success) {
      quantityString.textContent = newQuantity;
      priceFiled.textContent = newPrice;
    }
    totalAmout.innerText = data.total;
  } catch (error) {
    console.log(error);
  }
};

/*[ Fuction for alerting user ]
    ===========================================================*/
const alertUser = (title, state) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: state,
    title: title,
  });
};

// /*[ login hower function ]
//     ===========================================================*/
// const userIcon = document.querySelector(".user");
// const accountDiv = document.querySelector(".account");
// let isHovered = false;

// const showAccount = () => {
//   accountDiv.style.display = "flex";
//   isHovered = true;
// };

// const hideAccount = () => {
//   if (!isHovered) {
//     accountDiv.style.display = "none";
//   }
// };

// userIcon.addEventListener("mouseenter", showAccount);
// accountDiv.addEventListener("mouseenter", showAccount);

// userIcon.addEventListener("mouseleave", () => {
//   isHovered = false;
//   setTimeout(hideAccount, 100);
// });

// accountDiv.addEventListener("mouseleave", () => {
//   isHovered = false;
//   setTimeout(hideAccount, 100);
// });

/*[function to change banner image src based on size]
    ===========================================================*/
function updateImageSources() {
  try {
    const images = document.querySelectorAll(".carousel-item img");
    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    images.forEach((img, index) => {
      if (isMobile) {
        img.style.width = "100%";
        img.src = `/images/banner-mobile${index + 1}.webp`;
      } else {
        img.src = `/images/banner${index + 1}.webp`;
      }
    });
  } catch (error) {
    console.log(error);
  }
}
updateImageSources();
window.addEventListener("resize", updateImageSources);

/*[Add user address via ajax and update it dynamicaly]
    ===========================================================*/
const addressForm = document.getElementById("addressForm");
const addAddress = document.getElementById("add-address");

if (addAddress) {
  addAddress.addEventListener("click", () => {
    addressForm.style.display = "block";
  });
}

function hideForm() {
  addressForm.style.display = "none";
  addressForm.reset();
}

if (addressForm) {
  addressForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const fullName = formData.get("fullname");
    const mobile = formData.get("mobile");
    const email = formData.get("email");
    const address = formData.get("address");
    const pincode = formData.get("pincode");
    const city = formData.get("city");
    const state = formData.get("state");
    const data = await makeRequest("/add-address", "post", {
      fullName,
      mobile,
      email,
      address,
      city,
      state,
      pincode,
    });

    if (data.saved) {
      hideForm();
      const addressList = document.getElementById("addressList");

      if (!addressList) {
        const newAddressContainer = `
              <div class="row" id="addressList">
                <h5 class="font-size-16 mb-3">Select address:</h5>
                <div class="col-lg-4 col-sm-6 mb-3">
                  <div data-bs-toggle="collapse">
                    <label class="card-radio-label address mb-0">
                      <input type="radio" value="${data.address._id}" name="address" id="addressRadioButtons" class="card-radio-input">
                      <div class="card-radio text-truncate p-3">
                        <span class="fs-14 mb-2 d-block">Address 1</span>
                        <b class="fs-14 mb-2 d-block">${data.address.fullname}</b>
                        <span class="text-muted fw-normal text-wrap mb-1 d-block">${data.address.address}, ${data.address.city}, ${data.address.state}, ${data.address.pincode}</span>
                        <span class="text-muted fw-normal d-block">Mo. ${data.address.mobile}</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>`;

        document.querySelector(".alert-user").remove(); // Remove the warning alert
        document
          .querySelector("form")
          .insertAdjacentHTML("afterend", newAddressContainer); // Insert new address list
      } else {
        // Append the new address to the existing address list
        const newAddressItem = `
              <div class="col-lg-4 col-sm-6 mb-3">
                <div data-bs-toggle="collapse">
                  <label class="card-radio-label address mb-0">
                    <input type="radio" value="${
                      data.address._id
                    }" name="address" id="addressRadioButtons" class="card-radio-input">
                    <div class="card-radio text-truncate p-3">
                      <span class="fs-14 mb-2 d-block">Address ${
                        addressList.children.length + 1
                      }</span>
                      <b class="fs-14 mb-2 d-block">${data.address.fullname}</b>
                      <span class="text-muted fw-normal text-wrap mb-1 d-block">${
                        data.address.address
                      }, ${data.address.city}, ${data.address.state}, ${
          data.address.pincode
        }</span>
                      <span class="text-muted fw-normal d-block">Mo. ${
                        data.address.mobile
                      }</span>
                    </div>
                  </label>
                </div>
              </div>`;

        addressList.insertAdjacentHTML("beforeend", newAddressItem);
      }
    } else {
      console.log("Error while creating address");
    }
  });
}

/*[ajax for place order]
    ===========================================================*/
const orderSucccess = ()=>{
      Swal.fire({
        title: "Order Placed Successfully!",
        text: "Thank you for your purchase. Your order has been placed and is being processed.",
        icon: "success",
        confirmButtonText: "View Orders",
        customClass: {
          confirmButton: "btn-black",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/orders";
        }
      });
    }
const orderFailed = ()=>{
  Swal.fire({
    title: "Payment Failed",
    text: "Sorry, there was an issue processing your payment. Please try again or contact support if the problem persists.",
    icon: "error",
    confirmButtonText: "Try Again",
    customClass: {
      confirmButton: "btn-black",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Optional: Redirect to a specific page or reload the current page
      window.location.reload();
    }
  });
}
const placeOrderForm = document.getElementById("placeOrderForm");
if (placeOrderForm) {
  placeOrderForm.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      const addressRadioButtons = document.querySelectorAll(
        'input[name="address"]'
      );
      let isChecked = false;
      addressRadioButtons.forEach((radio) => {
        if (radio.checked) {
          isChecked = true;
        }
      });
      if (!isChecked) {
        Swal.fire({
          title: "No Address Selected",
          text: "Please select an address before placing your order.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn-black",
          },
        });
        return;
      }

      const formData = new FormData(e.target);
      const addressId = formData.get("address");
      const paymentMethod = formData.get("paymentMethod");
      const cartId = formData.get("cartId");
      const totalPrice = formData.get("totalPrice");

      const response = await fetch("/place-order", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId,
          paymentMethod,
          cartId,
          totalPrice,
        }),
      });
      const data = await response.json();
      if (data.codSuccess) {
       orderSucccess()
      } else {
        razorpayPayment(data);
      }
    } catch (error) {
      console.log(error);
    }
  });
}

const razorpayPayment = (data) => {
  const options = {
    key: "rzp_test_YMQUcOIb3QmAVR", // Enter the Key ID generated from the Dashboard
    amount: data.order.amount, // Amount is in currency subunits
    currency: "INR",
    name: "Gadgest Grove",
    description: "Test Transaction",
    order_id: data.order.id, // This is the order ID returned from your server
    handler: function (response) {
      verifyPayment(response,data)
    },
    prefill: {
      name: "Your Name",
      email: "your.email@example.com",
      contact: "9999999999",
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
};

const verifyPayment = async(response,order)=>{
  const cartId = order.order.receipt
  const orderId = order.orderId
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature,} = response;
  const data = await makeRequest("/verify-payment","post",{
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    cartId,
    orderId})
  if (data.success) {
    orderSucccess()
  }else{
    orderFailed()
  }
}

const addToWishlist = async(productId)=>{
  const response = await fetch("/add-to-wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
    if (response.status === 401) {
      window.location.href = "/login";
    }
  const data = await response.json()
  if(data.productRemove){
    alertUser("product removed from wishlist","warning")
  }
  if(data.success){
    alertUser("product added to wishlist","success")
  }
}
const deleteWishProduct = async(produtId,containerId)=>{
 const container = document.getElementById(containerId);
 const response = await fetch(`/delete-wish-product/${produtId}`)
 if(!response.ok){
  alertUser("An error occured while deleting product","error")
 }
 const data = await response.json()
 if (data.wishEmpty) {
  location.reload();
}
 if(data.success){
  container.remove()
  alertUser("product deleted from wishlist","success")
 }else{
  alertUser("An error occured while deleting product","error")
 }
}