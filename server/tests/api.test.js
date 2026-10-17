import http from 'http';
import app from '../src/server.js';
import { memoryStore } from '../src/config/memoryStore.js';

let server;
let baseUrl;

const startTestServer = () => {
  return new Promise((resolve) => {
    const port = 5066;
    server = http.createServer(app);
    server.listen(port, () => {
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
};

const stopTestServer = () => {
  return new Promise((resolve) => {
    if (server) {
      server.close(resolve);
    } else {
      resolve();
    }
  });
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
};

const runTests = async () => {
  console.log(`\n==============================================`);
  console.log(`🧪 Running Blog Platform Backend Test Suite`);
  console.log(`==============================================\n`);

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  \x1b[32m✔ PASS\x1b[0m ${name}`);
      passed++;
    } catch (err) {
      console.error(`  \x1b[31m✖ FAIL\x1b[0m ${name}`);
      console.error(`    \x1b[31mError:\x1b[0m ${err.message}`);
      failed++;
    }
  };

  try {
    await memoryStore.init();
    await startTestServer();

    let user1Token = '';
    let user2Token = '';
    let user1PostId = '';
    let testCommentId = '';

    // Test 1: Health check
    await test('GET /api/health returns 200 and operational status', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      const data = await res.json();
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(data.status === 'ok', 'Status must be ok');
      assert(data.database, 'Database info must be present');
    });

    // Test 2: Login User 1 (Alex)
    await test('POST /api/auth/login authenticates Alex and returns JWT', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'alex@journal.dev',
          password: 'password123'
        })
      });
      const data = await res.json();
      assert(res.status === 200, `Expected 200, got ${res.status}: ${data.message}`);
      assert(data.token, 'Token must be returned');
      assert(data.name === 'Alex Rivera', 'Name must match');
      user1Token = data.token;
    });

    // Test 3: Login User 2 (Sarah)
    await test('POST /api/auth/login authenticates Sarah and returns JWT', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'sarah@design.io',
          password: 'password123'
        })
      });
      const data = await res.json();
      assert(res.status === 200, `Expected 200, got ${res.status}: ${data.message}`);
      assert(data.token, 'Token must be returned');
      assert(data.name === 'Sarah Chen', 'Name must match');
      user2Token = data.token;
    });

    // Test 4: New User Registration
    await test('POST /api/auth/register creates new account and returns token', async () => {
      const randomEmail = `writer_${Date.now()}@journal.dev`;
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Elena Rostova',
          email: randomEmail,
          password: 'secretPassword123',
          bio: 'Investigative tech journalist'
        })
      });
      const data = await res.json();
      assert(res.status === 201, `Expected 201, got ${res.status}: ${data.message}`);
      assert(data.token, 'Token must be present');
      assert(data.email === randomEmail.toLowerCase(), 'Email must match');
    });

    // Test 5: Public Post Retrieval & Categories
    await test('GET /api/posts returns public posts and category list', async () => {
      const res = await fetch(`${baseUrl}/api/posts`);
      const data = await res.json();
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(Array.isArray(data.posts), 'Posts must be an array');
      assert(data.posts.length > 0, 'Posts count must be > 0');
      assert(Array.isArray(data.categories), 'Categories must be an array');
    });

    // Test 6: Authenticated Post Creation by User 1
    await test('POST /api/posts creates new article with readTime estimation', async () => {
      const res = await fetch(`${baseUrl}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user1Token}`
        },
        body: JSON.stringify({
          title: 'Deep Dive into Zero-Copy Memory Pipelines',
          excerpt: 'How modern runtimes optimize I/O buffers for ultra-low latency streams.',
          content: 'This is a technical article explaining how ring buffers and zero-copy semantics reduce CPU memory cache thrashing in asynchronous runtimes.',
          category: 'Engineering',
          coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
        })
      });
      const data = await res.json();
      assert(res.status === 201, `Expected 201, got ${res.status}: ${data.message}`);
      assert(data._id, 'Post must have an _id');
      assert(data.readTime, 'readTime must be calculated');
      user1PostId = data._id;
    });

    // Test 7: Post Owner Can Update Post
    await test('PUT /api/posts/:id allows owner (User 1) to update post', async () => {
      const res = await fetch(`${baseUrl}/api/posts/${user1PostId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user1Token}`
        },
        body: JSON.stringify({
          title: 'Deep Dive into Zero-Copy Memory Pipelines [Updated]'
        })
      });
      const data = await res.json();
      assert(res.status === 200, `Expected 200, got ${res.status}: ${data.message}`);
      assert(data.title.includes('[Updated]'), 'Title must be updated');
    });

    // Test 8: Non-Owner Blocked from Updating Post (Security Check)
    await test('PUT /api/posts/:id rejects non-owner (User 2) with 403 Forbidden', async () => {
      const res = await fetch(`${baseUrl}/api/posts/${user1PostId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user2Token}`
        },
        body: JSON.stringify({
          title: 'Hacked Title by Unauthorized User'
        })
      });
      assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
    });

    // Test 9: Authenticated User Can Comment on Post
    await test('POST /api/comments/post/:id creates comment linked to post', async () => {
      const res = await fetch(`${baseUrl}/api/comments/post/${user1PostId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user2Token}`
        },
        body: JSON.stringify({
          content: 'Fascinating breakdown of ring buffer caching! Would love to see benchmarks.'
        })
      });
      const data = await res.json();
      assert(res.status === 201, `Expected 201, got ${res.status}: ${data.message}`);
      assert(data._id, 'Comment must have an ID');
      assert(data.content.includes('Fascinating breakdown'), 'Content must match');
      testCommentId = data._id;
    });

    // Test 10: Non-Owner Blocked from Deleting Comment (Security Check)
    await test('DELETE /api/comments/:id rejects non-owner with 403 Forbidden', async () => {
      // User 1 trying to delete User 2's comment
      const res = await fetch(`${baseUrl}/api/comments/${testCommentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user1Token}`
        }
      });
      assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
    });

    // Test 11: Comment Owner Can Delete Comment
    await test('DELETE /api/comments/:id allows comment owner (User 2) to delete comment', async () => {
      const res = await fetch(`${baseUrl}/api/comments/${testCommentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user2Token}`
        }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
    });

    // Test 12: Commenting on Non-Existent Post Fails with 404
    await test('POST /api/comments/post/:id returns 404 for non-existent post', async () => {
      const res = await fetch(`${baseUrl}/api/comments/post/non_existent_post_999`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user1Token}`
        },
        body: JSON.stringify({
          content: 'Should fail because post does not exist'
        })
      });
      assert(res.status === 404, `Expected 404, got ${res.status}`);
    });

    // Test 13: Post Owner Can Delete Post
    await test('DELETE /api/posts/:id allows owner (User 1) to delete post', async () => {
      const res = await fetch(`${baseUrl}/api/posts/${user1PostId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user1Token}`
        }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
    });

  } finally {
    await stopTestServer();
  }

  console.log(`\n==============================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`==============================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
