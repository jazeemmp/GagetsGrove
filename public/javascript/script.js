const totalAmout = document.getElementById('totalAmout')
const allPrice = document.querySelectorAll('.price')
const addToCart = async (productId) => {
  try {
    const price = document.getElementById(productId).innerText;
    const priceNum = parseInt(price);
    const response = await fetch("/add-to-cart", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, priceNum }),
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
      } else {
        alertUser(data.message, "error");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteCartProduct = async (productId, compId) => {
  const container = document.getElementById(compId);
  const response = await fetch(`/remove-cart-product/${productId}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const data = await response.json();
  if (data.productremoved) {
      container.remove()
  }
  if (data.cartEmpty) {
    location.reload();
  }
  totalAmout.innerText = `₹ ${data.total}`
};
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
   totalAmout.innerText = `₹ ${data.total}`
};

const alertUser = (title, state) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
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
