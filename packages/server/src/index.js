import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import http from 'http';
import { initializeSocket } from './services/socket.js';
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/reports.js';
import mediatorRoutes from './routes/mediator.js';
import User from './models/User.js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Temporarily don't exit to allow server to start for debugging
    // process.exit(1);
  }
};

// Configure Passport Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find or create user
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in profile'), false);
          }

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              email,
              name: profile.displayName || 'Unknown',
              role: 'mediator', // Default role for OAuth users
              avatar: profile.photos?.[0]?.value,
            });
          }

          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
}

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'https://civicvoice-my-react-app-phvd.vercel.app',
      'http://localhost:5174', // development
      'http://localhost:3000'  // alternative dev port
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Passport middleware
app.use(passport.initialize());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/mediator', mediatorRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: 'Server Error',
  });
  return;
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});