import React from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/profile.css';

const Profile = () => {
  const { state } = useAppContext();

  if (!state.authUser) {
    return <div className="unauthorized">Please login first.</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-card">
        <div className="profile-field">
          <label>Name:</label>
          <p>{state.authUser.name}</p>
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <p>{state.authUser.email}</p>
        </div>
        <div className="profile-field">
          <label>Role:</label>
          <p className={`role-badge ${state.authUser.role}`}>{state.authUser.role}</p>
        </div>
        <div className="profile-field">
          <label>Department:</label>
          <p>{state.authUser.department || 'Not specified'}</p>
        </div>
        <div className="profile-field">
          <label>Status:</label>
          <p className={`status-badge ${state.authUser.status}`}>{state.authUser.status}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
