// Global Variables
const emailMsg = document.getElementById("email-error");
const otpMsg = document.getElementById("otp-error");
const passMsg = document.getElementById("pass-error");
const emailField = document.getElementById("emailField");
const passwordField = document.getElementById("passwordField");
const otpField = document.getElementById("otpField");
const getOtpButton = document.getElementById("getOtp");
const signupSubmitBtn = document.getElementById("signupSubmitBtn");
const rePasswordField = document.getElementById("rePasswordField");
const noPassMatch = document.getElementById("no-pass-match");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const signupBtnContainer = document.querySelector(".signup-btn-container");
const passwordForm = document.getElementById("forgotPasswordForm");
const resetPasswordForm = document.getElementById("resetPasswordForm");

let debounceTimer;

// Utility Functions
const clearMessage = () => {
  otpMsg.textContent = "";
  emailMsg.textContent = "";
};

const showMessage = (component, message, color) => {
  component.style.color = color;
  component.textContent = message;
};

const alertInvalid = () => {
  console.log("click");

  if (signupSubmitBtn.disabled) {
    showMessage(otpMsg, "Please provide valid otp to register", "red");
  }
};

// OTP Request
const getOtp = async () => {
  const email = emailField.value;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email) {
    showMessage(emailMsg, "Email can't be empty", "red");
    return;
  }

  if (!emailRegex.test(email)) {
    showMessage(emailMsg, "Please provide a valid email", "red");
    return;
  }

  clearMessage();
  showMessage(otpMsg, "Loading...", "green");

  const data = await makeRequest("/get-otp", "POST", { email });

  if (data && data.otpSend) {
    showMessage(otpMsg, "Check your email for the OTP!", "green");
  } else {
    showMessage(otpMsg, "Error while sending OTP", "red");
  }
};

// OTP Validation with Debounce
const verifyOtp = async () => {
  const email = emailField.value;
  const otp = otpField.value;

  const data = await makeRequest("/verify-otp", "POST", { email, otp });

  if (data && data.otpVerified) {
    showMessage(otpMsg, "OTP Validated", "green");
    signupSubmitBtn.disabled = false;
  } else {
    showMessage(otpMsg, "Please Enter a Valid OTP to Submit", "red");
    signupSubmitBtn.disabled = true;
  }
};

const callVerifyOtp = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(verifyOtp, 1500);
};

// Password Match Check
const checkPassword = () => {
  const password = passwordField.value;
  const rePassword = rePasswordField.value;
  if (password !== rePassword) {
    noPassMatch.style.color = "red";
    noPassMatch.innerText = "Passwords do not match";
  } else {
    noPassMatch.innerText = "";
  }
};

const signupSubmit = async (e) => {
  e.preventDefault();

  const userName = document.getElementById("nameField").value;
  const email = emailField.value;
  const password = passwordField.value;
  const rePassword = rePasswordField.value;
  const otp = otpField.value;

  if (password !== rePassword) {
    noPassMatch.style.color = "red";
    noPassMatch.innerText = "Passwords do not match";
    return;
  }
  const data = await makeRequest("/signup", "POST", {
    userName,
    email,
    password,
    otp,
  });
  if (data.userExists) {
    showMessage(emailMsg, "Email Already exists", "red");
  }
  if (data && data.success) {
    window.location.href = "/";
  }
  // if(data.otpFaild){
  //   showMessage(otpMsg,"Enter Valid Otp","red")
  // }
};

const loginSubmit = async (e) => {
  e.preventDefault();
  const email = emailField.value;
  const password = passwordField.value;

  const data = await makeRequest("/login", "POST", { email, password });

  if (data) {
    if (data.nouser) {
      showMessage(emailMsg, "No such user exists", "red");
    } else if (data.nopassword) {
      showMessage(passMsg, "Password is wrong", "red");
    } else if (data.success) {
      window.location.href = data.redirectTo || "/";
    }
  }
};

const sendMail = async (e) => {
  alertUser("Email sent successfully", "success");
  e.preventDefault();
  const email = document.getElementById("passwordEmail").value;
  console.log(passwordEmail);
  try {
    const data = await makeRequest("/forgot-password", "post", { email });

    if (data.userNotFound) {
      alertUser("User Not Found", "error");
    } else if (data.emailSend) {
      console.log("succcesss");
    } else {
      alertUser("An unexpected error occurred", "error");
    }
  } catch (error) {
    console.error(error);
    alertUser("Something went wrong. Please try again.", "error");
  }
};

const changePassword = async (e) => {
  e.preventDefault();
  const newPassword = document.getElementById("newPassword").value;
  const confirmPass = document.getElementById("confirmPassword")
  const token = document.getElementById("token").value;
  if (newPassword !== confirmPass) {
    return showMessage(passErr,"Passwords do not match","red")
  } else {
    passErr.innerText = "";
  }
  
  const response = await fetch(`/change-password/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: newPassword }),
  });

  const data = await response.json();

  if (data.success) {
    window.location.href = "/login";
  } else if (data.notValidToken) {
    alertUser("Password reset token is invalid or has expired", "error");
  }
};


if (getOtpButton) {
  getOtpButton.addEventListener("click", getOtp);
}

if (otpField) {
  otpField.addEventListener("input", callVerifyOtp);
}

if (signupBtnContainer) {
  signupBtnContainer.addEventListener("click", alertInvalid);
}

if (rePasswordField) {
  rePasswordField.addEventListener("blur", checkPassword);
}

if (signupForm) {
  signupForm.addEventListener("submit", signupSubmit);
}

if (loginForm) {
  loginForm.addEventListener("submit", loginSubmit);
}

if (passwordForm) {
  passwordForm.addEventListener("submit", sendMail);
}
if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", changePassword);
}
