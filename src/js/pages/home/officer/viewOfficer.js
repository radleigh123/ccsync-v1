/**
 * View Officers Page Script
 * Direct API calls (NO api.js)
 * Consistent with viewEvent.js structure
 */

import "/js/utils/core.js";
import "/scss/pages/home/officer/viewOfficer.scss";
// import { setSidebar } from "/components/js/sidebar";
import { setupLogout } from "/js/utils/navigation.js";
import { getCurrentSession } from "/js/utils/sessionManager.js";
import { getFirebaseToken } from "/js/utils/firebaseAuth.js";
import { responseModal } from "/js/utils/errorSuccessModal.js";
import "bootstrap";
import { Modal } from "bootstrap";

const shimmer = document.getElementById("shimmerContainer");
const officerContainer = document.getElementById("officerContainer");

// INIT
document.addEventListener("DOMContentLoaded", async () => {
  await initHome();
  // await setSidebar();
  setupLogout();
  loadOfficers();
});

/* -------------------------------------------------------------------------- */
/*                            VERIFY LOGIN SESSION                             */
/* -------------------------------------------------------------------------- */

async function initHome() {
  const user = await getCurrentSession();
  if (!user) window.location.href = "/pages/auth/login.html";
}

/* -------------------------------------------------------------------------- */
/*                              LOAD OFFICERS API                               */
/* -------------------------------------------------------------------------- */

