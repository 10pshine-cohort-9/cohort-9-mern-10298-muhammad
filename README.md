# NoteMaster Pro

NoteMaster Pro is a full-stack premium MERN (MySQL, Express, React, Node.js) application designed to securely capture, organize, and manage your ideas. This project is a comprehensive submission for Cohort 9 by Muhammad Shayan Mughal.

## 🚀 Features Implemented

1. **Premium Authentication System**
   - High-quality 50/50 split-screen login and registration UI with glassmorphism effects.
   - Secure JWT (JSON Web Tokens) based authentication and route protection.
   - Password hashing and robust validation.

2. **Advanced Notes Management (CRUD)**
   - Create, Read, Update, and Delete notes.
   - Rich Text Editor integrated via `react-quill` for advanced note formatting.

3. **Search and Filtering**
   - Live Search bar in the dashboard to instantly filter notes by title and content.

4. **User Profile Modal**
   - Clean, modal-based User Profile viewer.
   - Displays real-time data fetched from the backend (Name, Email, Account Creation Date).

5. **Bulk Data Export / Import**
   - Easily download all your notes as a portable `.json` file for backup.
   - Instantly restore or bulk-import notes by uploading a `.json` file back into the dashboard.

6. **SonarQube Code Quality Integration**
   - Full code quality analysis setup configuration.
   - Reports and screenshots documenting 0 bugs and high maintainability.

## 📁 Project Structure
- **/frontend**: React.js / Vite application with tailored CSS and modern UI components.
- **/backend**: Express.js server, MySQL database connection, authentication routes, and note controllers.
- **/Docs**: Contains the SonarQube quality analysis reports (`Sonarqube.pdf`) and screenshots.

## 🛠️ Setup Instructions

### Backend Setup
1. Navigate to `/backend`.
2. Run `npm install`.
3. Create a `.env` file with your `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `JWT_SECRET`.
4. Run `npm run dev` to start the server.

### Frontend Setup
1. Navigate to `/frontend`.
2. Run `npm install`.
3. Create a `.env` file with `VITE_API_URL=http://localhost:5000/api`.
4. Run `npm run dev` to start the frontend server.

## 📊 Code Quality
This project has been thoroughly analyzed using **SonarQube**. 
Please refer to the `Docs/` directory for the comprehensive `.pdf` report proving code quality and structural integrity.
