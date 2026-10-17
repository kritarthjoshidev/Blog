import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, Eye, PenLine, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const CreateEditPostPage = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Engineering',
    coverImage: '',
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isEditing && isAuthenticated) {
      const fetchPostToEdit = async () => {
        try {
          const data = await api.posts.getById(id);
          const authorId = data.author?._id || data.author;
          if (user && user._id !== authorId) {
            addToast('You can only edit your own stories.', 'error');
            navigate('/dashboard');
            return;
          }

          setFormData({
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            category: data.category || 'Engineering',
            coverImage: data.coverImage || '',
          });
        } catch (err) {
          setError(err.message || 'Failed to load post for editing');
        } finally {
          setLoading(false);
        }
      };

      fetchPostToEdit();
    }
  }, [id, isEditing, isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      setError('Please provide title, excerpt, and article content.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        const updated = await api.posts.update(id, formData);
        addToast('Story updated successfully!');
        navigate(`/posts/${updated._id}`);
      } else {
        const created = await api.posts.create(formData);
        addToast('Story published successfully!');
        navigate(`/posts/${created._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to save post. Please try again.');
      setSubmitting(false);
    }
  };

  const categories = ['Engineering', 'Design', 'Product', 'Culture', 'AI & Future', 'Career', 'Tutorial'];

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
        <p className="text-xs text-slate-400">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      
      {/* Top back bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Tab switch between Editor and Preview */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setPreviewMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !previewMode ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              previewMode ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
          {error}
        </div>
      )}

      {/* Editor View */}
      {!previewMode ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1 font-editorial">
              {isEditing ? 'Edit Story' : 'Draft a New Story'}
            </h1>
            <p className="text-xs text-slate-400">
              Share thoughtful insights with thousands of curious readers.
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Story Title *
            </label>
            <input
              type="text"
              name="title"
              required
              maxLength={150}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Deep Dive into Zero-Copy Memory Pipelines"
              className="w-full px-4 py-3 text-lg font-bold rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 placeholder:text-slate-300 transition-all font-editorial"
            />
          </div>

          {/* Category & Cover URL Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Topic Channel *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Cover Image URL (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500"
                />
                {formData.coverImage && (
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                    <img
                      src={formData.coverImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Summary / Excerpt * (Max 300 characters)
            </label>
            <textarea
              name="excerpt"
              required
              rows={2}
              maxLength={300}
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="A brief 1-2 sentence hook explaining what readers will discover..."
              className="w-full p-4 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Article Body * (Supports '## Heading' and '### Subheading')
              </label>
              <span className="text-[11px] text-slate-400">
                {formData.content.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              name="content"
              required
              rows={12}
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your story here... Separate paragraphs with double enter.\n\n### Subheading Example\n\nYour analysis and technical observations..."
              className="w-full p-4 rounded-2xl border border-slate-200 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 leading-relaxed font-sans"
            />
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Story...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Publish Story'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      ) : (
        /* Preview Mode */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs text-indigo-700 font-bold uppercase tracking-wider">
            <span>{formData.category}</span>
            <span>•</span>
            <span>Preview Mode</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-editorial leading-tight">
            {formData.title || 'Untitled Story'}
          </h1>

          <p className="text-base text-slate-500 italic">
            {formData.excerpt || 'No summary excerpt provided.'}
          </p>

          {formData.coverImage && (
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100">
              <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose text-slate-700 whitespace-pre-wrap leading-relaxed pt-4">
            {formData.content || 'Start typing in the editor tab to see your story rendered here...'}
          </div>
        </div>
      )}

    </div>
  );
};
