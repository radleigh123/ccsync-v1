import '/components/scss/sidebar.scss';

// Toggle sub-navigation
document.querySelectorAll(".toggle-nav").forEach((item) => {
    item.addEventListener("click", function () {
        const subNav = this.nextElementSibling;

        // Toggle the open class on the parent element
        let parent = this.parentElement;
        parent.classList.toggle("open");

        // Toggle the show class on the sub-navigation
        subNav.classList.toggle("show");
    });
});

// Handle all navigation links
document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
        // Don't prevent default for toggle-nav links, they need to toggle
        if (!this.classList.contains("toggle-nav")) {
            e.preventDefault();
        }

        // Remove active class from all links
        document.querySelectorAll(".nav-link").forEach((l) => {
            l.classList.remove("active");
        });

        // Add active class to clicked link
        this.classList.add("active");

        // If this is a sub-nav item, also activate its parent menu
        if (this.closest(".sub-nav")) {
            const parentToggle =
                this.closest(".sub-nav").previousElementSibling;

            if (parentToggle) {
                parentToggle.classList.add("active");

                // Make sure sub-menu stays open when item is selected
                const parentItem = this.closest(".nav-item");

                if (parentItem) {
                    parentItem.classList.add("open");
                    this.closest(".sub-nav").classList.add(
                        "show"
                    );
                }
            }
        }
    });
});

// Initial state - check if URL hash matches any nav link and activate it
const hash = window.location.hash;

if (hash) {
    const targetLink = document.querySelector(
        `a.nav-link[href="${hash}"]`
    );

    if (targetLink) {
        // Simulate click to set active states properly
        targetLink.click();
    }
}
