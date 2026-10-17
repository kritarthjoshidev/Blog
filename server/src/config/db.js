import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-platform';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });

    isConnected = true;
    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`\x1b[33m⚠ MongoDB Notice: Could not connect to MongoDB at "${uri}".\x1b[0m`);
    console.warn(`\x1b[36mℹ In-Memory Fallback Active: All Blog posts, comments, auth and tests work out-of-the-box!\x1b[0m`);
    console.warn(`\x1b[36mℹ To persist to MongoDB Atlas, set MONGODB_URI in server/.env\x1b[0m`);
    return false;
  }
};

export const getIsConnected = () => isConnected;
export const setIsConnected = (val) => { isConnected = val; };
