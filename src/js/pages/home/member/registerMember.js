import "/js/utils/core.js";
import "/scss/pages/home/member/registerMember.scss";
import { setSidebar } from "/components/js/sidebar";
import { getCurrentSession } from "/js/utils/sessionManager";
import { addMember } from "/js/utils/mock/mockStorage";

let userData = null;

document.addEventListener("DOMContentLoaded", async () => {
  initHome();
  setSidebar();

  const form = document.querySelector("form");
  form.addEventListener("submit", handleSubmit);
});

export async function initHome() {
  // Get logged-in user data
  userData = await getCurrentSession();
  if (!userData) window.location.href = "/pages/auth/login.html";
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

async function handleSubmit(e) {
  e.preventDefault();

  // Get form values
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const suffix = document.getElementById("suffix").value;
  const birthDate = document.getElementById("birthDate").value;
  // const enrollmentDate = document.getElementById("enrollmentDate").value; // NEED ADD TO PAGE
  const enrollmentDate = new Date().toISOString().split('T')[0]; // Current date (TEMPORARY)
  const idNumber = document.getElementById("idNumber").value;
  const email = document.getElementById("email").value;
  const yearLevel = document.getElementById("yearLevel").value;
  const program = document.getElementById("program").value;
  const isPaid = document.getElementById("isPaid").checked;

  console.log(JSON.stringify({
    first_name: firstName,
    last_name: lastName,
    suffix,
    id_school_number: parseInt(idNumber),
    email,
    birth_date: birthDate,
    enrollment_date: enrollmentDate,
    program,
    year: parseInt(yearLevel),
    is_paid: isPaid
  }));


  // Simple validation
  if (!firstName || !lastName || !birthDate || !idNumber || !yearLevel || !program) {
    alert(
      "Please fill in all required fields (First Name, Last Name, Birth Date, ID Number, Year Level, Program)."
    );
    return;
  }

  try {
    if (import.meta.env.DEV) {
      const newMember = {
        first_name: firstName,
        last_name: lastName,
        suffix: suffix,
        id_school_number: parseInt(idNumber),
        email: email,
        birth_date: birthDate,
        enrollment_date: new Date().toISOString().split('T')[0], // Current date
        program: program,
        year: parseInt(yearLevel),
        isPaid: isPaid
      };
      addMember(newMember);
    } else {
      // NOTE: TEMP, CHANGE TO PRODUCTION URL WHEN DEPLOYING
      // const response = await fetch("http://localhost:8000/api/member/", {
      const response = await fetch("http://localhost:8080/ccsync-plain-php/member/createMember.php", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${userData.firebase_token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          suffix: suffix,
          id_school_number: parseInt(idNumber),
          email: email,
          birth_date: birthDate,
          enrollment_date: enrollmentDate,
          program: program,
          year: parseInt(yearLevel),
          is_paid: isPaid
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
    }

    alert("Member successfully registered!");
    window.location.href = "/pages/home/member/view-member.html";
  } catch (error) {
    console.error("Error registering member:", error);
    alert("Failed to register member. Please try again.");
    return;
  }

  // Reset form
  this.reset();
}
