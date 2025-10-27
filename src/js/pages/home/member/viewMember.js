import "/js/utils/core.js";
import "/scss/pages/home/member/viewMember.scss";
import { setSidebar } from "/components/js/sidebar";
import { getCurrentSession } from "/js/utils/sessionManager";

let userData = null;
let allMembers = []; // Store all members from API
let currentPage = 1;
let currentLimit = 20; // Items per page
let paginationData = null;

// Filter state
let searchText = ""; // Tier 1: Text search
let selectedYear = "all"; // Tier 2: Year level filter
let selectedProgram = "all"; // Tier 2: Program filter

document.addEventListener("DOMContentLoaded", async () => {
  await initHome();
  setSidebar();
  setupSearchFilter();
  setupYearFilter();
  setupProgramFilter();
  setupPaginationButtons();
  loadMembers();
});

async function initHome() {
  // Get logged-in user data
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";
}

async function loadMembers(page = 1) {
  try {
    // Show loading state
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = '<tr><td colspan="3" class="text-center py-4">Loading...</td></tr>';

    // Call API with pagination parameters
    const response = await fetch(
      `/ccsync-api-plain/member/getMembers.php?page=${page}&limit=${currentLimit}`,
      {
        headers: {
          Authorization: `Bearer ${userData.firebase_token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    
    // Check if members exists and has data
    if (data.success && data.members && data.members.length > 0) {
      allMembers = data.members;
      paginationData = data.pagination;
      currentPage = paginationData.page;
    } else {
      allMembers = [];
      paginationData = null;
    }

    // Apply all filters and display
    applyAllFilters();
    updatePaginationControls();
  } catch (error) {
    console.error("Error fetching members:", error);
    allMembers = [];
    displayMembers([]);
  }
}

// ============================================
// TIER 1: Text Search Filter Setup
// ============================================
function setupSearchFilter() {
  const searchInput = document.getElementById("searchInput");
  
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchText = e.target.value.toLowerCase().trim();
      applyAllFilters(); // Re-apply all filters
    });
  }
}

// ============================================
// TIER 2: Year Level Filter Setup
// ============================================
function setupYearFilter() {
  const yearFilterMenu = document.getElementById("yearFilterMenu");
  const yearFilterLabel = document.getElementById("yearFilterLabel");

  if (yearFilterMenu) {
    yearFilterMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        selectedYear = link.dataset.year;
        
        // Update button label
        const yearText =
          selectedYear === "all"
            ? "All"
            : selectedYear === "1"
              ? "1st Year"
              : selectedYear === "2"
                ? "2nd Year"
                : selectedYear === "3"
                  ? "3rd Year"
                  : "4th Year";
        
        if (yearFilterLabel) {
          yearFilterLabel.textContent = `Year Level: ${yearText}`;
        }

        applyAllFilters(); // Re-apply all filters
      });
    });
  }
}

// ============================================
// TIER 2: Program Filter Setup
// ============================================
function setupProgramFilter() {
  const programFilterMenu = document.getElementById("programFilterMenu");
  const programFilterLabel = document.getElementById("programFilterLabel");

  if (programFilterMenu) {
    programFilterMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        selectedProgram = link.dataset.program;
        
        // Update button label
        const programText =
          selectedProgram === "all"
            ? "All"
            : selectedProgram === "BSCS"
              ? "BSCS"
              : selectedProgram === "BSIS"
                ? "BSIS"
                : selectedProgram === "BSIT"
                  ? "BSIT"
                  : "BSCE";
        
        if (programFilterLabel) {
          programFilterLabel.textContent = `Program: ${programText}`;
        }

        applyAllFilters(); // Re-apply all filters
      });
    });
  }
}

// ============================================
// Combined Filtering Logic
// ============================================
function applyAllFilters() {
  let filtered = [...allMembers];

  // Apply Tier 1: Text Search (by name)
  if (searchText) {
    filtered = filtered.filter((member) => {
      const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
      return fullName.includes(searchText);
    });
  }

  // Apply Tier 2: Year Level Filter
  if (selectedYear !== "all") {
    filtered = filtered.filter((member) => {
      return member.year.toString() === selectedYear;
    });
  }

  // Apply Tier 2: Program Filter
  if (selectedProgram !== "all") {
    filtered = filtered.filter((member) => {
      return member.program === selectedProgram;
    });
  }

  // Display the filtered results
  displayMembers(filtered);
}

function setupPaginationButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (paginationData && paginationData.hasPrev) {
        loadMembers(currentPage - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (paginationData && paginationData.hasNext) {
        loadMembers(currentPage + 1);
      }
    });
  }
}

function updatePaginationControls() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageInfo = document.getElementById("pageInfo");

  if (paginationData) {
    // Update button states
    if (prevBtn) prevBtn.disabled = !paginationData.hasPrev;
    if (nextBtn) nextBtn.disabled = !paginationData.hasNext;

    // Update page info display
    if (pageInfo) {
      pageInfo.textContent = `Page ${paginationData.page} of ${paginationData.pages} (${paginationData.total} total members)`;
    }
  }
}

function displayMembers(members) {
  const tbody = document.getElementById("userTableBody");
  const memberCountElement = document.getElementById("memberCount");

  tbody.innerHTML = "";

  // Update the member count
  if (memberCountElement) {
    memberCountElement.textContent = members.length;
  }

  if (members.length > 0) {
    members.forEach((member, index) => {
      const fullName = `${member.first_name} ${member.last_name}${
        member.suffix ? " " + member.suffix : ""
      }`;

      const row = document.createElement("tr");
      row.className = "member-row";
      row.dataset.memberId = member.id;

      row.innerHTML = `
        <td class="ps-3 text-muted">${member.id_school_number || "N/A"}</td>
        <td class="ps-3">${fullName}</td>
        <td class="ps-3 text-center">${member.year}</td>
        <td class="ps-3 text-center">${member.program}</td>
      `;

      row.addEventListener("click", () => {
        handleMemberClick(member);
      });

      tbody.appendChild(row);

      setTimeout(() => {
        row.style.opacity = "1";
        row.style.transform = "translateY(0)";
      }, index * 50);
    });
  } else {
    const emptyRow = document.createElement("tr");
    emptyRow.className = "summary-row";
    let message = "No members found";
    
    if (searchText) {
      message = `No members found matching "${searchText}"`;
    } else if (selectedYear !== "all" || selectedProgram !== "all") {
      message = "No members found with selected filters";
    }

    emptyRow.innerHTML = `
      <td colspan="4" class="text-muted text-center py-4">
        ${message}
      </td>
    `;
    tbody.appendChild(emptyRow);
  }
}

function handleMemberClick(member) {
  // Add member click functionality here
  alert(`Member clicked: ${member.first_name} ${member.last_name}`); // Placeholder action
}
