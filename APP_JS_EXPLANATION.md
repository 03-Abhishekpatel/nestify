# Line-by-Line Explanation of app.js

This document provides a detailed explanation of each line/section in `app.js`, the main entry point of the Nestify application.

## Core Module Imports

```javascript
// Core Module
const path = require('path');
```
- **What it is**: Imports Node.js built-in `path` module.
- **What it does**: Provides utilities for working with file and directory paths.
- **Why used**: Used to construct absolute paths for views, static files, and file uploads in a cross-platform way.

```javascript
// External Modules
const express = require('express');
```
- **What it is**: Imports the Express.js framework.
- **What it does**: Creates the web server and handles HTTP requests/responses.
- **Why used**: Express is the core framework for building the REST API and serving web pages.

```javascript
const session = require('express-session');
```
- **What it is**: Imports Express session middleware.
- **What it does**: Manages user sessions for authentication and state.
- **Why used**: Enables user login/logout functionality and maintains user state across requests.

```javascript
const MongoDBStore = require('connect-mongodb-session')(session);
```
- **What it is**: Imports MongoDB session store for express-session.
- **What it does**: Stores session data in MongoDB instead of memory.
- **Why used**: Persistent session storage across server restarts and for production scalability.

```javascript
const multer = require('multer');
```
- **What it is**: Imports Multer middleware for file uploads.
- **What it does**: Handles multipart/form-data for file uploads.
- **Why used**: Allows hosts to upload home images to the server.

```javascript
const mongoose = require('mongoose');
```
- **What it is**: Imports Mongoose ODM for MongoDB.
- **What it does**: Provides schema-based modeling for MongoDB collections.
- **Why used**: Defines data models (User, Home) and interacts with the database.

```javascript
const serverless = require('serverless-http');
```
- **What it is**: Imports serverless-http wrapper.
- **What it does**: Converts Express app to AWS Lambda compatible function.
- **Why used**: Enables deployment to Vercel (serverless platform).

```javascript
require('dotenv').config(); // Load .env file
```
- **What it is**: Loads environment variables from .env file.
- **What it does**: Makes environment variables available via `process.env`.
- **Why used**: Keeps sensitive data (database URI, secrets) out of source code.

## Local Module Imports

```javascript
// Local Modules
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
```
- **What it is**: Imports custom route modules.
- **What it does**: Defines route handlers for different app sections.
- **Why used**: Organizes routes by functionality (store browsing, hosting, authentication).

```javascript
const rootDir = require("./utils/pathUtil");
```
- **What it is**: Imports utility for getting root directory path.
- **What it does**: Provides helper function for path operations.
- **Why used**: Centralizes path utility logic.

```javascript
const errorsController = require("./controllers/errors");
```
- **What it is**: Imports error handling controller.
- **What it does**: Handles 404 and other error responses.
- **Why used**: Provides consistent error handling across the app.

## App Initialization

```javascript
const app = express();
```
- **What it is**: Creates Express application instance.
- **What it does**: Initializes the Express app object.
- **Why used**: This is the main application object that handles all requests.

## View Engine Setup

```javascript
// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
```
- **What it is**: Configures EJS as the template engine.
- **What it does**: Sets EJS for rendering dynamic HTML and specifies views directory.
- **Why used**: Enables server-side rendering of HTML templates with dynamic data.

## Session Store Configuration

```javascript
// MongoDB Session Store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
});
```
- **What it is**: Configures MongoDB as session storage.
- **What it does**: Creates a session store that persists data in MongoDB.
- **Why used**: Ensures sessions survive server restarts and work in distributed environments.

## Multer Configuration

```javascript
// Multer Config (for file uploads)
const randomGenerator = () => Math.random().toString(36).substring(2, 10);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Store inside public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, randomGenerator() + '-' + file.originalname);
  }
});

const multerOptions = { storage };
```
- **What it is**: Configures file upload storage.
- **What it does**: Defines where and how uploaded files are stored.
- **Why used**: Generates unique filenames and stores images in the public directory.

## Middleware Setup

```javascript
// Middleware
app.use(multer(multerOptions).single('photo'));
```
- **What it is**: Applies Multer middleware for single file uploads.
- **What it does**: Processes file uploads with field name 'photo'.
- **Why used**: Enables image upload functionality for home listings.

```javascript
// ✅ Serve static files from public
app.use(express.static(path.join(process.cwd(), 'public')));
```
- **What it is**: Serves static files (CSS, JS, images).
- **What it does**: Makes public directory accessible via HTTP.
- **Why used**: Allows browser to load stylesheets, scripts, and uploaded images.

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```
- **What it is**: Parses incoming request bodies.
- **What it does**: Converts JSON and URL-encoded data to JavaScript objects.
- **Why used**: Enables reading form data and JSON payloads from requests.

```javascript
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback_secret",
  resave: false,
  saveUninitialized: true,
  store
}));
```
- **What it is**: Configures session middleware.
- **What it does**: Enables session management with MongoDB storage.
- **Why used**: Manages user authentication state across requests.

```javascript
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});
```
- **What it is**: Custom middleware for authentication status.
- **What it does**: Adds login status to every request object.
- **Why used**: Makes authentication state available in templates and controllers.

## Route Setup

```javascript
// Routes
app.use(authRouter);
app.use(storeRouter);
```
- **What it is**: Mounts route modules.
- **What it does**: Registers authentication and store routes.
- **Why used**: Organizes route handling by feature area.

```javascript
// Protect /host routes
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);
```
- **What it is**: Protects host routes with authentication middleware.
- **What it does**: Redirects unauthenticated users and mounts host routes.
- **Why used**: Ensures only logged-in users can access hosting features.

```javascript
// Error Controller
app.use(errorsController.pageNotFound);
```
- **What it is**: Registers 404 error handler.
- **What it does**: Catches unmatched routes and shows 404 page.
- **Why used**: Provides user-friendly error pages for invalid URLs.

## Database Connection

```javascript
// ✅ Mongoose connection (only once)
let isConnected = false;
async function connectToMongo() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
connectToMongo();
```
- **What it is**: Establishes MongoDB connection.
- **What it does**: Connects to MongoDB Atlas with connection pooling.
- **Why used**: Enables database operations throughout the app.

## Server Startup

```javascript
// ✅ Conditional listen for local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
```
- **What it is**: Starts the server in development mode.
- **What it does**: Listens on specified port when run directly.
- **Why used**: Allows local development while supporting serverless deployment.

## Serverless Export

```javascript
// ✅ Export handler for Vercel
module.exports = app;
module.exports.handler = serverless(app);
```
- **What it is**: Exports app for serverless deployment.
- **What it does**: Makes app compatible with Vercel/serverless platforms.
- **Why used**: Enables deployment to cloud platforms without managing servers.
