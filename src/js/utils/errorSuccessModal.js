/**
 * Error/Success Modal Utility
 * 
 * Provides user-friendly modal dialog for API responses
 * Replaces browser alerts with styled modal component
 * 
 * @author CCSync Development Team
 * @version 1.0
 */

export class ResponseModal {
  constructor() {
    this.backdrop = document.getElementById('modalBackdrop');
    this.modal = document.getElementById('responseModal');
    this.title = document.getElementById('modalTitle');
    this.message = document.getElementById('modalMessage');
    this.details = document.getElementById('modalDetails');
    this.actionBtn = document.getElementById('modalActionBtn');
    this.closeBtn = document.getElementById('modalClose');
    this.callback = null;

    // Setup event listeners
    this.closeBtn?.addEventListener('click', () => this.hide());
    this.actionBtn?.addEventListener('click', () => this.handleAction());
    this.backdrop?.addEventListener('click', () => this.hide());

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('show')) {
        this.hide();
      }
    });
  }

  /**
   * Show error modal
   * @param {string} title - Modal title
   * @param {string} message - Main error message
   * @param {string} details - Optional detailed error message
   * @param {function} callback - Optional callback on action
   */
  showError(title, message, details = null, callback = null) {
    this.show(title, message, details, 'error', callback);
  }

  /**
   * Show success modal
   * @param {string} title - Modal title
   * @param {string} message - Main success message
   * @param {string} details - Optional detailed message
   * @param {function} callback - Optional callback on action
   */
  showSuccess(title, message, details = null, callback = null) {
    this.show(title, message, details, 'success', callback);
  }

  /**
   * Show modal with specified type
   * @param {string} title - Modal title
   * @param {string} message - Main message
   * @param {string} details - Optional details
   * @param {string} type - 'error' or 'success'
   * @param {function} callback - Optional callback
   */
  show(title, message, details = null, type = 'error', callback = null) {
    // Re-query elements in case they weren't available at init time
    if (!this.modal || !this.backdrop) {
      this.modal = document.getElementById('responseModal');
      this.backdrop = document.getElementById('modalBackdrop');
      this.title = document.getElementById('modalTitle');
      this.message = document.getElementById('modalMessage');
      this.details = document.getElementById('modalDetails');
      this.actionBtn = document.getElementById('modalActionBtn');
      this.closeBtn = document.getElementById('modalClose');
    }

    if (!this.modal || !this.backdrop) {
      console.error('Modal elements not found');
      return;
    }

    // Set content
    this.title.textContent = title;
    this.message.textContent = message;

    // Handle details
    if (details) {
      this.details.textContent = details;
      this.details.classList.remove('d-none');
    } else {
      this.details.classList.add('d-none');
    }

    // Set type-specific styling
    this.modal.classList.remove('error', 'success');
    this.modal.classList.add(type);

    // Update button text based on type
    this.actionBtn.textContent = type === 'success' ? 'OK' : 'OK';

    // Store callback
    this.callback = callback;

    // Show modal with animation
    this.backdrop.classList.add('show');
    this.modal.classList.add('show');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  /**
   * Hide modal
   */
  hide() {
    if (!this.modal || !this.backdrop) return;

    this.modal.classList.remove('show');
    this.backdrop.classList.remove('show');

    // Allow body scroll
    document.body.style.overflow = '';

    // Execute callback if provided
    if (this.callback) {
      this.callback();
      this.callback = null;
    }
  }

  /**
   * Handle action button click
   */
  handleAction() {
    this.hide();
  }

  /**
   * Clear all modal content
   */
  clear() {
    this.title.textContent = '';
    this.message.textContent = '';
    this.details.textContent = '';
    this.details.classList.add('d-none');
    this.callback = null;
  }
}

// Create singleton instance
export const responseModal = new ResponseModal();
