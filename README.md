# CCSync - A PHP-Based Student and Semestral Management System for Digitized Record Keeping and Record Efficiency

![CCSync Logo](src/assets/logo/icons8-sync-50.svg)

CCSync is a comprehensive student and semestral management platform designed to streamline academic management and digitize organizational processes for educational institutions, starting with the College of Computer Studies.

## 🔗 Live Demo

- [CCSync Application](https://radleigh123.github.io/ccsync-v1/)
- [Design System](https://radleigh123.github.io/ccsync-v1/design-system.html)

**NOTE**: Backend functionality requires a local PHP server. 
[See backend setup instructions](https://github.com/radleigh123/ccsync-v1/tree/keane/feature/auth-fix/temp).

## 📖 Overview

CCSync is a PHP-based student and semestral management platform designed to streamline and digitize organizational processes, starting with the College of Computer Studies.

It manages student records, requirements, events, and officer information, ensuring smooth and paperless transactions.
The system aims to replace manual forms and logs for semestral requirements (such as membership fees and event attendance) with a centralized, consistent, and accessible platform.

## 👥 Project Team  
- **IGOT, Went Ruzel**  
- **INTING, Keane Radleigh**  
- **JAKOSALEM, Joshua**  
- **TUNDAG, Laine Pearl** 

## �️ Tech Stack

### Frontend
- Vite.js (Build tool)
- Vanilla JavaScript (Core programming)
- SCSS/Sass (Styling with enhanced design system)
- Bootstrap 5 (Component framework)
- Bootstrap Icons (Icon library)

### Backend
- PHP (Server-side processing)
- MySQL (Database)
- RESTful API architecture

## 📂 Project Structure

```plaintext
ccsync-v1/
├── docs/                  # Documentation files
│   └── design-system.md
├── public/                # Static files
├── src/
│   ├── assets/            # Images, icons, and other static assets
│   ├── js/
│   │   ├── pages/         # Page-specific JavaScript
│   │   │   ├── auth/
│   │   │   ├── home/
│   │   │   └── ...
│   │   └── utils/
│   │       ├── components/# Reusable UI components
│   │       └── core.js    # Core dependencies and imports
│   ├── pages/             # HTML pages organized by feature
│   │   ├── auth/
│   │   ├── home/
│   │   ├── profile/
│   │   └── settings/
│   └── scss/
│       ├── components/    # Component-specific styles
│       ├── pages/         # Page-specific styles
│       ├── _components.scss
│       ├── _responsive.scss
│       ├── _typography.scss
│       ├── _utilities.scss
│       ├── _variables.scss
│       └── styles.scss       # Main stylesheet entry point
├── temp/                  # Backend PHP files
│   ├── auth/
│   ├── config/
│   └── MySQL_DB/
├── vite.config.js
├── package.json
└── README.md
```

## 🔧 Setup Instructions

### Frontend Development

1. Clone the repository:

   ```bash
   git clone https://github.com/radleigh123/ccsync-v1.git
   cd ccsync-v1
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5137
   ```

## 🔐 Authentication Flow

CCSync uses a secure authentication flow:

1. **Registration**:
   - User provides name, email, and password
   - Password is hashed using PHP's `password_hash()` function
   - User data is stored in MySQL database

2. **Login**:
   - User provides email and password
   - Server validates credentials and returns user data and token
   - Frontend stores authentication data in localStorage

3. **Session Management**:
   - Authentication state is checked on page load
   - Unauthenticated users are redirected to login
   - Session token expires after set duration

4. **Logout**:
   - Clears local storage data
   - Redirects to login page

## 📸 Screenshots 

### Authentication Screens

- **Login Page**  
  ![Login Page](./src/assets/screenshots/login.png)  

- **Register Page**  
  ![Register Page](./src/assets/screenshots/register.png)  

- **Forgot Password Page**  
  ![Forgot Password Page](./src/assets/screenshots/forgot-password.png)

### Main Application

- **Home Page**
  ![Home Page](./src/assets/screenshots/homepage-1.png)
  ![Home Page](./src/assets/screenshots/homepage-2.png)
  ![Home Page](./src/assets/screenshots/homepage-3.png)

## 🎨 Design System

CCSync includes a comprehensive design system with consistent UI components:

- **Color System**: Branded colors with semantic meaning
- **Typography**: Consistent text styles and hierarchies
- **Components**: Reusable UI elements with defined behavior
- **Spacing**: Consistent layout spacing
- **Responsive Utilities**: Classes for adaptive layouts

You can view the design system documentation in the [design-system.md](./docs/design-system.md) file or explore the [live design system page](https://radleigh123.github.io/ccsync-v1/design-system.html).

### Coding Standards

- Follow established naming conventions:
  - Files: lowercase with hyphens (`user-settings.html`)
  - JS functions: camelCase (`initUserSettings()`)
  - CSS classes: kebab-case (`.user-settings-container`)
- Always import core utilities first in JavaScript files
- Use absolute paths for imports starting with `/`
- Follow the design system for consistent UI

### Helpful VS Code Plugins

- **Todo Tree** (Gruntfuggly) - helps identify and list out TODOs
- **Bootstrap 5 Quick Snippets** (Anbuselvan Rocky) - helpful snippets for quick development
- **Live Sass Compiler** - For compiling SCSS files in real-time
- **Prettier** - Code formatter for consistent style

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- [Bootstrap](https://getbootstrap.com/) - Frontend component library
- [Vite](https://vitejs.dev/) - Build tooling
- [Bootstrap Icons](https://icons.getbootstrap.com/) - Icon library
- [Inter Font](https://rsms.me/inter/) - Typography
- [Bootstrap Vite Guide](https://getbootstrap.com/docs/5.3/getting-started/vite/) - Documentation
