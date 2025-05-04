function setCookie(name, value, hours) {
  const expires = new Date(Date.now() + hours * 3600000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp(name + "=([^;]+)"));
  return match ? match[1] : "";
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function saveToLocalStorage() {
  const form = document.getElementById("patientForm");
  const data = {};
  for (const el of form.elements) {
    if (el.name) {
      data[el.name] = el.type === "checkbox" ? el.checked : el.value;
    }
  }
  localStorage.setItem("formData", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("formData"));
  if (!data) return;
  const form = document.getElementById("patientForm");
  for (const key in data) {
    const el = form.elements[key];
    if (el) {
      if (el.type === "checkbox") {
        el.checked = data[key];
      } else {
        el.value = data[key];
      }
    }
  }
}

function clearLocalStorage() {
  localStorage.removeItem("formData");
}

function initializePage() {
  const storedName = getCookie("firstName");
  const welcome = document.getElementById("welcomeMessage");
  const nameBox = document.getElementById("first_name");
  const newUserLabel = document.getElementById("newUserLabel");
  const storedNameSpan = document.getElementById("storedName");

  if (storedName) {
    welcome.innerText = `Welcome back, ${storedName}`;
    nameBox.value = storedName;
    storedNameSpan.innerText = storedName;
    newUserLabel.style.display = "inline";
    loadFromLocalStorage();
  } else {
    welcome.innerText = "Welcome new user";
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
  const name = document.getElementById("first_name").value;
  if (document.getElementById("rememberMe").checked) {
    setCookie("firstName", name, 48);
    saveToLocalStorage();
  } else {
    deleteCookie("firstName");
    clearLocalStorage();
  }
  showReview(); // show modal before final submit
}

function showReview() {
  const form = document.getElementById("patientForm");
  const review = document.getElementById("reviewText");
  review.innerHTML = `
    <strong>Name:</strong> ${form.first_name.value}<br>
    <strong>User ID:</strong> ${form.first_name.value.toLowerCase()}<br>
  `;
  document.getElementById("reviewSection").style.display = "flex";
}

function goBack() {
  document.getElementById("reviewSection").style.display = "none";
}

function finalSubmit() {
  window.location.href = "thankyou.html";
}

function checkCapsLock(e) {
  const warning = document.getElementById("capsWarning");
  const capsOn = e.getModifierState && e.getModifierState("CapsLock");
  warning.textContent = capsOn ? "Caps Lock is ON" : "";
}


