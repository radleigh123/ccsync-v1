import "/js/utils/core.js";
import "/scss/pages/home/requirement/viewRequirement.scss";
// import { setSidebar } from "/components/js/sidebar";
import { getCurrentSession } from "/js/utils/sessionManager";
import { shimmerLoader } from "/js/utils/shimmerLoader";

let userData = null;
let allRequirements = []; // Store all requirements from API
let currentPage = 1;
let currentLimit = 20; // Items per page
let paginationData = null;

// Filter state
let searchText = ""; // Tier 1: Text search
let selectedStatus = "all"; // Tier 2: Status filter

document.addEventListener("DOMContentLoaded", async () => {
  await initHome();
  // setSidebar();
  setupSearchFilter();
  setupStatusFilter();
  setupPaginationButtons();
  loadRequirements();
});

async function initHome() {
  // Get logged-in user data
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";
}

async function loadRequirements(page = 1) {
  try {
    // Show loading state
    const tbody = document.getElementById("requirementTableBody");
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Loading...</td></tr>';
    }

    // Build query parameters
    let url = `https://ccsync-api-master-ll6mte.laravel.cloud/api/requirements/list?page=${page}&per_page=${currentLimit}`; // TODO: On laravel, add pagination
    if (selectedStatus !== "all") {
      url += `&status=${selectedStatus}`;
    }

    // Call API with pagination parameters
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${userData.firebase_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const json = await response.json();

    // Check if requirements exists and has data
    if (json.data && json.data.requirements.length > 0) {
      allRequirements = json.data.requirements;
      console.log(allRequirements);
      paginationData = json;
      currentPage = paginationData.meta.current_page;
    } else {
      allRequirements = [];
      paginationData = null;
    }

    // Apply all filters and display
    applyAllFilters();
    updatePaginationControls();

    // Hide shimmer and show table
    shimmerLoader.hide("#shimmerTable", 600);
    setTimeout(() => {
      document.getElementById("shimmerTable").style.display = "none";
      document.getElementById("dataTable").style.display = "table";
    }, 600);
  } catch (error) {
    console.error("Error fetching requirements:", error);
    allRequirements = [];
    displayRequirements([]);
    // Still hide shimmer on error
    shimmerLoader.hide("#shimmerTable", 300);
    setTimeout(() => {
      document.getElementById("shimmerTable").style.display = "none";
      document.getElementById("dataTable").style.display = "table";
    }, 300);
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
      currentPage = 1; // Reset to page 1 when searching
      applyAllFilters();
    });
  }
}

// ============================================
// TIER 2: Status Filter Setup
// ============================================
function setupStatusFilter() {
  const statusSelect = document.getElementById("statusSelect");

  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      selectedStatus = e.target.value;
      currentPage = 1; // Reset to page 1 when filtering
      loadRequirements(1); // Reload with new status filter
    });
  }
}

// ============================================
// APPLY ALL FILTERS (Tier 1 + Tier 2)
// ============================================
function applyAllFilters() {
  // Filter by search text (Tier 1)
  let filtered = allRequirements.filter((req) => {
    return (
      req.name.toLowerCase().includes(searchText) ||
      (req.description && req.description.toLowerCase().includes(searchText))
    );
  });

  // Note: Tier 2 (status) is handled by API query parameter
  // The filtered array here is already status-filtered from the API

  displayRequirements(filtered);
}

// ============================================
// Display Requirements in Table
// ============================================
function displayRequirements(requirements) {
  const tbody = document.getElementById("requirementTableBody");

  if (!tbody) return;

  if (requirements.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center py-4">No requirements found</td></tr>';
    return;
  }

  tbody.innerHTML = requirements
    .map((req) => {
      const statusClass = getStatusBadgeClass(req.status);
      const formattedDate = formatDate(req.requirement_date);
      const status = req.is_active ? "open" : "close";

      return `
        <tr>
          <td>${escapeHtml(req.name)}</td>
          <td>${escapeHtml(req.description || "—")}</td>
          <td>${formattedDate}</td>
          <td>
            <span class="badge ${statusClass}">
              ${capitalizeFirst(status)}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-primary view-btn" data-requirement-id="${req.id}">
              View
            </button>
            <button class="btn btn-sm btn-warning edit-btn" data-requirement-id="${req.id}">
              Edit
            </button>
            <button class="btn btn-sm btn-danger delete-btn" data-requirement-id="${req.id}">
              Delete
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  // Add event listeners to buttons
  setupActionButtonListeners();
}

// ============================================
// Pagination Controls
// ============================================
function setupPaginationButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        loadRequirements(currentPage - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (
        paginationData &&
        currentPage < paginationData.meta.current_page
      ) {
        loadRequirements(currentPage + 1);
      }
    });
  }
}

function updatePaginationControls() {
  const pageInfo = document.getElementById("pageInfo");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (pageInfo && paginationData) {
    pageInfo.textContent = `Page ${currentPage} of ${paginationData.meta.to} (${paginationData.meta.total} total requirements)`;
  }

  if (prevBtn) {
    prevBtn.disabled = currentPage <= 1;
  }

  if (nextBtn) {
    nextBtn.disabled = !paginationData || currentPage >= paginationData.meta.current_page;
  }
}

// ============================================
// Setup Action Button Listeners
// ============================================
function setupActionButtonListeners() {
  // View buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const requirementId = btn.dataset.requirementId;
      window.location.href = `/pages/home/requirement/view-requirement-single.html?requirement_id=${requirementId}`;
    });
  });

  // Edit buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const requirementId = btn.dataset.requirementId;
      editRequirement(requirementId);
    });
  });

  // Delete buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const requirementId = btn.dataset.requirementId;
      deleteRequirement(requirementId);
    });
  });
}

// ============================================
// Action Functions
// ============================================
function viewRequirement(id) {
  window.location.href = `/pages/home/requirement/view-requirement-single.html?requirement_id=${id}`;
}

function editRequirement(id) {
  // TODO: Implement edit functionality
  /*
  METHOD:
  PUT

  API:
  https://ccsync-api-master-ll6mte.laravel.cloud/api/requirements/${requirementId}

  BODY:
  {
    "name": "NAME",
    "description": "DESC",
    "type": "payment",
    "is_active": True/False,
    "semester_id": 1
  }
   */
  alert(`Edit requirement ${id}`);
}

function deleteRequirement(id) {
  if (!confirm("Are you sure you want to delete this requirement?")) {
    return;
  }

  // TODO: Implement edit functionality
  /*
  METHOD:
  DELETE

  API:
  https://ccsync-api-master-ll6mte.laravel.cloud/api/requirements/${requirementId}
   */
  console.log("Deleting requirement", id);
}

// ============================================
// Helper Functions
// ============================================
function getStatusBadgeClass(status) {
  const classes = {
    open: "badge-primary",
    closed: "badge-secondary",
    archived: "badge-dark"
  };
  return classes[status] || "badge-secondary";
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
