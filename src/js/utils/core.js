// Import Bootstrap JavaScript (CSS is imported via styles.scss)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '/scss/styles.scss';
import { initSessionManager } from "/js/utils/sessionManager.js";

console.log('Environment Variables:', import.meta.env);

/* // Expose Bootstrap to the global scope (important for proper functioning)
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap; */

if (import.meta.env.DEV) {
    console.log("Running in development mode");
}
initSessionManager();