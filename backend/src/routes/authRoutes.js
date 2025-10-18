// routes/authRoutes.js
const express = require('express'); // Import Express framework
const { registerUser, loginUser } = require('../controllers/authController'); // Import controller functions

const router = express.Router(); // Create an Express router

// Define authentication routes
router.post('/register', registerUser); // Route for user registration
router.post('/login', loginUser);     // Route for user login

module.exports = router; // Export the router
