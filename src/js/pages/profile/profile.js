document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
    } else {
        // TODO: API please
        const userData = JSON.parse(user);
        document.querySelector("#user-name-full").textContent = userData.firstName + " " + userData.lastName;
        document.querySelector("#user-email").textContent = userData.email;
    }

    const logout = document.querySelector("#logout-link");
    if (logout) {
        logout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user"); // clear state
            window.location.href = "/";
        });
    }
});
