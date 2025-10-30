/**
 * ConfirmationModal - Reusable confirmation dialog component
 * Similar pattern to ResponseModal but with Yes/No action buttons
 * Used for user verification steps before critical operations
 */

export class ConfirmationModal {
    constructor() {
        this.modal = document.getElementById('confirmationModal');
        this.backdrop = document.getElementById('confirmationBackdrop');
        this.title = document.getElementById('confirmationTitle');
        this.message = document.getElementById('confirmationMessage');
        this.details = document.getElementById('confirmationDetails');
        this.yesBtn = document.getElementById('confirmationYesBtn');
        this.noBtn = document.getElementById('confirmationNoBtn');
        this.closeBtn = document.getElementById('confirmationCloseBtn');

        this.yesCallback = null;
        this.noCallback = null;

        this.initEventListeners();
    }

    /**
     * Initialize event listeners for modal actions
     */
    initEventListeners() {
        // Yes button handler
        this.yesBtn?.addEventListener('click', () => {
            if (this.yesCallback) {
                this.yesCallback();
            }
            this.hide();
        });

        // No button handler
        this.noBtn?.addEventListener('click', () => {
            if (this.noCallback) {
                this.noCallback();
            }
            this.hide();
        });

        // Close button handler
        this.closeBtn?.addEventListener('click', () => {
            this.hide();
        });

        // Backdrop click to close
        this.backdrop?.addEventListener('click', (e) => {
            if (e.target === this.backdrop) {
                this.hide();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.hide();
            }
        });
    }

    /**
     * Show confirmation modal with message
     * @param {string} titleText - Modal title
     * @param {string} messageText - Main message
     * @param {object} options - Configuration options
     * @param {string} options.details - Detailed content (HTML)
     * @param {function} options.onYes - Callback when Yes is clicked
     * @param {function} options.onNo - Callback when No is clicked
     * @param {string} options.yesText - Yes button text (default: "Yes")
     * @param {string} options.noText - No button text (default: "No")
     */
    show(titleText, messageText, options = {}) {
        // Re-query elements in case they weren't available at init time
        if (!this.modal || !this.backdrop) {
            this.modal = document.getElementById('confirmationModal');
            this.backdrop = document.getElementById('confirmationBackdrop');
            this.title = document.getElementById('confirmationTitle');
            this.message = document.getElementById('confirmationMessage');
            this.details = document.getElementById('confirmationDetails');
            this.yesBtn = document.getElementById('confirmationYesBtn');
            this.noBtn = document.getElementById('confirmationNoBtn');
            this.closeBtn = document.getElementById('confirmationCloseBtn');
        }

        this.title.textContent = titleText;
        this.message.textContent = messageText;

        // Set details if provided
        if (options.details) {
            this.details.innerHTML = options.details;
            this.details.style.display = 'block';
        } else {
            this.details.innerHTML = '';
            this.details.style.display = 'none';
        }

        // Set button text
        this.yesBtn.textContent = options.yesText || 'Yes';
        this.noBtn.textContent = options.noText || 'No';

        // Set callbacks
        this.yesCallback = options.onYes || null;
        this.noCallback = options.onNo || null;

        // Show modal
        this.backdrop?.classList.add('active');
        this.modal?.classList.add('active');
    }

    /**
     * Hide confirmation modal
     */
    hide() {
        this.modal?.classList.remove('active');
        this.backdrop?.classList.remove('active');
        this.yesCallback = null;
        this.noCallback = null;
    }

    /**
     * Update details content dynamically
     * @param {string} detailsHTML - HTML content for details section
     */
    setDetails(detailsHTML) {
        if (this.details) {
            this.details.innerHTML = detailsHTML;
            this.details.style.display = 'block';
        }
    }

    /**
     * Clear modal state
     */
    clear() {
        this.title.textContent = '';
        this.message.textContent = '';
        this.details.innerHTML = '';
        this.yesCallback = null;
        this.noCallback = null;
    }
}

/**
 * Singleton instance of ConfirmationModal
 * Import as: import { confirmationModal } from '/js/utils/confirmationModal.js';
 */
export const confirmationModal = new ConfirmationModal();
