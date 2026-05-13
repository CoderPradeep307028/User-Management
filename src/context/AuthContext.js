import React, { createContext, useReducer, useEffect } from 'react';
import api, { setAuthToken } from '../utils/api';

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await api.get('/api/auth/user');
      dispatch({
        type: 'USER_LOADED',
        payload: res.data,
      });
    } catch (err) {
      setAuthToken(null);
      dispatch({
        type: 'AUTH_ERROR',
      });
    }
  };

  const register = async (name, email, password, role) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = { name, email, password, role };

    try {
      const res = await api.post('/api/auth/register', body);
      setAuthToken(res.data.token);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
      });
      await loadUser();
    } catch (err) {
      setAuthToken(null);
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.msg || 'Registration failed',
      });
      throw err;
    }
  };

  const login = async (email, password) => {
    const body = { email, password };

    try {
      const res = await api.post('/api/auth/login', body);
      setAuthToken(res.data.token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });
      await loadUser();
    } catch (err) {
      setAuthToken(null);
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.msg || 'Login failed',
      });
      throw err;
    }
  };

  const logout = () => {
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};