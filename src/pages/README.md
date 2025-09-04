# CCSync Page Development Guide

This guide provides detailed instructions for creating and maintaining pages in the CCSync application. Our project uses Vite as the build tool and follows a modular architecture for better organization and maintainability.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Creating New Pages](#creating-new-pages)
3. [JavaScript Patterns](#javascript-patterns)
4. [CSS/SCSS Organization](#cssscss-organization)
5. [Component Usage](#component-usage)
6. [Best Practices](#best-practices)
7. [Authentication Protection](#authentication-protection)
8. [Responsive Design](#responsive-design)

## Project Structure

CCSync follows a feature-based organization with clear separation of concerns:

```plaintext
src/
├── assets/         # Static assets (images, icons)
├── js/
│   ├── pages/      # Page-specific JavaScript
│   │   ├── auth/   # Authentication pages scripts
│   │   ├── home/   # Home/dashboard scripts
│   │   └── ...     # Other feature areas
│   └── utils/      # Shared utilities and components
│       ├── components/ # Reusable UI components
│       └── core.js     # Core dependencies and imports
├── pages/          # HTML pages
│   ├── auth/       # Authentication pages
│   ├── home/       # Home/dashboard pages
│   └── ...         # Other feature areas
└── scss/           # Styling
    ├── components/ # Component styles
    ├── pages/      # Page-specific styles
    └── styles.scss # Global styles
```

## Creating New Pages

Follow these steps to add a new page to the application:

### 1. Create HTML File

Create your HTML file in the appropriate directory under `src/pages/`. For example:

```html
<!-- src/pages/profile/settings.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>User Settings - CCSync</title>
    <script type="module" src="/js/pages/profile/settings.js"></script>
  </head>
  <body>
    <!-- Page content here -->
  </body>
</html>
```

### 2. Create JavaScript File

Create a corresponding JavaScript file in the `js/pages/` directory:

```js
// src/js/pages/profile/settings.js
import '/js/utils/core.js';             // Core utilities and global styles
import '/scss/pages/profile/settings.scss'; // Page-specific styles
import { setupNavigation } from '/js/utils/navigation.js';
import { setSidebar } from '/js/utils/components/sidebar.js';

// Initialize page-specific functionality
function initSettings() {
  // Your page-specific code here
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setSidebar();
  initSettings();
});
```

### 3. Create SCSS File (if needed)

Create a page-specific SCSS file in the appropriate directory:

```scss
// src/scss/pages/profile/settings.scss

// Page-specific styles here
.settings-container {
  max-width: 800px;
  margin: 0 auto;
}

// More styles...
```

### 4. Register Page in Vite Config

Add your page to the Vite configuration file:

```js
// vite.config.js
import { resolve } from 'path';

export default {
  // other config options...
  build: {
    rollupOptions: {
      input: {
        // existing entries...
        settings: resolve(__dirname, 'src', 'pages', 'profile', 'settings.html'),
      }
    }
  }
};
```

## JavaScript Patterns

### Core Imports

The `core.js` file centralizes essential dependencies:

```js
// src/js/utils/core.js
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '/scss/styles.scss';
```

### Page-Specific Scripts

Each page should follow this structure:

```js
// 1. Import core utilities and styles
import '/js/utils/core.js';

// 2. Import page-specific styles
import '/scss/pages/feature/page.scss';

// 3. Import required components and utilities
import { utilityFunction } from '/js/utils/utility.js';
import { setupComponent } from '/js/utils/components/component.js';

// 4. Initialize page-specific functionality in a function
function initPage() {
  // Page initialization logic
}

// 5. Use event listener to ensure DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize components and page functionality
  utilityFunction();
  setupComponent();
  initPage();
});
```

## CSS/SCSS Organization

We follow a structured approach to CSS organization:

1. **Global Styles**: Defined in `styles.scss`
2. **Design System**: Variables, utilities, and base components
3. **Component Styles**: Reusable UI components in `scss/components/`
4. **Page-Specific Styles**: Custom styles for each page

### Using Our Design System

CCSync has a comprehensive design system. Always reference our design tokens:

```scss
// Use design system variables
.my-element {
  color: $primary-ccsync; // Brand color
  font-size: $font-size-base; // Standard font size
  padding: $spacer; // Standard spacing unit
}
```

## Component Usage

CCSync includes several reusable components:

### Sidebar Navigation

```js
// Import the sidebar component
import { setSidebar } from '/js/utils/components/sidebar.js';

// Initialize in your DOMContentLoaded handler
setSidebar();
```

### Authentication Flow

```js
// Import authentication utilities
import { setupLogout } from '/js/utils/navigation.js';

// Initialize in your DOMContentLoaded handler
setupLogout();
```

## Best Practices

1. **Always use absolute paths** starting with `/` for imports from the src directory
2. **Import core utilities first** before any other imports
3. **Keep page-specific logic separate** from component initialization
4. **Follow the design system** for consistent UI
5. **Use responsive design patterns** for all UI elements
6. **Verify authentication** on protected pages
7. **Follow established naming conventions**:
   - Files: lowercase with hyphens (`user-settings.html`)
   - JS functions: camelCase (`initUserSettings()`)
   - CSS classes: kebab-case (`.user-settings-container`)

## Authentication Protection

For pages that require authentication:

```js
function checkAuth() {
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "/ccsync-v1/pages/auth/login.html";
    return false;
  }
  return JSON.parse(user);
}

document.addEventListener("DOMContentLoaded", () => {
  const userData = checkAuth();
  if (!userData) return;
  
  // Continue with page initialization
});
```

## Responsive Design

Always implement responsive design for all pages:

```js
// Mobile-friendly navigation
import { setupMobileSidebarToggle } from "/js/utils/components/mobile_sidebar_toggle.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize mobile navigation
  setupMobileSidebarToggle();
});
```

## Performance Considerations

1. **Lazy load heavy resources** when possible
2. **Minimize unnecessary DOM manipulations**
3. **Use efficient selectors** for DOM queries
4. **Avoid redundant API calls**

---

> **Need Help?**
>
> - Check the design system documentation in `/docs/design-system.md`
> - Review component examples in the design system page `/design-system.html`
> - Refer to the architecture documentation for system-wide patterns
