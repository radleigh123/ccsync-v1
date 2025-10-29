/**
 * Shimmer Loader Helper
 * 
 * Provides utility functions to manage shimmer loaders
 * Non-intrusive: Works with existing code without modifications
 * 
 * Usage Examples:
 * - shimmerLoader.show(elementSelector) - Show shimmer on element
 * - shimmerLoader.hide(elementSelector) - Hide shimmer with fade-out
 * - shimmerLoader.toggle(elementSelector) - Toggle shimmer state
 * - shimmerLoader.hideAll() - Hide all active shimmers
 */

export const shimmerLoader = {
    /**
     * Show shimmer loader on an element
     * @param {string} selector - CSS selector or element
     */
    show(selector) {
        const element = this._getElement(selector);
        if (element) {
            element.classList.add('shimmer');
            element.classList.remove('shimmer-fade-out');
        }
    },

    /**
     * Hide shimmer loader with smooth fade-out
     * @param {string} selector - CSS selector or element
     * @param {number} duration - Duration in ms before removing class (default: 600)
     */
    hide(selector, duration = 600) {
        const element = this._getElement(selector);
        if (element && element.classList.contains('shimmer')) {
            element.classList.add('shimmer-fade-out');
            
            // Remove shimmer class after animation completes
            setTimeout(() => {
                element.classList.remove('shimmer');
                element.classList.remove('shimmer-fade-out');
            }, duration);
        }
    },

    /**
     * Toggle shimmer loader on/off
     * @param {string} selector - CSS selector or element
     */
    toggle(selector) {
        const element = this._getElement(selector);
        if (element) {
            if (element.classList.contains('shimmer')) {
                this.hide(selector);
            } else {
                this.show(selector);
            }
        }
    },

    /**
     * Hide all active shimmer loaders
     */
    hideAll() {
        const allShimmers = document.querySelectorAll('.shimmer:not(.shimmer-fade-out)');
        allShimmers.forEach(element => {
            this.hide(element);
        });
    },

    /**
     * Skeleton screen state management
     * @param {string} selector - CSS selector or element
     * @param {boolean} isLoading - true for loading, false for loaded
     */
    setSkeleton(selector, isLoading) {
        const element = this._getElement(selector);
        if (element) {
            if (isLoading) {
                element.classList.add('is-loading');
                element.classList.remove('is-loaded');
            } else {
                element.classList.remove('is-loading');
                element.classList.add('is-loaded');
                
                // Clean up after animation
                setTimeout(() => {
                    element.classList.remove('is-loaded');
                }, 600);
            }
        }
    },

    /**
     * Helper: Get element from selector or element itself
     * @private
     */
    _getElement(selector) {
        if (typeof selector === 'string') {
            return document.querySelector(selector);
        }
        return selector;
    }
};
