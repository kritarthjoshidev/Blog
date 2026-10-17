import express from 'express';
import {
  getCommentsByPost,
  createComment,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/post/:postId')
  .get(getCommentsByPost)
  .post(protect, createComment);

router.route('/:id')
  .delete(protect, deleteComment);

export default router;
