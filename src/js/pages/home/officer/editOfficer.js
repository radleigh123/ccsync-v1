import "/js/utils/core.js";
import "/scss/pages/home/officer/editOfficer.scss";
// import { setSidebar } from "/components/js/sidebar";
import { setupLogout } from "/js/utils/navigation.js";
import "bootstrap";

document.addEventListener("DOMContentLoaded", () => {
  initHome();
  // setSidebar();
  setupLogout();
});

export function initHome() {
  const user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "/pages/auth/login.html";
    return;
  }

  const userData = JSON.parse(user);
}

// function handleEdit() {
//   alert("Edit button clicked");
//   // Add your edit functionality here
// }

// function handleDelete() {
//   if (confirm("Are you sure you want to delete this officer?")) {
//     alert("Delete confirmed");
//     // Add your delete functionality here
//   }
// }
