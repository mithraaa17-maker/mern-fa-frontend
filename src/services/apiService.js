import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const apiService = {
  // Auth
  register: (name, email, password, role, department) =>
    api.post('/auth/register', { name, email, password, role, department }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  getMe: () =>
    api.get('/auth/me'),

  // Users
  getAllUsers: () =>
    api.get('/users'),
  
  getUserById: (id) =>
    api.get(`/users/${id}`),

  // Projects
  createProject: (title, description, members) =>
    api.post('/projects', { title, description, members }),
  
  getProjects: (filters = {}, page = 1, limit = 10, search = '') =>
    api.get('/projects', { params: { ...filters, page, limit, search } }),
  
  getProjectById: (id) =>
    api.get(`/projects/${id}`),
  
  updateProject: (id, data) =>
    api.patch(`/projects/${id}`, data),
  
  deleteProject: (id) =>
    api.delete(`/projects/${id}`),
  
  addProjectMember: (id, memberId) =>
    api.post(`/projects/${id}/members`, { memberId }),

  // Issues
  createIssue: (title, description, priority, severity, project, dueDate) =>
    api.post('/issues', { title, description, priority, severity, project, dueDate }),
  
  getIssues: (filters = {}, page = 1, limit = 10, search = '') =>
    api.get('/issues', { params: { ...filters, page, limit, search } }),
  
  getIssueById: (id) =>
    api.get(`/issues/${id}`),
  
  updateIssue: (id, data) =>
    api.patch(`/issues/${id}`, data),
  
  deleteIssue: (id) =>
    api.delete(`/issues/${id}`),
  
  assignIssue: (id, assignedTo) =>
    api.patch(`/issues/${id}/assign`, { assignedTo }),
  
  updateIssueStatus: (id, status) =>
    api.patch(`/issues/${id}/status`, { status }),

  // Comments
  createComment: (issue, message) =>
    api.post('/comments', { issue, message }),
  
  getComments: (issue, page = 1, limit = 10) =>
    api.get(`/comments/${issue}`, { params: { page, limit } }),
  
  deleteComment: (id) =>
    api.delete(`/comments/${id}`),

  // Analytics
  getIssueAnalytics: () =>
    api.get('/analytics/issues'),
  
  getProjectAnalytics: () =>
    api.get('/analytics/projects'),
  
  getDeveloperAnalytics: () =>
    api.get('/analytics/developers'),

  // Sync
  syncDataset: () =>
    api.post('/sync'),
};

export default apiService;
