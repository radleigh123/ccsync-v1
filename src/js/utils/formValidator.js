/**
 * FormValidator - Real-time form validation utility
 * 
 * Provides client-side validation with real-time feedback
 * Prevents form submission if validation fails
 * Displays user-friendly error messages inline
 * 
 * @author CCSync Development Team
 * @version 1.0
 */

export class FormValidator {
  constructor(formElement, submitButtonSelector = '#submitBtn') {
    if (!formElement) {
      throw new Error('Form element is required');
    }
    
    this.form = formElement;
    this.errors = {};
    this.submitBtn = document.querySelector(submitButtonSelector);
    this.setupFieldListeners();
  }

  /**
   * Setup real-time validation on input/change/blur
   */
  setupFieldListeners() {
    this.form.querySelectorAll('[data-validate]').forEach(field => {
      // Validate on blur (when user leaves field)
      field.addEventListener('blur', () => {
        this.validateField(field);
      });

      // Validate in real-time (as user types)
      field.addEventListener('input', () => {
        this.validateField(field);
      });

      // Validate on change (for selects, checkboxes, radio buttons)
      field.addEventListener('change', () => {
        this.validateField(field);
      });
    });
  }

  /**
   * Validate a single field
   * @param {HTMLElement} field - The input field to validate
   * @returns {boolean} - True if valid, false if invalid
   */
  validateField(field) {
    const rules = field.dataset.validate.split('|').map(r => r.trim());
    const value = field.value.trim();
    const fieldName = field.id;
    let error = null;

    // Check each validation rule
    for (const rule of rules) {
      error = this.checkRule(rule, value, field);
      if (error) break; // Stop at first error
    }

    // Update field UI and store error
    this.updateFieldState(field, error);

    if (error) {
      this.errors[fieldName] = error;
    } else {
      delete this.errors[fieldName];
    }

    return !error;
  }

  /**
   * Check a single validation rule
   * @param {string} rule - The rule to check (e.g., "required", "email", "min:3")
   * @param {string} value - The field value
   * @param {HTMLElement} field - The input field
   * @returns {string|null} - Error message or null if valid
   */
  checkRule(rule, value, field) {
    // REQUIRED - Field must have a value
    if (rule === 'required') {
      if (!value) return 'Required';
    }

    // MIN - Minimum length
    if (rule.startsWith('min:')) {
      const min = parseInt(rule.split(':')[1]);
      if (value && value.length < min) {
        return `Minimum ${min} character${min > 1 ? 's' : ''}`;
      }
    }

    // MAX - Maximum length
    if (rule.startsWith('max:')) {
      const max = parseInt(rule.split(':')[1]);
      if (value && value.length > max) {
        return `Maximum ${max} character${max > 1 ? 's' : ''}`;
      }
    }

    // EMAIL - Valid email format
    if (rule === 'email') {
      if (value && !this.isValidEmail(value)) {
        return 'Invalid email address';
      }
    }

    // DATE - Valid date format
    if (rule === 'date') {
      if (value && !this.isValidDate(value)) {
        return 'Invalid date format';
      }
    }

    // DATE-FUTURE - Date must be in the future
    if (rule === 'date-future') {
      if (value && !this.isDateInFuture(value)) {
        return 'Date must be in the future';
      }
    }

    // DATE-NOT-TODAY - Date cannot be today
    if (rule === 'date-not-today') {
      if (value && this.isDateToday(value)) {
        return 'Cannot be today';
      }
    }

    // TIME-BEFORE - Time must be before a certain time (compared to another field)
    if (rule.startsWith('time-before:')) {
      const beforeFieldId = rule.split(':')[1];
      const beforeField = document.getElementById(beforeFieldId);
      if (value && beforeField && beforeField.value) {
        if (value >= beforeField.value) {
          const beforeFieldLabel = beforeField.previousElementSibling?.textContent || beforeFieldId;
          return `Must be before ${beforeFieldLabel}`;
        }
      }
    }

    // TIME-AFTER - Time must be after or equal to a certain time (compared to another field)
    if (rule.startsWith('time-after:')) {
      const afterFieldId = rule.split(':')[1];
      const afterField = document.getElementById(afterFieldId);
      if (value && afterField && afterField.value) {
        if (value < afterField.value) {
          const afterFieldLabel = afterField.previousElementSibling?.textContent || afterFieldId;
          return `Must be after ${afterFieldLabel}`;
        }
      }
    }

    // NUMERIC - Only numbers allowed
    if (rule === 'numeric') {
      if (value && !/^\d+$/.test(value)) {
        return 'Must be a number';
      }
    }

    // ALPHA - Only letters and spaces allowed
    if (rule === 'alpha') {
      if (value && !/^[a-zA-Z\s]+$/.test(value)) {
        return 'Only letters allowed';
      }
    }

    // ALPHANUMERIC - Letters, numbers, and underscores allowed
    if (rule === 'alphanumeric') {
      if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
        return 'Only letters, numbers, and underscores allowed';
      }
    }

    // PHONE - Valid phone number format
    if (rule === 'phone') {
      if (value && !this.isValidPhone(value)) {
        return 'Invalid phone number';
      }
    }

    // URL - Valid URL format
    if (rule === 'url') {
      if (value && !this.isValidUrl(value)) {
        return 'Invalid URL';
      }
    }

