import '/js/utils/core.js';
import '/scss/pages/home/member/viewMember.scss';
import { setSidebar } from '/components/js/sidebar';
import { getCurrentSession } from '/js/utils/sessionManager';
import { getMembers } from '/js/utils/mock/mockStorage';

let userData = null;
let allMembers = []; // Store all members
let selectedYear = null;

document.addEventListener("DOMContentLoaded", async () => {
  await initHome();
  setSidebar();
  setupYearFilter();
  loadMembers();
});

async function initHome() {
  // Get logged-in user data
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";
}

async function loadMembers() {
  try {
    if (import.meta.env.DEV) {
      allMembers = getMembers().members;
    } else {
      const response = await fetch("http://localhost:8000/api/member", {
        headers: {
          "Authorization": `Bearer ${userData.firebase_token}`,
          "Accept": "application/json",
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      allMembers = data.members;
    }

    // Display all members default
    displayMembers(allMembers);

  } catch (error) {
    console.error("Error fetching members:", error);
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = `
    <tr>
      <td colspan="3" class="text-danger text-center">
        Failed to load members. Please try again.
      </td>
    </tr>
    `;
  }
}

function setupYearFilter() {
  const yearDropdown = document.getElementById('yearDropdown');

  yearDropdown.addEventListener('change', (e) => {
    selectedYear = e.target.value;
    filterMembersByYear(selectedYear);
  });
}

function filterMembersByYear(year) {
  if (!year) {
    displayMembers(allMembers);
    return;
  }

  // Filter members by enrollment year
  const filteredMembers = allMembers.filter(member => {
    const enrollmentYear = new Date(member.enrollment_date).getFullYear();
    return enrollmentYear === parseInt(year);
  });

  displayMembers(filteredMembers);
}

// TODO: Cache list for hot-reload, add Refresh for UX
function displayMembers(members) {
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";

  if (members.length > 0) {
    members.forEach((member, index) => {
      const fullName = `${member.first_name} ${member.last_name}${member.suffix ? ' ' + member.suffix : ''}`;
      const programCode = member.program?.code || member.program;

      const row = document.createElement('tr');
      row.className = 'member-row';
      row.dataset.memberId = member.id;

      row.innerHTML = `
        <td class="ps-3">${fullName}</td>
        <td class="ps-3 text-center">${member.year}</td>
        <td class="ps-3 text-center">${programCode}</td>
      `;

      // Click event listeners, implement action here
      row.addEventListener('click', () => {
        handleMemberClick(member);
      });

      tbody.appendChild(row);

      setTimeout(() => {
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
      }, index * 50);
    });

    // TODO: Maybe limit to 50 (Similar to GMAIL)
    const summaryRow = document.createElement('tr');
    summaryRow.className = 'summary-row';
    summaryRow.innerHTML = `
      <td colspan="3" class="text-muted text-center">
        ---------------- ${members.length} member(s) found ----------------
      </td>
    `;
    tbody.appendChild(summaryRow);
  } else {
    const message = selectedYear
      ? `No members found for school year ${selectedYear}`
      : "No members found";

    const emptyRow = document.createElement('tr');
    emptyRow.className = 'summary-row';
    emptyRow.innerHTML = `
      <td colspan="3" class="text-muted text-center">
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