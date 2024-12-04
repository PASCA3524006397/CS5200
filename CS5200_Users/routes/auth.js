const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Use the pool exported from db.js
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('Request Body:', req.body); // Log request for debugging

    if (!username || !password) {
        console.error('Missing username or password');
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    try {
        console.log('Executing database query...');
        const [results] = await db.execute('SELECT * FROM users WHERE username = ?', [username]); // Proper destructuring

        console.log('Database Results:', results);

        if (results.length === 0) {
            console.error('User not found');
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const user = results[0];

        // Compare the provided password with the hashed password in the database
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            console.log('Login successful');
            return res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            console.error('Incorrect password');
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login process:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
