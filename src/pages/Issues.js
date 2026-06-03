import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { useAppContext } from '../context/AppContext';
import { formatDate, statusColor, priorityColor } from '../utils/helpers';
import '../styles/issues.css';

const Issues = () => {
  const { state, dispatch } = useAppContext();
  const [issues, setIssues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    severity: 'minor',
    project: '',
  });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    severity: '',
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchIssues();
  }, [filters, search, page]);

  const fetchIssues = async () => {
    try {
      const response = await apiService.getIssues(
        filters,
        page,
        10,
        search
      );
      setIssues(response.data.data.issues);
      dispatch({ type: 'SET_ISSUES', payload: response.data.data.issues });
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.createIssue(
        formData.title,
        formData.description,
        formData.priority,
        formData.severity,
        formData.project
      );
      setIssues([...issues, response.data.data]);
      dispatch({ type: 'ADD_ISSUE', payload: response.data.data });
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        severity: 'minor',
        project: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create issue:', error);
    }
  };

  const handleDeleteIssue = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiService.deleteIssue(id);
        setIssues(issues.filter(i => i._id !== id));
        dispatch({ type: 'DELETE_ISSUE', payload: id });
      } catch (error) {
        console.error('Failed to delete issue:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="issues-container">
      <div className="issues-header">
        <h1>Issues</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'New Issue'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateIssue} className="issue-form">
          <input
            type="text"
            placeholder="Issue Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select
            value={formData.severity}
            onChange={(e) => setFormData({...formData, severity: e.target.value})}
          >
            <option value="minor">Minor</option>
            <option value="major">Major</option>
            <option value="critical">Critical</option>
          </select>
          <input
            type="text"
            placeholder="Project ID"
            value={formData.project}
            onChange={(e) => setFormData({...formData, project: e.target.value})}
            required
          />
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}

      <div className="filters">
        <input
          type="text"
          placeholder="Search issues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="testing">Testing</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({...filters, priority: e.target.value})}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="issues-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Severity</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue._id}>
                <td>{issue.title}</td>
                <td>
                  <span 
                    className="badge status"
                    style={{backgroundColor: statusColor(issue.status)}}
                  >
                    {issue.status}
                  </span>
                </td>
                <td>
                  <span 
                    className="badge priority"
                    style={{backgroundColor: priorityColor(issue.priority)}}
                  >
                    {issue.priority}
                  </span>
                </td>
                <td>{issue.severity}</td>
                <td>{formatDate(issue.createdAt)}</td>
                <td>
                  <button className="btn-secondary">View</button>
                  <button 
                    onClick={() => handleDeleteIssue(issue._id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Issues;
