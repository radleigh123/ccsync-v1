document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/ccsync-v1/pages/auth/login.html";
    } else {
        // TODO: API please
        const userData = JSON.parse(user);
        document.querySelector("#user-name-full").textContent = userData.name_first + " " + userData.name_last;
        document.querySelector("#user-email").textContent = userData.email;

        if (userData.role == "ADMIN") {
            document.querySelector("#img-profile").src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXfJd8GSrBKC5rkiuwyqorIs8LJboDjI2IYw&s";
        }
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
