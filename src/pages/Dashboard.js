import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { useAppContext } from '../context/AppContext';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { state, dispatch } = useAppContext();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiService.getIssueAnalytics();
        setAnalytics(response.data.data);
        dispatch({
          type: 'SET_ANALYTICS',
          payload: { issues: response.data.data }
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dispatch]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total Issues</h3>
          <p className="stat-value">{analytics?.totalIssues || 0}</p>
        </div>
        <div className="stat-card open">
          <h3>Open Issues</h3>
          <p className="stat-value">{analytics?.openIssues || 0}</p>
        </div>
        <div className="stat-card in-progress">
          <h3>In Progress</h3>
          <p className="stat-value">{analytics?.inProgressIssues || 0}</p>
        </div>
        <div className="stat-card resolved">
          <h3>Resolved Issues</h3>
          <p className="stat-value">{analytics?.resolvedIssues || 0}</p>
        </div>
        <div className="stat-card closed">
          <h3>Closed Issues</h3>
          <p className="stat-value">{analytics?.closedIssues || 0}</p>
        </div>
      </div>

      {state.authUser && (
        <div className="user-info">
          <h3>Welcome, {state.authUser.name}!</h3>
          <p>Role: <strong>{state.authUser.role}</strong></p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
