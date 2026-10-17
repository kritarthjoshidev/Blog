import React from 'react';
import { Feather, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Feather className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 font-editorial">
                Journal
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              An open, distraction-free publishing platform built for builders, designers, and authors. Powered by React, Vite, Tailwind CSS, Node.js, Express, and MongoDB.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-900 font-bold bg-indigo-50 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Verified Author Ownership & JWT Authentication</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Topic Channels</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link to="/?category=Engineering" className="hover:text-indigo-600 transition-colors">Engineering & Architecture</Link></li>
              <li><Link to="/?category=Design" className="hover:text-indigo-600 transition-colors">UI Design & Typography</Link></li>
              <li><Link to="/?category=Product" className="hover:text-indigo-600 transition-colors">Product Strategy & Growth</Link></li>
              <li><Link to="/?category=AI & Future" className="hover:text-indigo-600 transition-colors">AI & Future Tech</Link></li>
            </ul>
          </div>

          {/* Demo Accounts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Evaluation Accounts</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">User 1 (Staff Writer)</p>
                <p className="text-[11px] font-mono text-slate-500">alex@journal.dev / password123</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">User 2 (Product Designer)</p>
                <p className="text-[11px] font-mono text-slate-500">sarah@design.io / password123</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 Journal Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Antigravity Assignment Showcase
          </p>
        </div>

      </div>
    </footer>
  );
};
