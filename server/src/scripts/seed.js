import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { initialUsers, initialPosts, initialComments } from '../config/demoData.js';

dotenv.config();

const seedData = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-platform';
  const force = process.argv.includes('--force');

  console.log(`\x1b[34m[Seed Script] Connecting to MongoDB for blog-platform...\x1b[0m`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`\x1b[32m✔ MongoDB connected successfully.\x1b[0m`);

    const postCount = await Post.countDocuments();
    if (postCount > 0 && !force) {
      console.log(`\x1b[33mℹ Database already contains ${postCount} posts. Skipping seed to prevent overwriting existing data.\x1b[0m`);
      console.log(`\x1b[90m(Run "npm run seed -- --force" to reset demo data)\x1b[0m`);
      process.exit(0);
    }

    if (force) {
      console.log(`\x1b[33m⚠ Force flag provided. Clearing existing blog data...\x1b[0m`);
      await Comment.deleteMany({});
      await Post.deleteMany({});
      await User.deleteMany({});
    }

    // 1. Seed users
    const createdUsers = [];
    for (const userData of initialUsers) {
      let user = await User.findOne({ email: userData.email.toLowerCase() });
      if (!user) {
        user = await User.create(userData);
        console.log(`\x1b[32m✔ Created user: ${user.name} (${user.email})\x1b[0m`);
      }
      createdUsers.push(user);
    }

    // 2. Seed posts
    const createdPosts = [];
    for (const postData of initialPosts) {
      const author = createdUsers[postData.authorIndex] || createdUsers[0];
      const post = await Post.create({
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        category: postData.category,
        coverImage: postData.coverImage,
        readTime: postData.readTime,
        author: author._id
      });
      createdPosts.push(post);
      console.log(`\x1b[32m✔ Seeded post: "${post.title}"\x1b[0m`);
    }

    // 3. Seed comments
    for (const commentData of initialComments) {
      const post = createdPosts[commentData.postIndex];
      const author = createdUsers[commentData.authorIndex];
      if (post && author) {
        await Comment.create({
          post: post._id,
          author: author._id,
          content: commentData.content
        });
      }
    }
    console.log(`\x1b[32m✔ Seeded sample comments.\x1b[0m`);

    console.log(`\n\x1b[32m✔ Blog Platform seeding completed successfully!\x1b[0m`);
    console.log(`\x1b[36mDemo Credentials:\x1b[0m`);
    console.log(`  User 1: alex@journal.dev  / password123`);
    console.log(`  User 2: sarah@design.io   / password123\n`);

    process.exit(0);
  } catch (error) {
    console.error(`\x1b[31m✖ Seeding failed: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

seedData();
