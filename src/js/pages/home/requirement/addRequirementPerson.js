import '/js/utils/core.js';
import '/scss/pages/home/event/addEventPerson.scss';
// import { setSidebar } from '/components/js/sidebar';
import { getCurrentSession } from '/js/utils/sessionManager';
import { responseModal } from '/js/utils/errorSuccessModal';
import { confirmationModal } from '/js/utils/confirmationModal';

let userData = null;
let selectedRequirement = null;
let selectedMemberId = null; // Store the database member ID
let searchTimeout = null; // Debounce timer for search

// Read requirement_id from URL parameters
const requirementId = new URLSearchParams(window.location.search).get('requirement_id');

document.addEventListener("DOMContentLoaded", async () => {
    await initHome();
    // setSidebar();
    await loadRequirementData();
    setupFormHandlers();
});

async function initHome() {
    // Get logged-in user data
    userData = await getCurrentSession();
    if (!userData) window.location.href = "/pages/auth/login.html";
}

/**
 * Load requirement data from API and display in form
 */
async function loadRequirementData() {
    if (!requirementId) {
        console.error('No requirement ID provided');
        showError('Requirement ID not found. Please select a requirement first.');
        return;
    }

    try {
        // Fetch requirement from API using the Laravel API
        const response = await fetch(
            `https://ccsync-api-master-ll6mte.laravel.cloud/api/requirements/${requirementId}`,
            {
                headers: {
                    Authorization: `Bearer ${userData.firebase_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if requirement data exists
        if (data.data) {
            selectedRequirement = data.data;
            
            // Update requirement information in the form
            document.getElementById('requirementCardTitle').textContent = selectedRequirement.name;
            document.getElementById('requirementSubtitle').textContent = `Record compliance for: ${selectedRequirement.name}`;
            document.getElementById('requirementCardDate').textContent = `Deadline: ${selectedRequirement.requirement_date || 'N/A'}`;
            
            // Setup back button
            const backButton = document.getElementById('backButton');
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    window.location.href = `/pages/home/requirement/view-requirement-single.html?requirement_id=${requirementId}`;
                });
            }
            
            // Setup cancel button
            const cancelButton = document.getElementById('cancelButton');
            if (cancelButton) {
                cancelButton.addEventListener('click', (e) => {
                    window.location.href = `/pages/home/requirement/view-requirement-single.html?requirement_id=${requirementId}`;
                });
            }
            
            console.log('Requirement data loaded successfully:', selectedRequirement);
        } else {
            showError('Requirement not found. Please select a valid requirement.');
        }
    } catch (error) {
        console.error('Error loading requirement data:', error);
        showError('Error loading requirement information. Please try again.');
    }
}

/**
 * Setup form event handlers
 */
function setupFormHandlers() {
    const complianceForm = document.getElementById('complianceForm');
    const idNumberInput = document.getElementById('idNumber');
    const studentInfoSection = document.getElementById('studentInfoSection');
    const complianceStatusSection = document.getElementById('complianceStatusSection');
    const submitButton = document.getElementById('submitButton');

    // Listen for ID number input changes with debouncing
    idNumberInput.addEventListener('input', async (e) => {
        const idNumber = e.target.value.trim();
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        if (idNumber.length === 0) {
            studentInfoSection.style.display = 'none';
            complianceStatusSection.style.display = 'none';
            submitButton.disabled = true;
            selectedMemberId = null;
            return;
        }

        // Only search for exact numeric matches (ID should be all digits)
        if (!/^\d+$/.test(idNumber)) {
            studentInfoSection.style.display = 'none';
            complianceStatusSection.style.display = 'none';
            submitButton.disabled = true;
            selectedMemberId = null;
            return;
        }

        // Require full 8-digit school ID before searching
        if (idNumber.length < 8) {
            studentInfoSection.style.display = 'none';
            complianceStatusSection.style.display = 'none';
            submitButton.disabled = true;
            selectedMemberId = null;
            return;
        }

        // Debounce the search - wait 500ms after user stops typing
        searchTimeout = setTimeout(async () => {
            await loadStudentInfo(idNumber);
        }, 500);
    });

    // Also allow Enter key to trigger immediate search
    idNumberInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const idNumber = idNumberInput.value.trim();
            
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            if (idNumber.length === 0) {
                responseModal.showError('Invalid ID Number', 'Please enter a valid ID number');
                return;
            }
            
            if (!/^\d+$/.test(idNumber)) {
                responseModal.showError('Invalid ID Number', 'ID number must contain only digits');
                return;
            }
            
            // Require exactly 8 digits for school ID
            if (idNumber.length !== 8) {
                responseModal.showError('Invalid ID Number', 'School ID number must be exactly 8 digits');
                return;
            }
            
            await loadStudentInfo(idNumber);
        }
    });

    // Handle form submission
    complianceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await recordCompliance();
    });
}

/**
 * Load and display student information
 */
async function loadStudentInfo(schoolIdNumber) {
    try {
        // Show student info section with shimmer loader
        const studentInfoSection = document.getElementById('studentInfoSection');
        const shimmerLoader = document.getElementById('studentInfoShimmer');
        const studentCard = document.getElementById('studentCard');
        
        studentInfoSection.style.display = 'block';
        shimmerLoader.style.display = 'block';
        studentCard.style.display = 'none';
        
        // Search for the member by school ID number using dedicated endpoint
        const response = await fetch(
            `https://ccsync-api-master-ll6mte.laravel.cloud/api/members/member?id_school_number=${schoolIdNumber}`,
            {
                headers: {
                    Authorization: `Bearer ${userData.firebase_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            shimmerLoader.style.display = 'none';
            studentInfoSection.style.display = 'none';
            showStudentError('Student not found');
            return;
        }

        const data = await response.json();

        if (data.data) {
            const member = data.data;
            
            // Store the member database ID for compliance recording
            selectedMemberId = member.id;
            
            // Check existing compliance status
            const existingCompliance = await checkExistingCompliance(member.id);
            
            let complianceStatusHTML = '<span class="badge bg-info">Not Yet Recorded</span>';
            if (existingCompliance) {
                const statusField = existingCompliance.status || existingCompliance.compliance_status;
                const statusBadgeClass = statusField === 'complied' ? 'bg-success' : 
                                        statusField === 'not_complied' || statusField === 'not complied' ? 'bg-danger' : 'bg-warning';
                const statusText = (statusField || '').replace('_', ' ').charAt(0).toUpperCase() + 
                                  (statusField || '').replace('_', ' ').slice(1);
                complianceStatusHTML = `<span class="badge ${statusBadgeClass}">${statusText}</span>`;
            }
            
            // Display student information
            document.getElementById('studentComplianceStatus').innerHTML = complianceStatusHTML;
            document.getElementById('studentName').textContent = 
                `${member.first_name} ${member.last_name}`;
            document.getElementById('studentEmail').textContent = member.email;
            document.getElementById('studentProgram').textContent = member.program;
            document.getElementById('studentYear').textContent = 
                `${member.year}${getYearSuffix(member.year)}`;
            
            // Hide shimmer, show actual card
            shimmerLoader.style.display = 'none';
            studentCard.style.display = 'block';
            
            document.getElementById('complianceStatusSection').style.display = 'block';
            document.getElementById('submitButton').disabled = false;
            document.getElementById('submitButton').textContent = existingCompliance ? 'Update Compliance' : 'Record Compliance';
            
            console.log('Student data loaded:', member);
        } else {
            shimmerLoader.style.display = 'none';
            studentInfoSection.style.display = 'none';
            showStudentError('Student not found');
        }
    } catch (error) {
        console.error('Error loading student info:', error);
        document.getElementById('studentInfoSection').style.display = 'none';
        document.getElementById('studentInfoShimmer').style.display = 'none';
        showStudentError('Error loading student information');
    }
}

/**
 * Check if compliance record already exists for this student and requirement
 */
async function checkExistingCompliance(memberId) {
    try {
        const response = await fetch(
            `https://ccsync-api-master-ll6mte.laravel.cloud/api/compliance-audits?requirement_id=${selectedRequirement.id}&member_id=${memberId}`,
            {
                headers: {
                    Authorization: `Bearer ${userData.firebase_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            console.error('Failed to check compliance status');
            return null;
        }

        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            return data.data[0];
        }
        
        return null;
    } catch (error) {
        console.error('Error checking compliance status:', error);
        return null;
    }
}

/**
 * Get year suffix (st, nd, rd, th)
 */
function getYearSuffix(year) {
    const yearNum = parseInt(year);
    switch (yearNum) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        case 4: return 'th';
        default: return '';
    }
}

/**
 * Record student compliance for requirement
 */
async function recordCompliance() {
    if (!selectedMemberId || !selectedRequirement) {
        responseModal.showError('Missing Information', 'Please provide all required information');
        return;
    }

    const complianceStatus = document.getElementById('complianceStatus').value;

    try {
        const response = await fetch(
            'https://ccsync-api-master-ll6mte.laravel.cloud/api/compliance-audits',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userData.firebase_token}`,
                },
                body: JSON.stringify({
                    requirement_id: selectedRequirement.id,
                    member_id: selectedMemberId,
                    status: complianceStatus,
                }),
            }
        );

        const result = await response.json();

        if (result.data || response.ok) {
            responseModal.showSuccess(
                'Compliance Recorded',
                'The student compliance has been successfully recorded.',
                () => {
                    // Redirect back to requirement single view
                    window.location.href = `/pages/home/requirement/view-requirement-single.html?requirement_id=${selectedRequirement.id}`;
                }
            );
        } else {
            responseModal.showError(
                'Recording Failed',
                result.message || 'Failed to record compliance'
            );
        }
    } catch (error) {
        console.error('Error recording compliance:', error);
        responseModal.showError(
            'Error',
            'An error occurred while recording compliance'
        );
    }
}

/**
 * Show student-specific error message
 */
function showStudentError(message) {
    document.getElementById('studentInfoSection').style.display = 'none';
    document.getElementById('complianceStatusSection').style.display = 'none';
    document.getElementById('submitButton').disabled = true;
    document.getElementById('statusMessage').style.display = 'block';
    document.getElementById('statusText').textContent = `Error: ${message}`;
}

/**
 * Show general error message
 */
function showError(message) {
    const statusDiv = document.getElementById('statusMessage');
    const statusText = document.getElementById('statusText');
    statusDiv.style.display = 'block';
    statusDiv.className = 'alert alert-danger mb-4';
    statusText.textContent = `Error: ${message}`;
}
