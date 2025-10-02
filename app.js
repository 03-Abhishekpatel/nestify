// Core Module
const path = require('path');

// External Modules
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
require('dotenv').config(); // Load .env file

// Local Modules
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// MongoDB Session Store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
});

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

// Middleware
app.use(multer(multerOptions).single('photo'));

// ✅ Serve static files from public
app.use(express.static(path.join(rootDir, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "fallback_secret",
  resave: false,
  saveUninitialized: true,
  store
}));

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

// Routes
app.use(authRouter);
app.use(storeRouter);

// Protect /host routes
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);

// Error Controller
app.use(errorsController.pageNotFound);

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

// ✅ Conditional listen for local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// ✅ Export handler for Vercel
module.exports = app;
module.exports.handler = serverless(app);
