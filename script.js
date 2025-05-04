function setCookie(name, value, hours) {
  const expires = new Date(Date.now() + hours * 3600000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const c of cookies) {
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
    if (el.name) {
      if (el.type === "checkbox" || el.type === "radio") {
        data[el.name] = el.checked;
      } else {
        data[el.name] = el.value;
      }
    }
  }
  localStorage.setItem("formData", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const saved = JSON.parse(localStorage.getItem("formData"));
  if (!saved) return;
  const form = document.getElementById("patientForm");
  for (let key in saved) {
    if (form.elements[key]) {
      if (form.elements[key].type === "checkbox" || form.elements[key].type === "radio") {
        form.elements[key].checked = saved[key];
      } else {
        form.elements[key].value = saved[key];
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
  const input = document.getElementById("first_name");
  const label = document.getElementById("newUserLabel");
  const storedName = document.getElementById("storedName");

  if (name) {
    welcome.innerText = `Welcome back, ${name}`;
    input.value = name;
    storedName.innerText = name;
    label.style.display = "inline";
    loadFromLocalStorage();
  } else {
    welcome.innerText = "Welcome new user";
    label.style.display = "none";
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

  alert("Form submitted!");
  window.location.href = "thankyou.html";
  return false;
}

function showReview() {
  const form = document.getElementById("patientForm");
  const data = `
    <p><strong>Name:</strong> ${form["first_name"].value}</p>
    <p><strong>Email:</strong> ${form["email"].value}</p>
    <p><strong>Phone:</strong> ${form["phone"].value}</p>
    <p><strong>User ID:</strong> ${form["userid"].value}</p>
  `;
  document.getElementById("reviewData").innerHTML = data;
  document.getElementById("reviewSection").style.display = "flex";
}

function closeReview() {
  document.getElementById("reviewSection").style.display = "none";
}

function submitFromReview() {
  document.getElementById("reviewSection").style.display = "none";
  document.getElementById("patientForm").requestSubmit();
}

