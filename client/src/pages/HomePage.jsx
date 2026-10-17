import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles, ChevronLeft, ChevronRight, X, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { PostCard } from '../components/PostCard';
import { useToast } from '../components/Toast';

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(currentSearch);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await api.posts.getAll({
        category: currentCategory !== 'All' ? currentCategory : '',
        search: currentSearch,
        page,
        limit: 7, // 1 featured + 6 grid items
      });

      setPosts(data.posts || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentCategory, currentSearch, page]);

  const handleCategorySelect = (cat) => {
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const clearSearch = () => {
    setSearchInput('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    setSearchParams(params);
  };

  const featuredPost = posts.length > 0 && !currentSearch && page === 1 ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-10">
      
      {/* Hero Banner (inspired by Untitled UI on Dribbble) */}
      <div className="text-center max-w-3xl mx-auto pt-6 pb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>The Open Publishing Platform for Modern Tech & Craft</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-4 font-editorial">
          Perspectives on Engineering, Design & Innovation.
        </h1>

        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed mb-8">
          Deep dives, technical retrospectives, and architecture breakdowns written by practitioners shipping real products.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search essays, design systems, runtimes..."
            className="w-full pl-11 pr-10 py-3 rounded-full bg-white border border-slate-200/90 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 shadow-sm transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = currentCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-indigo-600/25 scale-105'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Active Filter notification */}
      {(currentSearch || currentCategory !== 'All') && (
        <div className="flex items-center justify-between bg-indigo-50/70 border border-indigo-100 rounded-2xl px-5 py-3 text-xs text-indigo-900 font-medium">
          <span>
            Showing stories {currentSearch && <span>matching "<strong>{currentSearch}</strong>"</span>}
            {currentSearch && currentCategory !== 'All' && <span> in </span>}
            {currentCategory !== 'All' && <span>channel "<strong>{currentCategory}</strong>"</span>}
            {' '}({total} stories found)
          </span>

          <button
            onClick={() => { setSearchInput(''); setSearchParams({}); setPage(1); }}
            className="text-indigo-600 hover:text-indigo-900 font-bold underline underline-offset-2 ml-4"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Content Stream */}
      {loading ? (
        <div className="space-y-6">
          <div className="aspect-[21/9] bg-white rounded-3xl p-6 border border-slate-100 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-4 border border-slate-100 animate-pulse space-y-3">
                <div className="aspect-[16/10] bg-slate-100 rounded-2xl" />
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-5 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No articles found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            We couldn't find any published stories matching your criteria. Try different search terms or categories.
          </p>
          <button
            onClick={() => { setSearchInput(''); setSearchParams({}); setPage(1); }}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
          >
            Show All Stories
          </button>
        </div>
      ) : (
        <div>
          {/* Featured Post Card */}
          {featuredPost && (
            <PostCard post={featuredPost} featured={true} />
          )}

          {/* Regular Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-10">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-bold text-slate-700 shadow-sm transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs text-slate-500 font-semibold px-2">
                Page <strong className="text-slate-800">{page}</strong> of <strong>{totalPages}</strong>
              </span>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-bold text-slate-700 shadow-sm transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
