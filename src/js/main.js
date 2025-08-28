document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector("#navbarNav ul");

    const user = localStorage.getItem("user");

    if (user) {
        nav.innerHTML = `
          <li class="nav-item">
            <a class="nav-link active" href="/">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/ccsync-v1/pages/profile/profile.html">Profile</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" id="logout-link">Logout</a>
          </li>
        `;
    } else {
        nav.innerHTML = `
          <li class="nav-item">
            <a class="nav-link active" href="/">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/ccsync-v1/pages/auth/register.html">Register</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/ccsync-v1/pages/auth/login.html">Login</a>
          </li>
        `;
    }

    const logout = document.querySelector("#logout-link");
    if (logout) {
        logout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user"); // clear state
            window.location.href = "/";
        });
    }
});