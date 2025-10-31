import '/js/utils/core.js';
import '/scss/pages/home/event/viewEventSingle.scss';
import '/scss/confirmationModal.scss';
import { setSidebar } from '/components/js/sidebar';
import { getCurrentSession } from '/js/utils/sessionManager';
import { confirmationModal } from '/js/utils/confirmationModal.js';
import { shimmerLoader } from '/js/utils/shimmerLoader.js';

let userData = null;
let selectedRequirement = null;
let allCompliance = [];
let currentPage = 1;
let currentLimit = 20;
let paginationData = null;

// Get requirement_id from URL
const requirementId = new URLSearchParams(window.location.search).get('requirement_id');

document.addEventListener("DOMContentLoaded", async () => {
    await initHome();
    setSidebar();
    
    // Setup back button
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/pages/home/requirement/view-requirement.html';
        });
    }
    
    // Setup edit requirement button
    const editBtn = document.getElementById('editRequirementBtn');
    if (editBtn) {
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (requirementId) {
                window.location.href = `/pages/home/requirement/edit-requirement.html?requirement_id=${requirementId}`;
            }
        });
    }

    // Setup student compliance button
    const addComplianceBtn = document.getElementById('addComplianceBtn');
    if (addComplianceBtn) {
        addComplianceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (requirementId) {
                window.location.href = `/pages/home/requirement/add-requirement-person.html?requirement_id=${requirementId}`;
            }
        });
    }
    
    // Setup pagination buttons
    setupPaginationButtons();
    
    // Load requirement data
    await loadRequirementData();
    await loadCompliance();
});

async function initHome() {
    userData = await getCurrentSession();
    if (!userData) window.location.href = "/pages/auth/login.html";
}

/**
 * Load requirement data from API
 */
