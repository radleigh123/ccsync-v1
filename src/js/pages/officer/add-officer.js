/**
 * Add Officer Page Script
 *
 * Handles form submission for adding new officers.
 *
 * @author CCSync Development Team
 * @version 1.0
 */

// OLD API METHOD

// document.getElementById('addOfficerForm').addEventListener('submit', async function(e) {
//     e.preventDefault();

//     const formData = {
//         name: document.getElementById('name').value.trim(),
//         position: document.getElementById('position').value.trim()
//     };

//     // Basic client-side validation
//     if (!formData.name || !formData.position) {
//         showMessage('All fields are required.', 'danger');
//         return;
//     }

//     try {
//         const response = await fetch('/ccsync-api-plain/officer/createOfficer.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData)
//         });

//         const result = await response.json();

//         if (result.success) {
//             showMessage(result.message, 'success');
//             document.getElementById('addOfficerForm').reset();
//         } else {
//             showMessage(result.message, 'danger');
//         }
//     } catch (error) {
//         console.error('Error adding officer:', error);
//         showMessage('An error occurred. Please try again.', 'danger');
//     }
// });

//WAKO KAHIBAW SA PLAIN PHP D I NI SO AKO NA GI MOVE NI SA BAG-O NGA API
//FOR SEARCHING MEMBERS

const searchInput = document.getElementById("memberSearch");
const searchResults = document.getElementById("searchResults");

// live search event
searchInput.addEventListener("input", async function () {
  const query = this.value.trim();

  if (query.length < 1) {
    searchResults.style.display = "none";
    return;
  }

  const token = await getFirebaseToken();

  const response = await fetch(`/api/members/search?query=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const members = await response.json();
  searchResults.innerHTML = "";

  if (members.length === 0) {
    searchResults.style.display = "none";
    return;
  }

  members.forEach((member) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "list-group-item-action");
    li.textContent = `${member.first_name} ${member.last_name} (${member.id_school_number})`;

    li.addEventListener("click", () => {
      document.getElementById(
        "memberSearch"
      ).value = `${member.first_name} ${member.last_name}`;

      document.getElementById("memberId").value = member.id;

      searchResults.style.display = "none";
    });

    searchResults.appendChild(li);
  });

  searchResults.style.display = "block";
});



// NEW API METHOD WITH FIREBASE AUTH
document.getElementById("addOfficerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const memberId = document.getElementById("memberId").value.trim();
    const role = document.getElementById("position").value.trim();

    if (!memberId || !role) {
      showMessage("All fields are required.", "danger");
      return;
    }

    try {
      const token = await getFirebaseToken(); // must get firebase token

      const response = await fetch(`/api/role/${memberId}/promote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // REQUIRED
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
      console.error("Error promoting officer:", error);
      showMessage("An error occurred. Please try again.", "danger");
    }
});

function showMessage(message, type) {
  const messageDiv = document.getElementById("message");
  messageDiv.className = `alert alert-${type}`;
  messageDiv.textContent = message;
  messageDiv.style.display = "block";

  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 5000);
}




/**
 * Displays a message to the user.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message (success, danger, etc.).
 */
// function showMessage(message, type) {
//     const messageDiv = document.getElementById('message');
//     messageDiv.className = `alert alert-${type}`;
//     messageDiv.textContent = message;
//     messageDiv.style.display = 'block';

//     setTimeout(() => {
//         messageDiv.style.display = 'none';
//     }, 5000);
// }
