import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowUpRight } from 'lucide-react';

export const PostCard = ({ post, featured = false }) => {
  const authorName = post.author?.name || 'Anonymous';
  const authorAvatar = post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (featured) {
    return (
      <Link
        to={`/posts/${post._id}`}
        className="group grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-300 p-5 sm:p-7 shadow-sm hover:shadow-card transition-all duration-300 cursor-pointer mb-10"
      >
        <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto rounded-2xl overflow-hidden bg-slate-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-3">
              {post.title}
            </h2>

            <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-6">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">{authorName}</p>
                <p className="text-[11px] text-slate-400">{formattedDate}</p>
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/posts/${post._id}`}
      className="group flex flex-col bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-300 p-4 transition-all duration-300 hover:shadow-card cursor-pointer"
    >
      {/* Cover Image */}
      <div className="aspect-[16/10] w-full rounded-2xl bg-slate-100 overflow-hidden mb-4">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Meta header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
          {post.category}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <Clock className="w-3 h-3" />
          {post.readTime}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-extrabold text-slate-900 text-lg leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
        {post.excerpt}
      </p>

      {/* Author & Date Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-2.5">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
          <div>
            <p className="text-xs font-bold text-slate-900 leading-tight">{authorName}</p>
            <p className="text-[10px] text-slate-400">{formattedDate}</p>
          </div>
        </div>

        <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-colors">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
};
