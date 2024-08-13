/*[ Global decelaration]
    ===========================================================*/
const totalAmout = document.getElementById("totalAmout");
const allPrice = document.querySelectorAll(".price");

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

/*[ Add to cart ]
    ===========================================================*/
const addToCart = async (productId,priceString) => {
  try {
    const price = parseInt(priceString);
    const cartCount = document.querySelector('.count')
    const response = await fetch("/add-to-cart", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, price }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/login";
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } else {
      const data = await response.json();
      if (data.success) {
        alertUser(data.message, "success");
        const existingCount = cartCount.innerText
       const existingCountNum = parseInt(existingCount)
       
        cartCount.innerText = existingCountNum+1;
      } else {
        alertUser(data.message, "error");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/*[ delete cart product]
    ===========================================================*/
const deleteCartProduct = async (productId, compId) => {
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
};

/*[ Change quantity]
    ===========================================================*/
const changeQuantity = async (cartId, productId, priceString, count) => {
  const priceFiled = document.getElementById(`${cartId}-price-${productId}`);
  const quantityString = document.getElementById(productId);
  const quantity = parseInt(quantityString.innerText);
  const price = parseInt(priceString);
  const newQuantity = quantity + count;
  const newPrice = newQuantity * price;
  const response = await fetch("/change-product-quantiy", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartId, productId, count, quantity, price }),
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const data = await response.json();
  if (data.success) {
    quantityString.textContent = newQuantity;
    priceFiled.textContent = newPrice;
  }
  totalAmout.innerText = data.total;
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

/*[ login hower function ]
    ===========================================================*/
const userIcon = document.querySelector(".user");
const accountDiv = document.querySelector(".account");
let isHovered = false;

const showAccount = () => {
  accountDiv.style.display = "flex";
  isHovered = true;
};

const hideAccount = () => {
  if (!isHovered) {
    accountDiv.style.display = "none";
  }
};

userIcon.addEventListener("mouseenter", showAccount);
accountDiv.addEventListener("mouseenter", showAccount);

userIcon.addEventListener("mouseleave", () => {
  isHovered = false;
  setTimeout(hideAccount, 100);
});

accountDiv.addEventListener("mouseleave", () => {
  isHovered = false;
  setTimeout(hideAccount, 100);
});

/*[function to change banner image src based on size]
    ===========================================================*/
function updateImageSources() {
  const images = document.querySelectorAll(".carousel-item img");
  console.log(images);

  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  images.forEach((img, index) => {
    if (isMobile) {
      img.style.width = "100%";
      img.src = `/images/banner-mobile${index + 1}.webp`;
    } else {
      img.src = `/images/banner${index + 1}.webp`;
    }
  });
}
updateImageSources();
window.addEventListener("resize", updateImageSources);

const addressForm = document.getElementById("addressForm");
const addAddress = document.getElementById("add-address");

addAddress.addEventListener("click", () => {
  addressForm.style.display = "block";
});

function hideForm() {
  addressForm.style.display = "none";
  addressForm.reset();
}
/*[Add user address via ajax and update it dynamicaly]
    ===========================================================*/
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
    
      try {
        const response = await fetch("/add-address", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            mobile,
            email,
            address,
            city,
            state,
            pincode,
          }),
        });
    
        const data = await response.json(); // Await and parse the JSON response
        console.log(data); // Debugging: Check the response data
    
        if (response.ok && data.saved) {
          hideForm();
          const addressList = document.getElementById("addressList");
    
          if (!addressList) {
            // If addressList is not found, create and insert a new address list
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
            document.querySelector("form").insertAdjacentHTML("afterend", newAddressContainer); // Insert new address list
          } else {
            // Append the new address to the existing address list
            const newAddressItem = `
              <div class="col-lg-4 col-sm-6 mb-3">
                <div data-bs-toggle="collapse">
                  <label class="card-radio-label address mb-0">
                    <input type="radio" value="${data.address._id}" name="address" id="addressRadioButtons" class="card-radio-input">
                    <div class="card-radio text-truncate p-3">
                      <span class="fs-14 mb-2 d-block">Address ${addressList.children.length + 1}</span>
                      <b class="fs-14 mb-2 d-block">${data.address.fullname}</b>
                      <span class="text-muted fw-normal text-wrap mb-1 d-block">${data.address.address}, ${data.address.city}, ${data.address.state}, ${data.address.pincode}</span>
                      <span class="text-muted fw-normal d-block">Mo. ${data.address.mobile}</span>
                    </div>
                  </label>
                </div>
              </div>`;
    
            addressList.insertAdjacentHTML("beforeend", newAddressItem);
          }
        } else {
          console.log("Error while creating address");
        }
      } catch (error) {
        console.log(error);
      }
    });
    
/*[ajax for place order]
    ===========================================================*/
const placeOrderForm = document.getElementById("placeOrderForm");
placeOrderForm.addEventListener("submit", async (e) => {
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
  if (!response.ok) {
    alert("please add address");
  }
  const data = await response.json();
  if (data.success) {
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
});
