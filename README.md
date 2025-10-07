# 🏡 Nestify

Nestify is a **house booking platform** inspired by Airbnb, built with **Node.js, Express, MongoDB, and EJS**.  
It allows users to browse, book, and host homes with a smooth and secure experience.

---

## ✨ Features

- 🔑 **Authentication** – User signup/login with sessions  
- 🏠 **Host Dashboard** – Hosts can add, update, and manage their homes  
- 🔍 **Search & Browse** – Explore homes with details like price, rating, and description  
- 📷 **Image Uploads** – Hosts can upload home images (via Multer)  
- 💾 **MongoDB Storage** – All data stored in MongoDB Atlas  
- ⚡ **Responsive UI** – EJS templating with a clean layout  

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express  
- **Database:** MongoDB Atlas with Mongoose ODM  
- **Templating:** EJS  
- **File Uploads:** Multer  
- **Authentication:** express-session with connect-mongodb-session  
- **Styling:** Tailwind CSS  
- **Password Hashing:** bcryptjs  
- **Deployment:** Vercel (serverless-http)  

---

## 🏗️ Project Architecture

The project follows the MVC (Model-View-Controller) pattern:

- **Models:** Define MongoDB schemas for `User` and `Home` in the `models/` directory.  
- **Views:** EJS templates located in the `views/` directory render dynamic HTML pages.  
- **Controllers:** Handle business logic and interact with models, located in `controllers/`.  
- **Routes:** Define URL endpoints and map them to controllers, located in `routes/`.  
- **Public:** Static assets like CSS, JS, and uploaded images are served from `public/`.  
- **Utils:** Helper functions and utilities are in `utils/`.  

---

## 📊 Database Schema Overview

- **User Model:** Stores user information including first name, last name, email, hashed password, user type (`guest` or `host`), and a list of favourite homes.  
- **Home Model:** Stores home details such as house name, price, location, rating, description, and photo path.

---

## ⚙️ Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nestify.git
   cd nestify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   SESSION_SECRET=your_secret_key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. The app will be accessible at `http://localhost:3000`.

---

## 🚪 Usage Guide

- **Authentication:** Users can sign up and log in. Sessions are managed securely.  
- **Hosting:** Logged-in hosts can add, edit, and delete home listings with image uploads.  
- **Browsing:** Guests can browse homes, view details, and add favourites.  
- **File Uploads:** Hosts upload images for their homes, stored in `public/uploads/`.  
- **Session Management:** User sessions are stored in MongoDB for persistence.

---

## ☁️ Deployment

- The app is configured for deployment on Vercel using serverless functions.  
- The `serverless-http` package wraps the Express app for compatibility.  
- Environment variables must be set in the deployment environment.

---

## 📂 Project Structure

```
nestify/
├── controllers/          # Route controllers
├── models/               # MongoDB models (User, Home)
├── routes/               # Express routes (auth, host, store)
├── views/                # EJS templates for rendering pages
├── public/               # Static assets (CSS, JS, uploaded images)
├── utils/                # Utility functions
├── app.js                # Main server file
├── package.json          # Project dependencies and scripts
├── README.md             # Project documentation
└── .env                  # Environment variables (not committed)
```

---

For detailed explanation of the main server file `app.js`, please refer to [APP_JS_EXPLANATION.md](APP_JS_EXPLANATION.md).

---

This documentation provides a comprehensive overview of the Nestify project, its architecture, tech stack, and usage to help interviewers and developers understand the system quickly.
