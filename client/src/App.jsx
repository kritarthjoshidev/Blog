import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PostDetailPage } from './pages/PostDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateEditPostPage } from './pages/CreateEditPostPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        
        {/* Sticky Header */}
        <Navbar />

        {/* Dynamic Route Pages */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-post" element={<CreateEditPostPage />} />
            <Route path="/edit-post/:id" element={<CreateEditPostPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;
