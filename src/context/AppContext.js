import React, { createContext, useReducer } from 'react';
import appReducer from '../reducers/appReducer';

const AppContext = createContext();

const initialState = {
  authUser: null,
  token: localStorage.getItem('token') || null,
  users: [],
  projects: [],
  issues: [],
  comments: [],
  filters: {
    issueStatus: null,
    issuePriority: null,
    projectStatus: null,
  },
  analytics: {
    issues: null,
    projects: null,
    developers: null,
  },
  loading: false,
  error: null,
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Expose global state to window for debugging
  React.useEffect(() => {
    window.appState = state;
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export default AppContext;
