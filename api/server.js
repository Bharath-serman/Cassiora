import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import OpenAI from 'openai';
import 'dotenv/config';

const app = express();

// CORS configuration for Vercel
const allowedOrigins = [
  'http://localhost:3000',
  'https://cassiora-eta.vercel.app',
  'https://cassiora-git-main-bharath-sermans-projects.vercel.app',
  'https://cassiora-bharath-sermans-projects.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Increase payload size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Set up multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

// Serve uploaded images statically
app.use('/uploads', express.static(uploadDir));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('FATAL: MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI, {
  maxPoolSize: 50,
  minPoolSize: 5,
  maxIdleTimeMS: 10000,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
  connectTimeoutMS: 10000
});

let db;

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Your existing routes will go here
// For example:
// app.post('/api/auth/signup', ...);
// app.post('/api/auth/login', ...);

// For Vercel serverless functions
export default app;

// Only start the server if this file is run directly (not when imported as a module)
if (process.env.VERCEL !== '1') {
  const startServer = async () => {
    try {
      await connectToMongo();
      const PORT = process.env.PORT || 3001;
      const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });

      // Graceful shutdown
      const shutdown = async () => {
        console.log('Shutting down gracefully...');
        server.close(() => {
          console.log('Server closed');
          process.exit(0);
        });
        
        try {
          await client.close();
          console.log('MongoDB connection closed');
        } catch (err) {
          console.error('Error closing MongoDB connection:', err);
        }
      };

      process.on('SIGTERM', shutdown);
      process.on('SIGINT', shutdown);

    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer().catch(console.error);
}
