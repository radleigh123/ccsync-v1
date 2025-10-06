export function setupLogout() {
    const logout = document.querySelector("#logout-link");
    if (logout) {
        logout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user"); // clear state
            window.location.href = "/";
        });
    }
}

export async function setupNavigation() {
    const nav = document.querySelector("#navbarNav ul");

    if (!nav) return;

    const user = localStorage.getItem("user");
    console.log("user in navigation:", user);

    if (user) {
        nav.innerHTML = `
        <li class="nav-item">
            <a id="home-link" class="nav-link" href="/pages/home/home.html">Home</a>
        </li>
        <li class="nav-item">
            <a id="profile-link" class="nav-link" href="/pages/profile/profile.html">Profile</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#" id="logout-link">Logout</a>
        </li>
        `;
        setupLogout();
    } else {
        nav.innerHTML = `
        <li class="nav-item">
            <a class="nav-link" href="/pages/auth/register.html">Register</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/pages/auth/login.html">Login</a>
        </li>
        `;
    }
}
