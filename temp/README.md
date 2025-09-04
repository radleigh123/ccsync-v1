# Setting Up a Local PHP Server for CCSync

This guide provides step-by-step instructions for setting up a local PHP server to run CCSync's backend.

### Prerequisites

You'll need one of the following local server environments based on your operating system:
- **Windows**: XAMPP, WampServer, or PHP built-in server
- **macOS**: MAMP, Laravel Valet, or PHP built-in server
- **Linux**: LAMP stack, Docker, or PHP built-in server

## Using XAMPP

XAMPP provides an easy-to-install package with Apache, MySQL, PHP, and more.

Step 1: Install XAMPP

1. Download XAMPP from Apache Friends for your operating system
2. Run the installer and follow the prompts:
   - **Windows**: Choose components (Apache, MySQL, and PHP are required)
   - **macOS**: Drag to Applications folder
   - **Linux**: Make the installer executable and run it

Step 2: Set Up Project Files

1. Locate your XAMPP web root directory:
   - **Windows**: htdocs
   - **macOS**: `/Applications/XAMPP/htdocs`
   - **Linux**: `/opt/lampp/htdocs` or similar
2. Create the necessary directory structure:
    ```text
    htdocs/
    └── demo/
        └── ccsync/
            ├── auth/
            └── config/
    ```
3. Copy the backend files:
- Copy `login.php` and `register.php` from `auth` to `htdocs/demo/ccsync/auth/`
- Copy `database.php` from `config` to `htdocs/demo/ccsync/config/`

Step 3: Start the Server

1. Open the XAMPP Control Panel:

   - **Windows**: From the Start Menu
   - **macOS**: Open from Applications
   - **Linux**: Run `sudo /opt/lampp/lampp start` or use the manager

2. Start Apache and MySQL services by clicking their respective "Start" buttons

Step 4: Set Up the Database

1. Open your web browser and navigate to http://localhost/phpmyadmin
2. Create a new database:
   - Click "New" in the left sidebar
   - Enter `ccsync01` as the database name and click "Create"
3. Import the database schema:
   - Select the new database from the left sidebar
   - Click the "Import" tab
   - Click "Choose File" and select the `ccsync01.sql` file from the MySQL_DB directory
   - Click "Go" to import the schema

Step 5: Configure the Application

1. Open the frontend project in your code editor
2. Update API endpoints in your JavaScript files:
   - For `login.js`, `register.js`, etc., ensure API URLs point to:
    ```javascript
    const response = await fetch("http://localhost/demo/ccsync/auth/login.php", {
        // ... rest of the code
    });
    ```
## Troubleshooting Common Issues

### Issue: "Access Denied" When Connecting to MySQL

1. Check your database username and password in database.php
2. For XAMPP, the default is usually:
   ```php
   $username = "root";
   $password = "";  // Empty password by default
   ```
3. Verify MySQL is running in your control panel

### Issue: "Connection Refused" When Making API Requests

1. Ensure Apache/PHP server is running
2. Check URL paths match your directory structure
3. Verify CORS headers in PHP files match your frontend origin

### Issue: "Port Already in Use"

1. Check for other services using the same port:
   ```bash
   # Windows
   netstat -ano | findstr :8080

   # macOS/Linux
   lsof -i :8080
   ```
2. Change the port in your server configuration or kill the conflicting process

### Issue: PHP Extensions Not Available

1. For XAMPP, ensure the required extensions are enabled in `php.ini`
2. Common required extensions:
   - `extension=pdo_mysql`
   - `extension=mysqli`
   - Uncomment these lines by removing the semicolon (`;`) in front

## Testing Your Setup

1. Start your frontend application:
   ```bash
   npm run dev
   ```
2. Navigate to the login page
3. Try registering a new user
4. Check the database to verify the user was created
5. Test login functionality

## Security Notes

- This setup is for **local development only**
- Never use empty passwords or default credentials in production
- Consider implementing proper authentication mechanisms before deploying
