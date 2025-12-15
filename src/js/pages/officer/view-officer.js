import { getFirebaseToken } from "/js/firebase/firebase-auth.js";
import { responseModal } from '/js/utils/errorSuccessModal.js';
import { confirmationModal } from '/js/utils/confirmationModal.js';

const shimmer = document.getElementById("shimmerContainer");
const officerContainer = document.getElementById("officerContainer");

document.addEventListener("DOMContentLoaded", loadOfficers);

/**
 * Fetch officers from Laravel API
 */
async function loadOfficers() {
  try {
    const token = await getFirebaseToken();

    const response = await fetch("/api/officers/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      responseModal.showError('Error', 'Failed to load officers.');
      return;
    }

    displayOfficers(data.officers || []);
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 * Render officers into cards (robust version)
 */
function displayOfficers(officers = []) {
  // hide shimmer
  shimmer.style.display = "none";

  // ensure empty-state element exists
  const noOfficerUI = document.getElementById("noOfficerUI");
  if (!noOfficerUI) {
    console.warn("noOfficerUI element not found in DOM.");
  }

  // normalize officers
  if (!Array.isArray(officers) || officers.length === 0) {
    officerContainer.style.display = "none";
    if (noOfficerUI) noOfficerUI.style.display = "block";
    return;
  }

  // officers present
  if (noOfficerUI) noOfficerUI.style.display = "none";
  officerContainer.innerHTML = "";
  officerContainer.style.display = "grid";

  officers.forEach((officer, index) => {
    // Defensive: log officer shape if missing member_info occasionally
    if (!officer) {
      console.warn("Skipping null/undefined officer at index", index);
      return;
    }

    const member = officer.member_info ?? officer.member ?? null;

    // Attempt several places for an ID (be permissive)
    const memberId = member?.id ?? member?.user_id ?? officer.id ?? null;

    if (!memberId) {
      // Log for debugging — helps explain "Viewing details for officer ID: null"
      console.warn("No memberId found for officer object:", officer);
    }

    const program = member?.program ?? "Unknown Program";
    const year = member?.year ? `${member.year} Year` : "N/A";

    // Try several profile fields commonly used; fallback to public default
    const profilePicture =
      member?.profile ??
      officer?.profile ??
      officer?.avatar ??
      "/images/default-avatar.png";

    // Build card element
    const card = document.createElement("div");
    card.className = "officer-card";
    card.dataset.officerIndex = index;

    card.innerHTML = `
      <img src="${profilePicture}" class="officer-img" alt="${escapeHtml(officer.name ?? 'Officer')}" />
      <div class="officer-info">
        <h5 class="officer-name">${escapeHtml(officer.name ?? '—')}</h5>
        <p class="officer-year">${escapeHtml(program)} - ${escapeHtml(year)}</p>
      </div>
      <div class="officer-position">
        <h5>${escapeHtml(formatRole(officer.role ?? 'officer'))}</h5>
      </div>
      <div class="officer-actions d-flex gap-2 mt-2">
        <button class="btn btn-warning btn-sm btn-edit-officer" ${memberId ? `data-member-id="${memberId}"` : ""}>Edit</button>
        <button class="btn btn-danger btn-sm btn-delete-officer" ${memberId ? `data-member-id="${memberId}"` : ""}>Remove</button>
      </div>
    `;

    officerContainer.appendChild(card);

    // add listeners after appended
    const editBtn = card.querySelector(".btn-edit-officer");
    const delBtn = card.querySelector(".btn-delete-officer");

    editBtn.addEventListener("click", () => {
      const id = editBtn.dataset.memberId ?? null;
      if (!id) {
        console.warn("Edit clicked but memberId missing for officer:", officer);
        responseModal.showError('Error', 'Cannot edit this officer — missing member id.');
        return;
      }
      openEditOfficer(id, officer.role, officer.name);
    });

    delBtn.addEventListener("click", () => {
      const id = delBtn.dataset.memberId ?? null;
      if (!id) {
        console.warn("Delete clicked but memberId missing for officer:", officer);
        responseModal.showError('Error', 'Cannot remove this officer — missing member id.');
        return;
      }
      openDeleteOfficer(id, officer.name);
    });

    // optional: lazy-check image load and fallback if 404
    const img = card.querySelector(".officer-img");
    img.addEventListener("error", () => {
      img.src = "/src/assets/default_image.png"; 
      img.classList.add("avatar-fallback");
    });
  });
}

/**
 * small helper to safely escape text inserted into HTML strings
 */
function escapeHtml(s) {
  if (typeof s !== "string") return s ?? "";
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/**
 * OPEN EDIT MODAL (unchanged UX but safer)
 */
window.openEditOfficer = function (memberId, role, name) {
  // debug message (you have a log earlier showing null; now this will show actual value)
  console.log("Opening edit modal for memberId:", memberId);

  window.editOfficerId = memberId;
  document.getElementById("editOfficerName").value = name ?? "";
  document.getElementById("editOfficerPosition").value = role ?? "officer";

  // use bootstrap modal show
  const modalEl = document.getElementById("editOfficerModal");
  if (modalEl) new bootstrap.Modal(modalEl).show();
};

/**
 * OPEN DELETE MODAL
 */
window.openDeleteOfficer = function (memberId, name) {
  window.deleteOfficerId = memberId;
  const el = document.getElementById("deleteOfficerText");
  if (el) el.innerHTML = `Remove <strong>${escapeHtml(name ?? "")}</strong> as an officer?`;

  const modalEl = document.getElementById("deleteOfficerModal");
  if (modalEl) new bootstrap.Modal(modalEl).show();
};



/**
 * Format role title
 */
function formatRole(role) {
  return role
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

/**
 * SAVE EDIT
 */
document
  .getElementById("saveOfficerChanges")
  .addEventListener("click", async () => {
    const role = document.getElementById("editOfficerPosition").value;
    const token = await getFirebaseToken();

    const res = await fetch(`/api/role/${window.editOfficerId}/promote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();

    if (res.ok) {
      responseModal.showSuccess('Officer Updated', 'Officer updated successfully!', () => {
        location.reload();
      });
    } else {
      responseModal.showError('Update Failed', data.message);
    }
  });

/**
 * CONFIRM DELETE (DEMOTE)
 */
document
  .getElementById("confirmDeleteOfficer")
  .addEventListener("click", async () => {
    const token = await getFirebaseToken();

    const res = await fetch(`/api/role/${window.deleteOfficerId}/demote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: "student" }),
    });

    const data = await res.json();

    if (res.ok) {
      responseModal.showSuccess('Officer Removed', 'Officer removed successfully!', () => {
        location.reload();
      });
    } else {
      responseModal.showError('Removal Failed', data.message);
    }
  });
