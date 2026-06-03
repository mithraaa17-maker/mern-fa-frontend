import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const PrivateRoute = ({ children }) => {
  const { state } = useAppContext();

  return state.token ? children : <Navigate to="/login" />;
};

export const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { state } = useAppContext();

  if (!state.token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(state.authUser?.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;
