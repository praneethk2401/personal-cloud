import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization; // `Authorization` header contains the token
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No tolen provided' }); // Check if the header is present
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the header
    if(!token) return res.status(401).json({ message: 'Token is missing' }); // Check if the token is present

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret
        req.user = decoded; // Attach the decoded user information to the request object
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token', error: error.message }); // Handle token verification errors
    }
}