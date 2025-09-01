import '/js/utils/core.js';
import '/scss/pages/auth/forgot-password.scss';

document.addEventListener("DOMContentLoaded", () => {
    const backLink = document.getElementById('back-link');

    if (backLink) {
        backLink.setAttribute('href', document.referrer);
        backLink.onclick = function () {
            history.back();
            return false;
        }
    }
});