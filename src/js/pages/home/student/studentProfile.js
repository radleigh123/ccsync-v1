import "/js/utils/core.js";
import "/scss/pages/home/student/studentProfile.scss";
import { getCurrentSession } from "/js/utils/sessionManager";
import { getFirebaseToken } from "../../../utils/firebaseAuth";
import { responseModal } from "/js/utils/errorSuccessModal.js";
import { confirmationModal } from "/js/utils/confirmationModal.js";
import { shimmerLoader } from "/js/utils/shimmerLoader.js";
import { setupLogout } from "/js/utils/navigation.js";

// Show body after styles are loaded
document.body.classList.add("loaded");

let userData = null;
let memberData = null;

/* -------------------------------------------------------------------------- */
/*                               UTILITY FUNCTIONS                            */
/* -------------------------------------------------------------------------- */

function setUserInfo(name, id) {
  const userName = document.getElementById("user-name");
  const userId = document.getElementById("user-id");

  if (userName) userName.textContent = name;
  if (userId) userId.textContent = id;
}

/* -------------------------------------------------------------------------- */
/*                               INIT PAGE                                     */
/* -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", async () => {
  // Show shimmer loaders on individual shimmer elements
  const shimmerElements = document.querySelectorAll(
    ".shimmer-line, .shimmer-avatar, .shimmer-stats"
  );
  shimmerElements.forEach((el) => {
    el.classList.add("shimmer");
  });

  setupLogout();
  await verifyLogin();
  await loadProfileData();
  // Only attempt to load avatar if member data is available
  if (memberData?.id) {
    await loadAvatar();
  }
  attachModalEvents();
});

/* -------------------------------------------------------------------------- */
/*                        CHECK IF STUDENT IS LOGGED IN                        */
/* -------------------------------------------------------------------------- */

async function verifyLogin() {
  //commented out for testing purposes
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";

  // Set user info in sidebar
  const userName = userData.name || "USER NAME";
  const userId = userData.id_school_number || "ID NUMBER";
  setUserInfo(userName, userId);
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
  responseModal.showSuccess("Success", "Profile updated successfully!", () => {
    closeEditModal();
  });
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
    responseModal.showError("Password Mismatch", "New passwords do not match!");
    return;
  }

  responseModal.showSuccess(
    "Password Changed",
    "Password changed successfully!",
    () => {
      closePasswordModal();
      form.reset();
    }
  );
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
  const passwordCloseBtn = document.querySelector(
    "#passwordModal .modal-close"
  );

  if (editCloseBtn) editCloseBtn.addEventListener("click", closeEditModal);
  if (passwordCloseBtn)
    passwordCloseBtn.addEventListener("click", closePasswordModal);

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

