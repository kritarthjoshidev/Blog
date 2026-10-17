import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('journal_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    const err = new Error(message);
    err.status = error.response?.status;
    err.data = error.response?.data;
    return Promise.reject(err);
  }
);

export const api = {
  // Auth
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    getMe: () => apiClient.get('/auth/me'),
  },

  // Posts
  posts: {
    getAll: (params = {}) => apiClient.get('/posts', { params }),
    getById: (id) => apiClient.get(`/posts/${id}`),
    create: (postData) => apiClient.post('/posts', postData),
    update: (id, postData) => apiClient.put(`/posts/${id}`, postData),
    delete: (id) => apiClient.delete(`/posts/${id}`),
    getMyPosts: () => apiClient.get('/posts/my/all'),
  },

  // Comments
  comments: {
    getByPost: (postId) => apiClient.get(`/comments/post/${postId}`),
    create: (postId, content) => apiClient.post(`/comments/post/${postId}`, { content }),
    delete: (commentId) => apiClient.delete(`/comments/${commentId}`),
  },

  // Health
  health: {
    check: () => apiClient.get('/health'),
  },
};

export default apiClient;
