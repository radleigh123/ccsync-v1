function s(){const e=document.querySelector("#navbarNav ul");if(!e)return;localStorage.getItem("user")?(e.innerHTML=`
        <li class="nav-item">
            <a class="nav-link" href="/ccsync-v1/pages/home/home.html">Home</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/ccsync-v1/pages/profile/profile.html">Profile</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#" id="logout-link">Logout</a>
        </li>
        `,l()):e.innerHTML=`
        <li class="nav-item">
            <a class="nav-link" href="/ccsync-v1/pages/home/home.html">Home</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/ccsync-v1/pages/auth/register.html">Register</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/ccsync-v1/pages/auth/login.html">Login</a>
        </li>
        `}function l(){const e=document.querySelector("#logout-link");e&&e.addEventListener("click",a=>{a.preventDefault(),localStorage.removeItem("user"),window.location.href="/"})}export{l as a,s};
