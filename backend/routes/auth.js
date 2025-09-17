import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import express from 'express';

const router = express.Router();

//Route for user registration
router.post('/register', async (req, res) => {
    const { email, password } = req.body; // Extracting email and password from request body
    try {
        const userExists = await User.findOne({ email});
        if(userExists) {
            return res.status(400).json({ message : 'User already exists'});
        }

        const salt = await bcrypt.genSalt(10); // Generating salt for password hashing
        const passwordHash = await bcrypt.hash(password, salt); // Hashing the password

        const newUser = new User({ email, passwordHash }); // Creating a new user instance
        await newUser.save(); // Saving the user to the database

        res.status(201).json({ message: 'User registered Successfully'});
    }
    catch (error){
        res.status(500).json({ message: 'Registration Failed', error: error.message });
    }
});

// Route for user Login
router.post('/login', async (req, res) => {
    console.log('Login attempt:', { email: req.body.email });
    
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
        console.log('Missing credentials');
        return res.status(400).json({ 
            success: false,
            message: 'Please provide both email and password' 
        });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email }).select('+passwordHash');
        
        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        console.log('Login successful for user:', email);
        
        // Send response with token and user data (excluding password)
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'An error occurred during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;