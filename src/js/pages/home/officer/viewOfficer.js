/**
 * View Officers (ADMIN)
 * Same structure as studentViewOfficer.js
 * WITH getProfilePicture()
 */

import "/js/utils/core.js";
import "/scss/pages/home/officer/viewOfficer.scss";

import { setupLogout } from "/js/utils/navigation.js";
import { getFirebaseToken } from "/js/utils/firebaseAuth.js";
import { getCurrentSession } from "/js/utils/sessionManager.js";
import { responseModal } from "/js/utils/errorSuccessModal.js";
import { Modal } from "bootstrap";
import "bootstrap";

const shimmer = document.getElementById("shimmerContainer");
const officersGrid = document.getElementById("officerContainer");

let userData = null;
const API = "https://ccsync-api-master-ll6mte.laravel.cloud/api";

/* -------------------------------------------------------------------------- */
/*                                   INIT                                     */
/* -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", async () => {
  await verifyLogin();
  setupLogout();
  loadOfficers();
});

/* -------------------------------------------------------------------------- */
/*                               VERIFY LOGIN                                 */
/* -------------------------------------------------------------------------- */

async function verifyLogin() {
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";
}

/* -------------------------------------------------------------------------- */
/*                               FETCH OFFICERS                               */
/* -------------------------------------------------------------------------- */

async function loadOfficers() {
  try {
    const token = await getFirebaseToken();

    const res = await fetch(`${API}/officers`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!data.officers || data.officers.length === 0) {
      return showEmptyState();
    }

    await displayOfficers(data.officers);

    shimmer.style.display = "none";
    officersGrid.style.display = "grid";
  } catch (error) {
    console.error("❌ Error loading officers:", error);
    showEmptyState();
  }
}

/* -------------------------------------------------------------------------- */
/*                                EMPTY STATE                                 */
/* -------------------------------------------------------------------------- */

function showEmptyState() {
  shimmer.style.display = "none";
  officersGrid.innerHTML = `
    <div class="text-center text-muted py-5 col-12">
      <p class="h5">No officers found</p>
    </div>
  `;
}

/* -------------------------------------------------------------------------- */
/*                              ROLE SORT ORDER                               */
/* -------------------------------------------------------------------------- */

const ROLE_ORDER = {
  president: 1,
  "vice-president-internal": 2,
  "vice-president-external": 3,
  "vice-president": 2,
  secretary: 5,
  "assistant-secretary": 6,
  treasurer: 7,
  "assistant-treasurer": 8,
  auditor: 9,
  "PIO-internal": 10,
  "PIO-external": 11,
  "representative-1": 12,
  "representative-2": 13,
  "representative-3": 14,
  "representative-4": 15,
  representative: 16,
  officer: 17,
};

/* -------------------------------------------------------------------------- */
/*                               RENDER OFFICERS                              */
/* -------------------------------------------------------------------------- */

async function displayOfficers(officers) {
  officersGrid.innerHTML = "";

  const sortedOfficers = [...officers].sort(
    (a, b) => (ROLE_ORDER[a.role] ?? 999) - (ROLE_ORDER[b.role] ?? 999)
  );

  for (const officer of sortedOfficers) {
    const member = officer.member_info ?? {};
    const memberId = member?.id ?? officer.id;

    const profile = await getProfilePicture(memberId);

    const card = document.createElement("div");
    card.className = "officer-card";

    card.innerHTML = `
      <img src="${profile}" class="officer-img" alt="${escape(officer.name)}"/>

      <div class="officer-info text-center">
        <h5>${escape(officer.name)}</h5>
        <p>
          ${member.program || "Unknown Program"} - 
          ${member.year ? `${member.year} Year` : "N/A"}
        </p>

        <div class="officer-position">
          <h5>${formatRole(officer.role)}</h5>
        </div>
      </div>

      <div class="officer-actions">
        <button class="btn btn-warning btn-sm">Edit</button>
        <button class="btn btn-danger btn-sm">Remove</button>
      </div>
    `;

    card.querySelector(".officer-img").onerror = (e) => {
      e.target.src = "https://placehold.co/400x400?text=OFFICER";
    };

    card.querySelector(".btn-warning").onclick = () =>
      openEditOfficer(memberId, officer.role, officer.name);

    card.querySelector(".btn-danger").onclick = () =>
      openDeleteOfficer(memberId, officer.name);

    officersGrid.appendChild(card);
  }
}

/* -------------------------------------------------------------------------- */
/*                           PROFILE PICTURE API                               */
/* -------------------------------------------------------------------------- */

async function getProfilePicture(memberId) {
  try {
    const token = await getFirebaseToken();

    const res = await fetch(`${API}/profile/${memberId}/profile-picture`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    return data.success
      ? data.data
      : "https://placehold.co/400x400?text=OFFICER";
  } catch (error) {
    console.error("❌ Profile picture error:", error);
    return "https://placehold.co/400x400?text=OFFICER";
  }
}

/* -------------------------------------------------------------------------- */
/*                               MODALS                                       */
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
/*                               SAVE EDIT                                    */
/* -------------------------------------------------------------------------- */

document
  .getElementById("saveOfficerChanges")
  .addEventListener("click", async () => {
    const role = document.getElementById("editOfficerPosition").value;
    const token = await getFirebaseToken();

    const res = await fetch(`${API}/role/${window.editOfficerId}/promote`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();

    if (res.ok) {
      responseModal.showSuccess(
        "Officer Updated",
        "Officer role updated successfully.",
        () => location.reload()
      );
    } else {
      responseModal.showError(
        "Update Failed",
        data.message || "Failed to update officer"
      );
    }
  });

/* -------------------------------------------------------------------------- */
/*                               DELETE OFFICER                               */
/* -------------------------------------------------------------------------- */

document
  .getElementById("confirmDeleteOfficer")
  .addEventListener("click", async () => {
    const token = await getFirebaseToken();

    const res = await fetch(`${API}/role/${window.deleteOfficerId}/demote`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "student" }),
    });

    const data = await res.json();

    if (res.ok) {
      responseModal.showSuccess(
        "Officer Removed",
        "Officer demoted to student.",
        () => location.reload()
      );
    } else {
      responseModal.showError(
        "Removal Failed",
        data.message || "Failed to remove officer"
      );
    }
  });

/* -------------------------------------------------------------------------- */
/*                                 HELPERS                                    */
/* -------------------------------------------------------------------------- */

function escape(str) {
  return typeof str === "string"
    ? str.replace(
        /[&<>"]/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
          }[c])
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
