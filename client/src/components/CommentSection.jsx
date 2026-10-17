import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Trash2, Send, Loader2, User, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export const CommentSection = ({ postId }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchComments = async () => {
    try {
      const data = await api.comments.getByPost(postId);
      setComments(data || []);
    } catch (err) {
      console.error('Failed to load comments:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const newComment = await api.comments.create(postId, content.trim());
      setComments((prev) => [newComment, ...prev]);
      setContent('');
      addToast('Comment published successfully!');
    } catch (err) {
      addToast(err.message || 'Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setDeletingId(commentId);
    try {
      await api.comments.delete(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      addToast('Comment deleted successfully.');
    } catch (err) {
      addToast(err.message || 'Failed to delete comment', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="border-t border-slate-200 pt-10 mt-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Composer Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 mt-1"
            />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are your thoughts on this story? Leave a comment..."
                rows={3}
                required
                maxLength={1000}
                className="w-full p-3.5 text-sm rounded-2xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              {content.length}/1000 characters
            </span>

            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 rounded-3xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Join the discussion</h4>
              <p className="text-xs text-slate-500">Sign in to leave a response and interact with other readers.</p>
            </div>
          </div>

          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            Sign In to Comment
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 animate-pulse space-y-2">
              <div className="h-4 bg-slate-100 rounded w-1/4" />
              <div className="h-10 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-6">
          <p className="text-sm font-bold text-slate-700 mb-0.5">No comments yet</p>
          <p className="text-xs text-slate-400">Be the first to share your perspective on this essay.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const authorId = comment.author?._id || comment.author;
            const isOwner = user && (user._id === authorId);
            const authorName = comment.author?.name || 'Reader';
            const authorAvatar = comment.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
            const dateStr = new Date(comment.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={comment._id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all hover:border-slate-300"
              >
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={authorAvatar}
                      alt={authorName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {authorName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {dateStr}
                      </span>
                    </div>
                  </div>

                  {/* Delete button only if comment belongs to authenticated user */}
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      disabled={deletingId === comment._id}
                      className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete your comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-10 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
