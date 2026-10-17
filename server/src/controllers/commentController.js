import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { getIsConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

// @desc    Get comments for a specific post
// @route   GET /api/comments/post/:postId
// @access  Public
export const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (getIsConnected()) {
      const comments = await Comment.find({ post: postId })
        .populate('author', 'name email avatar')
        .sort({ createdAt: -1 });

      return res.json(comments);
    } else {
      const filtered = memoryStore.comments
        .filter((c) => c.post.toString() === postId.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const enriched = filtered.map((c) => {
        const author = memoryStore.users.find((u) => u._id === c.author);
        return {
          ...c,
          author: author ? { _id: author._id, name: author.name, email: author.email, avatar: author.avatar } : { _id: c.author, name: 'Anonymous' }
        };
      });

      return res.json(enriched);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to a blog post
// @route   POST /api/comments/post/:postId
// @access  Private
export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content cannot be empty' });
    }

    if (getIsConnected()) {
      // Prevent comments belonging to non-existent posts
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Target blog post not found' });
      }

      const comment = await Comment.create({
        post: post._id,
        author: req.user._id,
        content: content.trim()
      });

      const populated = await Comment.findById(comment._id).populate('author', 'name email avatar');
      return res.status(201).json(populated);
    } else {
      const post = memoryStore.posts.find((p) => p._id === postId);
      if (!post) {
        return res.status(404).json({ message: 'Target blog post not found' });
      }

      const newComment = {
        _id: `comment_${Date.now()}`,
        post: post._id,
        author: req.user._id,
        content: content.trim(),
        createdAt: new Date().toISOString()
      };

      memoryStore.comments.unshift(newComment);

      const author = memoryStore.users.find((u) => u._id === req.user._id);
      return res.status(201).json({
        ...newComment,
        author: author ? { _id: author._id, name: author.name, email: author.email, avatar: author.avatar } : req.user
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment (Owner only)
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      // Strict Ownership check
      if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Forbidden: You are not authorized to delete this comment. Only the comment author can delete it.'
        });
      }

      await Comment.findByIdAndDelete(id);
      return res.json({ message: 'Comment successfully deleted' });
    } else {
      const index = memoryStore.comments.findIndex((c) => c._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const comment = memoryStore.comments[index];

      // Strict Ownership check
      if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Forbidden: You are not authorized to delete this comment. Only the comment author can delete it.'
        });
      }

      memoryStore.comments.splice(index, 1);
      return res.json({ message: 'Comment successfully deleted' });
    }
  } catch (error) {
    next(error);
  }
};
