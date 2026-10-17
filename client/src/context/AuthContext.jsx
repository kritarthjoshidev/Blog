import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('journal_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('journal_token');
      const storedUser = localStorage.getItem('journal_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const me = await api.auth.getMe();
          setUser(me);
          localStorage.setItem('journal_user', JSON.stringify(me));
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login({ email, password });
    setToken(data.token);
    const userInfo = {
      _id: data._id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      bio: data.bio
    };
    setUser(userInfo);
    localStorage.setItem('journal_token', data.token);
    localStorage.setItem('journal_user', JSON.stringify(userInfo));
    return userInfo;
  };

  const register = async (name, email, password, bio, avatar) => {
    const data = await api.auth.register({ name, email, password, bio, avatar });
    setToken(data.token);
    const userInfo = {
      _id: data._id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      bio: data.bio
    };
    setUser(userInfo);
    localStorage.setItem('journal_token', data.token);
    localStorage.setItem('journal_user', JSON.stringify(userInfo));
    return userInfo;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('journal_token');
    localStorage.removeItem('journal_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
