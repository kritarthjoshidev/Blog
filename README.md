# Journal — Full-Stack Blog Platform with Comments

A clean, modern, responsive full-stack blogging platform and community built with **React**, **Vite**, **Tailwind CSS**, **React Router**, **Axios**, **Node.js**, **Express**, and **MongoDB with Mongoose**.

---

## 📸 Key Interfaces & Inspirations
- **Blog Homepage & Feed:** Inspired by *Untitled UI by Jordan Hughes on Dribbble*. Features an editorial header, search bar, topic channel pills, featured hero post, and responsive card grid.
- **Reading Experience & Comments:** Inspired by *Comments for Ghost*. Clean typographic prose layout, author bio card with avatar, social share, and interactive comment threads with author avatar and ownership delete controls.
- **Author Dashboard & Editor:** Inspired by *Scribbles: Blogging Made Simple*. Comprehensive author workspace to manage stories, track reading metrics, and write posts with live preview and auto-calculated read times.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + Tailwind CSS | Responsive light-theme UI with Plus Jakarta Sans & Newsreader typography |
| **Routing** | React Router (`react-router-dom` v7) | Client-side routing for `/`, `/posts/:id`, `/dashboard`, `/create-post`, `/edit-post/:id`, `/login`, `/register` |
| **HTTP Client**| Axios | Centralized API client with JWT bearer token request interceptor and error formatting |
| **Icons** | Lucide React | Modern feather, pen, clock, calendar, share, and trash icons |
| **Backend** | Node.js + Express (ES Modules) | RESTful API architecture with CORS, request logging, and structured error handling |
| **Database** | MongoDB with Mongoose | Models for Users, Posts, and Comments with timestamps, references, and validation |
| **Authentication** | JWT + Bcrypt.js | Salted password hashing, stateless bearer tokens, and ownership authorization |
| **Offline Fallback**| In-Memory Data Store | Gracefully runs offline/without Atlas so all features can be evaluated immediately |

---

## 🚀 Quick Start Guide

### 1. Setup & Installation
```bash
cd blog-platform

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration
Create `server/.env` (or use `.env.example` template):
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=super_secret_blog_platform_jwt_key_2026
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5174
```
> **Note on MongoDB Atlas:** To connect to a live MongoDB Atlas cluster, simply paste your connection string into `server/.env`.
> If MongoDB is not yet configured, the server automatically runs in **In-Memory Demo Mode** so you can test all features right away without setup hurdles!

### 3. Database Seeding (Idempotent)
To seed initial demo posts, authors, and comments:
```bash
cd server
npm run seed
```
> The seed script is strictly idempotent: it skips insertion if records already exist to protect real data. To force reseed, pass: `npm run seed -- --force`.

### 4. Running the Application
In two separate terminals:

**Terminal 1 — Backend API:**
```bash
cd server
npm run dev
# Starts backend server at http://localhost:5001
```

**Terminal 2 — Frontend Client:**
```bash
cd client
npm run dev
# Starts Vite client at http://localhost:5174
```

---

## 👥 Demo Credentials (1-Click Quick Login Available)

On the `/login` page, click either **Quick Demo** button for 1-click authentication:

| User | Email | Password | Role / Bio |
| :--- | :--- | :--- | :--- |
| **Alex Rivera** | `alex@journal.dev` | `password123` | Staff Software Architect & Tech Writer |
| **Sarah Chen** | `sarah@design.io` | `password123` | Design Director & Typographer |

---

## 🔒 Security & Data Integrity Features

1. **Strict Ownership Authorization:**
   - Every `PUT /api/posts/:id` and `DELETE /api/posts/:id` verifies on the server that `post.author.toString() === req.user._id.toString()`. If a user attempts to edit or delete someone else's post, the backend returns `403 Forbidden`.
   - Every `DELETE /api/comments/:id` verifies that `comment.author.toString() === req.user._id.toString()`. Cross-user comment deletion is blocked with `403 Forbidden`.
   - The backend **never trusts client-supplied user IDs** in the request body; author identity is extracted solely from verified JWT tokens.
2. **Password Security:**
   - User passwords are automatically salted and hashed with bcryptjs (cost factor 10) in Mongoose pre-save hooks.
   - User queries exclude passwords (`select: false`), ensuring password hashes are never exposed in API responses.
3. **Relational Integrity:**
   - Comments validate that the target post exists before creation (returns `404 Not Found` for non-existent posts).
   - Deleting a post automatically cascades and deletes all associated comments.

---

## 🧪 Automated Backend Test Suite

Run the automated integration test suite directly:

```bash
cd server
npm test
```

### Test Coverage (13 Tests Passed):
- `GET /api/health` — API health check and operational status.
- `POST /api/auth/login` — User 1 (Alex) login & JWT generation.
- `POST /api/auth/login` — User 2 (Sarah) login & JWT generation.
- `POST /api/auth/register` — New account registration with password hashing.
- `GET /api/posts` — Public posts catalog, search, and category listing.
- `POST /api/posts` — Authenticated post creation with automated readTime estimation.
- `PUT /api/posts/:id` — Owner can edit their post.
- `PUT /api/posts/:id` — **Security:** Non-owner blocked from updating with `403 Forbidden`.
- `POST /api/comments/post/:id` — Authenticated comment creation linked to post.
- `DELETE /api/comments/:id` — **Security:** Non-owner blocked from deleting comment with `403 Forbidden`.
- `DELETE /api/comments/:id` — Comment owner can delete their own comment.
- `POST /api/comments/post/:id` — **Validation:** Comment on non-existent post rejected with `404 Not Found`.
- `DELETE /api/posts/:id` — Owner can delete their post (cascading comment cleanup).

---

## 📁 Project Directory Structure

```
blog-platform/
├── package.json               # Root scripts
├── .gitignore                 # Excludes .env, node_modules, dist
├── .env.example               # Root environment template
├── README.md                  # Comprehensive setup and API guide
├── server/                    # Node.js + Express Backend
│   ├── package.json
│   ├── .env / .env.example
│   ├── src/
│   │   ├── config/            # db.js, demoData.js, memoryStore.js
│   │   ├── models/            # User.js, Post.js, Comment.js
│   │   ├── middleware/        # auth.js, errorHandler.js
│   │   ├── controllers/       # authController.js, postController.js, commentController.js
│   │   ├── routes/            # authRoutes.js, postRoutes.js, commentRoutes.js
│   │   ├── scripts/           # seed.js (idempotent seeder)
│   │   └── server.js          # Express app entry point
│   └── tests/
│       └── api.test.js        # Automated backend test suite
└── client/                    # React 19 + Vite Frontend
    ├── package.json
    ├── vite.config.js         # Configured for port 5174
    ├── tailwind.config.js     # Editorial design tokens
    ├── index.html             # Google fonts & SEO
    └── src/
        ├── index.css          # Tailwind directives & typography
        ├── main.jsx           # Provider wrappers
        ├── App.jsx            # React Router route definitions
        ├── context/           # AuthContext.jsx
        ├── services/          # api.js (Axios client with JWT interceptor)
        ├── components/        # Navbar.jsx, Footer.jsx, PostCard.jsx, CommentSection.jsx, Toast.jsx
        └── pages/             # HomePage, PostDetailPage, DashboardPage, CreateEditPostPage, LoginPage, RegisterPage
```
