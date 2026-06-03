// Authentication utilities
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Utility functions for formatting
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};

export const statusColor = (status) => {
  const colors = {
    'open': '#FF6B6B',
    'in-progress': '#FFA500',
    'testing': '#4ECDC4',
    'resolved': '#95E1D3',
    'closed': '#6C757D',
  };
  return colors[status] || '#333';
};

export const priorityColor = (priority) => {
  const colors = {
    'low': '#90EE90',
    'medium': '#FFD700',
    'high': '#FF8C00',
    'critical': '#FF0000',
  };
  return colors[priority] || '#333';
};

export const canAssignIssue = (userRole) => {
  return ['admin', 'manager'].includes(userRole);
};

export const canCloseIssue = (userRole) => {
  return userRole !== 'tester';
};

export const canUpdateIssueStatus = (userRole) => {
  return ['admin', 'manager', 'developer'].includes(userRole);
};
