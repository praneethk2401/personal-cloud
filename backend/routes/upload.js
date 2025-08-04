// This is the API route tht connects my frontend to the backend
// and handles file uploads and then saves the metadata to MongoDB

import express from 'express';
import multer from 'multer';
import FileMeta from '../models/FileMeta.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

//resolving the __dirname issue in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Multer setup for file uploads
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + file.originalname;
        cb(null, unique);
    },
});

const upload = multer({ storage });
// Route to handle file upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { originalname, mimetype, size, filename, path: filepath } = req.file;

        //Save the meta data to MongoDB
        const meta = await FileMeta.create({
            filename: originalname,
            filepath: filepath,
            size,
            mimetype: mimetype,

        });

        // To Do - Add AI tags processing here will do it in Phase 2
        res.status(201).json({ message: "File uploaded successfully", meta });
    }
    catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'File upload failed', error: error.message });
    }
});

// Route to get all uploaded files metadata
router.get('/files', async (_req, res) => {
    try {
        const list = await FileMeta.find().sort({ uploadDate: -1 });
        res.json(list);
    }
    catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Failed to fetch files', error: error.message });
    }
});


// Route to download a file by ID
router.get('/download/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const meta = await FileMeta.findById(id);
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
router.delete('/files/:id', async (req, res) => {
    try {
        const { id } = req.params;
        //find the file inside the DB and remove the DB record
        const meta = await FileMeta.findByIdAndDelete(id);
        if(!meta) return res.status(404).json({ error: 'File Not Found' });

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
