# Calculator

A simple calculator web application developed using React, PHP, and MySQL. It can perform basic mathematical operations and save previous calculations in a database so users can view their calculation history.

## Technologies Used
- React (Frontend)
- PHP (Backend)
- MySQL (Database)
- XAMPP (Local Server)
- Node.js and npm

## Requirements
- XAMPP installed
- Node.js and npm installed
- Git (for downloading the project)

## Installation and Setup

### 1. Set Up the Backend
1. Copy the `backend` folder into `D:\xampp\htdocs\smart-calculator\`.
2. Open XAMPP and start Apache and MySQL.
3. Open phpMyAdmin at `http://localhost/phpmyadmin`.
4. Import the `backend/database.sql` file into MySQL.
5. Check the database settings in `backend/config/database.php`.

### 2. Set Up the Frontend
1. Open the project folder in VS Code.
2. Open a terminal inside the `frontend` folder.
3. Run `npm install` to install the required packages.
4. Run `npm run dev` to start the application.
5. Open the local URL provided by Vite, usually `http://localhost:5173`.

## Testing
1. Make sure Apache and MySQL are running.
2. Open the calculator in your browser.
3. Try a calculation, such as `12 + 8`.
4. Press the equals button.
5. Check the History section to see if the calculation was saved.
6. Refresh the page and check if the history is still displayed.

## Note
The application currently runs locally using XAMPP. The frontend connects to the PHP backend through the API URL configured in `frontend/src/App.jsx`.
