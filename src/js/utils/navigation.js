export async function setupLogout() {
    const logout = document.querySelector("#logout-link");
    if (logout) {
        logout.addEventListener("click", async (e) => {
            e.preventDefault();
            
            try {
                // Import Firebase auth module
                const { auth } = await import('/js/utils/firebaseAuth.js');
                const { signOut } = await import('firebase/auth');
                
                // Get user data for logging
                const userData = JSON.parse(localStorage.getItem("user"));
                const userId = userData?.user?.id || null;
                const firebaseToken = userData?.firebase_token || null;

                // Clear local state
                localStorage.removeItem("user");
                localStorage.removeItem("member");
                localStorage.removeItem("ccsync_active_sidebar_href");
                localStorage.removeItem("ccsync_active_sidebar_text");
                
                // CRITICAL: Sign out from Firebase
                try {
                    console.log("🔐 Signing out from Firebase...");
                    await signOut(auth);
                    console.log("✓ Firebase signOut successful");
                } catch (error) {
                    console.error("⚠️ Firebase signOut error:", error);
                    // Continue anyway - try to redirect
                }
                
                console.log("✓ All logout procedures completed, redirecting...");
                window.location.href = "/pages/auth/login.html";
                
            } catch (error) {
                console.error("Error in logout handler:", error);
                // Fallback: just clear localStorage and redirect
                localStorage.removeItem("user");
                localStorage.removeItem("member");
                window.location.href = "/pages/auth/login.html";
            }
        });
    }
}

export async function setupNavigation() {
    const nav = document.querySelector("#navbarNav ul");

    if (!nav) return;

    const user = localStorage.getItem("user");
    // console.log("user in navigation:", user);
    // 
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
