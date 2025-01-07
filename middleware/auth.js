const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;

// Middleware for Admin Authentication
exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check if token is available
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Not authorized" });
            } 
            // Check if the role is admin
            if (decodedToken.role !== "admin") {
                return res.status(401).json({ message: "Not authorized" });
            } 
            next(); // User is an admin, proceed to the next middleware
        });
    } else {
        return res.status(401).json({ message: "Not authorized, token is not available" });
    }
};

// Middleware for Basic User Authentication
exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check if token is available
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Not authorized" });
            } 
            // Check if the role is Basic User
            if (decodedToken.role !== "Basic") {
                return res.status(401).json({ message: "Not authorized" });
            } 
            next(); // User is authorized, proceed to the next middleware
        });
    } else {
        return res.status(401).json({ message: "Not authorized, token is not available" });
    }
};
