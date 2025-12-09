/**
 * Add Officer Page Script
 *
 * Handles:
 *  - Live search of members
 *  - Selecting a member to promote
 *  - Promoting a member to officer/admin roles
 *  - Displaying success/error messages
 *
 * @author
 * CCSync Development Team
 * @version 2.0 (Firebase Auth + New API)
 */

import "/js/utils/core.js";
import "/scss/pages/home/officer/addOfficer.scss";
import { setSidebar } from "/components/js/sidebar";
import { setupLogout } from "/js/utils/navigation.js";
import { getFirebaseToken } from "/js/utils/firebaseAuth.js";
import "bootstrap";

/* ------------------------------- PAGE INIT ------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initAddOfficerPage();
  setSidebar();
  setupLogout();
});

/**
 * Initialize Add Officer Page
 */
function initAddOfficerPage() {
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "/pages/auth/login.html";
    return;
  }

  setupLiveSearch();
  setupAddOfficerForm();
}

const API = "https://ccsync-api-master-ll6mte.laravel.cloud/api"; 

/* --------------------------- LIVE MEMBER SEARCH -------------------------- */
function setupLiveSearch() {
  const searchInput = document.getElementById("memberSearch");
  const searchResults = document.getElementById("searchResults");

  searchInput.addEventListener("input", async function () {
    const query = this.value.trim();

    if (query.length < 1) {
      searchResults.style.display = "none";
      return;
    }

    try {
      const token = await getFirebaseToken();

      const response = await fetch(`${API}/members/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        console.error("Search error:", await response.text());
        return;
      }

      const members = await response.json();
      searchResults.innerHTML = "";

      if (!Array.isArray(members) || members.length === 0) {
        searchResults.style.display = "none";
        return;
      }

      members.forEach((member) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "list-group-item-action");
        li.textContent = `${member.first_name} ${member.last_name} (${member.id_school_number})`;

        li.addEventListener("click", () => {
          document.getElementById("memberSearch").value =
            `${member.first_name} ${member.last_name}`;
          document.getElementById("memberId").value = member.id;
          searchResults.style.display = "none";
        });

        searchResults.appendChild(li);
      });

      searchResults.style.display = "block";
    } catch (error) {
      console.error("Search error:", error);
    }
  });
}


/* -------------------------- ADD OFFICER PROMOTION -------------------------- */
function setupAddOfficerForm() {
  const button = document.getElementById("btnAddOfficer");

  button.addEventListener("click", async function () {
    const memberId = document.getElementById("memberId").value.trim();
    const role = document.getElementById("position").value.trim();

    if (!memberId || !role) {
      showMessage("All fields are required.", "danger");
      return;
    }

    try {
      const token = await getFirebaseToken();

      const response = await fetch(`${API}/role/${memberId}/promote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const result = await response.json();

      if (response.ok) {
        showMessage(result.message, "success");
        document.getElementById("addOfficerForm").reset();
      } else {
        showMessage(result.message || "Failed to promote member.", "danger");
      }
    } catch (error) {
      console.error("Promotion error:", error);
      showMessage("An error occurred. Please try again.", "danger");
    }
  });
}


/* --------------------------- MESSAGE HANDLING --------------------------- */

function showMessage(message, type) {
  const messageDiv = document.getElementById("message");
  if (!messageDiv) return;

  messageDiv.className = `alert alert-${type}`;
  messageDiv.textContent = message;
  messageDiv.style.display = "block";

  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 5000);
}
