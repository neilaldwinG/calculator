SMART CALCULATOR — SETUP GUIDE (XAMPP)

REQUIREMENTS
- XAMPP (Apache + MySQL)
- Node.js and npm

1. BACKEND SETUP
- Copy the entire backend folder into: C:\xampp\htdocs\smart-calculator\backend
- Open http://localhost/phpmyadmin
- Import backend/database.sql
- Check backend/config/database.php. Default XAMPP settings are root with a blank password.

2. FRONTEND SETUP
- Open a terminal in the frontend folder.
- Run: npm install
- Run: npm run dev
- Open the local URL shown by Vite, usually http://localhost:5173

3. TEST
- Make sure Apache and MySQL are running in XAMPP.
- Try 12 + 8, press =, and check that the result appears in History.
- Refresh the page; history should still be there because it is stored in MySQL.

IMPORTANT
- The frontend API URL is set in frontend/src/App.jsx to:
  http://localhost/smart-calculator/backend/api/calculations.php
- If you use a different folder name or port, update the API URL and the CORS origin in backend/api/calculations.php.
- This is a classroom/demo starter. For public deployment, add authentication, CSRF protection, stricter request limits, and HTTPS.