async function loadRequirementData() {
    if (!requirementId) {
        console.error('No requirement ID provided');
        return;
    }

    try {
        console.log('📥 Loading requirement data for ID:', requirementId);
        
        const response = await fetch(
            "/ccsync-api-plain/requirement/getRequirements.php",
            {
                headers: {
                    Authorization: `Bearer ${userData.firebase_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            console.error('Failed to load requirements');
            return;
        }

        const apiResponse = await response.json();

        if (!apiResponse.success || !apiResponse.requirements) {
            console.error('Failed to parse requirements');
            return;
        }

        // Find the requirement by ID
        selectedRequirement = apiResponse.requirements.find(r => r.id == requirementId);
        
        if (!selectedRequirement) {
            console.error('Requirement not found');
            return;
        }

        populateRequirementInfo(selectedRequirement);
        console.log('✅ Requirement data loaded:', selectedRequirement);

    } catch (error) {
        console.error('❌ Error loading requirement data:', error);
    }
}

/**
 * Load compliance records with pagination
 */
async function loadCompliance(page = 1) {
    if (!requirementId) return;

    try {
        console.log('📥 Loading compliance for requirement:', requirementId, 'page:', page);
        
        const response = await fetch(
            `/ccsync-api-plain/requirement/getRequirementCompliance.php?requirement_id=${requirementId}&page=${page}&limit=${currentLimit}`,
            {
                headers: {
                    Authorization: `Bearer ${userData.firebase_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Failed to load compliance:', response.status, errorData);
            displayCompliance([]);
            shimmerLoader.hide("#shimmerTable", 300);
            setTimeout(() => {
                document.getElementById("shimmerTable").style.display = "none";
                document.getElementById("dataTable").style.display = "table";
            }, 300);
            return;
        }

        const apiResponse = await response.json();

        if (apiResponse.success) {
            allCompliance = apiResponse.compliance;
            paginationData = apiResponse.pagination;
            currentPage = paginationData.page;
            
            displayCompliance(allCompliance);
            updatePaginationControls();
            
            console.log('✅ Compliance records loaded:', allCompliance);
            
            // Update compliance stats in requirement info
            if (selectedRequirement) {
                populateRequirementInfo(selectedRequirement);
            }
            
            // Hide shimmer and show table
            shimmerLoader.hide("#shimmerTable", 600);
            setTimeout(() => {
                document.getElementById("shimmerTable").style.display = "none";
                document.getElementById("dataTable").style.display = "table";
            }, 600);
        } else {
            displayCompliance([]);
            shimmerLoader.hide("#shimmerTable", 300);
            setTimeout(() => {
                document.getElementById("shimmerTable").style.display = "none";
                document.getElementById("dataTable").style.display = "table";
            }, 300);
        }
    } catch (error) {
        console.error('❌ Error loading compliance:', error);
        displayCompliance([]);
        shimmerLoader.hide("#shimmerTable", 300);
        setTimeout(() => {
            document.getElementById("shimmerTable").style.display = "none";
            document.getElementById("dataTable").style.display = "table";
        }, 300);
    }
}

/**
 * Populate requirement information on the page
 */
function populateRequirementInfo(requirement) {
    document.getElementById('requirementName').textContent = requirement.name || '-';
    document.getElementById('requirementDescription').textContent = requirement.description || '-';
    document.getElementById('requirementDate').textContent = formatDate(requirement.requirement_date) || '-';
    document.getElementById('requirementStatus').textContent = capitalizeStatus(requirement.status) || '-';
    
    // Display compliance statistics
    const stats = requirement.complianceStats || { complied: 0, notComplied: 0, pending: 0, total: 0 };
    document.getElementById('complianceComplied').textContent = stats.complied;
    document.getElementById('complianceNotComplied').textContent = stats.notComplied;
    document.getElementById('compliancePending').textContent = stats.pending;
}

/**
 * Display compliance records in table
 */
function displayCompliance(compliance) {
    const tbody = document.getElementById('complianceTableBody');
    const countElement = document.getElementById('complianceCount');
    
    tbody.innerHTML = '';

    // Update the compliance count
    if (countElement) {
        countElement.textContent = compliance.length;
    }

    if (!compliance || compliance.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No compliance records</td></tr>';
        return;
    }

    compliance.forEach((record) => {
        const row = document.createElement('tr');
        const statusBadge = getStatusBadge(record.compliance_status);
        row.innerHTML = `
            <td>${record.first_name} ${record.last_name}</td>
            <td>${getYearSuffix(record.year)}</td>
            <td>${record.program || '-'}</td>
            <td>${statusBadge}</td>
            <td>${formatDate(record.submitted_at) || '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Get status badge HTML
 */
function getStatusBadge(status) {
    const badges = {
        'complied': '<span class="badge bg-success">Complied</span>',
        'not_complied': '<span class="badge bg-danger">Not Complied</span>',
        'pending': '<span class="badge bg-warning">Pending</span>'
    };
    return badges[status] || '<span class="badge bg-secondary">Unknown</span>';
}

/**
 * Setup pagination buttons
 */
function setupPaginationButtons() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (paginationData && paginationData.hasPrev) {
                loadCompliance(currentPage - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (paginationData && paginationData.hasNext) {
                loadCompliance(currentPage + 1);
            }
        });
    }
}

/**
 * Update pagination controls
 */
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
            pageInfo.textContent = `Page ${paginationData.page} of ${paginationData.pages} (${paginationData.total} total records)`;
        }
    }
}

/**
 * Format date to readable format
 */
function formatDate(dateStr) {
    if (!dateStr) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}

/**
 * Get year suffix (1st, 2nd, 3rd, 4th)
 */
function getYearSuffix(year) {
    const yearNum = parseInt(year);
    const suffixes = { 1: 'st', 2: 'nd', 3: 'rd', 4: 'th' };
    return `${yearNum}${suffixes[yearNum] || 'th'} Year`;
}

/**
 * Capitalize status text
 */
function capitalizeStatus(status) {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1);
}
