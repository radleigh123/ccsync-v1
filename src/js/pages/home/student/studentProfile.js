import "/js/utils/core.js";
import "/scss/pages/home/student/studentProfile.scss";
import { getCurrentSession } from "/js/utils/sessionManager";

/* -------------------------------------------------------------------------- */
/*                               INIT PAGE                                     */
/* -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", async () => {
  await verifyLogin();
  attachModalEvents();
});

/* -------------------------------------------------------------------------- */
/*                        CHECK IF STUDENT IS LOGGED IN                        */
/* -------------------------------------------------------------------------- */

async function verifyLogin() {
    //commented out for testing purposes
//   const user = await getCurrentSession();
//   if (!user) window.location.href = "/pages/auth/login.html";
}

/* -------------------------------------------------------------------------- */
/*                         MODAL FUNCTIONALITY                                 */
/* -------------------------------------------------------------------------- */

// Open Edit Profile Modal
function openEditModal() {
  document.getElementById("editModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close Edit Profile Modal
function closeEditModal() {
  document.getElementById("editModal").classList.remove("active");
  document.body.style.overflow = "auto";
}

// Save Profile (placeholder logic)
function saveProfile() {
  alert("Profile updated successfully!");
  closeEditModal();
}

// Open Change Password Modal
function openPasswordModal() {
  document.getElementById("passwordModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close Change Password Modal
function closePasswordModal() {
  document.getElementById("passwordModal").classList.remove("active");
  document.body.style.overflow = "auto";
}

// Update Password Logic
function changePassword() {
  const form = document.getElementById("changePasswordForm");
  const inputs = form.querySelectorAll("input");

  const newPassword = inputs[1].value;
  const confirmPassword = inputs[2].value;

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match!");
    return;
  }

  alert("Password changed successfully!");
  closePasswordModal();
  form.reset();
}

/* -------------------------------------------------------------------------- */
/*                       ATTACH EVENTS TO BUTTONS                              */
/* -------------------------------------------------------------------------- */

function attachModalEvents() {
  // Buttons inside sidebar
  const editBtn = document.querySelector(".profile-actions .btn-primary");
  const passwordBtn = document.querySelector(".profile-actions .btn-secondary");

  if (editBtn) editBtn.addEventListener("click", openEditModal);
  if (passwordBtn) passwordBtn.addEventListener("click", openPasswordModal);

  // Close buttons in headers
  const editCloseBtn = document.querySelector("#editModal .modal-close");
  const passwordCloseBtn = document.querySelector("#passwordModal .modal-close");

  if (editCloseBtn) editCloseBtn.addEventListener("click", closeEditModal);
  if (passwordCloseBtn) passwordCloseBtn.addEventListener("click", closePasswordModal);

  // Modal action buttons
  const saveChangesBtn = document.querySelector("#editModal .btn-primary");
  const cancelEditBtn = document.querySelector("#editModal .btn-cancel");

  const updatePasswordBtn = document.querySelector(
    "#passwordModal .btn-primary"
  );
  const cancelPasswordBtn = document.querySelector(
    "#passwordModal .btn-cancel"
  );

  if (saveChangesBtn) saveChangesBtn.addEventListener("click", saveProfile);
  if (cancelEditBtn) cancelEditBtn.addEventListener("click", closeEditModal);

  if (updatePasswordBtn)
    updatePasswordBtn.addEventListener("click", changePassword);
  if (cancelPasswordBtn)
    cancelPasswordBtn.addEventListener("click", closePasswordModal);

  // Clicking outside modal closes it
  window.addEventListener("click", (event) => {
    const editModal = document.getElementById("editModal");
    const passwordModal = document.getElementById("passwordModal");

    if (event.target === editModal) closeEditModal();
    if (event.target === passwordModal) closePasswordModal();
  });
}
