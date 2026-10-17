import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PenSquare, Feather, LayoutDashboard, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 select-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Feather className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors font-editorial">
                Journal
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-600/80 leading-none">
                Essays & Code
              </p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                location.pathname === '/'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Explore Stories
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  location.pathname === '/dashboard'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Write Story CTA */}
            <Link
              to={isAuthenticated ? '/create-post' : '/login'}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <PenSquare className="w-4 h-4 stroke-[2.2]" />
              <span className="hidden sm:inline">Write Story</span>
            </Link>

            {/* User Profile or Guest Links */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in divide-y divide-slate-100">
                      <div className="px-4 py-2.5">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          <span>Manage Posts</span>
                        </Link>
                        <Link
                          to="/create-post"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <PenSquare className="w-4 h-4 text-slate-400" />
                          <span>Write New Story</span>
                        </Link>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Join
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Explore Stories
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                My Dashboard
              </Link>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
