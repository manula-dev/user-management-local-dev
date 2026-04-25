const API = "https://user-management-backend-production-418e.up.railway.app";

// protect dashboard
if (window.location.pathname.includes("dashboard.html")) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
  }
}
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

async function register() {
  const errorEl = document.getElementById("error");
  const spinner = document.getElementById("spinner");

  errorEl.textContent = "";
  spinner.classList.add("active");

  try {
    const res = await fetch(`${API}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      })
    });

    const data = await res.json();
    if (res.ok) {
    alert("Registration successful!");
    } else {
    alert(data.message || "Registration failed");
    }

    spinner.classList.remove("active");

    if (!res.ok) {
      errorEl.textContent = data.error || "Register failed";
      return;
    }

    window.location.href = "login.html";

  } catch (err) {
    spinner.classList.remove("active");
    errorEl.textContent = "Server error";
    console.error(err); // IMPORTANT
  }
}




async function login() {
  const spinner = document.getElementById("spinner");
  const errorEl = document.getElementById("error");
  const btn = document.getElementById("loginBtn");

  if (errorEl) errorEl.textContent = "";
  if (spinner) spinner.classList.add("active");
  if (btn) btn.disabled = true;

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("email")?.value,
        password: document.getElementById("password")?.value
      })
    });

    const data = await res.json();

    if (spinner) spinner.classList.remove("active");
    if (btn) btn.disabled = false;

    if (!res.ok) {
      if (errorEl) errorEl.innerText = data.error || "Login failed";
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";

  } catch (err) {
    if (spinner) spinner.classList.remove("active");
    if (btn) btn.disabled = false;
    if (errorEl) errorEl.innerText = "Server error";
    console.error(err);
  }
}



function toggleDark() {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark")
  );
}

// load saved theme
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}


async function loadProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
  window.location.href = "login.html";
}

  try {
    const res = await fetch(`${API}/users/me`, {
      method: "GET",
      headers: { 
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
      }
    });     

    const data = await res.json();
    const user = data.user; // import
    console.log(data);

    if (!res.ok) {
      alert(data.error || "Failed to load profile");
      return;
    }

    const userInfoDiv = document.getElementById("userInfo");

    userInfoDiv.innerHTML = `
    <h2>Welcome, ${user.name} 👋</h2>
    <img src="${API}/uploads/${user.image}" width="100" style="border-radius:50%" />
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Role:</strong> ${user.role}</p>
    `;
      // fill inputs
    document.getElementById("editName").value = user.name;
    document.getElementById("editEmail").value = user.email;
      // image preview
    document.getElementById("previewImg").src =
    `${API}/uploads/${user.image}`;
  
    document.getElementById("imageInput").addEventListener("change", function (e) {
    const file = e.target.files[0];

      if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
      document.getElementById("previewImg").src = event.target.result;
      };

      reader.readAsDataURL(file);
      }
    });  

    
  } catch (err) {
    console.error(err);  
  }
}   

async function updateProfile() {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("name", document.getElementById("editName").value);
  formData.append("email", document.getElementById("editEmail").value);

  const imageFile = document.getElementById("imageInput").files[0];
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch(`${API}/users/update`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token
      // ❌ DO NOT set Content-Type for FormData
    },
    body: formData
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Update failed");
    return;
  }

  alert("Profile updated successfully ✅");
  loadProfile(); // refresh UI
}




