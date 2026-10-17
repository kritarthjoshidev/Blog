import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB, getIsConnected } from './config/db.js';
import { memoryStore } from './config/memoryStore.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'blog-platform-api',
    timestamp: new Date().toISOString(),
    database: getIsConnected() ? 'MongoDB (Connected)' : 'In-Memory Demo Mode (Fallback Active)',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await memoryStore.init();
  await connectDB();

  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`\n🚀 \x1b[32mBlog Platform Server running on http://localhost:${PORT}\x1b[0m`);
      console.log(`📦 \x1b[36mEndpoints:\x1b[0m`);
      console.log(`   - GET  /api/health`);
      console.log(`   - POST /api/auth/register`);
      console.log(`   - POST /api/auth/login`);
      console.log(`   - GET  /api/auth/me`);
      console.log(`   - GET  /api/posts`);
      console.log(`   - POST /api/posts`);
      console.log(`   - GET  /api/comments/post/:postId`);
      console.log(`   - POST /api/comments/post/:postId\n`);
    });
  }
};

startServer();

export default app;
