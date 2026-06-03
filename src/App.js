import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import apiService from './services/apiService';
import { PrivateRoute, RoleBasedRoute } from './routes/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Issues from './pages/Issues';
import Comments from './pages/Comments';
import Users from './pages/Users';
import Profile from './pages/Profile';

// Components
import Navigation from './components/Navigation';

import './styles/App.css';

function App() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && !state.authUser) {
        try {
          const response = await apiService.getMe();
          dispatch({
            type: 'SET_AUTH_USER',
            payload: { user: response.data.data, token }
          });
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };

    initializeAuth();
  }, [dispatch, state.authUser]);

  return (
    <Router>
      <div className="app-container">
        {state.authUser && <Navigation />}
        <main className="app-main">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/projects" 
              element={
                <PrivateRoute>
                  <Projects />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/issues" 
              element={
                <PrivateRoute>
                  <Issues />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/comments" 
              element={
                <PrivateRoute>
                  <Comments />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />

            {/* Admin Only Routes */}
            <Route 
              path="/users" 
              element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <Users />
                </RoleBasedRoute>
              } 
            />

            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
