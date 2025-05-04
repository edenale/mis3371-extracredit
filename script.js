// script.js – Extra Credit JS Enhancements

// Cookie functions
function setCookie(name, value, hours) {
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const c of cookies) {
    if (c.startsWith(name + "=")) {
      return c.split("=")[1];
    }
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// Local Storage
function saveToLocalStorage() {
  const form = document.getElementById("patientForm");
  const data = {};
  for (const el of form.elements) {
    if (el.name && (el.type !== "submit" && el.type !== "reset")) {
      data[el.name] = el.type === "checkbox" || el.type === "radio" ? el.checked : el.value;
    }
  }
  localStorage.setItem("formData", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem("formData");
  if (saved) {
    const form = document.getElementById("patientForm");
    const data = JSON.parse(saved);
    for (const key in data) {
      const el = form.elements[key];
      if (el) {
        if (el.type === "checkbox" || el.type === "radio") {
          el.checked = data[key];
        } else {
          el.value = data[key];
        }
      }
    }
  }
}

function clearLocalStorage() {
  localStorage.removeItem("formData");
}

// Welcome Message & Modal
function initializePage() {
  const storedName = getCookie("firstName");
  const welcome = document.getElementById("welcomeMessage");
  const nameField = document.getElementById("first_name");
  const newUserLabel = document.getElementById("newUserLabel");
  const storedNameSpan = document.getElementById("storedName");

  if (storedName) {
    welcome.innerText = `Welcome back, ${storedName}`;
    nameField.value = storedName;
    storedNameSpan.innerText = storedName;
    newUserLabel.style.display = "inline";
    loadFromLocalStorage();
  } else {
    welcome.innerText = "Welcome new user";
    newUserLabel.style.display = "none";
  }

  document.getElementById("patientForm").addEventListener("input", saveToLocalStorage);
}

function resetUser() {
  deleteCookie("firstName");
  clearLocalStorage();
  document.getElementById("patientForm").reset();
  document.getElementById("welcomeMessage").innerText = "Welcome new user";
  document.getElementById("newUserLabel").style.display = "none";
}

function handleSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("first_name").value.trim();
  const remember = document.getElementById("rememberMe").checked;

  if (remember && name) {
    setCookie("firstName", name, 48);
    saveToLocalStorage();
  } else {
    deleteCookie("firstName");
    clearLocalStorage();
  }

  // Simulate recaptcha check (real API integration needed)
  alert("Form submitted successfully!");
  window.location.href = "thankyou.html";
}

// Modal Review
function showReviewModal() {
  const modal = document.getElementById("reviewModal");
  const form = document.getElementById("patientForm");
  const output = document.getElementById("reviewContent");
  output.innerHTML = `<h3>Review Your Information</h3><ul>
    <li><strong>Name:</strong> ${form.first_name.value}</li>
    <li><strong>Email:</strong> ${form.email.value}</li>
    <li><strong>Phone:</strong> ${form.phone.value}</li>
    <li><strong>City:</strong> ${form.city.value}</li>
    <li><strong>Zip:</strong> ${form.zip.value}</li>
    <li><strong>User ID:</strong> ${form.userid.value}</li>
  </ul>`;
  modal.style.display = "block";
}

function closeReviewModal() {
  document.getElementById("reviewModal").style.display = "none";
}
