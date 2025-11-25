/**
 * View Officers Page Script
 * Direct API calls (NO api.js)
 * Consistent with viewEvent.js structure
 */

import "/js/utils/core.js";
import "/scss/pages/home/officer/viewOfficer.scss";
import { setSidebar } from "/components/js/sidebar";
import { setupLogout } from "/js/utils/navigation.js";
import { getCurrentSession } from "/js/utils/sessionManager.js";
import { getFirebaseToken } from "/js/utils/firebaseAuth.js";
import "bootstrap";
import { Modal } from "bootstrap";

const shimmer = document.getElementById("shimmerContainer");
const officerContainer = document.getElementById("officerContainer");

// INIT
document.addEventListener("DOMContentLoaded", async () => {
  await initHome();
  await setSidebar();
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

    const API = "http://localhost:8000/api"; // IMPORTANT!!!

    const res = await fetch(`${API}/officers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();
    console.log("🔴 RAW RESPONSE TEXT:", text);

    const data = JSON.parse(text); // must now be JSON

    displayOfficers(data.officers);
  } catch (error) {
    console.error("❌ Officers load error:", error);
    displayEmptyState();
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

function displayOfficers(officers = []) {
  const noUI = document.getElementById("noOfficerUI");

  if (officers.length === 0) return displayEmptyState();

  officerContainer.innerHTML = "";
  officerContainer.style.display = "grid";
  if (noUI) noUI.style.display = "none";

  officers.forEach((officer, index) => {
    const member = officer.member_info ?? null;
    const memberId = member?.id ?? officer.id;

    const program = member?.program ?? "Unknown Program";
    const year = member?.year ? `${member.year} Year` : "N/A";

    const profilePicture =
      member?.profile ??
      officer?.profile ??
      officer?.avatar ??
      "/images/default-avatar.png";

    const card = document.createElement("div");
    card.className = "officer-card";

    card.innerHTML = `
      <img src="${profilePicture}" class="officer-img" />

      <div class="officer-info">
        <h5>${escape(officer.name)}</h5>
        <p>${escape(program)} - ${escape(year)}</p>
      </div>

      <div class="officer-position">
        <h5>${formatRole(officer.role)}</h5>
      </div>

      <div class="officer-actions d-flex gap-2 mt-2">
        <button class="btn btn-warning btn-sm" data-id="${memberId}">Edit</button>
        <button class="btn btn-danger btn-sm" data-id="${memberId}">Remove</button>
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
      alert("Officer updated!");
      location.reload();
    } else {
      alert(data.message || "Failed to update officer");
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
      alert("Officer removed!");
      location.reload();
    } else {
      alert(data.message || "Failed to remove officer");
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
    .replace(/-/g, " ") // convert "vice-president" → "vice president"
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
