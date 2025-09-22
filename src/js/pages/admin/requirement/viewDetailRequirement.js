import "/js/utils/core.js";
import "/scss/pages/admin/requirement/viewDetailRequirement.scss";
import { setSidebar } from "/components/js/sidebar";
import { setupLogout } from "/js/utils/navigation.js";
import "bootstrap";

document.addEventListener("DOMContentLoaded", () => {
  initHome();
  setSidebar();
  setupLogout();
});

export function initHome() {
  const user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "/ccsync-v1/pages/auth/login.html";
    return;
  }

  const userData = JSON.parse(user);
}
