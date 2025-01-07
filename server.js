const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const { adminAuth, userAuth } = require("./middleware/auth");

// Initialize Express app
const app = express();

// Load environment variables
dotenv.config();

// Set EJS as the template engine
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB()
    .then(() => {
        console.log("✅ Connected to MongoDB successfully");

        // Start the server
        const PORT = process.env.PORT || 3000;
        const server = app.listen(PORT, () =>
            console.log(`🚀 Server is running on port ${PORT}`)
        );

        // Handle unhandled promise rejections
        process.on("unhandledRejection", (err) => {
            console.error(`❌ Unhandled Rejection: ${err.message}`);
            server.close(() => process.exit(1)); // Exit process after closing the server
        });
    })
    .catch((err) => {
        console.error(`❌ Failed to connect to MongoDB: ${err.message}`);
        process.exit(1); // Exit process if DB connection fails
    });

// Public Routes
app.get("/", (req, res) => res.render("home"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));

// User Routes
app.get("/getusers", userAuth, (req, res) => res.render("user"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));

// Admin Routes
app.get("/admin", adminAuth, (req, res) => res.render("admin"));

// Logout Route
app.get("/logout", (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 }); // Immediately expire the cookie
    res.redirect("/");
});

// API Routes
app.use("/api/auth", require("./Auth/Route"));

// Handle Undefined Routes
app.use((req, res) => {
    res.status(404).send("Page not found");
});
