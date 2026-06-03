const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTH_USER':
      return {
        ...state,
        authUser: action.payload.user,
        token: action.payload.token,
      };

    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        authUser: null,
        token: null,
      };

    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      };

    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p._id === action.payload._id ? action.payload : p),
      };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p._id !== action.payload),
      };

    case 'SET_ISSUES':
      return {
        ...state,
        issues: action.payload,
      };

    case 'ADD_ISSUE':
      return {
        ...state,
        issues: [...state.issues, action.payload],
      };

    case 'UPDATE_ISSUE':
      return {
        ...state,
        issues: state.issues.map(i => i._id === action.payload._id ? action.payload : i),
      };

    case 'DELETE_ISSUE':
      return {
        ...state,
        issues: state.issues.filter(i => i._id !== action.payload),
      };

    case 'SET_COMMENTS':
      return {
        ...state,
        comments: action.payload,
      };

    case 'ADD_COMMENT':
      return {
        ...state,
        comments: [...state.comments, action.payload],
      };

    case 'DELETE_COMMENT':
      return {
        ...state,
        comments: state.comments.filter(c => c._id !== action.payload),
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default appReducer;
