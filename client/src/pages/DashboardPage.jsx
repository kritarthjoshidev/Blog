import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenSquare, BookOpen, Clock, Trash2, Edit3, Eye, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const DashboardPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchMyPosts = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await api.posts.getMyPosts();
      setPosts(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch your posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyPosts();
    }
  }, [isAuthenticated]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      await api.posts.delete(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      addToast('Story deleted successfully.');
    } catch (err) {
      addToast(err.message || 'Failed to delete story', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
            Author Workspace
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your published articles, monitor readability, and publish new ideas.
          </p>
        </div>

        <Link
          to="/create-post"
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <PenSquare className="w-4 h-4 stroke-[2.2]" />
          <span>Write New Story</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Your Stories</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{posts.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Total published pieces</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Read</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {posts.reduce((acc, p) => acc + (parseInt(p.readTime) || 3), 0)} mins
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Cumulative reading time</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Author Role</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">Verified</p>
          <p className="text-[11px] text-slate-400 mt-1">Full post ownership privileges</p>
        </div>
      </div>

      {/* Stories Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Your Articles Catalog</h2>
          <span className="text-xs text-slate-400 font-semibold">{posts.length} entries</span>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading your articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 p-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <PenSquare className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No articles published yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
              Share your insights, engineering challenges, or design concepts with the community.
            </p>
            <Link
              to="/create-post"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              Write Your First Story
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Article</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Published Date</th>
                  <th className="px-5 py-3.5">Read Time</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <Link
                          to={`/posts/${post._id}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{post.excerpt}</p>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {post.category}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="px-5 py-3.5 font-semibold text-slate-700">
                      {post.readTime}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/posts/${post._id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View Live Article"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/edit-post/${post._id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit Article"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id, post.title)}
                          disabled={deletingId === post._id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
