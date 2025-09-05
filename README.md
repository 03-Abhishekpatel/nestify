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

## 📂 Project Structure

nestify/
├── controllers/ # Route controllers
├── models/ # MongoDB models
├── routes/ # Express routes
├── views/ # EJS templates
├── public/ # Static assets (CSS, JS)
├── uploads/ # Uploaded images
├── utils/ # Utility functions
├── app.js # Main server file
├── package.json
├── .env # Environment variables (ignored in git)
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/nestify.git
cd nestify
npm install
MONGO_URI=your_mongodb_connection_string
PORT=3000
SESSION_SECRET=your_secret_key

🚀 Tech Stack

Backend: Node.js, Express

Database: MongoDB Atlas

Templating: EJS

File Uploads: Multer

Session Store: connect-mongodb-session
