import "/js/utils/core.js";
import "/scss/pages/home/student/studentViewOfficer.scss";

import { getFirebaseToken } from "/js/utils/firebaseAuth.js";
import { getCurrentSession } from "/js/utils/sessionManager.js";

// Show body after styles are loaded
document.body.classList.add("loaded");

const officersGrid = document.querySelector(".officers-grid");
let userData = null;

// Simple session cache so returning to this page is instant
const CACHE_KEY = "studentViewOfficer:v1";
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

/* -------------------------------------------------------------------------- */
/*                               INIT PAGE                                    */
/* -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", async () => {
  // Render instantly from cache if available
  const cached = tryShowFromCache();

  // Verify session, then refresh in the background
  await verifyLogin();

  // Only fetch if cache is missing or stale
  if (!cached) {
    loadOfficers();
  }
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

    // Pass token so we don't re-fetch it per officer
    await displayOfficers(data.officers, token);

    // Cache rendered HTML for instant subsequent loads
    safeSetCache({ html: officersGrid.innerHTML, ts: Date.now() });
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

async function displayOfficers(officers, token) {
  officersGrid.innerHTML = "";

  // 🔹 SORT ONLY
  const sortedOfficers = [...officers].sort((a, b) => {
    return (ROLE_ORDER[a.role] ?? 999) - (ROLE_ORDER[b.role] ?? 999);
  });

  // 🔹 Fetch profile pictures IN PARALLEL and reuse token
  const avatarUrls = await Promise.all(
    sortedOfficers.map((o) => getProfilePicture(o?.id, token))
  );

  const frag = document.createDocumentFragment();
  sortedOfficers.forEach((officer, idx) => {
    const member = officer.member_info ?? {};
    const avatarUrl = avatarUrls[idx];

    const card = document.createElement("div");
    card.className = "officer-card";

    card.innerHTML = `
        <div class="officer-image">
          <img src="${avatarUrl}" loading="lazy" class="officer-avatar-img" alt="${escape(
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

    frag.appendChild(card);
  });

  officersGrid.appendChild(frag);
}

/* -------------------------------------------------------------------------- */
/*                           PROFILE PICTURE                                   */
/* -------------------------------------------------------------------------- */

async function getProfilePicture(memberId, token) {
  try {
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

/* -------------------------------------------------------------------------- */
/*                               CACHING HELPERS                               */
/* -------------------------------------------------------------------------- */

function tryShowFromCache() {
  try {
    const cached = safeGetCache();
    if (cached && typeof cached.html === "string") {
      officersGrid.innerHTML = cached.html;
      return cached; // Return cache object if found
    }
  } catch {}
  return null; // Return null if no valid cache
}

function safeGetCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.ts !== "number") return null;
    const isFresh = Date.now() - parsed.ts < CACHE_TTL_MS;
    return isFresh ? parsed : null;
  } catch {
    return null;
  }
}

function safeSetCache(value) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(value));
  } catch {}
}
