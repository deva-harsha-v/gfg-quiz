import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  registerParticipant as apiRegister,
  loginParticipant as apiLogin,
  examEntryParticipant as apiExamEntry,
  getCurrentParticipant as apiGetMe
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [participant, setParticipant] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize session on startup
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const data = await apiGetMe();
          if (data?.success && data?.participant) {
            setParticipant(data.participant);
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            handleLogout();
          }
        } catch (err) {
          console.warn('[AuthContext] Session restore failed:', err.message);
          handleLogout();
        }
      } else {
        setParticipant(null);
        setToken(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = async (rollNumber, password) => {
    const data = await apiLogin({ rollNumber, password });
    if (data?.success && data?.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setParticipant(data.participant);
      setIsAuthenticated(true);
      return data;
    }
    throw new Error(data?.message || 'Login failed');
  };

  const handleExamEntry = async (entryData) => {
    const data = await apiExamEntry(entryData);
    if (data?.success && data?.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setParticipant(data.participant);
      setIsAuthenticated(true);
      return data;
    }
    throw new Error(data?.message || 'Exam entry failed');
  };

  const handleRegister = async (formData) => {
    return await apiRegister(formData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setParticipant(null);
    setIsAuthenticated(false);
  };

  const value = {
    participant,
    token,
    isAuthenticated,
    loading,
    login: handleLogin,
    examEntry: handleExamEntry,
    register: handleRegister,
    logout: handleLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
