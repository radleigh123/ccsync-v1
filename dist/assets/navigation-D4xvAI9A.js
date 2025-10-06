function l(){const e=document.querySelector("#logout-link");e&&e.addEventListener("click",a=>{a.preventDefault(),localStorage.removeItem("user"),window.location.href="/ccsync-v1/"})}async function n(){const e=document.querySelector("#navbarNav ul");if(!e)return;const a=localStorage.getItem("user");console.log("user in navigation:",a),a?(e.innerHTML=`
        <li class="nav-item">
            <a id="home-link" class="nav-link" href="/ccsync-v1/pages/home/home.html">Home</a>
        </li>
        <li class="nav-item">
            <a id="profile-link" class="nav-link" href="/ccsync-v1/pages/profile/profile.html">Profile</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#" id="logout-link">Logout</a>
        </li>
        `,l()):e.innerHTML=`
        <li class="nav-item">
            <a class="nav-link" href="/ccsync-v1/pages/auth/register.html">Register</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/ccsync-v1/pages/auth/login.html">Login</a>
        </li>
        `}export{l as a,n as s};