async function loadOfficers() {
  try {
    console.log("📋 Fetching officers...");

    const token = await getFirebaseToken();
    console.log("🟦 Firebase Token:", token);

    const API = "https://ccsync-api-master-ll6mte.laravel.cloud/api";

    const res = await fetch(`${API}/officers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();
    console.log("🔴 RAW RESPONSE TEXT:", text);

    const data = JSON.parse(text);

    displayOfficers(data.officers);

    // Hide shimmer and show officers
    setTimeout(() => {
      shimmer.style.display = "none";
      officerContainer.style.display = "grid";
    }, 300);
  } catch (error) {
    console.error("❌ Officers load error:", error);
    displayEmptyState();
    
    // Hide shimmer on error
    setTimeout(() => {
      shimmer.style.display = "none";
    }, 300);
  }
}

/* -------------------------------------------------------------------------- */
/*                                EMPTY STATE UI                               */
/* -------------------------------------------------------------------------- */

function displayEmptyState() {
  shimmer.style.display = "none";
  officerContainer.style.display = "none";

  const noUI = document.getElementById("noOfficerUI");
  if (noUI) noUI.style.display = "block";
}

/* -------------------------------------------------------------------------- */
/*                              RENDER OFFICERS                                 */
/* -------------------------------------------------------------------------- */

const ROLE_PRIORITY = {
  president: 1,
  "vice-president": 2,
  "vice president": 2,
  secretary: 3,
  treasurer: 4,
  auditor: 5,
  representative: 6,
  officer: 99, // always last
};

function displayOfficers(officers = []) {
  // Sort officers by role priority
  officers.sort((a, b) => {
    const roleA = (a.role || "").toLowerCase();
    const roleB = (b.role || "").toLowerCase();

    const priorityA = ROLE_PRIORITY[roleA] ?? 50;
    const priorityB = ROLE_PRIORITY[roleB] ?? 50;

    return priorityA - priorityB;
  });

  officers.sort((a, b) => {
    const roleA = (a.role || "").toLowerCase();
    const roleB = (b.role || "").toLowerCase();

    const priorityA = ROLE_PRIORITY[roleA] ?? 50;
    const priorityB = ROLE_PRIORITY[roleB] ?? 50;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return a.name.localeCompare(b.name);
  });
  
  const noUI = document.getElementById("noOfficerUI");

  if (officers.length === 0) return displayEmptyState();

  officerContainer.innerHTML = "";
  officerContainer.style.display = "grid";
  if (noUI) noUI.style.display = "none";

  officers.forEach((officer) => {
    const member = officer.member_info ?? null;
    const memberId = member?.id ?? officer.id;

    const program = member?.program ?? "Unknown Program";
    const year = member?.year ? `${member.year} Year` : "N/A";

    const profilePicture =
      member?.profile ??
      officer?.profile ??
      officer?.avatar ??
      "/assets/no_profile.png";

    const card = document.createElement("div");
    card.className = "officer-card";

    card.innerHTML = `
      <img src="${profilePicture}" class="officer-img" alt="${escape(
      officer.name
    )}" />

      <div class="officer-info">
        <h5>${escape(officer.name)}</h5>
        <p>${escape(program)} - ${escape(year)}</p>
        
        <div class="officer-position">
          <h5>${formatRole(officer.role)}</h5>
        </div>
      </div>

      <div class="officer-actions">
        <button class="btn btn-warning" data-id="${memberId}">Edit</button>
        <button class="btn btn-danger" data-id="${memberId}">Remove</button>
      </div>
    `;

    // Fallback image
    card.querySelector(".officer-img").onerror = (e) => {
      e.target.src = "/images/default-avatar.png";
    };

    // Attach events
    card.querySelector(".btn-warning").onclick = () =>
      openEditOfficer(memberId, officer.role, officer.name);

    card.querySelector(".btn-danger").onclick = () =>
      openDeleteOfficer(memberId, officer.name);

    officerContainer.appendChild(card);
  });
}

/* -------------------------------------------------------------------------- */
/*                              MODAL HANDLERS                                 */
/* -------------------------------------------------------------------------- */

window.openEditOfficer = function (memberId, role, name) {
  window.editOfficerId = memberId;

  document.getElementById("editOfficerName").value = name;
  document.getElementById("editOfficerPosition").value = role;

  new Modal(document.getElementById("editOfficerModal")).show();
};

window.openDeleteOfficer = function (memberId, name) {
  window.deleteOfficerId = memberId;

  document.getElementById(
    "deleteOfficerText"
  ).innerHTML = `Remove <strong>${escape(name)}</strong> as officer?`;

  new Modal(document.getElementById("deleteOfficerModal")).show();
};

/* -------------------------------------------------------------------------- */
/*                         SAVE EDIT (PROMOTE OFFICER)                         */
/* -------------------------------------------------------------------------- */

document
  .getElementById("saveOfficerChanges")
  .addEventListener("click", async () => {
    const role = document.getElementById("editOfficerPosition").value;
    const token = await getFirebaseToken();

    const res = await fetch(`/api/role/${window.editOfficerId}/promote`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();

    if (res.ok) {
      responseModal.showSuccess("Officer Updated", "Officer role has been updated successfully.", () => {
        location.reload();
      });
    } else {
      responseModal.showError("Update Failed", data.message || "Failed to update officer");
    }
  });

/* -------------------------------------------------------------------------- */
/*                       DELETE OFFICER (DEMOTE TO STUDENT)                    */
/* -------------------------------------------------------------------------- */

document
  .getElementById("confirmDeleteOfficer")
  .addEventListener("click", async () => {
    const token = await getFirebaseToken();

    const res = await fetch(`/api/role/${window.deleteOfficerId}/demote`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "student" }),
    });

    const data = await res.json();

    if (res.ok) {
      responseModal.showSuccess("Officer Removed", "Officer has been successfully demoted to student.", () => {
        location.reload();
      });
    } else {
      responseModal.showError("Removal Failed", data.message || "Failed to remove officer");
    }
  });

/* -------------------------------------------------------------------------- */
/*                                HELPERS                                      */
/* -------------------------------------------------------------------------- */

function escape(str) {
  return typeof str === "string"
    ? str.replace(
        /[&<>"]/g,
        (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
      )
    : "";
}

function formatRole(role = "") {
  return role
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
