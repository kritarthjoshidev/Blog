import bcrypt from 'bcryptjs';
import { initialUsers, initialPosts, initialComments } from './demoData.js';

class MemoryStore {
  constructor() {
    this.users = [];
    this.posts = [];
    this.comments = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    // 1. Seed users
    for (let i = 0; i < initialUsers.length; i++) {
      const u = initialUsers[i];
      const hashedPassword = await bcrypt.hash(u.password, 10);
      this.users.push({
        _id: `user_${i + 1}`,
        name: u.name,
        email: u.email.toLowerCase(),
        password: hashedPassword,
        avatar: u.avatar,
        bio: u.bio,
        createdAt: new Date().toISOString()
      });
    }

    // 2. Seed posts
    initialPosts.forEach((p, idx) => {
      const author = this.users[p.authorIndex] || this.users[0];
      this.posts.push({
        _id: `post_${idx + 1}`,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        category: p.category,
        coverImage: p.coverImage,
        readTime: p.readTime,
        author: author._id,
        createdAt: new Date(Date.now() - (idx * 86400000)).toISOString(),
        updatedAt: new Date(Date.now() - (idx * 86400000)).toISOString()
      });
    });

    // 3. Seed comments
    initialComments.forEach((c, idx) => {
      const post = this.posts[c.postIndex];
      const author = this.users[c.authorIndex];
      if (post && author) {
        this.comments.push({
          _id: `comment_${idx + 1}`,
          post: post._id,
          author: author._id,
          content: c.content,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        });
      }
    });

    this.initialized = true;
  }
}

export const memoryStore = new MemoryStore();
