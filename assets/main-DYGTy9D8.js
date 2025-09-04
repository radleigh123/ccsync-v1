document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector("#navbarNav ul");localStorage.getItem("user")?e.innerHTML=`
          <li class="nav-item">
            <a class="nav-link active" href="/">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/ccsync-v1/pages/profile/profile.html">Profile</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" id="logout-link">Logout</a>
          </li>
        `:e.innerHTML=`
          <li class="nav-item">
            <a class="nav-link active" href="/">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/ccsync-v1/pages/auth/register.html">Register</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/ccsync-v1/pages/auth/login.html">Login</a>
          </li>
        `;const a=document.querySelector("#logout-link");a&&a.addEventListener("click",l=>{l.preventDefault(),localStorage.removeItem("user"),window.location.href="/"})});
