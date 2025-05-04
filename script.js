function setCookie(name, value, hours) {
  const expires = new Date(Date.now() + hours * 3600000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let c of cookies) {
    if (c.startsWith(name + "=")) return c.split("=")[1];
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function saveToLocalStorage() {
  const form = document.getElementById("patientForm");
  const data = {};
  for (let el of form.elements) {
    if (el.name && el.type !== "submit") {
      data[el.name] = el.type === "checkbox" ? el.checked : el.value;
    }
  }
  localStorage.setItem("formData", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("formData") || "{}");
  const form = document.getElementById("patientForm");
  for (let key in data) {
    if (form.elements[key]) {
      if (form.elements[key].type === "checkbox") {
        form.elements[key].checked = data[key];
      } else {
        form.elements[key].value = data[key];
      }
    }
  }
}

function clearLocalStorage() {
  localStorage.removeItem("formData");
}

function initializePage() {
  const name = getCookie("firstName");
  const welcome = document.getElementById("welcomeMessage");
  const newUserLabel = document.getElementById("newUserLabel");
  const storedNameSpan = document.getElementById("storedName");

  if (name) {
    welcome.textContent = `Welcome back, ${name}`;
    document.getElementById("first_name").value = name;
    storedNameSpan.textContent = name;
    newUserLabel.style.display = "inline";
    loadFromLocalStorage();
  } else {
    welcome.textContent = "Welcome new user";
    newUserLabel.style.display = "none";
  }

  document.getElementById("patientForm").addEventListener("input", () => {
    saveToLocalStorage();
    updateProgressBar();
  });
  updateProgressBar();
}

function resetUser() {
  deleteCookie("firstName");
  clearLocalStorage();
  document.getElementById("patientForm").reset();
  document.getElementById("welcomeMessage").textContent = "Welcome new user";
  document.getElementById("newUserLabel").style.display = "none";
  updateProgressBar();
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
  window.location.href = "thankyou.html";
}

function detectCapsLock(event) {
  const warning = document.getElementById("capsWarning");
  warning.style.display = event.getModifierState("CapsLock") ? "block" : "none";
}

function showReviewModal() {
  const form = document.getElementById("patientForm");
  const review = `
    <strong>Name:</strong> ${form["first_name"].value}<br>
    <strong>Remember Me:</strong> ${form["rememberMe"].checked ? "Yes" : "No"}
  `;
  document.getElementById("reviewData").innerHTML = review;
  document.getElementById("reviewModal").style.display = "block";
}

function closeReviewModal() {
  document.getElementById("reviewModal").style.display = "none";
}

function confirmSubmit() {
  closeReviewModal();
  document.getElementById("patientForm").requestSubmit();
}

function updateProgressBar() {
  const form = document.getElementById("patientForm");
  const fields = [...form.elements].filter(el => el.tagName === "INPUT" && el.type !== "submit" && el.type !== "button");
  const filled = fields.filter(el => el.type === "checkbox" ? el.checked : el.value.trim() !== "").length;
  const percent = Math.round((filled / fields.length) * 100);
  document.getElementById("progressBar").style.width = `${percent}%`;
}

