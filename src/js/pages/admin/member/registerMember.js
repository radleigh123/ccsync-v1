import "/js/utils/core.js";
import { setSidebar } from "/components/js/sidebar";
import "/scss/pages/admin/member/registerMember.scss";
import "bootstrap";

document.addEventListener("DOMContentLoaded", () => {
  initHome();
  setSidebar();
  loadUsers();
});

export function initHome() {
  const user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "/ccsync-v1/pages/auth/login.html";
    return;
  }

  const userData = JSON.parse(user);
}

document.querySelectorAll("select.form-select").forEach((select) => {
  function updateColor() {
    if (!select.value) {
      select.classList.add("placeholder-gray");
    } else {
      select.classList.remove("placeholder-gray");
    }
  }
  // Initial check
  updateColor();
  // Update on change
  select.addEventListener("change", updateColor);
});

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const formData = {
    idNumber: document.getElementById("idNumber").value,
    program: document.getElementById("program").value,
    firstName: document.getElementById("firstName").value,
    yearLevel: document.getElementById("yearLevel").value,
    lastName: document.getElementById("lastName").value,
    suffix: document.getElementById("suffix").value,
  };

  // Simple validation
  if (!formData.idNumber || !formData.firstName || !formData.lastName) {
    alert(
      "Please fill in all required fields (ID Number, First Name, Last Name)"
    );
    return;
  }

  // Simulate registration success
  alert("Member registered successfully!");

  // Reset form
  this.reset();
});
