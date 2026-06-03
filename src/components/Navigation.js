import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import '../styles/navigation.css';

const Navigation = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const canAccessUsers = state.authUser?.role === 'admin';
  const canCreateProject = ['admin', 'manager'].includes(state.authUser?.role);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Issue Tracker</h2>
      </div>
      <div className="navbar-menu">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/projects" className="nav-link">Projects</Link>
        <Link to="/issues" className="nav-link">Issues</Link>
        <Link to="/comments" className="nav-link">Comments</Link>
        {canAccessUsers && <Link to="/users" className="nav-link">Users</Link>}
      </div>
      <div className="navbar-user">
        <span className="user-name">{state.authUser?.name}</span>
        <Link to="/profile" className="nav-link">Profile</Link>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
};

export default Navigation;
