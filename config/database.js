const mongoose = require("mongoose");
require("dotenv").config();

// Function to connect to the MongoDB database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,       // Ensures compatibility with the connection string
            useUnifiedTopology: true,   // Enables the new MongoDB connection management engine
        });
        console.log("MongoDB is successfully connected");
    } catch (err) {
        // Log the error and exit the process in case of a connection failure
        console.error(`Failed to connect to MongoDB: ${err.message}`);
        process.exit(1); // Exit the process with an error code (1 indicates an error)
    }
};

// Export the connection function for use in other modules
module.exports = connectDB;
