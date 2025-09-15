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

//Route for user Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Extracting email and password from request body
    try {
        const user = await User.findOne({ email }); // Finding user by email
        if(!user) return res.status(400).json({ message: 'User not found, Invalid username or passowrd' });

        const validPassword = await bcrypt.compare(password, user.passwordHash); // Comparing provided password with stored hash
        if(!validPassword) return res.status(400).json({ message: 'Invalid username or password' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }); // Generating JWT token
        res.status(200).json({ token, user: { id: user._id, email: user.email } }); // Sending token and user info in response

    }
    catch (error) {
        res.status(500).json({ message: 'Login Failed', error: error.message });
    }
});

export default router;