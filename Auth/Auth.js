const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret = process.env.jwtSecret;

// **Register Function**
exports.register = async (req, res, next) => {
    const { username, password } = req.body;

    if (password.length < 10) {
        return res.status(400).json({ message: "Password must be at least 10 characters long" });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user with hashed password
        const user = await User.create({
            username,
            password: hashedPassword,
        });

        // Generate JWT
        const maxAge = 3 * 60 * 60; // Token expiry: 3 hours
        const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            { expiresIn: maxAge }
        );

        // Set cookie with the token
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // Convert to milliseconds
        });

        // Respond with success message
        res.status(200).json({
            message: "User successfully created",
            user: user._id,
            token,
        });
    } catch (error) {
        res.status(401).json({
            message: "User creation failed",
            error: error.message,
        });
    }
};

// **Login Function**
exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password are required" });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Login failed", error: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Generate JWT
            const maxAge = 3 * 60 * 60; // Token expiry: 3 hours
            const token = jwt.sign(
                { id: user._id, username, role: user.role },
                jwtSecret,
                { expiresIn: maxAge }
            );

            // Set cookie with the token
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000, // Convert to milliseconds
            });

            // Send back user data along with the token for front-end display
            res.status(200).json({
                message: "Login successful",
                user: { id: user._id, username: user.username, role: user.role },
                token,
            });
        } else {
            res.status(400).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        res.status(400).json({
            message: "An error occurred during login",
            error: error.message,
        });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("jwt"); // Clear the JWT cookie
    res.status(200).json({ message: "Logged out successfully" });
};

// **Update User Role Function**
exports.update = async (req, res, next) => {
    const { role, id } = req.body;

    if (!role || !id) {
        return res.status(400).json({ message: "Role and ID are required" });
    }

    if (role !== "admin") {
        return res.status(400).json({ message: "Role must be 'admin'" });
    }

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(400).json({ message: "User is already an Admin" });
        }

        user.role = role;
        await user.save();

        res.status(201).json({
            message: "User role updated successfully",
            user,
        });
    } catch (error) {
        res.status(400).json({
            message: "An error occurred during role update",
            error: error.message,
        });
    }
};

// **Delete User Function**
exports.deleteUser = async (req, res, next) => {
    const { id } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();

        res.status(200).json({
            message: "User successfully deleted",
            user,
        });
    } catch (error) {
        res.status(400).json({
            message: "An error occurred during user deletion",
            error: error.message,
        });
    }
};

// **Get All Users Function**
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});

        // Map user details
        const userDetails = users.map((user) => ({
            username: user.username,
            role: user.role,
        }));

        res.status(200).json({ users: userDetails });
    } catch (err) {
        res.status(401).json({
            message: "Failed to fetch users",
            error: err.message,
        });
    }
};
