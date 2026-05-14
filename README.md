
# 🚀 Melike Zeynep Şen - Full-Stack Web Portfolio

Hello! This project is a comprehensive, dynamic portfolio web application developed as part of my Web Technologies coursework. It is not just an assignment; it is a professional asset that I use in my career to showcase my skills to potential employers.

Built with modern web development tools and methodologies, it features full integration of HTML5, CSS3, JavaScript, PHP, and MySQL.

---

## ✨ Key Features

### 🎨 Frontend (Client-Side)
- **Semantic HTML5 & Advanced CSS3:** Accessible and SEO-friendly markup, fully responsive design using CSS Grid, Flexbox, and the Box Model.
- **Dynamic UI (JS/DOM):** Hero image slider, typing animation, dark/light mode toggle, smooth scrolling, and scroll-triggered animations.
- **Form Validation:** Real-time client-side validation using JavaScript before submitting the contact form to the server.
- **AJAX Integration:** Asynchronous data fetching and posting using the Fetch API without page reloads.

### ⚙️ Backend & Database (Server-Side)
- **Contact Management:** User messages from the "Contact Me" form are saved directly into a MySQL database.
- **Dynamic Content:** Projects and content are fetched from the database and rendered dynamically on the frontend.
- **CRUD Operations:** Full Create, Read, Update, and Delete operations for projects and messages via the Admin Dashboard.

### 🔒 State Management & Security
- **Admin Authentication:** Secure login handling using PHP's `password_hash()` for password encryption.
- **Sessions & Cookies:** Server-side session management for admin state, and cookies for the "Remember Me" functionality.
- **Authorization:** Middleware checks on API endpoints to prevent unauthorized access.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Tailwind CSS, Custom CSS), JavaScript (ES6+, Fetch API, DOM Manipulation) |
| **Backend** | PHP (Procedural), MySQL |
| **Database** | MySQL (Managed via phpMyAdmin) |
| **Environment** | XAMPP (Apache Server) |
| **Version Control** | Git & GitHub |

---

## 📂 Project Structure

```text
portfolio/
├── index.html              # Main single-page application (SPA approach)
├── database.sql            # MySQL database and table creation script
├── config.php              # Database connection and session configurations
├── api/
│   ├── auth.php            # Login/Logout & Session API
│   ├── projects.php        # Projects CRUD API
│   └── messages.php        # Messages CRUD API
```

---

## 🚀 Installation & Setup

To run this project on your local machine, follow these steps:

### Prerequisites
- [XAMPP](https://www.apachefriends.org/) (Includes PHP and MySQL) or a similar local server environment.

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   ```

2. **Move to XAMPP Directory:**
   Move the cloned `portfolio` folder into XAMPP's `htdocs` directory:
   ```bash
   # Windows Example
   C:\xampp\htdocs\portfolio
   ```

3. **Setup the Database:**
   - Start Apache and MySQL from the XAMPP Control Panel.
   - Navigate to [phpMyAdmin](http://localhost/phpmyadmin) in your browser.
   - Go to the "Import" tab, select the `database.sql` file from the project directory, and import it. This will create the `portfolio_db` database and seed it with default records.

4. **Configure Database Connection:**
   - Open `config.php`. If you are not using the default XAMPP credentials, update them accordingly:
     ```php
     $host = 'localhost';
     $db   = 'portfolio_db';
     $user = 'root'; // Default XAMPP user
     $pass = '';     // Default XAMPP password
     ```

5. **Launch the Application:**
   Open your browser and navigate to:
   ```
   http://localhost/portfolio/
   ```

---

## 🔑 Admin Dashboard Access

Click the shield icon in the top right corner of the website to access the administrative dashboard.

**Demo Credentials:**
- **Username:** `melike`
- **Password:** `admin123`

*Note: The "Remember Me" checkbox utilizes cookies for session persistence across browser closures.*

---

## 🌐 API Endpoints

The project utilizes RESTful PHP APIs:

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects.php` | Fetch all projects | Public |
| `POST` | `/api/projects.php` | Add a new project | Admin |
| `PUT` | `/api/projects.php` | Update an existing project | Admin |
| `DELETE` | `/api/projects.php?id=X` | Delete a project | Admin |
| `POST` | `/api/messages.php` | Submit a new contact message | Public |
| `GET` | `/api/messages.php` | List all messages | Admin |
| `PUT` | `/api/messages.php` | Mark a message as "read" | Admin |
| `POST` | `/api/auth.php` | Log in | Public |
| `DELETE` | `/api/auth.php` | Log out | Admin |



## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## 📬 Contact

Melike Zeynep Şen
- **GitHub:** [github.com/melikezeynepsen](https://github.com/mlkzynp)
