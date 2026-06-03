import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { useAppContext } from '../context/AppContext';
import '../styles/users.css';

const Users = () => {
  const { state } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.authUser?.role === 'admin') {
      fetchUsers();
    }
  }, [state.authUser]);

  const fetchUsers = async () => {
    try {
      const response = await apiService.getAllUsers();
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (state.authUser?.role !== 'admin') {
    return <div className="unauthorized">Only admins can view users.</div>;
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="users-container">
      <h1>Users</h1>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className={`role ${user.role}`}>{user.role}</td>
                <td>{user.department || 'N/A'}</td>
                <td className={`status ${user.status}`}>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
