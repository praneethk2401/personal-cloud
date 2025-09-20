import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRouter from './routes/upload.js';
import authRouter from './routes/auth.js';
import { validateEnv } from './utils/validateEnv.js';
import errorMiddleware from './middleware/errorMiddleware.js';


dotenv.config();

// Validate environment variables
validateEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://personal-cloud-psi.vercel.app', // Vercel frontend main domain, this wont change with every deplyment
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
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

// Error handling middleware (must be last)
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