    // MATCH - Value must match another field (e.g., password confirmation)
    if (rule.startsWith('match:')) {
      const matchFieldId = rule.split(':')[1];
      const matchField = document.getElementById(matchFieldId);
      if (value && matchField && value !== matchField.value) {
        const matchFieldLabel = matchField.previousElementSibling?.textContent || matchFieldId;
        return `Must match ${matchFieldLabel}`;
      }
    }

    // CUSTOM - Allow custom validation via regex (e.g., "custom:^[A-Z]")
    if (rule.startsWith('custom:')) {
      const pattern = rule.split(':')[1];
      try {
        const regex = new RegExp(pattern);
        if (value && !regex.test(value)) {
          return 'Invalid format';
        }
      } catch (e) {
        console.error('Invalid regex pattern:', pattern);
      }
    }

    return null; // No error
  }

  /**
   * Update field visual state (red border + error message)
   * Also updates submit button state
   * @param {HTMLElement} field - The input field
   * @param {string|null} error - Error message or null
   */
  updateFieldState(field, error) {
    const errorDiv = document.getElementById(`${field.id}-error`);

    if (error) {
      // Show error state
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      
      if (errorDiv) {
        errorDiv.textContent = error;
        errorDiv.classList.add('show');
        // Show error div for optional fields that have input
        errorDiv.style.display = 'inline';
      }
    } else if (field.value.trim()) {
      // Show valid state (only if field has value)
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      
      if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.classList.remove('show');
      }
    } else {
      // Clear both states if field is empty
      field.classList.remove('is-invalid', 'is-valid');
      
      if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.classList.remove('show');
        // Hide error div for optional fields with no input
        if (field.id === 'registrationEnd') {
          errorDiv.style.display = 'none';
        }
      }
    }

    // Update submit button state after field validation
    this.updateSubmitButtonState();
  }

  /**
   * Update submit button state based on form validation
   * Disables button if any errors exist, enables if all valid
   */
  updateSubmitButtonState() {
    if (this.submitBtn) {
      if (Object.keys(this.errors).length > 0) {
        this.submitBtn.disabled = true;
      } else {
        // Check if all required fields have values
        const allRequiredFieldsFilled = this.checkRequiredFieldsFilled();
        this.submitBtn.disabled = !allRequiredFieldsFilled;
      }
    }
  }

  /**
   * Check if all required fields have values
   * @returns {boolean} - True if all required fields have values
   */
  checkRequiredFieldsFilled() {
    let allFilled = true;

    this.form.querySelectorAll('[data-validate]').forEach(field => {
      const rules = field.dataset.validate.split('|').map(r => r.trim());
      if (rules.includes('required') && !field.value.trim()) {
        allFilled = false;
      }
    });

    return allFilled;
  }

  /**
   * Validate entire form (called on submit)
   * @returns {boolean} - True if all fields valid, false if any invalid
   */
  validateForm() {
    this.errors = {};

    this.form.querySelectorAll('[data-validate]').forEach(field => {
      this.validateField(field);
    });

    this.updateSubmitButtonState();
    return Object.keys(this.errors).length === 0;
  }

  /**
   * Get all validation errors
   * @returns {object} - Object with field IDs as keys and error messages as values
   */
  getErrors() {
    return { ...this.errors };
  }

  /**
   * Clear all validation states
   */
  clearAll() {
    this.form.querySelectorAll('[data-validate]').forEach(field => {
      field.classList.remove('is-invalid', 'is-valid');
      const errorDiv = document.getElementById(`${field.id}-error`);
      if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.classList.remove('show');
      }
    });
    this.errors = {};
  }

  /**
   * Reset form to initial state (clear values and validation)
   */
  resetForm() {
    this.form.reset();
    this.clearAll();
  }

  // ==================== HELPER VALIDATION METHODS ====================

  /**
   * Check if email is valid
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if date is valid
   * @param {string} date - Date string (YYYY-MM-DD or any valid date format)
   * @returns {boolean}
   */
  isValidDate(date) {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj);
  }

  /**
   * Check if date is in the future
   * @param {string} date - Date string
   * @returns {boolean}
   */
  isDateInFuture(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    
    return dateObj > today;
  }

  /**
   * Check if date is today
   * @param {string} date - Date string
   * @returns {boolean}
   */
  isDateToday(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    
    return dateObj.getTime() === today.getTime();
  }

  /**
   * Check if phone number is valid (basic format check)
   * Accepts various formats: 09123456789, +639123456789, (09) 1234-5678
   * @param {string} phone - Phone number to validate
   * @returns {boolean}
   */
  isValidPhone(phone) {
    // Accepts: 09XX-XXXX-XXXX, +639XXXXXXXXX, (09) XXXX-XXXX, 09XXXXXXXXX
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Check if URL is valid
   * @param {string} url - URL to validate
   * @returns {boolean}
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if value matches a pattern (helper for custom regex)
   * @param {string} value - Value to check
   * @param {string} pattern - Regex pattern
   * @returns {boolean}
   */
  matchesPattern(value, pattern) {
    try {
      const regex = new RegExp(pattern);
      return regex.test(value);
    } catch (e) {
      console.error('Invalid regex pattern:', pattern, e);
      return false;
    }
  }
}

export default FormValidator;
