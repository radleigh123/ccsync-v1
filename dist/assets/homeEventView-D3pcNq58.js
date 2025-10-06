import{g as d}from"./core-inoSP3gc.js";import{s as m}from"./sidebar-B6qmYeWP.js";import"./mockStorage-99A_-fjr.js";import"./bootstrap.esm-C8zcUHWS.js";import"./navigation-D4xvAI9A.js";import"./data-CZaJBQaZ.js";let l=null;document.addEventListener("DOMContentLoaded",async()=>{await p(),m(),f()});async function p(){l=await d(),l||(window.location.href="/ccsync-v1/pages/auth/login.html")}async function f(){try{{const e=await fetch("http://localhost:8000/api/events",{headers:{Authorization:`Bearer ${l.firebase_token}`,"Content-Type":"application/json",Accept:"application/json"}});if(!e.ok){const t=await e.json();throw new Error(t.message||`HTTP error! status: ${e.status}`)}const a=await e.json();u(a.data)}}catch(e){console.error("Error fetching events:",e)}}function u(e){const a=document.getElementById("eventContainer");if(a.className+=" gap-4",a.innerHTML="",e.length>0)e.forEach(t=>{const s=document.createElement("div");s.id="eventCardItem",s.className="card px-0 col-md-4 col-sm-6 mb-4";const i=document.createElement("div");i.className="card-body d-flex flex-column justify-content-between",i.innerHTML=`
          <h5 class="card-title text-center flex-fill align-content-center">${t.name}</h5>
          <hr />
          <div class="d-flex flex-row gap-2">
            <strong>Date:</strong>
            <p id="eventCardDate" class="my-0">${t.event_date}</p>
          </div>
          <div class="d-flex flex-row gap-2">
            <strong>Attendees:</strong>
            <p id="eventCardAttendees" class="my-0">${t.attendees}</p>
          </div>
          <div class="d-flex flex-row gap-2">
            <strong>Venue:</strong>
            <p id="eventCardVenue" class="my-0">${t.venue}</p>
          </div>
        `;const n=document.createElement("div");n.id="eventCardActions",n.className="d-flex flex-row justify-content-around mt-3";const o=document.createElement("div");o.id="registerButton",o.className="d-flex flex-column align-items-center",o.innerHTML=`
          <a href="/ccsync-v1/pages/home/event/add-event-person.html" class="text-decoration-none text-dark d-flex flex-column align-items-center">
            <i class="bi bi-person-plus"></i>
            <p class="my-0" hidden>Register</p>
          </a>
        `;const c=document.createElement("div");c.id="editButton",c.className="d-flex flex-column align-items-center justify-content-center",c.innerHTML=`
          <a href="/ccsync-v1/pages/home/event/edit-event.html" class="text-decoration-none text-dark d-flex flex-column align-items-center">
            <i class="bi bi-pencil-square"></i>
            <p class="my-0" hidden>Edit</p>
          </a>
        `;const r=document.createElement("div");r.id="viewButton",r.className="d-flex flex-column align-items-center",r.innerHTML=`
          <a href="/ccsync-v1/pages/home/event/view-event-single.html" class="text-decoration-none text-dark d-flex flex-column align-items-center">
            <i class="bi bi-eye"></i>
            <p class="my-0" hidden>View</p>
          </a>
        `,n.appendChild(o),n.appendChild(c),n.appendChild(r),i.appendChild(n),s.appendChild(i),a.appendChild(s)});else{const t=document.getElementById("eventContainer");t.innerHTML=`
      <div class="text-center text-info h4">
        No events available.
      </div>
    `}}
