import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Edit3, Trash2, Share2, Bookmark, Check, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { CommentSection } from '../components/CommentSection';

export const PostDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.posts.getById(id);
        setPost(data);
      } catch (err) {
        setError(err.message || 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const authorId = post?.author?._id || post?.author;
  const isAuthor = user && (user._id === authorId);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    addToast('Article link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this story?')) return;

    setDeleting(true);
    try {
      await api.posts.delete(post._id);
      addToast('Story deleted successfully.');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Failed to delete story', 'error');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Article Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error || "This article may have been deleted by its author."}</p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const authorName = post.author?.name || 'Anonymous';
  const authorAvatar = post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  const authorBio = post.author?.bio || 'Writer, thinker, and technology enthusiast.';
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      
      {/* Top back navigation */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all stories</span>
        </Link>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {isAuthor && (
            <div className="flex items-center gap-2 mr-2">
              <Link
                to={`/edit-post/${post._id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors shadow-sm"
            title="Share article"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.18] tracking-tight mb-4 font-editorial">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      {/* Author Card Row */}
      <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm mb-8">
        <img
          src={authorAvatar}
          alt={authorName}
          className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-slate-900 leading-tight">{authorName}</p>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{authorBio}</p>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-100 shadow-md mb-10">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Formatted Article Prose */}
      <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-base sm:text-lg space-y-6">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 pt-4 font-editorial">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-slate-900 pt-6 font-editorial">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          return (
            <p key={idx} className="whitespace-pre-line leading-relaxed text-slate-700">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Bottom Author Bio Card */}
      <div className="mt-14 p-6 rounded-3xl bg-slate-100/70 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <img
          src={authorAvatar}
          alt={authorName}
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
        />
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Written by
          </span>
          <h4 className="text-base font-extrabold text-slate-900 mb-1">{authorName}</h4>
          <p className="text-xs text-slate-600 leading-relaxed max-w-lg">{authorBio}</p>
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection postId={post._id} />

    </article>
  );
};
