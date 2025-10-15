// Import Bootstrap JavaScript (CSS is imported via styles.scss)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '/scss/styles.scss';
import { initSessionManager } from "/js/utils/sessionManager.js";
import { user as mockUser } from '/js/utils/mock/data.js';

console.log('Environment Variables:', import.meta.env);

/* // Expose Bootstrap to the global scope (important for proper functioning)
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap; */

if (import.meta.env.DEV) {
    console.log("Running in development mode");
    // Set mock user data for development
    if (!localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(mockUser));
        console.log("Mock user data set in localStorage for development");
    }
}
initSessionManager();