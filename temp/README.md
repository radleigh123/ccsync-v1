## Local Server Setup

#### Prerequites


- **XAMPP** Download and install from Apache Friends. This includes Apache (web server) and PHP (interpreter).
- **Postman** (optional)

#### File Setup

1. Locate your XAMPP installation directory Typically:
   - Windows: `C:\xampp\htdocs` 
2. Create the following folders for the project:
    ```
    C:\xampp\htdocs\demo\ccsync\auth\
    C:\xampp\htdocs\demo\ccsync\config\
    ```
3. Copy the `login.php` & `register.php` file From this repository’s current directory and paste into **auth** folder.
4. Copy the `database.php` and paste into **config** folder.

#### Database Setup

1. Go to [http://localhost/phpmyadmin](http://localhost/phpmyadmin) in your browser.
2. In the left sidebar, click **New** to create a new database.
3. Name the database (e.g., `ccsync01`) and click **Create**.
4. Once inside the new database, click the **Import** tab at the top.
5. Click **Choose File** and select the `.sql` file from your project directory.
6. Make sure the format is set to **SQL**, then click **Go** to import.
7. You should see a success message and the tables listed in the left sidebar.

---

#### NOTES

- This setup is for ***local development only***.
- Make sure Apache (**XAMPP**) is running before testing.