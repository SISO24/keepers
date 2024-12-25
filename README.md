
# Keeper Notes App  

## Description  
The Keeper Notes App is a web application that allows users to sign up, log in, and manage their personal notes. Users can create, edit, and delete notes, which are displayed dynamically in a flexbox layout. The application uses secure authentication with hashed passwords, session management for user login persistence, and a PostgreSQL database for storing user data and notes.

---

## Features  
- **User Authentication**:  
  - Signup and login functionality with password hashing using bcrypt and saltrounds.  
  - Session-based login persistence for enhanced security.  

- **Notes Management**:  
  - Users can create new notes via a simple input box.  
  - Notes are displayed dynamically in a flexbox layout.  
  - Each note has options to edit or delete.  

- **Welcome Message**:  
  - Displays a personalized "Welcome [username]" message at the top of the content page.  

---

## Technologies Used  
- **Frontend**:  
  - HTML  
  - CSS (Flexbox for layout)  
  - EJS (Embedded JavaScript Templates)  

- **Backend**:  
  - JavaScript (Node.js with Express framework)  

- **Database**:  
  - PostgreSQL  

- **Packages/Dependencies**:  
  - `bcrypt` for password hashing.  
  - `body-parser` for parsing request bodies.  
  - `dotenv` for managing environment variables.  
  - `express-session` for session management.  
  - `express` for routing and server setup.  
  - `pg` for PostgreSQL database interaction.  

---

## Project Structure  

project-root
│
├── views/
│ ├── index.ejs # Signup/landing page
│ ├── login.ejs # Login page
│ └── content.ejs # Main content page with notes
│
├── public/
│ └── styles.css # Styling for the application
│
├── index.js # Main server file
├── package.json # Project metadata and dependencies
├── .env # Environment variables (database credentials, etc.)
└── README.md # Project documentation



---

## How It Works  

1. **Signup**:  
   - Users enter their email and password on the signup page (`index.ejs`).  
   - Passwords are hashed using `bcrypt` with saltrounds before being stored in the PostgreSQL database.  

2. **Login**:  
   - Users log in with the same credentials on the login page (`login.ejs`).  
   - On successful authentication, the user is redirected to the main content page (`content.ejs`).  

3. **Content Page**:  
   - The top of the page displays a personalized "Welcome [username]" message.  
   - Below it, users can enter thoughts in an input box and submit them.  
   - Submitted thoughts are displayed in individual divs, arranged in a flexbox layout.  

4. **Edit/Delete Notes**:  
   - Each note has edit and delete buttons for easy management.  
   - Edit allows the user to update the note content.  
   - Delete removes the note from the database and the UI.  

---

## Setup and Installation  

1. **Clone the Repository**:  
   Clone the project from the GitHub repository:  
   ```bash
   git clone https://github.com/SISO24/keepers.git
   cd keeper-notes-app
   
## Install Dependencies
npm install 

## .env file
DB_USER=<your-database-username>
DB_PASSWORD=<your-database-password>
DB_HOST=localhost
DB_NAME=keeper_notes
SESSION_SECRET=<your-secret-key>

## Start the application
node index.js

## Access the Application

http://localhost:3000  



---

### Key Points to Remember:
- Replace the placeholders like `<your-database-username>`, `<your-database-password>`, and `<your-secret-key>` in the `README.md` with your actual credentials **locally**, but never share them publicly.
- Use `.env` to store real values privately.
- Add `.env` to your `.gitignore` file to ensure it's not uploaded to GitHub.

Let me know if you need any more adjustments! 😊



