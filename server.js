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
const allowedDomains = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(domain => domain.trim())
  : [
      'http://localhost:3000',
      'https://cassiora-eta.vercel.app',
      'https://cassiora-git-main-bharath-sermans-projects.vercel.app',
      'https://cassiora-bharath-sermans-projects.vercel.app'
    ];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed domains
    if (allowedDomains.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // For development, you might want to log which origin was blocked
    if (process.env.NODE_ENV === 'development') {
      console.log('Blocked CORS request from origin:', origin);
    }
    
    return callback(new Error('Not allowed by CORS'));
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
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('FATAL: MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// Create a connection pool with improved settings
const client = new MongoClient(MONGODB_URI, {
  maxPoolSize: 50,
  minPoolSize: 10,
  maxIdleTimeMS: 60000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 30000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  retryReads: true,
});

let db;
let isConnecting = false;
let connectionPromise = null;

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'bharathserman@gmail.com',
    pass: process.env.EMAIL_PASS || 'rwvl njqi umiu kyuy'
  }
});

// Improved connection handling with retries
async function connectToMongo(retries = 3) {
  if (isConnecting) {
    return connectionPromise;
  }

  if (db) {
    return db;
  }

  isConnecting = true;
  connectionPromise = (async () => {
    for (let i = 0; i < retries; i++) {
      try {
        await client.connect();
        db = client.db('placement');
        console.log('Connected to MongoDB');
        isConnecting = false;
        return db;
      } catch (err) {
        console.error(`Connection attempt ${i + 1} failed:`, err);
        if (i === retries - 1) {
          isConnecting = false;
          throw err;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  })();

  return connectionPromise;
}

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

if (!process.env.OPENROUTER_API_KEY) {
  console.error('FATAL: OPENROUTER_API_KEY is not defined in environment variables');
  process.exit(1);
}

const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3001",
    "X-Title": "Spideo"
  }
});

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      username,
      streak: 0,
      last_streak_date: null,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Create profile
    await db.collection('profiles').insertOne({
      user_id: result.insertedId,
      username,
      streak: 0,
      last_streak_date: null,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Generate token
    const token = jwt.sign({ userId: result.insertedId }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      token,
      user: {
        id: result.insertedId,
        email,
        username,
        streak: 0
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    // Find user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Find profile
    const profile = await db.collection('profiles').findOne({ user_id: user._id });

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: profile.username,
        streak: profile.streak
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profile endpoints
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await db.collection('profiles').findOne({ user_id: req.user._id });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Ensure the username is taken from the profile, not from the base user object
    const username = profile.username || req.user.username; // Fallback to user's username

    // Update last_seen
    await db.collection('profiles').updateOne(
      { user_id: req.user._id },
      { $set: { last_seen: new Date() } }
    );

    // Check if streak needs to be reset (date-only comparison)
    function getDateOnly(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    const today = getDateOnly(new Date());
    const lastStreakDate = profile.last_streak_date ? getDateOnly(new Date(profile.last_streak_date)) : null;
    let currentStreak = profile.streak || 0;

    if (lastStreakDate) {
      const diffTime = today - lastStreakDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      if (diffDays > 1) {
        currentStreak = 0;
        await db.collection('profiles').updateOne(
          { user_id: req.user._id },
          { $set: { streak: 0 } }
        );
      }
    }

    // Fetch photoUrl from users collection
    const user = await db.collection('users').findOne({ _id: req.user._id });
    res.json({
      id: req.user._id,
      email: req.user.email,
      username,
      streak: currentStreak,
      last_streak_date: lastStreakDate,
      photoUrl: user?.photoUrl || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/profile/photo', upload.single('photo'), authenticateToken, async (req, res) => {
  try {
    const photoUrl = `/uploads/${req.file.filename}`;
    await db.collection('users').updateOne(
      { _id: new ObjectId(req.user._id) },
      { $set: { photoUrl } }
    );
    res.json({ photoUrl });
  } catch (err) {
    console.error('Photo upload error:', err);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

app.patch('/api/profile', authenticateToken, async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Update profile
    const result = await db.collection('profiles').updateOne(
      { user_id: req.user._id },
      { $set: { username, updated_at: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      id: req.user._id,
      email: req.user.email,
      username,
      streak: req.user.streak
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update streak endpoint
app.post('/api/profile/streak', authenticateToken, async (req, res) => {
  try {
    const { topic, score, totalQuestions } = req.body;
    const profile = await db.collection('profiles').findOne({ user_id: req.user._id });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Always log the test activity first
    await db.collection('activity_logs').insertOne({
      user_id: req.user._id,
      date: new Date(),
      type: 'test',
      details: `Completed ${topic} test`,
      topic,
      score,
      totalQuestions,
    });

    const today = new Date().toISOString().slice(0, 10);
    const lastStreakDate = profile.last_streak_date;
    let newStreak = profile.streak || 0;
    let isFirstTestOfDay = false;

    // Only update streak if it's the first test of a new day
    if (lastStreakDate !== today) {
      isFirstTestOfDay = true;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (lastStreakDate === yesterdayStr) {
        newStreak++; // Increment streak
      } else {
        newStreak = 1; // Reset streak
      }

      await db.collection('profiles').updateOne(
        { user_id: req.user._id },
        { $set: { streak: newStreak, last_streak_date: today, updated_at: new Date() } }
      );
    }

    // Add activity log for the test completion
    await db.collection('activities').insertOne({
      user_id: req.user._id,
      date: new Date(),
      type: 'test',
      details: `Completed a test on '${topic}'`,
      topic,
      score,
      totalQuestions,
    });

    res.json({
      streak: newStreak,
      last_streak_date: today,
      isFirstTestOfDay,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activity log endpoint
app.get('/api/activity', authenticateToken, async (req, res) => {
  try {
    const logs = await db.collection('activities')
      .find({ user_id: req.user._id })
      .sort({ date: -1 })
      .toArray();
    res.json({ logs });
  } catch (err) {
    console.error('Error fetching activity logs:', err);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

// Questions endpoint
app.get('/api/questions', authenticateToken, async (req, res) => {
  const { topic } = req.query;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }
  try {
    const questions = await db.collection('questions').find({ topic }).toArray();
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Notes endpoints
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const notes = await db.collection('notes')
      .find({ user_id: req.user._id })
      .sort({ updated_at: -1 })
      .toArray();

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notes', authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Note cannot be empty' });
  }

  try {
    const now = new Date();
    const result = await db.collection('notes').insertOne({
      user_id: req.user._id,
      title,
      content,
      created_at: now,
      updated_at: now
    });

    const note = await db.collection('notes').findOne({ _id: result.insertedId });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/notes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title && !content) {
    return res.status(400).json({ error: 'Note cannot be empty' });
  }

  try {
    const updateData = { updated_at: new Date() };
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    const result = await db.collection('notes').updateOne(
      { _id: new ObjectId(id), user_id: req.user._id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Note not found or you do not have permission to edit it' });
    }

    const note = await db.collection('notes').findOne({ _id: new ObjectId(id) });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE note endpoint
app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.collection('notes').deleteOne({ _id: new ObjectId(id), user_id: req.user._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Note not found or not owned by user' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// New endpoint to generate questions based on role
app.post('/api/interview/questions', authenticateToken, async (req, res) => {
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ error: 'Role is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interviewer. Your ONLY task is to generate a set of 10 interview questions for a specific job role. The questions should be divided into two categories: 5 general HR questions and 5 technical questions relevant to the role. Respond ONLY with a valid JSON object, no explanation, no markdown, no extra text. The JSON object must have a single key, "questions", which is an array of 10 strings. Example: {"questions": ["question 1", "question 2", ...]}',
        },
        {
          role: 'user',
          content: `Generate questions for the role: ${role}`,
        },
      ],
    });

    const rawResponse = completion.choices[0].message.content;
    try {
      // Extract the first JSON object from the AI response
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON object found in AI response');
      const jsonResponse = JSON.parse(jsonMatch[0]);
      if (!jsonResponse.questions || !Array.isArray(jsonResponse.questions)) {
        throw new Error('Invalid JSON structure from AI.');
      }
      res.json({ questions: jsonResponse.questions });
    } catch (e) {
      console.error("Failed to parse AI JSON response or invalid structure:", rawResponse);
      res.status(500).json({ error: 'The AI returned an invalid format.' });
    }

  } catch (err) {
    console.error('Error generating questions from AI:', err);
    res.status(500).json({ error: 'Failed to generate questions. The AI service may be down or the request failed.' });
  }
});

// Analyze interview transcript
app.post('/api/interview/analyze', authenticateToken, async (req, res) => {
  const { transcript, role } = req.body;

  if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
    return res.status(400).json({ error: 'A valid transcript is required.' });
  }

  try {
    const formattedTranscript = transcript.map(t => `Q: ${t.question}\nA: ${t.answer}`).join('\n\n');

    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3-haiku',
      messages: [
        {
          role: 'system',
          content: `You are an expert HR manager. Your task is to provide a detailed analysis of an interview transcript for a candidate applying for a ${role || 'general'} position. Your response MUST be a single, valid JSON object and nothing else. Do not include any text, explanation, or markdown formatting before or after the JSON object. The JSON object must follow this exact structure: { "overallSummary": "(A brief, high-level overview of the candidate's performance, considering the job role)", "questionBreakdown": [ { "question": "(The question that was asked)", "answer": "(The user's transcribed answer)", "analysis": "(Your critique of the answer, keeping the job role in mind)", "strengths": ["(A strength of the answer)"], "improvements": ["(An area for improvement)"] } ], "finalSuggestions": ["(Your first most important, actionable step)", "(Your second step)", "(Your third step)"] }`,
        },
        {
          role: 'user',
          content: formattedTranscript,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const rawFeedback = completion.choices[0].message.content;

// Clean up possible markdown or extra quotes
const cleaned = rawFeedback
  .replace(/```json/i, '')
  .replace(/```/g, '')
  .trim();

try {
  const feedbackJson = JSON.parse(cleaned);
  res.json({ feedback: feedbackJson });
} catch (e) {
  console.error("❌ Failed to parse AI JSON response:", cleaned);
  res.status(500).json({ error: 'The AI returned an invalid JSON format.' });
}

  } catch (err) {
    console.error('Error analyzing transcript with AI:', err);
    res.status(500).json({ error: 'Failed to analyze transcript.' });
  }
});

// Test endpoints
// Debug endpoint to check database connection and question structure
app.get('/api/debug/questions', async (req, res) => {
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: 'questions' }).toArray();
    if (collections.length === 0) {
      return res.status(404).json({ error: 'Questions collection not found' });
    }

    // Get count of all questions
    const count = await db.collection('questions').countDocuments();
    
    // Get sample of questions
    const sample = await db.collection('questions').find({}).limit(2).toArray();
    
    // Get all unique topics
    const topics = await db.collection('questions').distinct('topic');
    
    res.json({
      collectionExists: true,
      totalQuestions: count,
      sampleQuestions: sample,
      allTopics: topics,
      firstTopicSample: topics.length > 0 ? topics[0] : null
    });
  } catch (err) {
    console.error('Debug error:', err);
    res.status(500).json({ 
      error: 'Debug error',
      message: err.message,
      stack: err.stack
    });
  }
});

// Get all unique topics
app.get('/api/topics', authenticateToken, async (req, res) => {
  try {
    const topics = await db.collection('questions').distinct('topic');
    res.json({ topics });
  } catch (err) {
    console.error('Error fetching topics:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      details: err.message 
    });
  }
});

app.get('/api/questions', authenticateToken, async (req, res) => {
  let { topic } = req.query;
  console.log('Original requested topic:', topic);
  
  try {
    // Get all available topics for case-insensitive comparison
    const allTopics = await db.collection('questions').distinct('topic');
    console.log('All available topics in DB:', allTopics);
    
    // Find the correct case of the topic (case-insensitive match)
    const matchedTopic = allTopics.find(t => t.toLowerCase() === topic.toLowerCase());
    
    if (!matchedTopic) {
      return res.status(404).json({ 
        error: `Topic not found: ${topic}`,
        availableTopics: allTopics,
        suggestion: allTopics.length > 0 ? `Did you mean one of these? ${allTopics.join(', ')}` : 'No topics available'
      });
    }
    
    console.log('Matched topic with correct case:', matchedTopic);
    
    // Now query with the exact topic name from the database
    const questions = await db.collection('questions').aggregate([
      { $match: { topic: matchedTopic } },
      { $sample: { size: 5 } }
    ]).toArray();
    
    console.log(`Found ${questions.length} questions for topic: ${matchedTopic}`);
    
    if (questions.length === 0) {
      return res.status(404).json({ 
        error: `No questions found for topic: ${matchedTopic}`,
        availableTopics: allTopics
      });
    }
    
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Chatbot proxy endpoint (secure OpenRouter API key)
app.post('/api/chat', async (req, res) => {
  const { messages, model } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required.' });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: model || "deepseek/deepseek-r1-0528:free",
      messages,
    });
    res.json(completion);
  } catch (err) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: 'Failed to get chat completion.' });
  }
});

// Feedback endpoint
app.post('/api/feedback', async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: 'bharathserman@gmail.com',
      subject: 'New Feedback from Cassiora Practice',
      text: `Feedback from: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Feedback from Cassiora Practice</h3>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Error sending feedback email:', err);
    res.status(500).json({ error: 'Failed to send feedback' });
  }
});

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