/*[ Global decelaration]
    ===========================================================*/
const totalAmout = document.getElementById("totalAmout");
const allPrice = document.querySelectorAll(".price");

/*[ Add to cart ]
    ===========================================================*/
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
  totalAmout.innerText = `₹ ${data.total}`;
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
  const images = document.querySelectorAll(".swiper-slide .img");
  const prev = document.querySelector('.swiper-button-prev')
  const next = document.querySelector('.swiper-button-next')
  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  images.forEach((img, index) => {
    if (isMobile) {
      img.style.width = "100%"
      img.src = `/images/banner-mobile${index + 1}.webp`;
      prev.remove()
      next.remove()
    } else {
      img.src = `/images/banner${index + 1}.webp`;
    }
  });
}
updateImageSources();
window.addEventListener("resize", updateImageSources);

/*[banner swiper library function]
    ===========================================================*/
const swiper = new Swiper(".swiper", {
  pagination: {
    el: ".swiper-pagination",
  },
  autoplay: {
    delay: 5000, 
    disableOnInteraction: false,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  scrollbar: {
    el: ".swiper-scrollbar",
  },
});
