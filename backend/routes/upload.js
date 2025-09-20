// This is the API route tht connects my frontend to the backend
// and handles file uploads and then saves the metadata to MongoDB

import express from 'express';
import multer from 'multer';
import FileMeta from '../models/FileMeta.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

//resolving the __dirname issue in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File type validation function
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: images, PDF, text, and office documents.`), false);
    }
};
// Route to handle file upload
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
    const userId = req.user.userId; // Get user ID from the authenticated user
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' }); // Check if file is present
    }
    try {
        const { originalname, mimetype, size, filename, path: filepath } = req.file;

        //Save the meta data to MongoDB
        const meta = await FileMeta.create({
            filename: originalname,
            filepath: filepath,
            size,
            mimetype: mimetype,
            ownerId: userId, // Associate the file with the authenticated user

        });

        // To Do - Add AI tags processing here will do it in Phase 2
        res.status(201).json({ message: "File uploaded successfully", meta });
    }
    catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'File upload failed', error: error.message });
    }
});

// Route to get all uploaded files metadata for the authenticated user
// This will be used to display the list of uploaded files in the frontend
router.get('/files', requireAuth, async (req, res) => {

    try {
        const userId = req.user.userId; // Get user ID from the authenticated user
        const list = await FileMeta.find({ ownerId: userId }).sort({ uploadDate: -1 }); // Find all files uploaded by the user and sort them by upload date
        if (list.length === 0) {
            return res.status(404).json({ message: 'No files found' }); // Check if any files are present
        }
        res.json(list);
    }
    catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Failed to fetch files', error: error.message });
    }
});


// Route to download a file by ID only for authenticated users
// This will be used to download the file from the frontend
router.get('/download/:id', requireAuth, async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.userId; // Get user ID from the authenticated user
        const meta = await FileMeta.findOne({ _id: id, ownerId: userId})  // Find the file metadata by ID
        if(!meta) return res.status(404).json({ error: 'File not found'});

        // Resolve the file path to get the absolute filepath
        const filePath = path.resolve(meta.filepath);

        //res.download sets the appropriate headers and sends the file
        res.download(filePath, meta.filename);
    }
    catch (error) {
        console.error('Downaload error:', error);
        res.status(500).json({ error: 'Failed to Downaload file' });
    }
});

// Route to delete a file by ID
router.delete('/files/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId; // Get user ID from the authenticated user
        //find the file inside the DB and remove the DB record
        const meta = await FileMeta.findOneAndDelete({ _id: id, ownerId: userId }); // Find the file metadata by ID and delete it

        if(!meta) return res.status(404).json({ error: 'File Not Found' }); // Check if the file metadata exists

        // Delete the actual file from the disk
        const filepath = path.isAbsolute(meta.filepath) ? meta.filepath : path.join(__dirname, '..', meta.filepath);
        fs.unlink(filepath, err => {
            if(err) console.error('Error deleting file:', err);
            else console.log('File deleted successfully');
        });

        return res.json({ message: 'File deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});
export default router;
