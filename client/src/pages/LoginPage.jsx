import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Feather, Mail, Lock, ArrowRight, Loader2, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const LoginPage = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      addToast('Welcome back! Successfully logged in.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const fillAlex = () => {
    setFormData({ email: 'alex@journal.dev', password: 'password123' });
    setError('');
  };

  const fillSarah = () => {
    setFormData({ email: 'sarah@design.io', password: 'password123' });
    setError('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 p-8 shadow-card">
        
        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Feather className="w-6 h-6 stroke-[2.2]" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-editorial">
            Welcome to Journal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to write stories, leave responses, and manage your articles.
          </p>
        </div>

        {/* 1-Click Quick Demo Box */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 mb-6 space-y-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Quick Demo Sign-In (Instant Testing):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillAlex}
              className="py-1.5 px-2 bg-white hover:bg-indigo-100 border border-indigo-200 rounded-xl text-[11px] font-bold text-indigo-800 transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              <UserCheck className="w-3 h-3 text-indigo-600" />
              Fill Alex (Writer)
            </button>
            <button
              type="button"
              onClick={fillSarah}
              className="py-1.5 px-2 bg-white hover:bg-indigo-100 border border-indigo-200 rounded-xl text-[11px] font-bold text-indigo-800 transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              <UserCheck className="w-3 h-3 text-indigo-600" />
              Fill Sarah (Designer)
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="author@journal.dev"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In to Journal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-500 pt-2">
            Don't have an author profile yet?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2">
              Create an account
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
};
