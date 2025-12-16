import "/js/utils/core.js";
import "/scss/pages/home/student/studentViewOfficer.scss";

import { getFirebaseToken } from "/js/utils/firebaseAuth.js";
import { getCurrentSession } from "/js/utils/sessionManager.js";

const officersGrid = document.querySelector(".officers-grid");
let userData = null;

/* -------------------------------------------------------------------------- */
/*                               INIT PAGE                                    */
/* -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", async () => {
  await verifyLogin();
  loadOfficers();
});

/* -------------------------------------------------------------------------- */
/*                           VERIFY STUDENT LOGIN                              */
/* -------------------------------------------------------------------------- */

async function verifyLogin() {
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";
}

/* -------------------------------------------------------------------------- */
/*                             FETCH OFFICERS API                              */
/* -------------------------------------------------------------------------- */

async function loadOfficers() {
  try {
    const token = await getFirebaseToken();
    const API = "https://ccsync-api-master-ll6mte.laravel.cloud/api";

    const res = await fetch(`${API}/officers`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!data.officers || data.officers.length === 0) {
      return showEmptyState();
    }

    displayOfficers(data.officers);
  } catch (error) {
    console.error("❌ Error loading officers:", error);
    showEmptyState();
  }
}

/* -------------------------------------------------------------------------- */
/*                           EMPTY STATE                                       */
/* -------------------------------------------------------------------------- */

function showEmptyState() {
  officersGrid.innerHTML = `
    <div class="text-center text-muted py-5 col-12">
      <p class="h5">No officers found</p>
    </div>
  `;
}

/* -------------------------------------------------------------------------- */
/*                           ROLE SORT ORDER                                   */
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
  /*                           RENDER OFFICERS                                   */
  /* -------------------------------------------------------------------------- */

  async function displayOfficers(officers) {
    officersGrid.innerHTML = "";

    // 🔹 SORT ONLY
    const sortedOfficers = [...officers].sort((a, b) => {
      return (ROLE_ORDER[a.role] ?? 999) - (ROLE_ORDER[b.role] ?? 999);
    });

    for (const officer of sortedOfficers) {
      const member = officer.member_info ?? {};
      const avatarUrl = await getProfilePicture(officer?.id);

      const card = document.createElement("div");
      card.className = "officer-card";

      card.innerHTML = `
      <div class="officer-image">
        <img src="${avatarUrl}" class="officer-avatar-img" alt="${escape(
        officer.name
      )}"/>
      </div>

      <div class="officer-content">
        <h3 class="officer-name">${escape(officer.name)}</h3>
        <p class="officer-position">${formatRole(officer.role)}</p>
        <p class="officer-year">
          ${member.year || "Year N/A"} ${member.program || ""}
        </p>

        <div class="officer-contact">
          <div class="contact-item">
            <span>📧</span>
            <span>${member?.user?.email || "No email available"}</span>
          </div>
          <div class="contact-item">
            <span>📱</span>
            <span>${member.phone || "No phone number"}</span>
          </div>
        </div>
      </div>
    `;

      officersGrid.appendChild(card);
    }
  };

/* -------------------------------------------------------------------------- */
/*                           PROFILE PICTURE                                   */
/* -------------------------------------------------------------------------- */

async function getProfilePicture(memberId) {
  try {
    const token = await getFirebaseToken();
    const API = "https://ccsync-api-master-ll6mte.laravel.cloud/api";

    const res = await fetch(`${API}/profile/${memberId}/profile-picture`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    return data.success
      ? data.data
      : "https://placehold.co/400x400?text=OFFICER";
  } catch {
    return "https://placehold.co/400x400?text=OFFICER";
  }
}

/* -------------------------------------------------------------------------- */
/*                                 HELPERS                                     */
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
