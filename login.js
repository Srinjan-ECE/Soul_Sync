const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

// ✅ Handle Google login response
function handleCredentialResponse(response) {
  const token = response.credential;

  fetch("http://localhost:3000/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Google login success:", data);
    alert(`Welcome ${data.user.name}`);
    localStorage.setItem("user", JSON.stringify(data.user));
  })
  .catch(err => console.error("Google login failed:", err));
}
window.handleCredentialResponse = handleCredentialResponse;

// ✅ Handle normal SignUp
document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  fetch("http://localhost:3000/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || "Account created!");
  })
  .catch(err => console.error("Signup error:", err));
});

// ✅ Handle normal SignIn
document.getElementById("signin-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;

  fetch("http://localhost:3000/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`Welcome back ${data.user.name}`);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      alert("Invalid credentials");
    }
  })
  .catch(err => console.error("Signin error:", err));
});
