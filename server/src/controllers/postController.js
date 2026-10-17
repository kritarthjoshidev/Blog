import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { getIsConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

const calculateReadTime = (content) => {
  const words = (content || '').split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

// @desc    Get all published posts with filtering, search & pagination
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 9 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;

    if (getIsConnected()) {
      const query = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      const total = await Post.countDocuments(query);
      const posts = await Post.find(query)
        .populate('author', 'name email avatar bio')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      const categories = await Post.distinct('category');

      return res.json({
        posts,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        categories: ['All', ...categories]
      });
    } else {
      let filtered = [...memoryStore.posts];

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(s) ||
            p.excerpt.toLowerCase().includes(s) ||
            p.content.toLowerCase().includes(s)
        );
      }

      if (category && category !== 'All') {
        filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const total = filtered.length;
      const startIndex = (pageNum - 1) * limitNum;
      const paginated = filtered.slice(startIndex, startIndex + limitNum);

      // Populate author
      const enrichedPosts = paginated.map((p) => {
        const author = memoryStore.users.find((u) => u._id === p.author);
        return {
          ...p,
          author: author ? { _id: author._id, name: author.name, email: author.email, avatar: author.avatar, bio: author.bio } : { _id: p.author, name: 'Anonymous' }
        };
      });

      const distinctCategories = Array.from(new Set(memoryStore.posts.map((p) => p.category)));

      return res.json({
        posts: enrichedPosts,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        categories: ['All', ...distinctCategories]
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID or slug
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      let post;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        post = await Post.findById(id).populate('author', 'name email avatar bio');
      }
      if (!post) {
        post = await Post.findOne({ slug: id }).populate('author', 'name email avatar bio');
      }

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const commentCount = await Comment.countDocuments({ post: post._id });

      return res.json({
        ...post.toObject(),
        commentCount
      });
    } else {
      const post = memoryStore.posts.find((p) => p._id === id || p.slug === id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const author = memoryStore.users.find((u) => u._id === post.author);
      const commentCount = memoryStore.comments.filter((c) => c.post === post._id).length;

      return res.json({
        ...post,
        author: author ? { _id: author._id, name: author.name, email: author.email, avatar: author.avatar, bio: author.bio } : { _id: post.author, name: 'Anonymous' },
        commentCount
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { title, excerpt, content, category, coverImage } = req.body;

    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, excerpt, content, and category'
      });
    }

    const defaultCover = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';
    const readTime = calculateReadTime(content);
    const slug = title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-') + '-' + Date.now().toString(36);

    if (getIsConnected()) {
      const post = await Post.create({
        title: title.trim(),
        slug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        category: category.trim(),
        coverImage: coverImage?.trim() || defaultCover,
        readTime,
        author: req.user._id
      });

      const populatedPost = await Post.findById(post._id).populate('author', 'name email avatar bio');
      return res.status(201).json(populatedPost);
    } else {
      const newPost = {
        _id: `post_${Date.now()}`,
        title: title.trim(),
        slug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        category: category.trim(),
        coverImage: coverImage?.trim() || defaultCover,
        readTime,
        author: req.user._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      memoryStore.posts.unshift(newPost);

      const author = memoryStore.users.find((u) => u._id === req.user._id);
      return res.status(201).json({
        ...newPost,
        author: author ? { _id: author._id, name: author.name, email: author.email, avatar: author.avatar, bio: author.bio } : req.user
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing blog post (Owner only)
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, coverImage } = req.body;

    if (getIsConnected()) {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Strict Ownership check
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Forbidden: You are not authorized to update this post. Only the post author can modify it.'
        });
      }

      if (title !== undefined) post.title = title.trim();
      if (excerpt !== undefined) post.excerpt = excerpt.trim();
      if (content !== undefined) {
        post.content = content.trim();
        post.readTime = calculateReadTime(content);
      }
      if (category !== undefined) post.category = category.trim();
      if (coverImage !== undefined) post.coverImage = coverImage.trim();

      const updated = await post.save();
      const populated = await Post.findById(updated._id).populate('author', 'name email avatar bio');
      return res.json(populated);
    } else {
      const index = memoryStore.posts.findIndex((p) => p._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const post = memoryStore.posts[index];

      // Strict Ownership check
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Forbidden: You are not authorized to update this post. Only the post author can modify it.'
        });
      }

      const updated = {
        ...post,
        title: title !== undefined ? title.trim() : post.title,
        excerpt: excerpt !== undefined ? excerpt.trim() : post.excerpt,
        content: content !== undefined ? content.trim() : post.content,
        category: category !== undefined ? category.trim() : post.category,
        coverImage: coverImage !== undefined ? coverImage.trim() : post.coverImage,
        readTime: content !== undefined ? calculateReadTime(content) : post.readTime,
        updatedAt: new Date().toISOString()
      };

      memoryStore.posts[index] = updated;

      const author = memoryStore.users.find((u) => u._id === post.author);
      return res.json({
        ...updated,
        author: author ? { _id: author._id, name: author.name, email: author.email, avatar: author.avatar, bio: author.bio } : req.user
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog post (Owner only)
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Strict Ownership check
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Forbidden: You are not authorized to delete this post. Only the post author can remove it.'
        });
      }

      // Delete associated comments
      await Comment.deleteMany({ post: post._id });
      await Post.findByIdAndDelete(id);

      return res.json({ message: 'Post and associated comments successfully deleted' });
    } else {
      const index = memoryStore.posts.findIndex((p) => p._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const post = memoryStore.posts[index];

      // Strict Ownership check
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Forbidden: You are not authorized to delete this post. Only the post author can remove it.'
        });
      }

      // Delete post & associated comments
      memoryStore.posts.splice(index, 1);
      memoryStore.comments = memoryStore.comments.filter((c) => c.post !== id);

      return res.json({ message: 'Post and associated comments successfully deleted' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts created by current logged in user
// @route   GET /api/posts/my/all
// @access  Private
export const getMyPosts = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
      return res.json(posts);
    } else {
      const posts = memoryStore.posts
        .filter((p) => p.author.toString() === req.user._id.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(posts);
    }
  } catch (error) {
    next(error);
  }
};
