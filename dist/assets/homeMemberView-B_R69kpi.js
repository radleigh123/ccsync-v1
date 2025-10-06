import{g as u}from"./core-inoSP3gc.js";import{s as p}from"./sidebar-B6qmYeWP.js";import"./mockStorage-99A_-fjr.js";import"./bootstrap.esm-C8zcUHWS.js";import"./navigation-D4xvAI9A.js";import"./data-CZaJBQaZ.js";let l=null,s=[],o=null;document.addEventListener("DOMContentLoaded",async()=>{await f(),p(),g(),y()});async function f(){l=await u(),l||(window.location.href="/ccsync-v1/pages/auth/login.html")}async function y(){try{{const e=await fetch("http://localhost:8000/api/member",{headers:{Authorization:`Bearer ${l.firebase_token}`,Accept:"application/json"}});if(!e.ok){const r=await e.json();throw new Error(r.message||`HTTP error! status: ${e.status}`)}s=(await e.json()).members}c(s)}catch(e){console.error("Error fetching members:",e);const n=document.getElementById("userTableBody");n.innerHTML=`
    <tr>
      <td colspan="3" class="text-danger text-center">
        Failed to load members. Please try again.
      </td>
    </tr>
    `}}function g(){document.getElementById("yearDropdown").addEventListener("change",n=>{o=n.target.value,h(o)})}function h(e){if(!e){c(s);return}const n=s.filter(r=>new Date(r.enrollment_date).getFullYear()===parseInt(e));c(n)}function c(e){const n=document.getElementById("userTableBody");if(n.innerHTML="",e.length>0){e.forEach((t,d)=>{const i=`${t.first_name} ${t.last_name}${t.suffix?" "+t.suffix:""}`,m=t.program?.code||t.program,a=document.createElement("tr");a.className="member-row",a.dataset.memberId=t.id,a.innerHTML=`
        <td class="ps-3">${i}</td>
        <td class="ps-3 text-center">${t.year}</td>
        <td class="ps-3 text-center">${m}</td>
      `,a.addEventListener("click",()=>{w(t)}),n.appendChild(a),setTimeout(()=>{a.style.opacity="1",a.style.transform="translateY(0)"},d*50)});const r=document.createElement("tr");r.className="summary-row",r.innerHTML=`
      <td colspan="3" class="text-muted text-center">
        ---------------- ${e.length} member(s) found ----------------
      </td>
    `,n.appendChild(r)}else{const r=o?`No members found for school year ${o}`:"No members found",t=document.createElement("tr");t.className="summary-row",t.innerHTML=`
      <td colspan="3" class="text-muted text-center">
        ${r}
      </td>
    `,n.appendChild(t)}}function w(e){alert(`Member clicked: ${e.first_name} ${e.last_name}`)}
