import "/js/utils/core.js";
import "/scss/pages/home/student/studentViewOfficer.scss";

import { getFirebaseToken } from "/js/utils/firebaseAuth.js";
import { getCurrentSession } from "/js/utils/sessionManager.js";

const officerGridSections = document.querySelectorAll(".officers-grid");
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
  //commented out for testing purposes
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";
}

/* -------------------------------------------------------------------------- */
/*                             FETCH OFFICERS API                              */
/* -------------------------------------------------------------------------- */

async function loadOfficers() {
  try {
    console.log("📋 Fetching officers for student view...");

    const token = await getFirebaseToken();
    // TODO: Manual call, merge in one file like `utils/api.js`
    const API = "https://ccsync-api-master-ll6mte.laravel.cloud/api";
    // const API = "http://localhost:8000/api";

    const res = await fetch(`${API}/officers`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const text = await res.text();
    // console.log("🔴 RAW RESPONSE TEXT:", text);

    const data = JSON.parse(text);
    // console.log("🔵 JSON RESPONSE TEXT:", data);

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
/*                           SHOW EMPTY STATE UI                               */
/* -------------------------------------------------------------------------- */

function showEmptyState() {
  officerGridSections.forEach((section) => {
    section.innerHTML = `
      <div class="text-center text-muted py-5 col-12">
        <p class="h5">No officers found</p>
      </div>
    `;
  });
}

/* -------------------------------------------------------------------------- */
/*                           RENDER OFFICERS FOR STUDENT                       */
/* -------------------------------------------------------------------------- */

function displayOfficers(officers) {
  // 🔹 Find sections in HTML: Executive Board and Department Heads
  const sections = document.querySelectorAll(".officers-section");

  if (sections.length < 2) {
    console.warn("⚠️ Expected 2 officer sections, found:", sections.length);
  }

  const execBoardGrid = sections[0].querySelector(".officers-grid");
  const deptHeadGrid = sections[1].querySelector(".officers-grid");

  execBoardGrid.innerHTML = "";
  deptHeadGrid.innerHTML = "";

  officers.forEach(async (officer) => {
    const member = officer.member_info ?? {};

    // GET API profile picture
    const avatarUrl = await getProfilePicture(officer?.id);

    const card = document.createElement("div");
    card.className = "officer-card";

    console.log("member", member);

    card.innerHTML = `
      <div class="officer-image">
        <img src="${avatarUrl}" class="officer-avatar-img" alt="${escape(
      officer.name
    )}"/>
      </div>

      <div class="officer-content">
        <h3 class="officer-name">${escape(officer.name)}</h3>
        <p class="officer-position">${formatRole(officer.role)}</p>
        <p class="officer-year">${member.year || "Year N/A"} ${
      member.program || ""
    }</p>

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

    // Insert card depending on role
    if (
      officer.role === "president" ||
      officer.role === "vice-president" ||
      officer.role === "secretary" ||
      officer.role === "treasurer"
    ) {
      execBoardGrid.appendChild(card);
    } else {
      deptHeadGrid.appendChild(card);
    }
  });
}

async function getProfilePicture(memberId) {
  try {
    const token = await getFirebaseToken();
    // TODO: Manual call, merge in one file like `utils/api.js`
    const API = "https://ccsync-api-master-ll6mte.laravel.cloud/api";
    // const API = "http://localhost:8000/api";

    const res = await fetch(`${API}/profile/${memberId}/profile-picture`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    // console.log("🔵 JSON RESPONSE TEXT:", data);

    if (!data.success) {
      return "https://placehold.co/400x400?text=OFFICER";
    }

    return data.data;
  } catch (error) {
    console.error("❌ Error getting profile URL:", error);
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
