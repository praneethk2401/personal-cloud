import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRouter from './routes/upload.js';
import authRouter from './routes/auth.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

//Middlewares
app.use('/api', uploadRouter); // Middleware for handling file uploads
app.use('/api/auth', authRouter); // Middleware for authentication routes

app.get('/', (req, res) => {
  res.send('Welcome to the Personal Cloud API');
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
