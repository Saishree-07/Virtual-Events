const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// User registration route
router.post('/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ 
                error: 'All fields are required' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ 
                error: 'User with this email or username already exists' 
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        console.log('Attempting to save user...');
        await user.save();
        console.log('User saved successfully');

        // Return success but don't send password
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        res.status(201).json({
            message: 'User registered successfully',
            user: userResponse
        });
    } catch (error) {
        console.error('Detailed registration error:', error);
        res.status(500).json({ 
            error: 'Error registering user',
            details: error.message 
        });
    }
});

// User login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Return user data without password
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        res.json({
            message: 'Login successful',
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error during login' });
    }
});

module.exports = router;
