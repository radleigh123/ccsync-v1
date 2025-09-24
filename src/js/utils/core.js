import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.esm.min.js';
import '/scss/styles.scss';
import { initSessionManager } from "/js/utils/sessionManager.js";

/* // Expose Bootstrap to the global scope (important for proper functioning)
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap; */

initSessionManager();