async function loadProfileData() {
  try {
    const token = await getFirebaseToken();
    const baseUrl = "https://ccsync-api-master-ll6mte.laravel.cloud/api";
    // const baseUrl = "http://localhost:8000/api";

    // Get the selected member's ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const selectedMemberId = urlParams.get("id");

    // Use selected member's ID if provided, otherwise use logged-in user's ID
    const idSchoolNumber = selectedMemberId || userData.id_school_number;

    const response = await fetch(
      `${baseUrl}/members/member?id_school_number=${idSchoolNumber}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 404) {
      // Student isn't registered as a member yet – stay on page and show message
      showErrorState();
      console.warn("User has not been registered as a member.");
      return;
    }

    const result = await response.json();

    if (result.success && result.data) {
      memberData = result.data;
      populateUI();
    } else {
      console.error("❌ Invalid API response:", result);
      showErrorState();
    }
  } catch (err) {
    console.error("❌ Error loading profile:", err.message);
    showErrorState();
  }
}

async function loadAvatar() {
  try {
    if (!memberData?.id) return;
    const token = await getFirebaseToken();
    const baseUrl = "https://ccsync-api-master-ll6mte.laravel.cloud/api";
    // const baseUrl = "http://localhost:8000/api";
    const memberId = memberData.id;
    const response = await fetch(
      `${baseUrl}/profile/${memberId}/profile-picture`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const result = await response.json();
    console.log(result);

    if (result.success && result.data) {
      const avatarUrl = result.data;
      populateAvatar(avatarUrl);
    } else {
      console.error("❌ Invalid API Profile Picture response:", result);
      // showErrorState();
    }
  } catch (err) {
    console.error("❌ Error loading profile picture:", err.message);
  }
}

function populateUI() {
  if (!memberData) return;

  const user = memberData.user || {};
  const fullName = `${memberData.first_name} ${memberData.middle_name || ""} ${
    memberData.last_name
  }`.trim();

  // First, remove shimmer classes from all elements that will display data
  const dataElements = document.querySelectorAll(
    ".info-value, .profile-name, .profile-role, .profile-year, .activity-title, .activity-desc, .activity-date, .activity-icon, .stat-number, .stat-label"
  );
  dataElements.forEach((el) => {
    el.classList.remove("shimmer-line");
    el.classList.remove("shimmer");
    el.classList.remove("shimmer-fade-out");
    el.classList.remove("stopped");
  });

  // Also remove shimmer from avatar and stats
  const avatarEl = document.querySelector(".profile-avatar");
  if (avatarEl) {
    avatarEl.classList.remove("shimmer-avatar");
    avatarEl.classList.remove("shimmer");
    avatarEl.classList.remove("shimmer-fade-out");
    avatarEl.classList.remove("stopped");
  }

  const statsEl = document.querySelector(".profile-stats");
  if (statsEl) {
    statsEl.classList.remove("shimmer-stats");
    statsEl.classList.remove("shimmer");
    statsEl.classList.remove("shimmer-fade-out");
    statsEl.classList.remove("stopped");
  }

  // Now populate all the text content
  // Personal Information
  const infoItems = document
    .querySelectorAll(".info-grid")[0]
    .querySelectorAll(".info-item");
  infoItems[0].querySelector(".info-value").textContent = fullName;
  infoItems[1].querySelector(".info-value").textContent =
    memberData.id_school_number || "N/A";
  infoItems[2].querySelector(".info-value").textContent = user.email || "N/A";
  infoItems[3].querySelector(".info-value").textContent =
    memberData.phone || "N/A";
  infoItems[4].querySelector(".info-value").textContent = `${
    memberData.year
  }${getOrdinalSuffix(memberData.year)} Year`;
  infoItems[5].querySelector(".info-value").textContent =
    memberData.program || "N/A";

  // Academic Information
  const academicItems = document
    .querySelectorAll(".info-grid")[1]
    .querySelectorAll(".info-item");
  academicItems[0].querySelector(".info-value").textContent =
    "College of Computer Studies";
  academicItems[1].querySelector(".info-value").textContent =
    memberData.program || "N/A";
  academicItems[2].querySelector(".info-value").textContent = memberData.is_paid
    ? "Regular"
    : "Pending";
  academicItems[3].querySelector(".info-value").textContent =
    memberData.semester?.title || "N/A";

  // Sidebar
  document.querySelector(".profile-name").textContent = fullName;
  document.querySelector(".profile-role").textContent = "Student Member";
  document.querySelector(".profile-year").textContent = `${
    memberData.year
  }${getOrdinalSuffix(memberData.year)} Year ${memberData.program}`;

  // Show profile actions after data loads
  setTimeout(() => {
    const profileActions = document.getElementById("profileActions");
    if (profileActions) {
      profileActions.style.display = "flex";
    }
  }, 450);

  // Edit Form Modal - Pre-fill with current data
  populateEditForm();
}

function populateAvatar(url) {
  const avatarElement = document.querySelector(".profile-avatar");
  if (avatarElement && url) {
    avatarElement.style.backgroundImage = `url('${url}')`;
    avatarElement.style.backgroundSize = "cover";
    avatarElement.style.backgroundPosition = "center";
    avatarElement.textContent = "";
  }
}

function populateEditForm() {
  if (!memberData) return;

  const form = document.getElementById("editProfileForm");
  const inputs = form.querySelectorAll("input, select");

  inputs[0].value = memberData.first_name || "";
  inputs[1].value = memberData.last_name || "";
  inputs[2].value = memberData.user?.email || "";
  inputs[3].value = memberData.phone || "";

  // Year Level
  const yearSelect = form.querySelector("select[required]");
  if (yearSelect) yearSelect.value = memberData.year || "1";

  // Program
  const programSelect = form.querySelectorAll("select")[1];
  if (programSelect) {
    const programValue =
      memberData.program?.toLowerCase().replace(" ", "") || "bsit";
    programSelect.value = programValue;
  }

  inputs[inputs.length - 1].value = memberData.program || "";
}

function showErrorState() {
  const mainContent = document.querySelector(".profile-main");
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="error-state" style="padding: 2rem; text-align: center; background: #fff3cd; border-radius: 8px; margin: 2rem 0;">
        <p style="color: #856404; margin: 0;">⚠️ Unable to load profile data. Please refresh the page.</p>
      </div>
    `;
  }
}

function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}
