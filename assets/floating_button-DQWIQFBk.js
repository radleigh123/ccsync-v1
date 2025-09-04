function c(){const i=document.getElementById("sidebar-toggle"),e=document.getElementById("sidebar"),a=document.createElement("div");a.className="sidebar-overlay",e.parentNode.insertBefore(a,e.nextSibling);const t=()=>{window.innerWidth<992||localStorage.getItem("sidebar-collapsed")==="true"?e.classList.add("collapsed"):e.classList.remove("collapsed")};t(),i.addEventListener("click",function(){e.classList.toggle("collapsed"),window.innerWidth>=992&&localStorage.setItem("sidebar-collapsed",e.classList.contains("collapsed"))}),a.addEventListener("click",function(){window.innerWidth<992&&e.classList.add("collapsed")}),window.addEventListener("resize",t)}function d(){const i=document.createElement("button");i.className="floating-action-btn",i.id="floating-nav-btn",i.innerHTML='<i class="bi bi-list"></i>',document.body.appendChild(i);const e=document.createElement("div");e.className="nav-card",e.innerHTML=`
        <div class="card-header">Navigation</div>
        <div class="list-group list-group-flush">
            <a href="/ccsync-v1/pages/home/home.html" class="list-group-item list-group-item-action ${window.location.pathname.includes("/home/")?"active":""}">
                <i class="bi bi-house-door"></i>Home
            </a>
            <a href="/ccsync-v1/pages/profile/profile.html" class="list-group-item list-group-item-action ${window.location.pathname.includes("/profile/")?"active":""}">
                <i class="bi bi-person"></i>Profile
            </a>
            <a href="/ccsync-v1/pages/settings/settings.html" class="list-group-item list-group-item-action ${window.location.pathname.includes("/settings/")?"active":""}">
                <i class="bi bi-gear"></i>Settings
            </a>
            <a id="floating-logout" href="#" class="list-group-item list-group-item-action">
                <i class="bi bi-box-arrow-in-left"></i>Logout
            </a>
        </div>
    `,document.body.appendChild(e),i.addEventListener("click",s=>{s.stopPropagation(),e.classList.toggle("visible")}),document.addEventListener("click",s=>{!e.contains(s.target)&&s.target!==i&&e.classList.remove("visible")}),e.addEventListener("click",s=>{s.stopPropagation()});const a=document.getElementById("floating-logout");a&&a.addEventListener("click",s=>{s.preventDefault(),localStorage.removeItem("user"),window.location.href="/"});const t=document.getElementById("sidebar");t&&t.classList.contains("collapsed")&&i.classList.add("visible");const n=new MutationObserver(s=>{s.forEach(l=>{l.attributeName==="class"&&(t.classList.contains("collapsed")?i.classList.add("visible"):(i.classList.remove("visible"),e.classList.remove("visible")))})});t&&n.observe(t,{attributes:!0});function o(){window.innerWidth<992&&t.classList.contains("collapsed")?i.classList.add("visible"):window.innerWidth>=992&&(i.classList.remove("visible"),e.classList.remove("visible"))}o(),window.addEventListener("resize",o)}export{d as a,c as s};
