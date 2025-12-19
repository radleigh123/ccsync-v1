export async function setupLogout() {
  const logoutLinks = Array.from(
    document.querySelectorAll("#logout-link, .logout-link")
  );
  if (!logoutLinks.length) return;

  const ensureConfirmationModal = () => {
    let modal = document.getElementById("confirmationModal");
    if (modal) return modal;

    const template = `
      <div id="confirmationBackdrop"></div>
      <div id="confirmationModal" class="confirmation-modal">
        <div class="confirmation-header">
          <h5 id="confirmationTitle"></h5>
          <button id="confirmationCloseBtn" class="close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="confirmation-body">
          <p class="message" id="confirmationMessage"></p>
          <div class="details" id="confirmationDetails"></div>
        </div>
        <div class="confirmation-footer" style="justify-content: center">
          <button id="confirmationNoBtn" class="no-btn">Cancel</button>
          <button id="confirmationYesBtn" class="yes-btn">Yes</button>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", template);
    return document.getElementById("confirmationModal");
  };

  const onLogoutClick = async (e) => {
    e.preventDefault();

    // Helper to perform the actual logout
    const performLogout = async () => {
      try {
        const { auth } = await import("/js/utils/firebaseAuth.js");
        const { signOut } = await import("firebase/auth");

        // Clear local state (idempotent)
        localStorage.removeItem("user");
        localStorage.removeItem("member");
        localStorage.removeItem("ccsync_active_sidebar_href");
        localStorage.removeItem("ccsync_active_sidebar_text");

        try {
          console.log("🔐 Signing out from Firebase...");
          await signOut(auth);
          console.log("✓ Firebase signOut successful");
        } catch (error) {
          console.error("⚠️ Firebase signOut error:", error);
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
    };

    // Try to use shared confirmation modal if present; fallback to native confirm
    try {
      const modalEl = document.getElementById("confirmationModal");
      const ensuredModal = modalEl || ensureConfirmationModal();
      if (ensuredModal) {
        const { confirmationModal } = await import(
          "/js/utils/confirmationModal.js"
        );
        confirmationModal.show("Log out", "Are you sure you want to log out?", {
          yesText: "Log out",
          noText: "Cancel",
          yesVariant: "danger",
          onYes: () => {
            performLogout();
          },
        });
      } else {
        const ok = window.confirm("Are you sure you want to log out?");
        if (ok) await performLogout();
      }
    } catch (err) {
      console.error("Confirmation failed, proceeding with safe fallback", err);
      const ok = window.confirm("Are you sure you want to log out?");
      if (ok) await performLogout();
    }
  };

  logoutLinks.forEach((link) => {
    link.addEventListener("click", onLogoutClick);
  });
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
